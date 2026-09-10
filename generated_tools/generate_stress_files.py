#!/usr/bin/env python3
"""
Stress File Generator for External SSD & USB Port Testing
Generates thousands/millions of tiny random files (10B to 15KB) totaling a configurable
size (default 10GB). Designed to stress-test external drives, USB bridge controllers,
and random 4K/small-file I/O throughput.
"""

import os
import sys
import time
import shutil
import random
import argparse
import subprocess
from concurrent.futures import ThreadPoolExecutor

# Default configuration values
DEFAULT_TOTAL_SIZE = "10GB"
DEFAULT_MIN_SIZE = 10           # 10 bytes
DEFAULT_MAX_SIZE = 15360        # 15 KB (15 * 1024 bytes)
DEFAULT_FILES_PER_DIR = 5000    # Prevent single-directory inode bottleneck
DEFAULT_OUTPUT_DIR = "./stress_test_data"


def parse_size(size_str: str) -> int:
    """Parse human-readable size string (e.g. 10GB, 500MB, 2G) into bytes."""
    size_str = size_str.strip().upper()
    units = {
        'B': 1,
        'KB': 1024,
        'K': 1024,
        'MB': 1024 ** 2,
        'M': 1024 ** 2,
        'GB': 1024 ** 3,
        'G': 1024 ** 3,
        'TB': 1024 ** 4,
        'T': 1024 ** 4,
    }
    
    # Check multi-character units first, then single-character
    for unit, multiplier in sorted(units.items(), key=lambda x: -len(x[0])):
        if size_str.endswith(unit):
            num_part = size_str[:-len(unit)].strip()
            try:
                return int(float(num_part) * multiplier)
            except ValueError:
                break
                
    try:
        return int(size_str)
    except ValueError:
        raise argparse.ArgumentTypeError(
            f"Invalid size format: '{size_str}'. Use formats like 10GB, 500MB, 2G, or raw bytes."
        )


def format_bytes(num_bytes: int) -> str:
    """Format bytes into readable string (e.g. 1.25 GB)."""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if abs(num_bytes) < 1024.0:
            return f"{num_bytes:3.2f} {unit}"
        num_bytes /= 1024.0
    return f"{num_bytes:.2f} PB"


def format_time(seconds: float) -> str:
    """Format seconds into MM:SS or HH:MM:SS."""
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"


def generate_worker(worker_id: int, output_dir: str, target_bytes_per_worker: int,
                    min_size: int, max_size: int, files_per_dir: int,
                    progress_callback):
    """
    Worker thread that generates random files from a pre-buffered entropy pool.
    """
    # 4MB high-entropy random buffer to slice from, minimizing kernel entropy overhead
    buffer_pool = os.urandom(4 * 1024 * 1024)
    pool_len = len(buffer_pool)
    
    bytes_written = 0
    files_created = 0
    dir_index = worker_id * 1000
    current_dir = os.path.join(output_dir, f"batch_{dir_index:04d}")
    os.makedirs(current_dir, exist_ok=True)
    
    local_file_count_in_dir = 0
    
    while bytes_written < target_bytes_per_worker:
        file_size = random.randint(min_size, max_size)
        offset = random.randint(0, pool_len - file_size)
        data_chunk = buffer_pool[offset:offset + file_size]
        
        file_name = f"w{worker_id}_{files_created:06d}_{file_size}b.bin"
        file_path = os.path.join(current_dir, file_name)
        
        with open(file_path, 'wb') as f:
            f.write(data_chunk)
            
        bytes_written += file_size
        files_created += 1
        local_file_count_in_dir += 1
        
        # Batch notify every 100 files to minimize lock contention
        if files_created % 100 == 0:
            progress_callback(100, bytes_written)
            
        # Switch directory when limit is reached
        if local_file_count_in_dir >= files_per_dir:
            dir_index += 1
            current_dir = os.path.join(output_dir, f"batch_{dir_index:04d}")
            os.makedirs(current_dir, exist_ok=True)
            local_file_count_in_dir = 0
            
    # Report remaining
    remainder = files_created % 100
    if remainder > 0:
        progress_callback(remainder, bytes_written)
        
    return files_created, bytes_written


class ProgressTracker:
    """Thread-safe terminal progress tracker and ETA calculator."""
    def __init__(self, target_bytes: int):
        import threading
        self.lock = threading.Lock()
        self.target_bytes = target_bytes
        self.total_files = 0
        self.total_bytes = 0
        self.start_time = time.time()
        self.last_render = 0
        
    def update(self, files_delta: int, bytes_delta: int):
        with self.lock:
            self.total_files += files_delta
            self.total_bytes += bytes_delta
            
            now = time.time()
            # Update terminal UI at most 10 times per second
            if now - self.last_render > 0.1:
                self.render(now)
                self.last_render = now
                
    def render(self, now: float):
        elapsed = now - self.start_time
        pct = min(100.0, (self.total_bytes / self.target_bytes) * 100.0) if self.target_bytes > 0 else 0
        
        mb_written = self.total_bytes / (1024 * 1024)
        target_mb = self.target_bytes / (1024 * 1024)
        
        files_per_sec = self.total_files / elapsed if elapsed > 0 else 0
        mb_per_sec = mb_written / elapsed if elapsed > 0 else 0
        
        # ETA calculation
        if pct > 0:
            eta_seconds = (elapsed / pct) * (100.0 - pct)
            eta_str = format_time(eta_seconds)
        else:
            eta_str = "--:--"
            
        bar_len = 24
        filled = int(bar_len * (pct / 100.0))
        bar = "█" * filled + "░" * (bar_len - filled)
        
        status_line = (
            f"\r[\033[36m{bar}\033[0m] {pct:5.1f}% | "
            f"\033[1m{self.total_files:,}\033[0m files | "
            f"{format_bytes(self.total_bytes)} / {format_bytes(self.target_bytes)} | "
            f"\033[32m{files_per_sec:,.0f} files/s\033[0m | "
            f"\033[33m{mb_per_sec:.1f} MB/s\033[0m | "
            f"ETA: {eta_str} "
        )
        sys.stdout.write(status_line)
        sys.stdout.flush()


def run_transfer_benchmark(source_dir: str, target_dir: str):
    """Benchmark real-world transfer speed to an external SSD or folder."""
    print(f"\n\033[1;36m======================================================\033[0m")
    print(f"\033[1;36m       🚀 BENCHMARKING TRANSFER TO EXTERNAL SSD       \033[0m")
    print(f"\033[1;36m======================================================\033[0m")
    print(f"Source:      {source_dir}")
    print(f"Destination: {target_dir}")
    
    if not os.path.exists(target_dir):
        os.makedirs(target_dir, exist_ok=True)
        
    dest_path = os.path.join(target_dir, "stress_test_transfer")
    if os.path.exists(dest_path):
        print(f"Cleaning previous test at destination: {dest_path}...")
        shutil.rmtree(dest_path)
        
    print(f"Executing transfer using native streaming copy...")
    start_time = time.time()
    
    # Use rsync with archive mode for accurate filesystem replication
    cmd = ["rsync", "-a", "--stats", f"{source_dir}/", f"{dest_path}/"]
    process = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    elapsed = time.time() - start_time
    
    if process.returncode == 0:
        print(f"\033[1;32m✅ Transfer complete in {elapsed:.2f}s!\033[0m")
        # Extract transfer statistics from rsync
        for line in process.stdout.splitlines():
            if "Total transferred file size" in line or "Number of files" in line:
                print(f"  • {line.strip()}")
                
        # Calculate throughput
        total_size = sum(os.path.getsize(os.path.join(dirpath, f)) 
                         for dirpath, _, filenames in os.walk(dest_path) for f in filenames)
        mb_per_sec = (total_size / (1024 * 1024)) / elapsed if elapsed > 0 else 0
        total_files = sum(len(filenames) for _, _, filenames in os.walk(dest_path))
        files_per_sec = total_files / elapsed if elapsed > 0 else 0
        
        print(f"  • Effective Throughput:   \033[1;33m{mb_per_sec:.2f} MB/s\033[0m")
        print(f"  • Small File Random Rate: \033[1;32m{files_per_sec:,.0f} files/sec\033[0m")
        
        # Diagnostic Assessment
        if mb_per_sec >= 150:
            print(f"  \033[32m✅ EXCELLENT: Drive handles random small-file queue depth at high speed.\033[0m")
        elif mb_per_sec >= 40:
            print(f"  \033[33m⚠️  AVERAGE: Standard SATA/USB flash drive speed under 4K random strain.\033[0m")
        else:
            print(f"  \033[31m❌ POOR / RED FLAG: Throughput under 40 MB/s. Possible USB bridge throttling or low-grade flash.\033[0m")
    else:
        print(f"\033[1;31m❌ Transfer failed:\033[0m\n{process.stderr}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate thousands of tiny random files (10B to 15KB) totaling a configurable size to stress-test external SSDs and USB controllers."
    )
    parser.add_argument(
        "-o", "--output",
        default=DEFAULT_OUTPUT_DIR,
        help=f"Target directory for generated files (default: {DEFAULT_OUTPUT_DIR})"
    )
    parser.add_argument(
        "-s", "--size",
        default=DEFAULT_TOTAL_SIZE,
        help=f"Total dataset size (e.g. 10GB, 500MB, 2G, default: {DEFAULT_TOTAL_SIZE})"
    )
    parser.add_argument(
        "--min-size",
        type=int,
        default=DEFAULT_MIN_SIZE,
        help=f"Minimum file size in bytes (default: {DEFAULT_MIN_SIZE})"
    )
    parser.add_argument(
        "--max-size",
        type=int,
        default=DEFAULT_MAX_SIZE,
        help=f"Maximum file size in bytes (default: {DEFAULT_MAX_SIZE} = 15KB)"
    )
    parser.add_argument(
        "--files-per-dir",
        type=int,
        default=DEFAULT_FILES_PER_DIR,
        help=f"Max files per subfolder to prevent single-directory inode lag (default: {DEFAULT_FILES_PER_DIR})"
    )
    parser.add_argument(
        "-t", "--threads",
        type=int,
        default=os.cpu_count() or 4,
        help=f"Number of concurrent generator threads (default: CPU cores = {os.cpu_count() or 4})"
    )
    parser.add_argument(
        "--transfer-to",
        help="Optional destination path (e.g. /Volumes/MySSD). Automatically benchmarks copy throughput upon completion."
    )
    parser.add_argument(
        "-c", "--cleanup",
        action="store_true",
        help="Delete the target stress directory and exit."
    )

    args = parser.parse_args()

    # Cleanup mode
    if args.cleanup:
        if os.path.exists(args.output):
            print(f"\033[33mCleaning up stress dataset at '{args.output}'...\033[0m")
            shutil.rmtree(args.output)
            print("\033[32m✅ Cleanup complete.\033[0m")
        else:
            print(f"Directory '{args.output}' does not exist.")
        sys.exit(0)

    total_bytes_target = parse_size(args.size)
    os.makedirs(args.output, exist_ok=True)

    avg_file_size = (args.min_size + args.max_size) / 2
    estimated_files = int(total_bytes_target / avg_file_size)

    print("\033[1;36m======================================================\033[0m")
    print("\033[1;36m       🔥 RANDOM TINY FILE STRESS GENERATOR 🔥        \033[0m")
    print("\033[1;36m======================================================\033[0m")
    print(f"  • Target Size:     \033[1m{format_bytes(total_bytes_target)}\033[0m ({total_bytes_target:,} bytes)")
    print(f"  • File Size Range: {args.min_size} bytes to {format_bytes(args.max_size)} ({args.max_size} B)")
    print(f"  • Estimated Count: ~{estimated_files:,} files")
    print(f"  • Output Path:     \033[1m{os.path.abspath(args.output)}\033[0m")
    print(f"  • Worker Threads:  {args.threads}")
    print(f"  • Files / Subdir:  {args.files_per_dir:,} (Prevents directory locking)")
    print("\033[1;36m======================================================\033[0m")
    print("Starting generation...")

    tracker = ProgressTracker(total_bytes_target)
    bytes_per_worker = total_bytes_target // args.threads
    
    start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=args.threads) as executor:
        futures = []
        for worker_id in range(args.threads):
            # Give remainder to the last worker
            worker_target = bytes_per_worker + (total_bytes_target % args.threads if worker_id == args.threads - 1 else 0)
            
            # Local callback updating tracker with relative byte delta
            last_reported_bytes = [0]
            def make_callback(last_ref):
                def cb(files_delta, current_cumulative_bytes):
                    bytes_delta = current_cumulative_bytes - last_ref[0]
                    last_ref[0] = current_cumulative_bytes
                    tracker.update(files_delta, bytes_delta)
                return cb
                
            future = executor.submit(
                generate_worker,
                worker_id,
                args.output,
                worker_target,
                args.min_size,
                args.max_size,
                args.files_per_dir,
                make_callback(last_reported_bytes)
            )
            futures.append(future)

        # Wait for all workers to finish
        for future in futures:
            future.result()

    total_duration = time.time() - start_time
    tracker.render(time.time())
    print("\n")

    # Final summary calculation
    actual_files = tracker.total_files
    actual_bytes = tracker.total_bytes
    avg_speed_mb = (actual_bytes / (1024 * 1024)) / total_duration if total_duration > 0 else 0
    avg_speed_files = actual_files / total_duration if total_duration > 0 else 0

    print("\033[1;32m======================================================\033[0m")
    print("\033[1;32m               🎉 GENERATION COMPLETE!                \033[0m")
    print("\033[1;32m======================================================\033[0m")
    print(f"  • Total Files:     \033[1m{actual_files:,}\033[0m")
    print(f"  • Total Size:      \033[1m{format_bytes(actual_bytes)}\033[0m")
    print(f"  • Total Time:      {total_duration:.2f} seconds ({format_time(total_duration)})")
    print(f"  • Creation Rate:   \033[1;33m{avg_speed_files:,.0f} files/sec\033[0m ({avg_speed_mb:.1f} MB/s)")
    print(f"  • Location:        {os.path.abspath(args.output)}")
    print("\033[1;32m======================================================\033[0m")

    # If transfer benchmark was requested
    if args.transfer_to:
        run_transfer_benchmark(args.output, args.transfer_to)


if __name__ == "__main__":
    main()

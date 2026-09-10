# ⚡ Random Tiny File Stress Generator (`generated_tools`)

An ultra-fast, multi-threaded generator designed to stress-test external SSDs, USB-C ports, and Thunderbolt enclosures by generating thousands or millions of tiny random files (**10 bytes to 15 KB**) totaling a configurable size (default **10 GB**).

---

## 🎯 Why Tiny Files Are the Ultimate External SSD Test

Most synthetic benchmarks (like Blackmagic Disk Speed Test) only write large 1GB or 5GB sequential blocks. While this shows peak marketing speeds, **it hides critical hardware flaws**:

1. **USB Bridge Controller Overheating & Disconnects:**
   - External SSD enclosures rely on USB-to-NVMe bridge chips (e.g., ASMedia, Realtek, JMicron).
   - Writing 1.3+ million individual files bombards the controller with continuous metadata transactions, flush calls, and high-queue-depth operations. Defective or poorly heatsinked bridge chips will overheat and drop the drive mid-transfer.
2. **SLC Cache Exhaustion:**
   - Cheap external SSDs use small pseudo-SLC caches that mask slow QLC NAND. Sustained small-file random writes quickly exhaust this cache, revealing the drive's true bare-metal write performance.
3. **USB-C Port Current & Signal Integrity:**
   - MacBook Thunderbolt / USB ports must deliver continuous power and maintain clock synchronization under heavy I/O interrupts. A failing port or degraded power IC (`CD3217`) will reset or disconnect the bus.

---

## 🚀 Quick Start & CLI Usage

Run using either the Python script directly or the shell wrapper:

```bash
# 1. Generate default 10 GB dataset into local directory:
./generated_tools/generate_stress_files.sh

# 2. Generate directly onto an external SSD:
./generated_tools/generate_stress_files.sh --size 10GB --output /Volumes/YOUR_SSD/stress_data

# 3. Generate locally, then automatically benchmark copying to the external SSD:
./generated_tools/generate_stress_files.sh --size 5GB --transfer-to /Volumes/YOUR_SSD

# 4. Quick 500 MB sanity check:
./generated_tools/generate_stress_files.sh --size 500MB --output /tmp/quick_check

# 5. Clean up stress dataset when done:
./generated_tools/generate_stress_files.sh --output /Volumes/YOUR_SSD/stress_data --cleanup
```

---

## ⚙️ Options & Arguments

| Flag | Long Option | Default | Description |
| :--- | :--- | :--- | :--- |
| `-s` | `--size` | `10GB` | Total dataset size (`10GB`, `5GB`, `500MB`, `2G`, etc.). |
| `-o` | `--output` | `./stress_test_data` | Directory where files will be created. |
| | `--min-size` | `10` | Minimum file size in bytes. |
| | `--max-size` | `15360` (15 KB) | Maximum file size in bytes. |
| | `--files-per-dir`| `5000` | Max files per subfolder (prevents single-folder inode lag on FAT32/exFAT/APFS). |
| `-t` | `--threads` | CPU cores | Number of concurrent worker threads. |
| | `--transfer-to` | None | Destination path to immediately benchmark transfer speed with rsync. |
| `-c` | `--cleanup` | False | Quickly delete the output stress directory and exit. |

---

## 📊 Interpreting Transfer Benchmark Results

When copying the stress dataset to your external drive (via `--transfer-to`), compare the resulting throughput:

| Effective Small-File Speed | Status | Diagnosis |
| :--- | :--- | :--- |
| **`> 150 MB/s`** (`> 15,000 files/s`) | 🟢 **Excellent** | High-end Thunderbolt 4 / USB 3.2 Gen 2x2 NVMe SSD with DRAM and quality controller. |
| **`40 – 150 MB/s`** (`5,000 – 15,000 files/s`) | 🟡 **Average** | Standard USB 3.2 Gen 2 (10 Gbps) portable SSD (e.g. Samsung T7, SanDisk Extreme). |
| **`< 40 MB/s`** (`< 3,000 files/s`) | 🔴 **Poor / Red Flag** | Budget DRAM-less drive, failing NAND flash, or severe USB bridge throttling. |
| **Drive Disconnects / I/O Freeze** | 🚨 **FATAL DEFECT** | Broken USB bridge chip, faulty USB-C cable, or defective MacBook logic board port! |

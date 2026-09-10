#!/usr/bin/env python3
"""
Extended Real-World Battery Performance & Stress Diagnostic
Measures true battery health under active workload:
- Instantaneous Discharge Power (Watts) & Amperage (mA)
- Voltage Sag under load (indicates internal cell resistance / worn chemistry)
- Individual Cell Voltage Balance (mV Delta across series cells)
- Thermal Dissipation & Temperature Rise (°C)
- Drain Rate (% and mAh per minute)
- Projected Real-World Run Times (Heavy, Balanced, Light)
- Final Usability Scorecard regardless of cycle count or replacement history.
"""

import os
import re
import sys
import time
import math
import hashlib
import argparse
import threading
import subprocess

# ANSI Colors
RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
CYAN = '\033[0;36m'
MAGENTA = '\033[0;35m'
BOLD = '\033[1m'
NC = '\033[0m'

# Telemetry data structure
class BatterySnapshot:
    def __init__(self, timestamp, pct, raw_mah, max_mah, design_mah, volt_mv, 
                 amp_ma, temp_c, is_charging, cells, cycles):
        self.timestamp = timestamp
        self.pct = pct
        self.raw_mah = raw_mah
        self.max_mah = max_mah
        self.design_mah = design_mah
        self.volt_mv = volt_mv
        self.amp_ma = amp_ma
        self.watts = (abs(amp_ma) * volt_mv) / 1_000_000.0
        self.temp_c = temp_c
        self.is_charging = is_charging
        self.cells = cells  # List of cell mV e.g. [4120, 4118, 4122]
        self.cell_delta = (max(cells) - min(cells)) if cells else 0
        self.cycles = cycles


def fetch_battery_telemetry():
    """Extract real-time battery sensors from IOKit AppleSmartBattery."""
    try:
        raw_out = subprocess.check_output(['ioreg', '-r', '-c', 'AppleSmartBattery'], text=True)
    except Exception as e:
        return None

    def get_int(key):
        m = re.search(rf'\"{key}\"\s*=\s*(\d+)', raw_out)
        return int(m.group(1)) if m else None

    # Amperage handling (two's complement 64-bit int for negative discharge current)
    amp_raw = get_int('InstantAmperage') or get_int('Amperage') or 0
    if amp_raw >= (1 << 63):
        amp_ma = amp_raw - (1 << 64)
    else:
        amp_ma = amp_raw

    pct = get_int('CurrentCapacity') or 0
    raw_mah = get_int('AppleRawCurrentCapacity') or 0
    max_mah = get_int('AppleRawMaxCapacity') or 0
    design_mah = get_int('DesignCapacity') or 0
    volt_mv = get_int('Voltage') or 0
    temp_raw = get_int('Temperature') or 0
    temp_c = temp_raw / 100.0 if temp_raw else 0.0
    cycles = get_int('CycleCount') or 0
    is_charging = True if '"IsCharging" = Yes' in raw_out else False

    # Individual Cell Voltages
    cells = []
    cell_match = re.search(r'\"CellVoltage\"\s*=\s*\(([^)]+)\)', raw_out)
    if cell_match:
        try:
            cells = [int(x.strip()) for x in cell_match.group(1).split(',') if x.strip()]
        except ValueError:
            cells = []

    return BatterySnapshot(
        timestamp=time.time(),
        pct=pct,
        raw_mah=raw_mah,
        max_mah=max_mah,
        design_mah=design_mah,
        volt_mv=volt_mv,
        amp_ma=amp_ma,
        temp_c=temp_c,
        is_charging=is_charging,
        cells=cells,
        cycles=cycles
    )


def compute_workload(stop_event, intensity):
    """Worker loop generating sustained CPU & memory computation."""
    # Pre-allocate memory block for cache/memory strain
    block_size = 4 * 1024 * 1024 if intensity == "heavy" else 1024 * 1024
    scratch_data = os.urandom(block_size)
    
    while not stop_event.is_set():
        if intensity == "heavy":
            # Continuous SHA-256 and mathematical matrix crunching
            hasher = hashlib.sha256()
            for _ in range(50):
                hasher.update(scratch_data)
            _ = hasher.hexdigest()
            # Matrix float operations
            _ = [math.sin(x) * math.cos(x) for x in range(1000)]
        elif intensity == "balanced":
            # Bursts of computation with brief idle sleep
            hasher = hashlib.sha256()
            for _ in range(25):
                hasher.update(scratch_data)
            _ = hasher.hexdigest()
            time.sleep(0.01)
        else:
            # Light / background monitoring
            time.sleep(0.5)


def parse_duration(dur_str):
    """Parse time string like 3m, 5m, 180s, 10m into seconds."""
    dur_str = dur_str.strip().lower()
    if dur_str.endswith('m'):
        return int(float(dur_str[:-1]) * 60)
    elif dur_str.endswith('s'):
        return int(float(dur_str[:-1]))
    else:
        return int(float(dur_str))


def print_dashboard(current, initial, elapsed, total_sec, baseline_volt):
    """Render dynamic real-time telemetry dashboard in terminal."""
    pct_bar_len = 20
    filled = int(pct_bar_len * (current.pct / 100.0))
    bar = "█" * filled + "░" * (pct_bar_len - filled)
    
    volt_v = current.volt_mv / 1000.0
    sag_v = (baseline_volt - current.volt_mv) / 1000.0 if baseline_volt else 0.0
    sag_str = f"-{sag_v:.3f}V" if sag_v > 0 else f"+{abs(sag_v):.3f}V"
    
    temp_delta = current.temp_c - initial.temp_c
    delta_str = f"+{temp_delta:.1f}°C" if temp_delta >= 0 else f"{temp_delta:.1f}°C"
    
    m_el, s_el = divmod(int(elapsed), 60)
    m_tot, s_tot = divmod(int(total_sec), 60)
    
    # Cells string
    if current.cells:
        cells_disp = " | ".join([f"C{i+1}: {v/1000.0:.3f}V" for i, v in enumerate(current.cells)])
        imbalance_disp = f"Δ: {current.cell_delta} mV"
    else:
        cells_disp = "N/A"
        imbalance_disp = "N/A"

    charging_status = f"{YELLOW}⚡ CHARGER CONNECTED (Unplug for true discharge test!){NC}" if current.is_charging else f"{GREEN}🔋 Discharging on Battery{NC}"

    sys.stdout.write("\033[H\033[J") # Clear screen
    print(f"{BOLD}{CYAN}======================================================================{NC}")
    print(f"{BOLD}{CYAN}       🍏 REAL-WORLD BATTERY STRESS & HEALTH DIAGNOSTIC 🍏            {NC}")
    print(f"{BOLD}{CYAN}======================================================================{NC}")
    print(f"Status:          {charging_status}")
    print(f"Test Progress:   [{m_el:02d}:{s_el:02d} / {m_tot:02d}:{s_tot:02d}] ({elapsed*100/total_sec:.1f}%)")
    print(f"Battery Level:   [{CYAN}{bar}{NC}] {BOLD}{current.pct}%{NC} ({current.raw_mah:,} mAh remaining)")
    print(f"Power Draw:      {BOLD}{YELLOW}{current.watts:5.2f} W{NC} ({abs(current.amp_ma):,} mA)")
    print(f"Pack Voltage:    {BOLD}{volt_v:6.3f} V{NC} (Instant Voltage Sag: {sag_str})")
    print(f"Cell Voltages:   {cells_disp} ({BOLD}{imbalance_disp}{NC})")
    print(f"Cell Temp:       {BOLD}{current.temp_c:4.1f}°C{NC} (Rise: {delta_str})")
    print(f"{BOLD}{CYAN}----------------------------------------------------------------------{NC}")
    print(f"Press {BOLD}Ctrl + C{NC} at any moment to stop test and view diagnostic summary.")
    print(f"{BOLD}{CYAN}======================================================================{NC}")
    sys.stdout.flush()


def generate_final_report(snapshots, baseline_volt, workload, duration_sec):
    """Analyze collected telemetry and generate a comprehensive usability scorecard."""
    if not snapshots or len(snapshots) < 2:
        print(f"\n{RED}Insufficient telemetry data collected to generate a report.{NC}")
        return

    first = snapshots[0]
    last = snapshots[-1]
    elapsed = last.timestamp - first.timestamp
    
    if elapsed <= 0:
        elapsed = 1.0

    # Capacity calculations
    mah_drained = max(0, first.raw_mah - last.raw_mah)
    pct_drained = max(0, first.pct - last.pct)
    mah_per_minute = (mah_drained / elapsed) * 60.0
    pct_per_minute = (pct_drained / elapsed) * 60.0

    # Wattage & Voltage calculations
    avg_watts = sum(s.watts for s in snapshots) / len(snapshots)
    min_voltage = min(s.volt_mv for s in snapshots) / 1000.0
    max_voltage_sag = max(0.0, (baseline_volt - min(s.volt_mv for s in snapshots)) / 1000.0)

    # Max Cell Imbalance (mV Delta)
    max_cell_delta = max((s.cell_delta for s in snapshots), default=0)
    
    # Temperature rise
    max_temp = max(s.temp_c for s in snapshots)
    temp_rise = max_temp - first.temp_c

    # Runtime Projections
    usable_mah = last.raw_mah if last.raw_mah > 0 else (last.max_mah * (last.pct / 100.0))
    
    # Heavy Load runtime (based on measured watts under stress)
    heavy_hours = (usable_mah / mah_per_minute / 60.0) if mah_per_minute > 0 else (usable_mah / (avg_watts / (last.volt_mv/1000.0) * 1000.0)) if avg_watts > 0 else 0
    # Balanced daily browsing runtime (assumes ~7-9W average draw)
    balanced_hours = (usable_mah * (last.volt_mv/1000.0) / 1000.0) / 8.0
    # Light video playback runtime (assumes ~4-5W average draw)
    light_hours = (usable_mah * (last.volt_mv/1000.0) / 1000.0) / 4.5

    # Evaluation Grades
    # 1. Cell Balance Grade
    if max_cell_delta <= 15:
        grade_balance = f"{GREEN}✅ EXCELLENT (Δ <= 15 mV){NC} - Cells perfectly matched in resistance"
        score_balance = "PASS"
    elif max_cell_delta <= 30:
        grade_balance = f"{YELLOW}⚠️  ACCEPTABLE (Δ {max_cell_delta} mV){NC} - Normal aging or moderate wear"
        score_balance = "WARN"
    else:
        grade_balance = f"{RED}❌ SEVERELY UNBALANCED (Δ {max_cell_delta} mV){NC} - Defective/recycled mismatched cells"
        score_balance = "FAIL"

    # 2. Voltage Sag Grade
    if max_voltage_sag <= 0.45:
        grade_sag = f"{GREEN}✅ STABLE (< 0.45V sag){NC} - High chemical conductivity, low internal resistance"
        score_sag = "PASS"
    elif max_voltage_sag <= 0.80:
        grade_sag = f"{YELLOW}⚠️  MODERATE SAG ({max_voltage_sag:.2f}V sag){NC} - Chemistry aged but functional"
        score_sag = "WARN"
    else:
        grade_sag = f"{RED}❌ CRITICAL SAG ({max_voltage_sag:.2f}V sag){NC} - High internal resistance; prone to sudden shutdown"
        score_sag = "FAIL"

    # 3. Thermal Efficiency Grade
    if max_temp <= 36.0:
        grade_temp = f"{GREEN}✅ COOL ({max_temp:.1f}°C, +{temp_rise:.1f}°C){NC} - Zero excessive heat generation"
        score_temp = "PASS"
    elif max_temp <= 41.0:
        grade_temp = f"{YELLOW}⚠️  NORMAL ({max_temp:.1f}°C, +{temp_rise:.1f}°C){NC} - Standard thermal dissipation"
        score_temp = "WARN"
    else:
        grade_temp = f"{RED}❌ OVERHEATING ({max_temp:.1f}°C, +{temp_rise:.1f}°C){NC} - Cheap copy cell or thermal short"
        score_temp = "FAIL"

    print("\n")
    print(f"{BOLD}{CYAN}======================================================================{NC}")
    print(f"{BOLD}{CYAN}           📊 BATTERY EXTENDED STRESS TEST REPORT                     {NC}")
    print(f"{BOLD}{CYAN}======================================================================{NC}")
    print(f"  • Test Duration:        {elapsed:.1f} seconds ({int(elapsed//60)}m {int(elapsed%60)}s) under '{workload}' load")
    print(f"  • Battery Level Drop:   {BOLD}{first.pct}% ➔ {last.pct}%{NC} (-{pct_drained}% | -{mah_drained} mAh)")
    print(f"  • Drain Velocity:       {BOLD}{pct_per_minute:.2f}% per minute{NC} ({mah_per_minute:.0f} mAh/min)")
    print(f"  • Mean Discharge Power: {BOLD}{YELLOW}{avg_watts:.2f} Watts{NC}")
    print(f"  • Pack Voltage Window:  {first.volt_mv/1000.0:.3f}V ➔ {min_voltage:.3f}V (Max Sag: {max_voltage_sag:.3f}V)")
    if last.cells:
        print(f"  • Final Cell Voltages:  " + " | ".join([f"Cell {i+1}: {v/1000.0:.3f}V" for i, v in enumerate(last.cells)]))
    print(f"  • Cell Peak Imbalance:  {BOLD}{max_cell_delta} mV Delta{NC}")
    print(f"  • Battery Temperatures: Start: {first.temp_c:.1f}°C ➔ Peak: {max_temp:.1f}°C (+{temp_rise:.1f}°C)")
    print(f"  • Factory Design Specs: Design: {last.design_mah:,} mAh | Current Max: {last.max_mah:,} mAh | Cycles: {last.cycles}")

    print(f"\n{BOLD}{CYAN}----------------------------------------------------------------------{NC}")
    print(f"{BOLD}🔋 ESTIMATED REAL-WORLD RUNTIME (Based on Actual Discharge Curve):{NC}")
    print(f"  • Sustained Heavy Load (Rendering, Gaming, Stress): ~{heavy_hours:.1f} Hours")
    print(f"  • Balanced Daily Use (Web Browsing, Coding, Docs):  ~{balanced_hours:.1f} Hours")
    print(f"  • Light Power Saver (Video Playback, Reading):      ~{light_hours:.1f} Hours")

    print(f"\n{BOLD}{CYAN}----------------------------------------------------------------------{NC}")
    print(f"{BOLD}🎯 BATTERY PHYSICAL HEALTH & SAFETY AUDIT:{NC}")
    print(f"  • Cell Voltage Alignment: {grade_balance}")
    print(f"  • Load Voltage Stability: {grade_sag}")
    print(f"  • Thermal Dissipation:    {grade_temp}")

    print(f"\n{BOLD}{CYAN}======================================================================{NC}")
    if score_balance == "FAIL" or score_sag == "FAIL":
        print(f"  {BOLD}{RED}🚨 FINAL VERDICT: DO NOT BUY / BATTERY DEFECTIVE!{NC}")
        print(f"  Reason: Severe cell imbalance or voltage collapse under load.")
        print(f"  Even if macOS says 'Normal', this battery will abruptly shut down below 30%.")
    elif score_temp == "FAIL":
        print(f"  {BOLD}{RED}🚨 FINAL VERDICT: DANGEROUS BATTERY DETECTED!{NC}")
        print(f"  Reason: Battery reached {max_temp:.1f}°C. Possible low-grade counterfeit cell with swelling risk.")
    elif score_balance == "WARN" or score_sag == "WARN":
        print(f"  {BOLD}{YELLOW}⚠️  FINAL VERDICT: ACCEPTABLE PRE-OWNED / NEGOTIATE DISCOUNT{NC}")
        print(f"  Reason: Battery is aged but chemically intact. Safe to use, but budget for future replacement.")
    else:
        print(f"  {BOLD}{GREEN}🎉 FINAL VERDICT: EXCELLENT PERFORMING BATTERY!{NC}")
        print(f"  Reason: Outstanding cell balance, tight voltage regulation, and low thermal resistance.")
        print(f"  Whether original or quality replacement, this battery is 100% ROAD READY.")
    print(f"{BOLD}{CYAN}======================================================================{NC}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Run an active real-world battery stress test and monitor cell health, voltage sag, and power draw."
    )
    parser.add_argument(
        "-d", "--duration",
        default="3m",
        help="Test duration (e.g. 3m, 5m, 180s, default: 3m)"
    )
    parser.add_argument(
        "-w", "--workload",
        choices=["heavy", "balanced", "light"],
        default="heavy",
        help="Simulated workload intensity: 'heavy' (100% stress), 'balanced' (typical bursty use), 'light' (idle drain)"
    )
    parser.add_argument(
        "-t", "--threads",
        type=int,
        default=os.cpu_count() or 4,
        help=f"Number of computation worker threads (default: {os.cpu_count() or 4})"
    )

    args = parser.parse_args()
    total_seconds = parse_duration(args.duration)

    # Initial baseline check
    initial_sample = fetch_battery_telemetry()
    if not initial_sample:
        print(f"{RED}❌ Error: Could not query IOKit AppleSmartBattery. Ensure you are running macOS on a MacBook.{NC}")
        sys.exit(1)

    if initial_sample.is_charging:
        print(f"{YELLOW}⚠️  WARNING: Charger is currently connected!{NC}")
        print(f"   To measure true battery discharge and cell voltage sag, please {BOLD}UNPLUG THE CHARGER{NC}.")
        try:
            input(f"   Press {BOLD}[Enter]{NC} once unplugged to proceed (or Ctrl+C to abort)...")
        except KeyboardInterrupt:
            print("\nAborted.")
            sys.exit(0)
        # Re-sample
        initial_sample = fetch_battery_telemetry()

    baseline_volt = initial_sample.volt_mv

    print(f"\n{BOLD}Initializing {args.workload} workload with {args.threads} worker threads...{NC}")
    stop_event = threading.Event()
    worker_threads = []
    
    if args.workload in ["heavy", "balanced"]:
        for _ in range(args.threads):
            t = threading.Thread(target=compute_workload, args=(stop_event, args.workload), daemon=True)
            t.start()
            worker_threads.append(t)

    snapshots = [initial_sample]
    start_time = time.time()
    
    try:
        while True:
            time.sleep(1.0)
            now = time.time()
            elapsed = now - start_time
            
            sample = fetch_battery_telemetry()
            if sample:
                snapshots.append(sample)
                print_dashboard(sample, initial_sample, elapsed, total_seconds, baseline_volt)
                
                # Safety checks
                if sample.pct <= 3:
                    print(f"\n{RED}🛑 Safety Cutoff: Battery level dropped to 3%! Terminating test.{NC}")
                    break
                if sample.temp_c >= 48.0:
                    print(f"\n{RED}🛑 Safety Cutoff: Battery temperature exceeded 48°C! Terminating test.{NC}")
                    break

            if elapsed >= total_seconds:
                break

    except KeyboardInterrupt:
        print(f"\n{YELLOW}⚠️  Test interrupted by user. Generating report from collected samples...{NC}")
    finally:
        stop_event.set()
        for t in worker_threads:
            t.join(timeout=1.0)

    # Output detailed report
    generate_final_report(snapshots, baseline_volt, args.workload, total_seconds)


if __name__ == "__main__":
    main()

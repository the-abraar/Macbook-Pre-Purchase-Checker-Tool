# 🔋 Battery Extended Performance & Real-World Stress Test

A diagnostic suite designed to test the **actual physical health, cell balance, voltage stability, and runtime** of a pre-owned MacBook battery under an active multi-core workload—looking far beyond cycle counts or replacement history.

---

## 💡 Why Cycle Count & "Health %" Can Be Deceiving

In reseller and grey-market shops, buyers frequently get tricked by superficial battery statistics:

1. **Cycle Counts Can Be Falsified:**
   - Resellers use inexpensive battery programmer boxes (such as QianLi or JCID tools) to reset the battery BMS microcontroller EEPROM to "5 cycles" and "100% capacity" on worn-out cells.
2. **Old Original vs. Fresh Quality Replacement:**
   - A 4-year-old original Apple battery with 300 cycles has chemically degraded cathode material and high internal resistance. Under heavy load, its voltage will collapse.
   - Conversely, **a quality replacement battery installed by a reputable technician is often far superior to a dying original battery**.
3. **The "Dies at 35%" Mystery:**
   - Apple Silicon MacBooks use 3 lithium-polymer cells connected in series (3S pack).
   - If one of the three cells is degraded or recycled, it discharges faster than the other two. When that single weak cell hits the cutoff threshold (~3.2V), the Mac's Power Management IC instantly cuts all power to prevent lithium fire—**abruptly shutting down the Mac while macOS still claims 30%–40% charge**.

---

## 🎯 The 3 Real-World Metrics That Actually Matter

[`battery_stress_test.py`](battery_stress_test.py) monitors the three critical physical parameters in real-time using native IOKit telemetry:

### 1. Cell Voltage Balance (Delta in mV)
* **What it measures:** The voltage difference between Cell 1, Cell 2, and Cell 3 under active load.
* **🟢 Excellent (Δ ≤ 15 mV):** Perfectly matched cells with identical internal resistance.
* **🟡 Acceptable (Δ 16 – 30 mV):** Normal aging; safe for daily tasks.
* **🔴 Dangerous Imbalance (Δ > 35 mV):** Defective pack with mismatched or dying cells. **This battery will abruptly crash below 35%.**

### 2. Instantaneous Voltage Sag under Load
* **What it measures:** How much total pack voltage drops when transitioning from idle (~5W) to multi-core load (~25W–45W).
* **Formula:** $\Delta V = I \times R_{\text{internal}}$
* **🟢 Stable (< 0.45V sag):** High chemical conductivity, low internal resistance.
* **🟡 Moderate (0.45V – 0.80V sag):** Chemistry has aged; acceptable for moderate use.
* **🔴 Severe (> 0.85V sag):** High internal resistance. The battery cannot deliver required current peaks.

### 3. Thermal Dissipation & Temperature Rise
* **What it measures:** Temperature of the battery pack during sustained load.
* **🟢 Cool (< 36°C):** Quality OEM cells with low internal dissipation ($P = I^2 R$).
* **🟡 Normal (36°C – 40°C):** Standard dissipation during heavy multi-core compute.
* **🔴 Overheating (> 42°C):** Poor quality counterfeit copy cells; high fire / pouch swelling risk over time.

---

## 🚀 Quick Shop Testing Protocol (3-Minute Test)

When standing in a reseller shop, run this 3-minute test right after the factory reset:

1. **Unplug the charger brick.**
2. Open **Terminal** and navigate to the directory (or launch from your USB drive):
   ```bash
   ./battery_extended_test/battery_stress_test.sh -d 3m
   ```
3. The script will spin up multi-threaded worker threads and display a live telemetry dashboard:
   ```
   ======================================================================
          🍏 REAL-WORLD BATTERY STRESS & HEALTH DIAGNOSTIC 🍏            
   ======================================================================
   Status:          🔋 Discharging on Battery
   Test Progress:   [01:45 / 03:00] (58.3%)
   Battery Level:   [████████████████░░░░] 84% (4,820 mAh remaining)
   Power Draw:       26.40 W (2,180 mA)
   Pack Voltage:    12.110 V (Instant Voltage Sag: -0.320V)
   Cell Voltages:   C1: 4.038V | C2: 4.035V | C3: 4.037V (Δ: 3 mV)
   Cell Temp:       32.4°C (Rise: +1.8°C)
   ----------------------------------------------------------------------
   Press Ctrl + C at any moment to stop test and view diagnostic summary.
   ======================================================================
   ```
4. Once completed (or interrupted with `Ctrl + C`), the tool automatically outputs a comprehensive **Diagnostic Scorecard**:
   - Starting vs Ending Capacity (% & mAh).
   - Drain velocity (%/minute).
   - Real-world runtime projections for **Heavy Load**, **Balanced Browsing**, and **Video Playback**.
   - Cell balance, voltage stability, and thermal grades.
   - **Final Buying Verdict**.

---

## ⚙️ CLI Options & Flags

```bash
# Standard 3-minute shop test (default heavy load):
./battery_extended_test/battery_stress_test.sh

# 5-minute deep inspection:
./battery_extended_test/battery_stress_test.sh -d 5m

# Balanced workload (simulates typical bursty web & app use):
./battery_extended_test/battery_stress_test.sh -d 5m -w balanced

# Passive background drain monitoring (no compute load):
./battery_extended_test/battery_stress_test.sh -d 10m -w light

# Specify custom worker threads:
./battery_extended_test/battery_stress_test.sh -d 3m -t 8
```

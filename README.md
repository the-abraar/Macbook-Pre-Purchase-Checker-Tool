# 🍏 Universal Apple Silicon MacBook Pre-Purchase Checker Tool

An all-in-one pre-purchase guide, model-specific checklist repository, and automated diagnostic tool for inspecting used Apple Silicon MacBooks (**M1, M2, M3, M4** across both **Air** and **Pro/Max** lines) before buying from reseller shops.

---

## 📂 Model-Specific Directories & Benchmark Guides

Each model directory provides tailored checklists, known hardware defect warnings (e.g. single-NAND layout on base M2, port failures on M1, port counts on M3/M4), and Geekbench/SSD benchmark baselines:

| Model Series | Years | Form Factors | Checklist & Baselines |
| :--- | :--- | :--- | :--- |
| **M1 MacBook Air** | 2020 | 13.3" Retina | [📋 M1 Air Checklist](models/m1-air/CHECKLIST.md) \| [🎯 M1 Air Baselines](models/m1-air/BENCHMARKS.md) |
| **M1 Pro & M1 Max** | 2021 | 14.2" & 16.2" Pro | [📋 M1 Pro/Max Checklist](models/m1-pro-max/CHECKLIST.md) \| [🎯 M1 Pro/Max Baselines](models/m1-pro-max/BENCHMARKS.md) |
| **M2 MacBook Air** | 2022–2023 | 13.6" & 15.3" Air | [📋 M2 Air Checklist](models/m2-air/CHECKLIST.md) \| [🎯 M2 Air Baselines](models/m2-air/BENCHMARKS.md) |
| **M2 Pro & M2 Max** | 2023 | 14.2" & 16.2" Pro | [📋 M2 Pro/Max Checklist](models/m2-pro-max/CHECKLIST.md) \| [🎯 M2 Pro/Max Baselines](models/m2-pro-max/BENCHMARKS.md) |
| **M3 Series** | 2023–2024 | 13"/15" Air, 14"/16" Pro | [📋 M3 Series Checklist](models/m3-series/CHECKLIST.md) \| [🎯 M3 Series Baselines](models/m3-series/BENCHMARKS.md) |
| **M4 Series** | 2024–2025 | 14.2" & 16.2" Pro | [📋 M4 Series Checklist](models/m4-series/CHECKLIST.md) \| [🎯 M4 Series Baselines](models/m4-series/BENCHMARKS.md) |

---

## ⚡ Universal Automated Inspection Script (`check_mac.sh`)

[`check_mac.sh`](check_mac.sh) is a lightweight, color-coded Bash script that runs in **under 10 seconds** using **100% native macOS tools** (no `sudo`, no installation, no dependencies).

### Key Features:
- **Auto-Detects Chip Generation & Model:** Identifies M1, M2, M3, M4 (Base, Pro, Max) and whether the chassis is a MacBook Air or MacBook Pro.
- **Dynamic Battery Evaluation:** Uses generation-aware cycle thresholds (flags <25 cycles as suspicious for an older M1, while recognizing low cycles as normal for fresh M3/M4 units).
- **Dynamic SSD Analysis:** Accurately evaluates M1 dual-NAND (~2,100 MB/s), base M2 single-NAND (~1,500 MB/s), and M3/M4 high-speed flash (~3,500–7,000 MB/s).
- **Model-Tailored Manual Checks:** Recommends checking ProMotion 120Hz, HDMI, MagSafe 3, and SD card on MacBook Pros, vs dual USB-C ports on MacBook Airs.
- **Biometrics & Security:** Queries Secure Enclave for Touch ID pairing, checks MDM enrollment, and flags iCloud Activation Lock.

### How to Use at the Shop:
1. Save [`check_mac.sh`](check_mac.sh) onto your USB flash drive.
2. Plug the USB into the target MacBook.
3. Open **Terminal** (`Cmd + Space` -> type `Terminal`).
4. Type `bash ` (with a space) and **drag & drop** the `check_mac.sh` file from your USB into Terminal, then press **Enter**:
   ```bash
   bash /Volumes/YOUR_USB_NAME/check_mac.sh
   ```

---

## 🇧🇩 Used Market Pricing & Buying Rules (Bangladesh)

Buying a pre-owned MacBook from unauthorized or grey-market reseller shops (Multiplan, Elephant Road, Motaleb Plaza, Mirpur, or Bashundhara/JFP) carries specific risks like MDM bypasses, replaced copy parts, and swapped boards.

### Current Used Price Range in Bangladesh (M1 Air 8GB / 256GB baseline)
* **Median Market Price:** ৳60,000 – ৳65,000 BDT
* **Rough / High Cycle Count (>500 cycles / minor body dents):** ৳54,000 – ৳58,000 BDT
* **Mint Condition (Battery health >88%, with original box & accessories):** ৳66,000 – ৳70,000 BDT
* **Upgraded 16GB RAM models:** Usually ৳75,000 – ৳85,000+ BDT (rare in local shops)

> [!WARNING]
> If a shop is selling an Apple Silicon MacBook for drastically below market price, walk away immediately. It is almost certainly an MDM-enrolled corporate laptop, iCloud-bypassed, or has internal liquid damage.

### The Golden Rule: Demand a Factory Reset
Never buy a MacBook set up with a pre-existing user account:
1. Tell the seller: *"I want to format and set it up from the initial setup screen."*
2. Go to **System Settings > General > Transfer or Reset > Erase All Content and Settings**.
3. Once formatted, connect to Wi-Fi or your mobile hotspot during the initial "Hello" setup wizard.
4. If a screen titled **"Remote Management"** appears, the machine belongs to an overseas company/school and has an MDM lock. **Do not buy it.**

---

## 🛠️ Native Diagnostic Commands Reference

These native macOS commands run directly in Terminal without any installation:

| Command | Purpose |
| :--- | :--- |
| `profiles status -type enrollment 2>&1` | Check MDM / DEP enterprise enrollment status without root password. |
| `ioreg -r -c AppleSmartBattery \| grep -iE "CycleCount\|MaxCapacity\|DesignCapacity"` | Inspect raw hardware battery metrics. |
| `pmset -g therm` | Check current CPU speed and thermal scheduler limits. |
| `pmset -g batt` | Check current battery charge status and power source. |
| `system_profiler SPPowerDataType \| grep -A 10 "Health Information"` | Check macOS reported battery health and cycle count. |
| `system_profiler SPHardwareDataType` | Verify chip, total cores, memory, serial number, and Activation Lock. |
| `system_profiler SPDisplaysDataType` | Check display resolution and connection status. |
| `bioutil -r` | Query Touch ID sensor status and Secure Enclave pairing. |
| `diskutil info disk0 \| grep -iE "SMART\|Device / Media Name\|Disk Size\|Solid State"` | Check internal SSD SMART health status and capacity. |
| `dd if=/dev/zero of=/tmp/test_speed.bin bs=1m count=1024 2>&1` | Write a temporary 1GB block to test sequential write speed. |
| `rm -f /tmp/test_speed.bin` | Clean up speed test temporary file. |
| `log show --predicate 'eventMessage contains "Previous shutdown cause"' --last 48h` | Check previous shutdown cause codes (thermal shutdowns, panics). |

---

## 🧰 Recommended Free Benchmark Tools & Direct Links

Download these tools onto your USB flash drive before visiting the shop:

1. **coconutBattery** (Battery Health & Authenticity)
   - 👉 [coconut-flavour.com/coconutbattery](https://www.coconut-flavour.com/coconutbattery/)
2. **DriveDx** (SSD Health, Wear & TBW)
   - 👉 [binaryfruit.com/drivedx](https://binaryfruit.com/drivedx/)
3. **Geekbench 6** (CPU & GPU Performance Benchmark)
   - 👉 [geekbench.com/download/mac](https://www.geekbench.com/download/mac/)
4. **Disk Speed Test**
   - **Blackmagic Disk Speed Test:** [Mac App Store Link](https://apps.apple.com/app/blackmagic-disk-speed-test/id425264550)
   - **AmorphousDiskMark:** [Download Page](https://katsurashareware.com/amorphousdiskmark/) or [GitHub Releases](https://github.com/hkatsura/AmorphousDiskMark/releases)

---

## 📱 Quick Mobile Checklist (For Phone Notes)

```markdown
📱 Apple Silicon MacBook Field Inspection Checklist

🛠️ Step 0: Pre-Shop Prep
[ ] Put test files on USB: Geekbench 6, Disk Speed Test, DriveDx, coconutBattery, check_mac.sh.

🔒 Phase 1: Security, Reset & MDM (Do This First!)
[ ] Full Factory Reset: System Settings > General > Transfer or Reset > Erase All Content and Settings.
[ ] Wi-Fi Setup Test: Connect during "Hello" screen.
    Pass: Normal user setup screen.
    Fail: "Remote Management" screen (Corporate MDM lock - WALK AWAY).
[ ] MDM Terminal Check: profiles status -type enrollment
    Pass: Enrolled via DEP: No.
[ ] Check System Settings > Privacy & Security > Profiles (must be empty).

💻 Phase 2: System & Serial Verification
[ ] Run: system_profiler SPHardwareDataType | grep "Serial Number"
[ ] Verify terminal serial matches bottom metal chassis engraving.
[ ] Check warranty on checkcoverage.apple.com.
[ ] Battery Health: ioreg -r -c AppleSmartBattery | grep -iE "CycleCount|MaxCapacity|DesignCapacity"

🖥️ Phase 3: Hardware & Display
[ ] True Tone: System Settings > Displays (toggle must exist; missing = cheap replacement screen).
[ ] ProMotion (Pros): System Settings > Displays > Refresh Rate (must show ProMotion 120Hz).
[ ] Screen Uniformity: White image at 100% brightness (check dead pixels, yellow tint, stage light).
[ ] Touch ID: Register fingerprint in System Settings > Touch ID (errors = unbonded board/button).
[ ] Keyboard: Test every key on keyboardtester.com (Fn, Caps Lock, Spacebar corners).
[ ] All Physical Ports: Test charging AND fast data on all USB-C/Thunderbolt ports, HDMI, and SD slot.
[ ] Speakers & Mic: Record 5s in Voice Memos and play at 100% volume.

⚙️ Phase 4: Apple Hardware Diagnostics
[ ] Shut down -> Hold Power until "Loading startup options" -> Press Cmd+D.
    Pass: Code ADP000.
    Fail: Codes PPT (battery), VDC/VFF (display), NDR (Wi-Fi).

🚀 Phase 5: Run Automated Script & USB Benchmarks
[ ] Run check_mac.sh in Terminal (10-second pass).
[ ] DriveDx: Life Remaining > 85%, Media Errors = 0.
[ ] Disk Speed: Compare against model benchmark targets in models/ directory.
[ ] Geekbench 6: Verify Multi-Core score is within expected range (rules out thermal throttling).

🧾 Phase 6: Deal Finalization
[ ] Cash Memo: With matching Serial Number, shop seal, and owner signature.
[ ] Warranty: Minimum 7–10 days replacement warranty written on memo.
[ ] Charger: Genuine Apple or reputable GaN (Anker/Ugreen). Reject cheap unbranded copy bricks.
[ ] Sign in Apple ID, enable FileVault, and reboot cleanly once.
```
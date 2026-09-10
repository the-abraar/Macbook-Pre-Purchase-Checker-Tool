# 🍏 M1 MacBook Air Field Inspection Checklist

## Reference Benchmark Targets
| Test Metric | Expected Range (Pass) | Red Flag / Immediate Failure |
| :--- | :--- | :--- |
| **Battery Cycle Count** | `150 – 550` cycles | `< 20` cycles on a worn chassis (reprogrammed/fake) |
| **SSD Health (DriveDx)** | `> 85%` Life Remaining | Media Errors `> 0` or Data Written `> 50 TB` |
| **Disk Write Speed** | `~2,100 – 2,300 MB/s` | Below `1,200 MB/s` |
| **Disk Read Speed** | `~2,600 – 2,800 MB/s` | Below `1,200 MB/s` |
| **Geekbench 6 Multi-Core** | `8,200 – 8,700` | Below `6,500` (severe thermal throttling) |
| **Geekbench 6 Single-Core** | `~2,300 – 2,400` | Significantly lower scores |
| **Hardware Diagnostics** | Code `ADP000` (No issues) | Codes starting with `PPT` (battery), `VDC`/`VFF` (display), `NDR` (Wi-Fi) |

---

## Phase 0: Pre-Shop Preparation
* Prepare a USB flash drive formatted for macOS containing the following `.dmg` installers/apps:
  * Geekbench 6
  * Blackmagic Disk Speed Test (or AmorphousDiskMark)
  * DriveDx
  * coconutBattery
  * [`check_mac.sh`](check_mac.sh)

---

## Phase 1: Security, Reset & MDM Lock Check
*Perform these checks before handing over payment or testing hardware.*

* **Full Factory Reset Verification:**
  * Navigate to `System Settings > General > Transfer or Reset > Erase All Content and Settings`.
* **Wi-Fi Setup Test:**
  * Connect to Wi-Fi or phone Hotspot during the initial "Hello" setup flow.
  * **Pass:** Proceeds normally to desktop account creation screen.
  * **Fail (Walk Away):** A "Remote Management" screen appears (Corporate/School MDM enrolled).
* **Terminal MDM Verification:**
  * Open Terminal and execute:
    ```bash
    profiles status -type enrollment
    ```
  * **Pass:** Output displays `Enrolled via DEP: No` and `MDM enrollment: No` (or *"Client is not DEP enabled"*).
  * **Fail:** Displays any company, institution name, or enrollment URL.

---

## Phase 2: System & Serial Verification
* **Serial Number Check:**
  * Open Terminal and execute:
    ```bash
    system_profiler SPHardwareDataType | grep "Serial Number"
    ```
  * Confirm the displayed serial matches the text engraved on the bottom metal case.
  * Check warranty and service status online at [checkcoverage.apple.com](https://checkcoverage.apple.com/).
* **Battery Health & History:**
  * Open Terminal and execute:
    ```bash
    ioreg -r -c AppleSmartBattery | grep -iE "CycleCount|MaxCapacity|DesignCapacity"
    ```
  * Verify cycle count falls within `150 – 550`. (*Caution:* Under 20 cycles on a heavily used body indicates a reprogrammed or third-party copy battery).

---

## Phase 3: Hardware & Display Inspection
* **True Tone Display Check:**
  * Navigate to `System Settings > Displays`. Toggle switch must be present. (*Missing toggle indicates an inferior third-party screen replacement*).
* **Display Defect Test:**
  * Open a solid white image in full-screen at maximum brightness.
  * Check for dead pixels, yellow tinting, or uneven light bleed along the bottom edge (*"stage light"* effect).
* **Touch ID Functionality:**
  * Go to `System Settings > Touch ID` and register your fingerprint. (*Errors indicate an unbonded or repaired logic board*).
* **Keyboard Matrix Test:**
  * Open TextEdit or visit [keyboardtester.com](https://www.keyboardtester.com/).
  * Test **every key**, including Fn, Caps Lock, function row, and all four corners of the Spacebar.
* **USB-C Port Connectivity:**
  * Insert charger into Port 1, then attach USB drive into Port 2. Swap positions. Both ports must charge and mount data simultaneously.
* **Microphone & Speakers:**
  * Record a 5-second sample in Voice Memos; play back at 100% volume to check for distortion or speaker crackle.

---

## Phase 4: Apple Hardware Diagnostics
* **Run On-Board Hardware Self-Test:**
  1. Shut down the MacBook completely.
  2. Press and hold the **Power / Touch ID** button until *"Loading startup options"* appears.
  3. Press and hold `Cmd + D` on the keyboard.
  * **Pass:** Result code `ADP000` (No issues found).
  * **Fail:** Any code starting with `PPT` (battery failure), `VDC`/`VFF` (display issue), or `NDR` (Wi-Fi hardware issue).

---

## Phase 5: Speed & Health Benchmarks
*Run applications installed directly from your prepared USB flash drive.*

* **DriveDx (SSD Health & Lifetime):**
  * Life Remaining: Must be `> 85%`.
  * Media Errors: Must equal `0`.
  * Data Written (TBW): Ideally `< 50 TB`.
* **Blackmagic Disk Speed Test:**
  * Write Speed: `~2,100 – 2,300 MB/s`
  * Read Speed: `~2,600 – 2,800 MB/s`
  * (*Red Flag:* Write or read speeds below 1,200 MB/s).
* **Geekbench 6 (CPU & GPU Performance):**
  * Multi-Core Score: `8,200 – 8,700` (Below 6,500 indicates thermal throttling or sensor issues).
  * Single-Core Score: `~2,300 – 2,400`.
* **Network Health Test:**
  * Run `networkQuality` in Terminal to ensure consistent throughput and latency responsiveness.

---

## Phase 6: Deal Finalization
* Demand an official cash memo / purchase invoice featuring:
  * MacBook Serial Number matching the unit.
  * Official shop seal and owner signature.
* Ensure a minimum **7–10 days replacement warranty** is explicitly handwritten or printed on the receipt.
* Inspect power adapter: verify it is a genuine Apple USB-C charger or a reputable GaN adapter (e.g., Anker, Ugreen). Reject unbranded power bricks.

---

## 📱 Compact Field Notes Checklist

```markdown
📱 M1 MacBook Air Field Inspection Checklist

🛠️ Step 0: Pre-Shop Prep
[ ] Put test files on USB drive: Geekbench 6, Disk Speed Test, DriveDx, coconutBattery, check_mac.sh.

🔒 Phase 1: Security, Reset & MDM (Do This First!)
[ ] Full Factory Reset: System Settings > General > Transfer or Reset > Erase All Content and Settings.
[ ] Wi-Fi Setup Test: Connect during initial "Hello" setup.
    Pass: Reaches normal user account creation.
    Fail: "Remote Management" screen appears (Corporate MDM lock - WALK AWAY).
[ ] MDM Terminal Check: profiles status -type enrollment
    Pass: Enrolled via DEP: No / MDM enrollment: No.
[ ] Check System Settings > Privacy & Security > Profiles (must be empty).

💻 Phase 2: System & Serial Verification
[ ] Serial Check: system_profiler SPHardwareDataType | grep "Serial Number"
[ ] Verify terminal serial matches bottom chassis engraving.
[ ] Check warranty on checkcoverage.apple.com.
[ ] Battery Health: ioreg -r -c AppleSmartBattery | grep -iE "CycleCount|MaxCapacity|DesignCapacity"
    Normal cycles: 150 – 550 (If < 20 on a worn body = fake/reset battery).

🖥️ Phase 3: Hardware & Display
[ ] True Tone: System Settings > Displays (toggle must exist; missing = cheap 3rd-party screen).
[ ] Screen Quality: Full-screen white image at 100% brightness (check dead pixels, yellow tint, stage light).
[ ] Touch ID: Register fingerprint in System Settings > Touch ID (errors = swapped/unpaired board).
[ ] Keyboard: Test every single key on keyboardtester.com or TextEdit (check spacebar corners & Fn).
[ ] Both USB-C Ports: Test charging AND fast USB transfer on Port 1, then Port 2.
[ ] Speakers & Mic: Record 5s voice memo and play at 100% volume (listen for crackle).

⚙️ Phase 4: Apple Hardware Diagnostics
[ ] Shut down -> Hold Power until "Loading startup options" -> Press Cmd+D.
    Pass: Code ADP000.
    Fail: Codes PPT (battery), VDC/VFF (display), NDR (Wi-Fi).

🚀 Phase 5: Speed & Health Benchmarks (From USB)
[ ] Run check_mac.sh in Terminal (automated 10-second pass).
[ ] DriveDx: Life Remaining > 85%, Media Errors = 0, TBW < 50 TB.
[ ] Disk Speed: Write > 2,000 MB/s, Read > 2,500 MB/s (Red flag: < 1,200 MB/s).
[ ] Geekbench 6: Multi-Core 8,200–8,700 (Red flag: < 6,500 = severe throttling).
[ ] Network Check: Run networkQuality in Terminal.

🧾 Phase 6: Deal Finalization
[ ] Cash Memo: With matching Serial Number, shop seal, and owner signature.
[ ] Warranty: Minimum 7–10 days replacement warranty written on memo.
[ ] Charger: Genuine Apple or branded GaN (Anker/Ugreen). Reject cheap clone bricks.
[ ] Sign in your Apple ID, enable FileVault, and reboot cleanly once.
```

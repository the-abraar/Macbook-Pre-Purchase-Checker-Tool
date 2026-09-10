# 🧰 Extra Tools & Advanced Manual Field Inspection Guide

This guide covers **advanced physical, hardware, and GUI diagnostics** that cannot be automated via terminal scripts alone. Use this guide alongside [`check_mac.sh`](../check_mac.sh) when inspecting a pre-owned MacBook in a reseller shop.

---

## 📋 Table of Contents
1. [Using the Standalone GUI Tools](#1-using-the-standalone-gui-tools)
   - [coconutBattery (Deep Battery Telemetry)](#coconutbattery-deep-battery-telemetry)
   - [DriveDx (NVMe S.M.A.R.T. & TBW Health)](#drivedx-nvme-smart--tbw-health)
   - [Geekbench 6 (CPU/GPU Stress & Thermal Test)](#geekbench-6-cpugpu-stress--thermal-test)
   - [Blackmagic Disk Speed Test](#blackmagic-disk-speed-test)
2. [Physical & Sensor Checks (Beyond CLI Scripts)](#2-physical--sensor-checks-beyond-cli-scripts)
   - [Flexgate / Hinge Ribbon Cable Test](#1-flexgate--hinge-ribbon-cable-test)
   - [Trackpad Force Touch Haptic Test](#2-trackpad-force-touch-haptic-test)
   - [Liquid Contact Indicator (LCI) Inspection](#3-liquid-contact-indicator-lci-inspection)
   - [Display Anti-Reflective Coating & Keyboard Imprints](#4-display-anti-reflective-coating--keyboard-imprints)
   - [Keyboard Scissor Mechanism Heat Test](#5-keyboard-scissor-mechanism-heat-test)
   - [Ambient Light & True Tone Sensor Test](#6-ambient-light--true-tone-sensor-test)
   - [Lid Angle & Sleep Magnet Sensor Test](#7-lid-angle--sleep-magnet-sensor-test)
   - [Battery Real-World Load Test](#8-battery-real-world-load-test)
3. [Updater Script Guide (`update_tools.sh`)](#3-updater-script-guide-update_toolssh)

---

## 1. Using the Standalone GUI Tools

### coconutBattery (Deep Battery Telemetry)
*Launch `coconutBattery.app` directly from your USB drive.*

- **Mac Manufacture Date vs. Battery Manufacture Date:**
  - In coconutBattery, check the **Age of Mac** vs **Age of Battery**.
  - *Red Flag:* If the Mac is 4 years old (e.g., late 2020) but the battery shows it was manufactured 2 months ago in 2026, **it is an aftermarket copy battery**.
- **Full Charge Capacity vs. Design Capacity:**
  - Compare actual mAh capacity against factory specification. If below 80%, request a price reduction of ৳6,000 – ৳8,000 BDT for battery replacement.
- **Battery Temperature:**
  - Idle battery temperature should be **26°C – 32°C**. If it exceeds 38°C while idling on desktop, battery cells may have internal shorting or high internal resistance.

---

### DriveDx (NVMe S.M.A.R.T. & TBW Health)
*Launch `DriveDx.app` directly from your USB drive.*

Because Apple Silicon SSDs are **permanently soldered to the logic board**, a dead SSD means a completely dead MacBook that cannot be repaired without BGA micro-soldering.

- **Lifetime Left Indicator:**
  - **Healthy:** `> 85%` Life Remaining.
  - **Caution:** `75% – 84%`.
  - **Immediate Walk-Away:** `< 70%`.
- **Data Units Written (TBW - Terabytes Written):**
  - Normal used machines have written **15 TB – 40 TB**.
  - *Red Flag:* If TBW exceeds **150+ TB**, the SSD was subjected to server workloads or the early Big Sur swap bug.
- **Media and Data Integrity Errors:**
  - **Must be `0`**. Any non-zero count indicates bad NAND sectors.
- **Available Spare:**
  - Must show `100%`. If available spare blocks have dropped below 90%, flash blocks are actively dying.

---

### Geekbench 6 (CPU/GPU Stress & Thermal Test)
*Launch `Geekbench 6.app` or execute via Terminal CLI.*

- **Headless Terminal Run with Live Online Link:**
  ```bash
  /Volumes/YOUR_USB/extra_tools/Geekbench\ 6.app/Contents/MacOS/geekbench6 --upload
  ```
  This runs the test headlessly and prints a direct URL to `browser.geekbench.com` comparing this exact machine against global benchmarks.
- **Thermal Throttling Detection:**
  - Immediately after the multi-core run completes, check the score against the target in `models/<chip>/BENCHMARKS.md`.
  - If multi-core is **more than 20% below baseline**, the heatsink is unseated, thermal paste is degraded, or the internal fans are defective.

---

### Blackmagic Disk Speed Test
*Drag `Blackmagic Disk Speed Test.app` from your current Mac's `/Applications` folder onto the USB drive.*

- Click the **Gear (Settings)** icon -> Select Target Drive -> Select the internal Macintosh HD.
- Set Stress to **5 GB** (tests sustained write performance rather than just SLC cache burst).
- Verify write speeds sustain:
  - M1 Air / Pro: `> 2,000 MB/s`
  - M2 Air (256GB Base): `~1,450 – 1,600 MB/s`
  - M2 Pro / M3 / M4: `> 3,000 MB/s`

---

## 2. Physical & Sensor Checks (Beyond CLI Scripts)

### 1. Flexgate / Hinge Ribbon Cable Test
- **The Defect:** Repeated lid opening can stress and fray the display ribbon cable routed through the hinge.
- **How to Test:**
  1. Open a full-screen bright image or video.
  2. Slowly open and close the display lid from **30 degrees to 130 degrees** repeatedly.
  3. Look for screen flickering, horizontal scan lines, or backlights turning off completely at wide angles. If any occur, the display assembly requires a costly replacement.

---

### 2. Trackpad Force Touch Haptic Test
- **The Defect:** Apple trackpads do not have mechanical switches; they use a "Taptic Engine" electromagnet underneath solid glass.
- **How to Test:**
  1. Click firmly on all four corners and the center of the trackpad while powered on. It should click with identical force everywhere.
  2. **Shut down the MacBook completely.**
  3. Try clicking the trackpad while the Mac is powered off.
  4. **Pass:** The trackpad should feel like a completely solid, unmoving piece of glass with zero click.
  5. **Fail:** If it moves or physically clicks when powered off, it is a cheap counterfeit non-haptic replacement trackpad!

---

### 3. Liquid Contact Indicator (LCI) Inspection
- **The Defect:** Water damage corrodes internal copper traces and logic board power rails over time.
- **How to Test:**
  - Shine a bright phone flashlight into:
    1. The **3.5mm headphone jack**.
    2. Inside the **USB-C / Thunderbolt ports**.
  - **Pass:** Clean silver or white dot.
  - **Fail:** **Bright red or pink dot**. This proves liquid has entered the chassis. Walk away immediately regardless of how clean the outside appears.

---

### 4. Display Anti-Reflective Coating & Keyboard Imprints
- **The Defect:** Known as "Staingate" or keyboard etching—due to tight tolerances, oils from keycaps permanently etch square outlines into the display coating.
- **How to Test:**
  - Turn off the display.
  - Tilt the laptop under bright ambient light.
  - Check for square keyboard outlines, horizontal striping from the spacebar, or peeling anti-reflective coating around the camera bezel.

---

### 5. Keyboard Scissor Mechanism Heat Test
- **The Defect:** Debris or liquid residue under keys can cause keys to stick or double-register only when warm.
- **How to Test:**
  - Run the Geekbench benchmark to warm the aluminum body.
  - Open [keyboardtester.com](https://www.keyboardtester.com/) or TextEdit.
  - Rapidly type full sentences across all rows, specifically checking:
    - Spacebar (test top-left, top-right, center, bottom-left, bottom-right).
    - Caps Lock (verify green LED indicator toggles).
    - Shift, Option, Command, and Fn keys.

---

### 6. Ambient Light & True Tone Sensor Test
- Open **System Settings > Displays**.
- Cover the top camera notch with your palm for 3 seconds.
  - **Pass:** Screen brightness should smoothly dim and color temperature should adjust.
  - Remove your hand: Display should smoothly brighten.
  - If brightness does not adjust, the ambient light sensor in the display flex cable is disconnected or damaged.

---

### 7. Lid Angle & Sleep Magnet Sensor Test
- Lower the laptop lid slowly until it is approximately **1 inch from closed**.
- Look closely at the gap: the display backlight and keyboard backlight should click off instantly.
- Lift the lid slightly: the display should wake instantaneously without requiring a key press.
- If it fails to sleep or wake, the Hall effect lid angle sensor is damaged.

---

### 8. Battery Real-World Load Test
- Unplug the charger brick.
- Set display brightness to 100%.
- Open Safari, play a **4K 60fps video** on YouTube or run a continuous benchmark for **5 minutes**.
- Observe the battery percentage:
  - **Normal:** Drops 1% – 2% over 5 minutes.
  - **Defective:** Drops 5% – 10%, jumps erratically (e.g. 85% -> 72%), or shuts off suddenly under load.

---

## 3. Updater Script Guide (`update_tools.sh`)

[`update_tools.sh`](update_tools.sh) automatically downloads the latest versions of **Geekbench 6**, **coconutBattery**, and **DriveDx**, unzips them into `.app` bundles, and packages [`check_mac.sh`](../check_mac.sh) onto your USB drive in one command.

### How to Prepare Your USB Drive:
1. Insert your USB flash drive into your current Mac.
2. Check the volume name of your USB in Terminal:
   ```bash
   ls /Volumes
   ```
3. Run the updater pointing directly to your USB drive:
   ```bash
   bash /Users/blackbird/Everything/dev/Macbook-Pre-Purchase-Checker-Tool/extra_tools/update_tools.sh /Volumes/YOUR_USB_NAME
   ```
4. Drag **Blackmagic Disk Speed Test.app** from `/Applications` onto your USB drive.

Your USB drive is now completely prepped to walk into any shop and fully inspect any Apple Silicon MacBook in under 10 minutes!

# 🍏 M2 MacBook Air (13" & 15" - 2022/2023) Field Checklist
**Model Identifiers:** `Mac14,2` (13") / `Mac14,15` (15") | **Chassis:** `A2681` (13") / `A2941` (15")

---

## ⚠️ Known Critical Nuances & Inspection Points
1. **The Base 256GB Single-NAND Controversy:**
   - **Crucial Context:** Apple equipped the base 256GB M2 Air with a **single 256GB NAND chip** rather than two 128GB chips in parallel.
   - **Expected Speed:** Sequential write speeds on base 256GB models hover around **`~1,400 – 1,600 MB/s`** (compared to ~2,200 MB/s on the older M1).
   - *This is factory normal and not a hardware defect!* However, if speeds dip below `1,000 MB/s`, the chip is degraded. 512GB+ models feature dual NAND chips and score **`~3,000+ MB/s`**.
2. **Midnight Finish Anodization Wear:**
   - If purchasing the Midnight colorway, inspect the bezel around both USB-C ports and the MagSafe 3 port. The dark anodized layer frequently chips away to expose raw silver aluminum.
3. **MagSafe 3 & Dual Thunderbolt Ports:**
   - Verify MagSafe 3 magnetic connection charges properly.
   - Verify both Left-side Thunderbolt / USB 4 ports charge and mount external SSDs.
4. **Display Notch & True Tone:**
   - Check around the camera notch for backlight bleed or LCD adhesive separation.
   - Verify **True Tone** toggle in System Settings > Displays.

---

## 📱 Rapid Shop Checklist
- [ ] **Factory Erase:** System Settings > General > Transfer or Reset > Erase All Content and Settings.
- [ ] **MDM Verification:** Run `profiles status -type enrollment` (Confirm `Enrolled via DEP: No`).
- [ ] **Check Storage Configuration:** Run `diskutil info disk0` (256GB = single NAND ~1.5 GB/s; 512GB+ = dual NAND ~3.0 GB/s).
- [ ] **Battery Condition:** Run `ioreg -r -c AppleSmartBattery | grep -iE "CycleCount|MaxCapacity|DesignCapacity"`.
- [ ] **MagSafe 3 Charging:** Test LED indicator (Amber/Green).
- [ ] **Camera & Audio:** Test 1080p FaceTime HD camera in Photo Booth and speakers in Voice Memos.
- [ ] **Hardware Diagnostics:** Boot with Power held down -> `Cmd + D` -> Confirm code `ADP000`.

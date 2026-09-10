# 🍏 M1 Pro & M1 Max MacBook Pro (14" & 16" - 2021) Field Checklist
**Model Identifiers:** `MacBookPro18,1` / `18,2` / `18,3` / `18,4` | **Chassis:** `A2442` (14") / `A2485` (16")

---

## ⚠️ Specific Vulnerabilities & Hardware Inspection Points
1. **Liquid Retina XDR Mini-LED & ProMotion (120Hz):**
   - Verify ProMotion: Navigate to **System Settings > Displays > Refresh Rate**. It must show `ProMotion` (120Hz dynamic refresh). If locked at 60Hz without ProMotion, the panel has been swapped with an aftermarket LCD!
   - Mini-LED Backlight Zones: In a dark room or under dim light, inspect black screens for localized dimming zone failures, dead backlight sections, or excessive clouding.
2. **Comprehensive Port Array Check:**
   - **MagSafe 3 Port:** Verify charging indicator light (Amber when charging, Green when full).
   - **3x Thunderbolt 4 Ports:** Test all 3 ports (2 on the left, 1 on the right) with a fast SSD.
   - **HDMI Port:** Test external display output via HDMI.
   - **SDXC Card Slot:** Test an SD card; inspect the slot with your phone flashlight for bent internal connector pins.
3. **Dual Fan & Thermal Behavior:**
   - Run Geekbench 6 multi-core stress test: Listen for abnormal fan grinding, bearing rattle, or high-pitched whining.
4. **Battery Health:**
   - Expected cycles: 120 – 450. Battery design capacity is 6,068 mAh (14") or 8,693 mAh (16").

---

## 📱 Rapid Shop Checklist
- [ ] **Factory Reset Verification:** Format unit and verify no "Remote Management" profile appears.
- [ ] **Terminal MDM Check:** Run `profiles status -type enrollment` (Must report `No`).
- [ ] **ProMotion 120Hz Toggle:** System Settings > Displays > Refresh Rate > `ProMotion`.
- [ ] **True Tone Toggle:** System Settings > Displays (Must be present).
- [ ] **Touch ID:** Successfully register fingerprint and test unlocking.
- [ ] **All Ports Functional:** MagSafe 3 + 3x Thunderbolt 4 + HDMI + SD Card Slot.
- [ ] **High-Impedance Headphone Jack:** Plug in 3.5mm headphones and verify stereo channels.
- [ ] **Apple Diagnostics:** Shut down -> Hold Power -> Press `Cmd + D` -> Confirm code `ADP000`.

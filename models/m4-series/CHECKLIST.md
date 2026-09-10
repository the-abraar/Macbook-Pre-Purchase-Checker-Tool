# 🍏 M4 Series (MacBook Pro 14" & 16" - Late 2024/2025) Field Checklist
**Covers:** M4 Base (`Mac16,1`), M4 Pro (`Mac16,5`/`16,7`), M4 Max (`Mac16,6`/`16,8`)

---

## ⚠️ Known Critical Nuances & Inspection Points
1. **16 GB Minimum Base Memory:**
   - **Crucial Anti-Scam Check:** Apple officially standardized base unified memory on all M4 MacBook Pros to **16 GB**.
   - If a seller claims an M4 MacBook Pro has 8GB RAM, **it is a scam or mislabeled older generation (M2 or M3)**. Check `system_profiler SPHardwareDataType | grep Memory`.
2. **Three Thunderbolt Ports on Base M4:**
   - Unlike the base M3 (which had only 2 ports on the left), the **base M4 14" features three Thunderbolt 4 ports** (two on the left, one on the right).
3. **Thunderbolt 5 on M4 Pro & M4 Max:**
   - M4 Pro and M4 Max models feature **Thunderbolt 5** ports delivering up to 120 Gb/s bandwidth.
4. **Display Upgrades (1,000 Nits SDR & Nano-Texture):**
   - SDR maximum brightness on M4 Pro screens reaches **1,000 nits** outdoors (vs 600 nits on M3/M2).
   - If equipped with the optional **Nano-texture display**, inspect closely with your phone flashlight for improper cleaning swirl marks, micro-abrasions, or coating stripping.
5. **12MP Center Stage Camera:**
   - Test the camera in FaceTime or Photo Booth: verify **Center Stage** tracking and **Desk View** functionality.

---

## 📱 Rapid Shop Checklist
- [ ] **Erase All Content and Settings:** System Settings > General > Transfer or Reset.
- [ ] **MDM Enrollment Check:** Run `profiles status -type enrollment` (Confirm clean status).
- [ ] **Verify 16GB+ RAM & Model Identifier:** Confirm `Mac16,1` (Base M4), `Mac16,5`+ (M4 Pro/Max).
- [ ] **ProMotion 120Hz Test:** System Settings > Displays > Refresh Rate > `ProMotion`.
- [ ] **Full Port Check:** MagSafe 3 + all 3 Thunderbolt ports + HDMI + SDXC reader.
- [ ] **Camera Test:** Open Photo Booth to verify 12MP Center Stage sensor.
- [ ] **Apple Hardware Diagnostics:** Hold Power on startup -> `Cmd + D` -> Confirm code `ADP000`.

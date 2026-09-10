# 🍏 M2 Pro & M2 Max MacBook Pro (14" & 16" - 2023) Field Checklist
**Model Identifiers:** `Mac14,6` / `Mac14,9` / `Mac14,10` | **Chassis:** `A2779` (14") / `A2780` (16")

---

## ⚠️ Known Technical Nuances & Inspection Points
1. **Base 512GB SSD NAND Layout:**
   - Apple utilized fewer, higher-density NAND chips on the base 512GB M2 Pro compared to the older M1 Pro (two 256GB dies instead of four 128GB dies).
   - Write speeds on base 512GB models measure around **`~3,200 – 3,600 MB/s`** (rather than ~4,500 MB/s on M1 Pro). This is normal factory operation. Units with 1TB or higher storage utilize full-lane parallelism and exceed **`~5,500+ MB/s`**.
2. **HDMI 2.1 Port Verification:**
   - The M2 Pro/Max was the first MacBook Pro to feature an **HDMI 2.1** port (supporting up to 8K @ 60Hz or 4K @ 240Hz). Verify video output cleanly mounts without signal drops.
3. **Wi-Fi 6E & Antenna Stability:**
   - Supports 6GHz Wi-Fi 6E. Hold `Option` and click the Wi-Fi menu icon to confirm high PHY Tx rates.
4. **ProMotion & Liquid Retina XDR:**
   - Navigate to **System Settings > Displays > Refresh Rate** and ensure **ProMotion** (120Hz) is selectable.
   - Inspect black backgrounds for dead Mini-LED backlighting zones.

---

## 📱 Rapid Shop Checklist
- [ ] **Factory Erase:** System Settings > General > Transfer or Reset > Erase All Content and Settings.
- [ ] **MDM Terminal Verification:** `profiles status -type enrollment` (Must confirm clean status).
- [ ] **Display 120Hz:** Verify ProMotion toggle under Displays.
- [ ] **Full I/O Inspection:** MagSafe 3 + 3x Thunderbolt 4 ports + HDMI 2.1 port + SDXC card reader.
- [ ] **Fan Diagnostics:** Run Geekbench 6 multi-core stress test and verify quiet, smooth fan spin.
- [ ] **Touch ID:** Confirm fingerprint unlock functions reliably.
- [ ] **Apple Diagnostics:** Boot with Power held down -> `Cmd + D` -> Confirm code `ADP000`.

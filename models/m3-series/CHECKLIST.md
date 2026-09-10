# 🍏 M3 Series (MacBook Air & MacBook Pro - Late 2023/2024) Field Checklist
**Covers:** M3 Air (13"/15"), M3 MacBook Pro 14", M3 Pro & M3 Max MacBook Pro (14"/16")

---

## ⚠️ Known Model Differences & Inspection Nuances
1. **Base 14" MacBook Pro (M3) vs M3 Pro/Max Distinction:**
   - **Crucial Buyer Warning:** The entry-level 14" MacBook Pro was offered with the **standard base M3 chip** (replacing the old 13" Pro).
   - **How to tell:** The base M3 14" has **only two Thunderbolt ports on the left** and **no Thunderbolt port on the right**; it also has a single internal fan. The M3 Pro and M3 Max models have **three Thunderbolt ports** (two on the left, one on the right) and dual internal fans. Verify which one you are buying!
2. **NAND SSD Speed Restoration on M3 Air:**
   - On the M3 MacBook Air, Apple restored dual-NAND flash on the base 256GB model (two 128GB dies), giving **`~2,800 MB/s`** write speeds.
3. **Space Black Anodization Seal:**
   - If buying the Space Black colorway on M3 Pro/Max, check the corners, edges, and trackpad bezel for cosmetic wear through the anti-fingerprint anodized oxide coating.
4. **Hardware Ray Tracing Support:**
   - The M3 architecture introduced hardware-accelerated ray tracing and mesh shading. Run Geekbench 6 Metal test to verify all GPU compute units are active.

---

## 📱 Rapid Shop Checklist
- [ ] **Factory Erase:** System Settings > General > Transfer or Reset > Erase All Content and Settings.
- [ ] **MDM Verification:** Run `profiles status -type enrollment` (Confirm clean status).
- [ ] **Identify Exact Chip & Ports:**
  - Base M3 14": 2x Left Thunderbolt ports only + MagSafe 3.
  - M3 Pro/Max 14"/16": 3x Thunderbolt 4 ports (2 Left, 1 Right) + MagSafe 3.
- [ ] **ProMotion 120Hz Test:** System Settings > Displays > Refresh Rate > `ProMotion` (on MacBook Pro).
- [ ] **Hardware Diagnostics:** Hold Power on startup -> `Cmd + D` -> Confirm code `ADP000`.
- [ ] **Battery Condition:** Cycle count should ideally be under 250 cycles on used units.

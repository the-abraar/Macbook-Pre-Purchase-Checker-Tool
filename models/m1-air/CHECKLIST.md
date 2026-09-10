# 🍏 M1 MacBook Air (2020) Pre-Purchase Field Checklist
**Model Identifier:** `MacBookAir10,1` | **Chassis Model:** `A2337` | **Display:** 13.3" Retina (60Hz, 400 nits)

---

## ⚠️ Known Critical Hardware Vulnerabilities for M1 Air
1. **Failing Thunderbolt / USB-C Ports:**
   - The M1 Air only has two physical I/O ports. It is extremely common for one port to stop charging or lose high-speed data transfer due to blown `CD3217` power-delivery ICs.
   - **Test:** Plug a charger into Port 1 and a fast USB drive into Port 2, verify both, then swap them.
2. **Excessive SSD Wear (TBW) from Early Big Sur Bug:**
   - Early macOS 11 builds suffered from runaway swap writes. Run **DriveDx** and verify Data Units Written is under `50 TB`. If it shows `150+ TB`, the soldered NAND is severely worn.
3. **Reprogrammed / Fake Copy Batteries:**
   - Because M1 Airs are older (2020–2021), a cycle count under 25 on a chassis with worn keys or scratches is an immediate indicator of a counterfeit battery or reset EEPROM.
4. **Passive Thermal Throttling:**
   - The M1 Air is completely fanless. If the internal thermal pad or heatsink was displaced during a sketchy repair, the CPU will heavily throttle under minor load.

---

## 📱 Rapid Shop Checklist

### 1. Security & MDM Verification (Do First)
- [ ] **Erase All Content and Settings:** (System Settings > General > Transfer or Reset).
- [ ] Connect to your phone hotspot during the "Hello" screen: **Must NOT show "Remote Management"**.
- [ ] Run in Terminal: `profiles status -type enrollment` (Expect `Enrolled via DEP: No`).
- [ ] Check System Settings > Privacy & Security > Profiles (Must be completely empty).

### 2. Physical & Chassis Checks
- [ ] Confirm bottom engraved serial matches `system_profiler SPHardwareDataType | grep "Serial Number"`.
- [ ] Inspect display anti-reflective coating for keyboard key indentation marks or delamination.
- [ ] Check hinge tension: Lid should open smoothly with one finger without lifting the bottom base.
- [ ] Test every key on [keyboardtester.com](https://www.keyboardtester.com/) (especially spacebar corners and Fn keys).

### 3. Display & Audio
- [ ] Check **True Tone** toggle in System Settings > Displays (Missing toggle = 3rd-party screen replacement).
- [ ] Full-screen white image at 100% brightness: check for dead pixels, yellowing, and bottom edge light bleed ("stage lighting").
- [ ] Record 5 seconds in Voice Memos and play back at 100% volume to inspect speakers for crackling.

### 4. Hardware Diagnostic
- [ ] Shut down -> Hold Power / Touch ID button until "Loading startup options" -> Press `Cmd + D`.
- [ ] Confirm diagnostic passes with code **`ADP000`**.

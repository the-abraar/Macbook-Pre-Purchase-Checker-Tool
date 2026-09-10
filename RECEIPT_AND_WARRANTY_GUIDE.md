# 🧾 Shop Negotiation, Cash Memo & Warranty Agreement Guide

In grey-market reseller shops (Multiplan, Elephant Road, Motaleb Plaza, Mirpur, Bashundhara, etc.), verbal promises mean nothing. **If it is not handwritten or printed on the official money receipt (cash memo) with the shop seal and owner's signature, it does not exist.**

---

## 🛑 The "Service Warranty" Trap vs. "Replacement Warranty"

Resellers often brag: *"Bhai, 1-year or 2-year service warranty dibo!"* (We'll give you a 2-year service warranty).

> [!WARNING]
> **A "Service Warranty" is completely worthless.**
> It only means they will not charge you labor fees to open the laptop. If the logic board, screen, or SSD dies, **you will be forced to pay ৳25,000 – ৳45,000 for replacement parts** from their shop.

### What You Must Demand:
Insist on a minimum **7 to 10 Days Unconditional Replacement Warranty** (or full money refund if a replacement unit is unavailable).

---

## 📝 Exact Clauses to Have Written on the Cash Memo

Make sure the seller explicitly writes these details on the physical invoice:

### 1. Serial Number Verification
```text
Item: MacBook [Model, e.g. Air M1 8/256]
Serial Number: [H7VV75KWQ4] (Matching chassis & system_profiler)
Color & Condition: [Space Gray - No dents]
```

### 2. MDM & Cloud Lock Guarantee
```text
"Guaranteed 100% Free of MDM, DEP, Remote Management, and iCloud Lock. 
If any corporate profile or remote lock appears after future formatting/macOS updates, 
the shop will provide an immediate 100% full cash refund."
```
*(Bangla Translation to show the seller):*
> *"ভবিষ্যতে যেকোনো সময় ফরম্যাট বা আপডেট দিলে যদি কোনো MDM বা Remote Management লক আসে, তবে দোকান সম্পূর্ণ টাকা ফেরত দিতে বাধ্য থাকিবে।"*

### 3. Logic Board & No-Repair Guarantee
```text
"Logic board is 100% original, non-repaired, non-reballed, and free of liquid damage. 
Touch ID and True Tone are original factory-paired."
```

### 4. Replacement Period
```text
"7/10 Days Hardware Replacement Warranty. 
Any hardware defects detected within 10 days will be replaced with a unit of identical grade 
or full money refund if replacement is unavailable."
```

---

## 💰 Negotiation Discount Checklist

Use discovered test results from [`check_mac.sh`](check_mac.sh) and [`battery_stress_test.sh`](battery_extended_test/battery_stress_test.sh) to negotiate immediate cash discounts:

| Discovered Defect | How to Leverage in Negotiation | Recommended Price Deduction |
| :--- | :--- | :--- |
| **Battery Health < 80% or Excessive Voltage Sag** | Show the seller the voltage sag report: *"Bhai, battery internal resistance high, eta swap korte hobe."* | **Deduct ৳6,000 – ৳8,000 BDT** |
| **Fake Copy Charger Included** | Check charger serial via `check_mac.sh`: *"Eta Chinese copy brick, original na. Board nosto korbe."* | **Deduct ৳2,500 – ৳3,500 BDT** (Buy an Anker / Ugreen GaN charger instead) |
| **Base M2 256GB Single-NAND SSD** | Point out the 1,400 MB/s speed: *"Eta single-NAND model, dual-NAND na."* | **Deduct ৳3,000 – ৳5,000 BDT** |
| **Cycle Count > 550** | High cycle count nearing end of rated cell life. | **Deduct ৳3,000 – ৳4,000 BDT** |
| **Cosmetic Scuffs or Key Shine** | Anti-reflective coating keyboard etching ("Staingate") or Midnight finish chipping. | **Deduct ৳2,000 – ৳3,000 BDT** |

---

## 📋 Pre-Departure Checklist (Before Stepping Out of the Shop)

- [ ] Cash memo has **Serial Number**, **7–10 days replacement warranty**, **Shop Seal**, and **Owner Signature**.
- [ ] You have logged into your own personal **Apple ID**.
- [ ] **FileVault** is enabled (**System Settings > Privacy & Security > FileVault**).
- [ ] You have restarted the Mac once cleanly and unlocked with your own password.
- [ ] You verified the physical charger brick weight and regulatory markings.

/**
 * Negotiation Discount Calculator & Cash Memo Clause Generator
 * Tailored for Bangladesh and grey-market reseller shops
 */

export const DEFECT_ITEMS = [
  {
    id: "batt_degraded",
    label: "Battery Health < 80% or Excessive Voltage Sag",
    category: "battery",
    deductionMin: 6000,
    deductionMax: 8000,
    desc: "Original Apple Silicon battery replacement costs ৳7,000–৳10,000. Battery will degrade rapidly.",
    dialogue: "ভাই, ব্যাটারির হেলথ ৮০% এর নিচে / ভোল্টেজ স্যাগ বেশি। আমাকে নতুন ব্যাটারি লাগাতে হবে, দাম ৮,০০০ টাকা কমান।"
  },
  {
    id: "fake_charger",
    label: "3rd-Party Copy / Fake Power Brick Provided",
    category: "power",
    deductionMin: 2500,
    deductionMax: 3500,
    desc: "Cheap copy bricks can fry power delivery chips (CD3217). Deduct cost to purchase genuine Apple or Anker GaN.",
    dialogue: "ভাই, চার্জারটা চাইনিজ কপি ব্রিক, অরিজিনাল না। মাদারবোর্ড নষ্ট করবে। আমি নিজে অরিজিনাল কিনে নেব, ৩,৫০০ টাকা বাদ দেন।"
  },
  {
    id: "m2_single_nand",
    label: "Base M2 256GB Single-NAND SSD (Half Speed)",
    category: "storage",
    deductionMin: 3000,
    deductionMax: 5000,
    desc: "Sequential write speed is ~1,450 MB/s (vs ~2,200 MB/s on M1 Air). Significant resale disadvantage.",
    dialogue: "ভাই, এটা তো বেস ২৫৬ জিবি সিঙ্গেল ন্যান্ড মডেল, স্পিড অর্ধেক (~১৫০০ MB/s)। এইটার দাম মার্কেটে কম, ৫,০০০ টাকা ছাড় দেন।"
  },
  {
    id: "high_cycles",
    label: "High Battery Cycle Count (> 550 Cycles)",
    category: "battery",
    deductionMin: 3000,
    deductionMax: 4000,
    desc: "Cells are nearing Apple's 1,000-cycle design rating. Chemical capacity is heavily exhausted.",
    dialogue: "ভাই, সাইকেল কাউন্ট ৫৫০ এর উপরে চলে গেছে, বেশি দিন চলবে না। ৩,৫০০ টাকা কমান।"
  },
  {
    id: "cosmetic_wear",
    label: "Chassis Dents, Key Shine or Midnight Edge Chipping",
    category: "cosmetic",
    deductionMin: 2000,
    deductionMax: 3500,
    desc: "Anti-reflective coating keyboard etching ('Staingate'), chipped port anodization, or chassis corner bumps.",
    dialogue: "ভাই, বডিতে ডেন্ট/স্ক্র্যাচ আছে আর কি-বোর্ড গ্লেজি হয়ে গেছে। ৩,০০০ টাকা ছাড় দিতে হবে।"
  },
  {
    id: "missing_box",
    label: "Missing Original Box & Factory Packaging",
    category: "accessories",
    deductionMin: 1500,
    deductionMax: 2500,
    desc: "Laptops with original matching IMEI/Serial boxes carry higher resale value in BD.",
    dialogue: "ভাই, সাথে তো অরিজিনাল ম্যাচিং বক্স নাই। বক্স ছাড়া রিসেল ভ্যালু কমে যায়, ২,০০০ টাকা ছাড় দেন।"
  }
];

export const CASH_MEMO_CLAUSES = [
  {
    title: "1. Serial Number & Machine Identity",
    english: "Item: MacBook [Model, e.g. Air M1 8/256GB]\nSerial Number: [SERIAL_HERE] (Strictly matching bottom chassis and macOS system_profiler)\nColor & Cosmetic Grade: [Space Gray - Mint, no dents]",
    bangla: "ম্যাকবুক মডেল এবং সিরিয়াল নম্বর অবশ্যই ক্যাশ মেমোতে সঠিক ও পরিষ্কারভাবে লিখিত থাকতে হবে।"
  },
  {
    title: "2. 100% MDM & iCloud Activation Lock Refund Guarantee (Crucial!)",
    english: "\"Guaranteed 100% Free of MDM, DEP, Remote Management, and iCloud Lock. If any corporate profile or remote lock appears after future formatting or macOS updates, the shop will provide an immediate 100% full cash refund.\"",
    bangla: "\"ভবিষ্যতে যেকোনো সময় ফরম্যাট বা আপডেট দিলে যদি কোনো MDM বা Remote Management লক আসে, তবে দোকান সম্পূর্ণ টাকা নগদ ফেরত দিতে বাধ্য থাকিবে।\""
  },
  {
    title: "3. Original Logic Board & No-Repair Guarantee",
    english: "\"Logic board is 100% original, non-repaired, non-reballed, and free of liquid damage. Touch ID and True Tone are original factory-paired.\"",
    bangla: "\"লজিকবোর্ড ১০০% অরিজিনাল, কোনো রিপেয়ার বা লিকুইড ড্যামেজ নাই। টাচ আইডি ও ট্রু টোন ফ্যাক্টরি পেয়ার্ড।\""
  },
  {
    title: "4. Unconditional Replacement Warranty Period",
    english: "\"7 to 10 Days Unconditional Hardware Replacement Warranty. Any hardware defect discovered within 10 days will be replaced with an identical grade unit or full money refund.\"",
    bangla: "\"ন্যূনতম ৭ থেকে ১০ দিনের আনকন্ডিশনাল রিপ্লেসমেন্ট ওয়ারেন্টি (সার্ভিস ওয়ারেন্টি নয়)।\""
  }
];

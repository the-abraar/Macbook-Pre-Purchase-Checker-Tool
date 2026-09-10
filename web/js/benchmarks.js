/**
 * Apple Silicon Model Specifications, Benchmark Baselines, and Hardware Pitfalls
 * Extracted and normalized from models/ and check_mac.sh
 */
export const MODELS_DATA = {
  "m1-air": {
    id: "m1-air",
    name: "M1 MacBook Air (2020)",
    years: "2020 – 2022",
    chassis: "A2337 (13.3\" Retina)",
    modelId: "MacBookAir10,1",
    chip: "Apple M1 (8-core CPU: 4 Perf + 4 Eff)",
    gpu: "7-Core or 8-Core GPU",
    ram: "8 GB or 16 GB unified LPDDR4X (68.25 GB/s)",
    storageOptions: "256 GB, 512 GB, 1 TB, 2 TB (Dual-NAND flash)",
    display: "13.3\" Retina LCD (2560x1600), 400 nits, P3, True Tone, 60Hz",
    ports: "2x Thunderbolt / USB 4 (Left side only) + 3.5mm headphone jack",
    benchmarks: {
      geekbenchSingle: { pass: "2,300 – 2,400", warning: "2,000 – 2,200", fail: "< 1,900" },
      geekbenchMulti: { pass: "8,200 – 8,700", warning: "6,800 – 7,800", fail: "< 6,500 (Thermal throttle)" },
      metalGpu: { pass: "31,000 – 34,500", warning: "28,000 – 30,000", fail: "< 26,000" },
      ssdWrite: { pass: "~2,100 – 2,300 MB/s", warning: "1,400 – 1,800 MB/s", fail: "< 1,200 MB/s (Degraded NAND)" },
      ssdRead: { pass: "~2,600 – 2,800 MB/s", warning: "1,800 – 2,200 MB/s", fail: "< 1,500 MB/s" },
      batteryCycles: { pass: "150 – 550", warning: "550 – 750", fail: "< 25 (Fake/Reset alert) or > 800" },
      batteryHealth: { pass: "> 83%", warning: "79% – 82%", fail: "< 78% or Service Battery" }
    },
    knownPitfalls: [
      {
        title: "Blown Thunderbolt / USB-C Ports (High Risk)",
        severity: "danger",
        desc: "The M1 Air only has two physical ports. Blown CD3217 power-delivery IC chips are common. Plug a charger into Port 1 and a fast USB drive into Port 2, test both, then swap them."
      },
      {
        title: "Counterfeit or Reset Battery EEPROM",
        severity: "warning",
        desc: "Because M1 Airs are from 2020, seeing < 25 cycles on a chassis with worn keycaps or scratches almost always indicates a cheap Chinese copy battery or a reset microcontroller."
      },
      {
        title: "Early Big Sur SSD Wear Bug (High TBW)",
        severity: "warning",
        desc: "Early macOS 11 builds suffered from excessive swap writes. Ensure Data Units Written is under 50 TB. Above 120 TB means the soldered flash has suffered heavy wear."
      },
      {
        title: "Fanless Thermal Heatsink Displacement",
        severity: "info",
        desc: "M1 Air is completely fanless. If a shop performed a sloppy logic board repair, the thermal gap pad may be displaced, causing throttling under even light web browsing."
      }
    ]
  },

  "m1-pro-max": {
    id: "m1-pro-max",
    name: "M1 Pro & M1 Max MacBook Pro (14\" & 16\" - 2021)",
    years: "2021 – 2023",
    chassis: "A2442 (14.2\") / A2485 (16.2\")",
    modelId: "MacBookPro18,1 – 18,4",
    chip: "M1 Pro (8 or 10-core) / M1 Max (10-core)",
    gpu: "14-Core, 16-Core (Pro) / 24-Core, 32-Core (Max)",
    ram: "16 GB, 32 GB (Pro) / 32 GB, 64 GB (Max)",
    storageOptions: "512 GB, 1 TB, 2 TB, 4 TB, 8 TB (PCIe 4.0 array)",
    display: "Liquid Retina XDR Mini-LED, 120Hz ProMotion, 1000 nits sustained, 1600 peak",
    ports: "MagSafe 3, 3x Thunderbolt 4 (2 Left, 1 Right), HDMI, SDXC, 3.5mm jack",
    benchmarks: {
      geekbenchSingle: { pass: "2,350 – 2,450", warning: "2,000 – 2,300", fail: "< 2,000" },
      geekbenchMulti: { pass: "10,000 – 12,800", warning: "8,500 – 9,800", fail: "< 8,000" },
      metalGpu: { pass: "54,000 – 128,000 (By GPU count)", warning: "Below spec", fail: "< 48,000" },
      ssdWrite: { pass: "~4,200 – 5,800 MB/s", warning: "2,800 – 3,800 MB/s", fail: "< 2,500 MB/s" },
      ssdRead: { pass: "~5,200 – 5,800 MB/s", warning: "3,800 – 4,800 MB/s", fail: "< 3,500 MB/s" },
      batteryCycles: { pass: "120 – 450", warning: "450 – 650", fail: "< 20 (Suspicious) or > 750" },
      batteryHealth: { pass: "> 84%", warning: "80% – 83%", fail: "< 80% or Service Battery" }
    },
    knownPitfalls: [
      {
        title: "3rd-Party Screen Swaps (Loss of 120Hz ProMotion)",
        severity: "danger",
        desc: "Check System Settings > Displays > Refresh Rate. It MUST say 'ProMotion'. If stuck at 60Hz without ProMotion, the Mini-LED panel was replaced with a cheap standard LCD!"
      },
      {
        title: "Mini-LED Dimming Zone Failure / Clouding",
        severity: "warning",
        desc: "Open a solid black screen in a dark corner. Check for failed localized dimming zones, bright stuck pixels, or uneven yellow blotches."
      },
      {
        title: "Bent SDXC Card Connector Pins",
        severity: "warning",
        desc: "Reseller units often have pins inside the SD card slot crushed by foreign objects. Shine phone flashlight inside to confirm straight parallel pins."
      },
      {
        title: "Dual Fan Bearing Rattle",
        severity: "info",
        desc: "Run a heavy multi-core benchmark. Listen closely to both exhaust vents for metallic clicking or grinding noises."
      }
    ]
  },

  "m2-air": {
    id: "m2-air",
    name: "M2 MacBook Air (13\" & 15\" - 2022/2023)",
    years: "2022 – 2024",
    chassis: "A2681 (13.6\") / A2941 (15.3\")",
    modelId: "Mac14,2 / Mac14,15",
    chip: "Apple M2 (8-core CPU: 4 Perf + 4 Eff)",
    gpu: "8-Core or 10-Core GPU",
    ram: "8 GB, 16 GB, or 24 GB unified LPDDR5 (100 GB/s)",
    storageOptions: "256 GB (Single NAND) / 512 GB, 1 TB, 2 TB (Dual NAND)",
    display: "Liquid Retina LCD, 500 nits, P3, True Tone, 60Hz with Camera Notch",
    ports: "MagSafe 3, 2x Thunderbolt / USB 4 (Left side only), 3.5mm jack",
    benchmarks: {
      geekbenchSingle: { pass: "2,550 – 2,650", warning: "2,200 – 2,500", fail: "< 2,200" },
      geekbenchMulti: { pass: "9,600 – 10,200", warning: "7,800 – 9,000", fail: "< 7,500" },
      metalGpu: { pass: "38,000 – 47,000", warning: "33,000 – 36,000", fail: "< 32,000" },
      ssdWrite: { pass: "256GB: ~1,450–1,600 MB/s | 512GB+: ~3,000 MB/s", warning: "Below spec", fail: "< 1,000 MB/s" },
      ssdRead: { pass: "256GB: ~1,500–1,700 MB/s | 512GB+: ~3,200 MB/s", warning: "Below spec", fail: "< 1,100 MB/s" },
      batteryCycles: { pass: "50 – 350", warning: "350 – 550", fail: "< 15 (Suspicious) or > 650" },
      batteryHealth: { pass: "> 86%", warning: "81% – 85%", fail: "< 80% or Service Battery" }
    },
    knownPitfalls: [
      {
        title: "Base 256GB Single-NAND Half Speed (Not a Defect, But Negotiate!)",
        severity: "info",
        desc: "Base 256GB M2 Air has only ONE NAND chip (~1,500 MB/s), half the speed of the M1 Air. It is normal factory behavior, but use this to negotiate a ৳3,000–৳5,000 price discount!"
      },
      {
        title: "Midnight Colorway Edge Chipping",
        severity: "warning",
        desc: "The Midnight anodized coating is notorious for chipping off around the USB-C and MagSafe ports, revealing silver raw aluminum underneath."
      },
      {
        title: "Camera Notch Delamination",
        severity: "warning",
        desc: "Check the rubber gasket and adhesive around the display notch for lifting, separation, or white glue residue from bad screen replacements."
      }
    ]
  },

  "m2-pro-max": {
    id: "m2-pro-max",
    name: "M2 Pro & M2 Max MacBook Pro (14\" & 16\" - 2023)",
    years: "2023 – 2023",
    chassis: "A2779 (14.2\") / A2780 (16.2\")",
    modelId: "Mac14,6 / Mac14,9 / Mac14,10",
    chip: "M2 Pro (10 or 12-core) / M2 Max (12-core)",
    gpu: "16, 19 (Pro) / 30, 38-Core (Max)",
    ram: "16 GB, 32 GB (Pro) / 32 GB, 64 GB, 96 GB (Max)",
    storageOptions: "512 GB, 1 TB, 2 TB, 4 TB, 8 TB",
    display: "Liquid Retina XDR Mini-LED, 120Hz ProMotion, 1000 nits sustained, 1600 peak",
    ports: "MagSafe 3, 3x Thunderbolt 4, HDMI 2.1 (8K/4K 240Hz), SDXC, 3.5mm jack",
    benchmarks: {
      geekbenchSingle: { pass: "2,650 – 2,750", warning: "2,350 – 2,600", fail: "< 2,300" },
      geekbenchMulti: { pass: "12,000 – 14,800", warning: "10,500 – 11,800", fail: "< 10,000" },
      metalGpu: { pass: "69,000 – 155,000 (By GPU count)", warning: "Below spec", fail: "< 60,000" },
      ssdWrite: { pass: "512GB: ~3,400 MB/s | 1TB+: ~5,800 MB/s", warning: "Below spec", fail: "< 2,200 MB/s" },
      ssdRead: { pass: "~5,500 – 6,200 MB/s", warning: "3,800 – 5,000 MB/s", fail: "< 3,500 MB/s" },
      batteryCycles: { pass: "40 – 300", warning: "300 – 480", fail: "< 10 or > 550" },
      batteryHealth: { pass: "> 88%", warning: "82% – 87%", fail: "< 80% or Service Battery" }
    },
    knownPitfalls: [
      {
        title: "Base 512GB Fewer NAND Dies",
        severity: "info",
        desc: "Base 512GB uses two 256GB NAND dies instead of four 128GB dies on M1 Pro. Write speeds are ~3,400 MB/s (vs ~4,500 MB/s on M1 Pro 512GB). 1TB+ models hit 5,800+ MB/s."
      },
      {
        title: "HDMI 2.1 Handshake Failures",
        severity: "warning",
        desc: "First generation with 8K HDMI 2.1. Test with an external screen or TV to ensure immediate handshake without flickering or black screen drops."
      }
    ]
  },

  "m3-series": {
    id: "m3-series",
    name: "M3 Series (Air & Pro/Max - 2023/2024)",
    years: "2023 – 2024",
    chassis: "Air 13\"/15\", Pro 14\" (Base), Pro 14\"/16\" (Pro/Max)",
    modelId: "Mac15,3 / Mac15,6 / Mac15,8+",
    chip: "M3 Base (8-core), M3 Pro (11/12-core), M3 Max (14/16-core)",
    gpu: "8/10-Core (Base), 14/18-Core (Pro), 30/40-Core (Max) with Hardware Ray Tracing",
    ram: "8, 16, 24 GB (Base) | 18, 36 GB (Pro) | 36, 48, 64, 128 GB (Max)",
    storageOptions: "256 GB (Dual NAND restored on Air!), 512 GB, 1 TB, 2 TB, 4 TB, 8 TB",
    display: "Liquid Retina (Air) / Liquid Retina XDR Mini-LED with 120Hz ProMotion (Pro)",
    ports: "Base 14\" Pro has only 2 Left ports; Pro/Max has 3 ports (2 Left, 1 Right)",
    benchmarks: {
      geekbenchSingle: { pass: "3,050 – 3,150", warning: "2,700 – 2,950", fail: "< 2,600" },
      geekbenchMulti: { pass: "11,800 (Base) – 21,800 (Max 16c)", warning: "Below spec", fail: "< 9,500" },
      metalGpu: { pass: "47,000 (Base) – 162,000 (Max 40c)", warning: "Below spec", fail: "< 40,000" },
      ssdWrite: { pass: "Air 256GB: ~2,900 MB/s | Pro: ~3,800–6,000 MB/s", warning: "Below spec", fail: "< 2,000 MB/s" },
      ssdRead: { pass: "~3,500 – 6,500 MB/s", warning: "Below spec", fail: "< 2,500 MB/s" },
      batteryCycles: { pass: "20 – 250", warning: "250 – 400", fail: "> 450 (High for M3 age)" },
      batteryHealth: { pass: "> 90%", warning: "85% – 89%", fail: "< 84%" }
    },
    knownPitfalls: [
      {
        title: "The Base 14\" M3 Port & Fan Trap",
        severity: "danger",
        desc: "The entry 14\" M3 has only TWO Thunderbolt ports on the left, NO port on the right, and ONE single fan! M3 Pro/Max models have THREE ports and dual fans. Don't pay M3 Pro price for a base M3!"
      },
      {
        title: "Dual NAND Restored on M3 Air",
        severity: "info",
        desc: "Apple listened to complaints and restored dual 128GB NAND chips on the 256GB M3 Air, delivering healthy ~2,900 MB/s speeds."
      },
      {
        title: "Space Black Coating Inspection",
        severity: "warning",
        desc: "Inspect the anodized seal on Space Black models around trackpad palm rest and chassis corners for abrasive fading."
      }
    ]
  },

  "m4-series": {
    id: "m4-series",
    name: "M4 Series (MacBook Pro 14\" & 16\" - 2024/2025)",
    years: "2024 – 2025",
    chassis: "Mac16,1 (Base), Mac16,5+ (Pro), Mac16,6+ (Max)",
    modelId: "Mac16,1 – Mac16,8",
    chip: "M4 Base (10-core), M4 Pro (12/14-core), M4 Max (14/16-core)",
    gpu: "10-Core (Base), 16/20-Core (Pro), 32/40-Core (Max)",
    ram: "16 GB MINIMUM standard on all models! (Scam alert if 8GB)",
    storageOptions: "512 GB, 1 TB, 2 TB, 4 TB, 8 TB (PCIe 5.0 controller)",
    display: "Liquid Retina XDR 1,000 nits SDR / 1,600 nits HDR, Optional Nano-texture",
    ports: "3x Thunderbolt 4 (Base) or 3x Thunderbolt 5 (Pro/Max), MagSafe 3, HDMI, SDXC",
    benchmarks: {
      geekbenchSingle: { pass: "3,750 – 3,950", warning: "3,300 – 3,650", fail: "< 3,200" },
      geekbenchMulti: { pass: "14,600 (Base) – 26,800 (Max 16c)", warning: "Below spec", fail: "< 12,000" },
      metalGpu: { pass: "57,000 (Base) – 200,000 (Max 40c)", warning: "Below spec", fail: "< 49,000" },
      ssdWrite: { pass: "512GB: ~3,600 MB/s | 1TB+: ~6,500–7,400 MB/s", warning: "Below spec", fail: "< 2,400 MB/s" },
      ssdRead: { pass: "~6,000 – 7,500 MB/s", warning: "Below spec", fail: "< 3,800 MB/s" },
      batteryCycles: { pass: "5 – 150", warning: "150 – 300", fail: "> 350 (Heavy abuse for M4)" },
      batteryHealth: { pass: "> 94%", warning: "88% – 93%", fail: "< 88%" }
    },
    knownPitfalls: [
      {
        title: "ANTI-SCAM: 16 GB Minimum RAM Standard",
        severity: "danger",
        desc: "Apple standardized 16 GB RAM as the absolute minimum on all M4 MacBooks. If a seller offers an 'M4 MacBook' with 8 GB RAM, it is a 100% FRAUD or mislabeled M2/M3!"
      },
      {
        title: "Thunderbolt 5 on Pro/Max & 3 Ports on Base",
        severity: "info",
        desc: "Even the base 14\" M4 now has 3 Thunderbolt ports (including one on the right). M4 Pro and Max models feature ultra-high-speed Thunderbolt 5 (120 Gb/s)."
      },
      {
        title: "Nano-Texture Display Scratch Warning",
        severity: "warning",
        desc: "If equipped with matte Nano-texture glass, inspect under phone flashlight for micro-scratches caused by improper cleaning with regular paper towels."
      }
    ]
  }
};

/**
 * Diagnostics Code Dictionary (Apple Hardware Test & Diagnostics)
 */
export const DIAGNOSTIC_CODES = [
  { code: "ADP000", status: "pass", label: "No issues found", desc: "Hardware self-diagnostics completed successfully with zero component errors." },
  { code: "PPT001", status: "fail", label: "Battery Fault", desc: "Battery was not detected or internal battery sensor communications failed." },
  { code: "PPT004", status: "fail", label: "Battery Degraded", desc: "Battery cells have degraded beyond safety tolerance." },
  { code: "VDC001", status: "fail", label: "Display Controller Issue", desc: "Error communicating with internal display panel or T-CON board." },
  { code: "VFF001", status: "fail", label: "Audio Hardware Fault", desc: "Internal audio hardware or amplifier sensor error." },
  { code: "NDR001", status: "fail", label: "Wi-Fi Controller Error", desc: "Wireless networking module failed hardware loopback test." },
  { code: "NDC001", status: "fail", label: "Camera Sensor Error", desc: "FaceTime HD camera failed initialization self-test." },
  { code: "PFM006", status: "fail", label: "System Management / SMC", desc: "Power management controller error or sensor loop disconnected." },
  { code: "PPF001", status: "warning", label: "Fan Sensor Fault", desc: "Cooling fan tachometer sensor failed to report RPM." }
];

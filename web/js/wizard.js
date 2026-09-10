/**
 * Step-by-Step "Idiot-Proof" Pre-Purchase Inspection Wizard
 * Enhanced with visual comparison mockups and rich guidance.
 */

export const WIZARD_STEPS = [
  {
    id: "step-reset-mdm",
    phase: "Phase 1 of 10 • Critical Security",
    title: "1. Demand Factory Erase & Test for MDM / Remote Management",
    badge: "CRITICAL #1 RISK",
    badgeType: "danger",
    summary: "Never buy a pre-setup Mac from a shop. It could be leased or stolen company property with a temporary bypass.",
    instructions: [
      {
        type: "p",
        content: "Shops often sell corporate MacBooks (MDM enrolled) by running bypass scripts so they boot to the desktop. <strong>The moment you format or update macOS later, the laptop locks permanently.</strong>"
      },
      {
        type: "visual-mdm-comparison"
      },
      {
        type: "steps",
        items: [
          "Tell the seller: <strong>\"I want to erase this Mac and set it up from the initial Hello screen.\"</strong>",
          "Navigate to <strong>System Settings > General > Transfer or Reset > Erase All Content and Settings</strong>.",
          "Once formatted and rebooted to the multilingual <strong>\"Hello\"</strong> screen, connect to your phone's personal hotspot or shop Wi-Fi.",
          "Proceed through the setup wizard until you reach the standard 'Create a Computer Account' screen."
        ]
      },
      {
        type: "alert",
        alertType: "danger",
        title: "🚨 IMMEDIATE RED FLAG / WALK AWAY",
        content: "If a screen titled <strong>\"Remote Management\"</strong> appears asking for credentials from a company or school: <strong>WALK AWAY IMMEDIATELY!</strong> It is enterprise property and cannot be legally removed."
      },
      {
        type: "command",
        title: "Terminal Verification (Run in Terminal to be 100% sure):",
        cmd: "profiles status -type enrollment",
        expected: "Must show 'Enrolled via DEP: No' and 'MDM enrollment: No'"
      }
    ],
    checkItems: [
      { id: "mdm_erased", text: "I witnessed a fresh factory erase (or performed it myself)." },
      { id: "mdm_wifi_hello", text: "Connected to Wi-Fi on 'Hello' setup and NO 'Remote Management' screen appeared." },
      { id: "mdm_profiles_clean", text: "Ran 'profiles status' or checked System Settings > Profiles (completely empty)." }
    ]
  },

  {
    id: "step-serial-identity",
    phase: "Phase 2 of 10 • Identity & Security",
    title: "2. Check Serial Number, Metal Engraving & iCloud Lock",
    badge: "HARDWARE IDENTITY",
    badgeType: "primary",
    summary: "Ensure the metal chassis matches the motherboard, and iCloud Activation Lock is disabled.",
    instructions: [
      {
        type: "p",
        content: "Shops occasionally put repaired boards into different chassis, or leave the previous customer's iCloud locked."
      },
      {
        type: "visual-chassis-diagram"
      },
      {
        type: "command",
        title: "Check System Serial & Activation Lock Status:",
        cmd: "system_profiler SPHardwareDataType | grep -iE 'Model Name|Chip|Memory|Serial Number|Activation Lock'",
        expected: "Activation Lock Status must be: 'Disabled'. Serial must match chassis."
      },
      {
        type: "steps",
        items: [
          "Turn the MacBook upside down. Use your phone flashlight to read the laser-engraved serial number on the bottom metal plate.",
          "Verify the engraved serial strictly matches the <strong>Serial Number</strong> reported in Terminal.",
          "Check <strong>Activation Lock Status</strong>: It MUST say <strong>Disabled</strong>. If Enabled, the seller MUST sign out of their Apple ID before you pay!",
          "Visit <a href='https://checkcoverage.apple.com/' target='_blank' rel='noopener' class='btn-link'>Apple Check Coverage ↗</a> to confirm exact model, manufacturing date, and AppleCare status."
        ]
      }
    ],
    checkItems: [
      { id: "serial_chassis_matches", text: "Bottom metal engraving serial strictly matches Terminal serial." },
      { id: "icloud_disabled", text: "iCloud Activation Lock is DISABLED (or previous owner completely signed out)." },
      { id: "apple_coverage_verified", text: "Model verified on checkcoverage.apple.com." }
    ]
  },

  {
    id: "step-battery-charger",
    phase: "Phase 3 of 10 • Power & Battery",
    title: "3. Battery Health, Cycle Count & Charger Authenticity",
    badge: "HIGH REPLACEMENT COST",
    badgeType: "warning",
    summary: "Spot counterfeit copy batteries, reset cycle counts, and dangerous fake clone chargers.",
    instructions: [
      {
        type: "p",
        content: "A genuine Apple Silicon battery replacement costs ৳6,000–৳10,000+. Worse, shops often bundle cheap copy chargers that burn out power ICs."
      },
      {
        type: "interactive-battery"
      },
      {
        type: "command",
        title: "Check Raw Battery Metrics & Cycle Count in Terminal:",
        cmd: "ioreg -r -c AppleSmartBattery | grep -iE 'CycleCount|MaxCapacity|DesignCapacity|Temperature|Voltage'",
        expected: "Shows raw mAh capacity, genuine cycle count, and temperature."
      },
      {
        type: "alert",
        alertType: "warning",
        title: "⚠️ FAKE / RESET BATTERY WARNING SIGN",
        content: "If inspecting an older M1 (2020) and the cycle count is under <strong>25 cycles</strong> on a worn body with key shine, the battery has been replaced with a cheap Chinese copy or has had its EEPROM cleared."
      },
      {
        type: "alert",
        alertType: "info",
        title: "🔌 Genuine Charger Inspection:",
        content: "Original Apple chargers have soft matte gray regulatory text, heavy solid weight (~200g), and a metal grounding pin inside the removable AC plug. Plug it in and run <code>system_profiler SPPowerDataType</code> — it must list Apple Inc. with a serial number."
      }
    ],
    checkItems: [
      { id: "battery_cycles_reasonable", text: "Cycle count is reasonable for the age of the machine (not suspiciously under 25 on older models)." },
      { id: "battery_health_acceptable", text: "Battery maximum capacity is healthy (>80%, or discount negotiated)." },
      { id: "charger_authentic", text: "Verified original Apple charger or reputable GaN brand (Anker, Ugreen) — NOT cheap clone." }
    ]
  },

  {
    id: "step-storage-nand",
    phase: "Phase 4 of 10 • Storage & SSD",
    title: "4. SSD Health, S.M.A.R.T. Status & NAND Speeds",
    badge: "SOLDERED COMPONENT",
    badgeType: "primary",
    summary: "MacBook SSDs are permanently soldered to the motherboard. If the flash dies, the laptop is dead.",
    instructions: [
      {
        type: "p",
        content: "Verify that the soldered NAND flash memory is in healthy condition with zero sensor errors."
      },
      {
        type: "command",
        title: "Check S.M.A.R.T. Health Status in Terminal:",
        cmd: "diskutil info disk0 | grep -iE 'SMART|Disk Size|Solid State'",
        expected: "SMART Status must read: 'Verified'"
      },
      {
        type: "command",
        title: "Benchmark Read/Write Throughput (1GB block test):",
        cmd: "dd if=/dev/zero of=/tmp/test_spd.bin bs=1m count=1024 2>&1 && dd if=/tmp/test_spd.bin of=/dev/null bs=1m count=1024 2>&1 && rm -f /tmp/test_spd.bin",
        expected: "Expect ~2,100+ MB/s (M1), ~1,500 MB/s (M2 256GB), ~3,000+ MB/s (M2 512GB+ / M3 / M4)"
      },
      {
        type: "alert",
        alertType: "info",
        title: "💡 Base M2 256GB Single-NAND Note:",
        content: "Base 256GB M2 Air models have a single 256GB NAND die (~1,500 MB/s). This is normal factory spec, but you can leverage it to negotiate ৳3,000–৳5,000 off!"
      }
    ],
    checkItems: [
      { id: "ssd_smart_verified", text: "diskutil info shows SMART Status: Verified." },
      { id: "ssd_speed_normal", text: "SSD speed test matches model expected range (not below 1,000 MB/s)." },
      { id: "ssd_size_matches", text: "Storage capacity matches the advertised specs (e.g., 256GB / 512GB)." }
    ]
  },

  {
    id: "step-display-pixels",
    phase: "Phase 5 of 10 • Display & Screen",
    title: "5. Screen Uniformity, Dead Pixels, True Tone & ProMotion",
    badge: "MOST EXPENSIVE REPAIR",
    badgeType: "danger",
    summary: "Screen replacement costs ৳25,000 to ৳45,000. Inspect every square millimeter.",
    instructions: [
      {
        type: "p",
        content: "Check for dead pixels, backlight bleed along edges, stage-lighting shadows, and counterfeit display replacements."
      },
      {
        type: "action-button",
        btnLabel: "🖥️ Launch Fullscreen Display & Dead Pixel Tester",
        action: "launchScreenTester",
        description: "Cycles through pure White, Black, Red, Green, Blue, and Neutral Gray."
      },
      {
        type: "steps",
        items: [
          "<strong>True Tone Check:</strong> Go to <strong>System Settings > Displays</strong>. Verify the 'True Tone' toggle is present. <em>If missing, the display was swapped with a counterfeit panel!</em>",
          "<strong>ProMotion 120Hz (MacBook Pro):</strong> In Displays settings, verify Refresh Rate shows <strong>'ProMotion' (120Hz)</strong>. If locked to 60Hz, it is a downgraded replacement screen.",
          "<strong>Anti-Reflective Coating / Staingate:</strong> Tilt the screen against overhead lights while asleep to check if keyboard keys have permanently scratched the glass."
        ]
      }
    ],
    checkItems: [
      { id: "screen_dead_pixels_clean", text: "Tested full screen with white/black/colors — zero dead or stuck pixels." },
      { id: "screen_true_tone_present", text: "True Tone toggle exists and functions under System Settings > Displays." },
      { id: "screen_promotion_tested", text: "ProMotion 120Hz verified (for MacBook Pro) or 60Hz smooth (for Air)." },
      { id: "screen_coating_intact", text: "No permanent keyboard scratch marks or peeling anti-reflective coating." }
    ]
  },

  {
    id: "step-keyboard-trackpad",
    phase: "Phase 6 of 10 • Keyboard & Trackpad",
    title: "6. Keyboard Matrix & Multi-Touch Trackpad Test",
    badge: "INTERACTIVE TEST",
    badgeType: "primary",
    summary: "Liquid spills frequently damage individual keys or cause repeat strokes. Test every key.",
    instructions: [
      {
        type: "p",
        content: "Use our interactive on-screen keyboard tester to ensure every scissor switch registers properly."
      },
      {
        type: "action-button",
        btnLabel: "⌨️ Open Built-in Interactive Keyboard Tester",
        action: "launchKeyboardTester",
        description: "Test all keys directly in the browser! Keys light up green as you press them."
      },
      {
        type: "steps",
        items: [
          "Press every function key (F1 to F12), Escape, Tab, Caps Lock, Shift, Option, and Command.",
          "Press all four corners of the Spacebar (a common failure point on worn mechanisms).",
          "Test trackpad: Click across all four corners and center. Verify smooth two-finger scrolling and pinch-to-zoom."
        ]
      }
    ],
    checkItems: [
      { id: "keyboard_all_keys_pass", text: "All keys tested and confirmed functional in the keyboard matrix tester." },
      { id: "spacebar_corners_work", text: "Spacebar presses cleanly on all edges and corners." },
      { id: "trackpad_haptics_pass", text: "Trackpad clicks smoothly across full surface with responsive Force Touch haptics." }
    ]
  },

  {
    id: "step-audio-camera-touchid",
    phase: "Phase 7 of 10 • Biometrics & Media",
    title: "7. Touch ID, Speakers, Microphone & FaceTime Camera",
    badge: "BIOMETRICS & MEDIA",
    badgeType: "primary",
    summary: "Verify Touch ID Secure Enclave bonding, stereo speaker balance, mic clarity, and camera.",
    instructions: [
      {
        type: "steps",
        items: [
          "<strong>Touch ID Check:</strong> Go to <strong>System Settings > Touch ID & Password</strong>. Add a fingerprint. <em>If it fails to enroll, the power button was swapped and cannot pair with the Secure Enclave!</em>",
          "<strong>Microphone & Speakers:</strong> Record 5 seconds of audio below and play back at 100% volume to listen for blown speaker cone rattle.",
          "<strong>Stereo Balance Chime:</strong> Test the Left and Right speaker channels independently below.",
          "<strong>Camera Test:</strong> Preview live camera stream below to inspect sensor sharpness."
        ]
      },
      {
        type: "interactive-media"
      },
      {
        type: "command",
        title: "Verify Secure Enclave Sensor Communication in Terminal:",
        cmd: "bioutil -r",
        expected: "Must complete successfully without sensor communication errors."
      }
    ],
    checkItems: [
      { id: "touchid_enrolled", text: "Touch ID enrolled fingerprint successfully and unlocked the screen." },
      { id: "speakers_clean_sound", text: "Speakers played at 100% volume without crackling, buzzing, or muffled distortion." },
      { id: "mic_and_camera_work", text: "Microphone recorded clear audio and FaceTime camera shows crisp video." }
    ]
  },

  {
    id: "step-ports-thermal",
    phase: "Phase 8 of 10 • Physical I/O & Fans",
    title: "8. Physical I/O Ports, Charging & Thermals",
    badge: "PHYSICAL I/O",
    badgeType: "warning",
    summary: "Test every physical port for both power charging and fast USB-C data transfer.",
    instructions: [
      {
        type: "steps",
        items: [
          "<strong>Thunderbolt / USB-C Ports:</strong> Insert the charger into Port 1 and a USB drive into Port 2. Swap them! Both ports must charge AND transfer data.",
          "<strong>MagSafe 3 Port:</strong> Verify magnetic cable lights amber (charging) and green (full). Wiggle gently to check connection stability.",
          "<strong>HDMI & Headphone Jack:</strong> Test 3.5mm headphones and plug into an external monitor if available.",
          "<strong>Thermals:</strong> Ensure laptop is not hot to the touch while idling."
        ]
      },
      {
        type: "command",
        title: "Check for Active Thermal Throttling in Terminal:",
        cmd: "pmset -g therm",
        expected: "Should show normal scheduler limits with zero throttling."
      }
    ],
    checkItems: [
      { id: "ports_all_charge_and_data", text: "Tested ALL USB-C / Thunderbolt ports for both charging AND data transfer." },
      { id: "magsafe_tested", text: "MagSafe 3 (if present) connects firmly with proper LED status." },
      { id: "thermals_normal", text: "pmset -g therm reports normal CPU speed limits with no active throttling." }
    ]
  },

  {
    id: "step-apple-diagnostics",
    phase: "Phase 9 of 10 • Hardware Self-Test",
    title: "9. Apple Hardware Diagnostics (Cmd + D Boot Test)",
    badge: "BUILT-IN SELF TEST",
    badgeType: "primary",
    summary: "Apple's native on-board component diagnostic checks memory, power controllers, and sensors.",
    instructions: [
      {
        type: "steps",
        items: [
          "Shut down the MacBook completely (Apple menu > Shut Down).",
          "Press and <strong>hold the Power / Touch ID button</strong> until you see <strong>\"Loading startup options\"</strong> on screen.",
          "Press and hold <kbd>Cmd</kbd> + <kbd>D</kbd> on the keyboard.",
          "The Mac will connect to diagnostics and run self-tests for 2–3 minutes."
        ]
      },
      {
        type: "alert",
        alertType: "success",
        title: "🎯 EXPECTED RESULT CODE: ADP000",
        content: "If the screen displays <strong>ADP000: No issues found</strong>, all onboard sensors and power controllers passed factory self-tests."
      },
      {
        type: "diagnostic-lookup"
      }
    ],
    checkItems: [
      { id: "diagnostics_completed", text: "Apple Diagnostics completed and returned code ADP000 (No issues found)." }
    ]
  },

  {
    id: "step-cashmemo-negotiation",
    phase: "Phase 10 of 10 • Deal Finalization",
    title: "10. Cash Memo, Warranty Clauses & Price Negotiation",
    badge: "MONEY PROTECTION",
    badgeType: "danger",
    summary: "In reseller markets, verbal promises mean nothing. Get the exact clauses in writing.",
    instructions: [
      {
        type: "alert",
        alertType: "danger",
        title: "🛑 Avoid the 'Service Warranty' Trap:",
        content: "Never accept a '1-Year Service Warranty'. It only covers labor. If the motherboard or screen dies, you pay ৳25,000–৳45,000 for replacement parts! Demand a <strong>7 to 10 Days Unconditional Replacement Warranty</strong>."
      },
      {
        type: "action-button",
        btnLabel: "💰 Open Reseller Negotiation & Discount Calculator",
        action: "switchTabNegotiation",
        description: "Calculate exact price deductions in ৳ BDT based on defects found, and generate cash memo clauses with Bangla translations."
      }
    ],
    checkItems: [
      { id: "memo_serial_written", text: "Cash memo has the exact matching serial number written on it." },
      { id: "memo_replacement_warranty", text: "7–10 days replacement warranty is explicitly written and signed." },
      { id: "memo_shop_seal", text: "Shop official seal and owner signature are on the receipt." },
      { id: "memo_filevault_appleid", text: "Logged into my own Apple ID, enabled FileVault, and restarted cleanly once." }
    ]
  }
];

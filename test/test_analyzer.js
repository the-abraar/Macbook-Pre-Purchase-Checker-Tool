import { parseTerminalOutput } from "../web/js/analyzer.js";

function assert(condition, message) {
  if (!condition) {
    console.error("❌ FAILED:", message);
    process.exit(1);
  } else {
    console.log("✅ PASSED:", message);
  }
}

console.log("--- Testing Terminal Parser ---");

// Test 1: Empty input
const emptyRes = parseTerminalOutput("");
assert(emptyRes.error !== undefined, "Handles empty input gracefully");

// Test 2: Clean M1 Output
const cleanM1Log = `
  • Machine:      MacBook Air (MacBookAir10,1)
  • Processor:    Apple M1 [8 (4 performance and 4 efficiency)]
  • Memory (RAM): 8 GB
  • Logic Serial: C02FM3T1Q05D
  • iCloud Lock:  ✅ Clean / Disabled (Safe to link your Apple ID)
  • MDM Status:   ✅ CLEAN (Not DEP Enrolled / Free of corporate remote management)
  • Reported Cycles:  185
  • macOS Health:     92% (Condition: Normal)
  • S.M.A.R.T. Status:✅ Verified (Self-monitoring sensors healthy)
  • Sequential Write Speed: 2185 MB/s
  • Thermal State:  ✅ Normal (No CPU scheduler thermal limits active)
  • Touch ID Sensor:✅ Sensor verified and communicating with Secure Enclave
`;

const res1 = parseTerminalOutput(cleanM1Log);
assert(res1.hardware.chip === "Apple M1 [8 (4 performance and 4 efficiency)]", "Parsed M1 chip correctly");
assert(res1.hardware.serial === "C02FM3T1Q05D", "Parsed serial correctly");
assert(res1.mdm.status === "pass", "Parsed clean MDM status");
assert(res1.icloud.status === "pass", "Parsed clean iCloud status");
assert(res1.battery.cycles === 185, "Parsed 185 battery cycles");
assert(res1.battery.healthPct === 92, "Parsed 92% battery health");
assert(res1.storage.smartStatus === "Verified", "Parsed SMART Verified");
assert(res1.storage.writeSpeed === 2185, "Parsed write speed 2185 MB/s");
assert(res1.overallVerdict === "RECOMMENDED", "Verdict is RECOMMENDED for clean machine");

// Test 3: Dangerous MDM Log
const mdmFailLog = `
  • Logic Serial: C02FM3T1Q05D
  • MDM Status:   ❌ RED ALERT: MDM CORPORATE PROFILE DETECTED!
  • Enrolled via DEP: Yes
`;
const res2 = parseTerminalOutput(mdmFailLog);
assert(res2.mdm.status === "fail", "Correctly identified MDM failure");
assert(res2.overallVerdict === "DO_NOT_BUY", "Verdict is DO_NOT_BUY for MDM machine");

// Test 4: Suspicious Low Cycle Count on M1
const suspiciousBattLog = `
  • Processor:    Apple M1
  • Logic Serial: C02FM3T1Q05D
  • Reported Cycles:  12
  • macOS Health:     100%
  • MDM Status:   ✅ CLEAN (Not DEP Enrolled)
  • iCloud Lock:  ✅ Clean / Disabled
`;
const res3 = parseTerminalOutput(suspiciousBattLog);
assert(res3.battery.status === "warning", "Flagged suspiciously low cycles on M1 as warning");
assert(res3.overallVerdict === "NEGOTIATE_DISCOUNT", "Verdict is NEGOTIATE_DISCOUNT for suspicious battery");

// Test 5: Serial present but MDM status never confirmed — must NOT be blessed as RECOMMENDED
const unconfirmedMdmLog = `
  • Machine:      MacBook Air (MacBookAir10,1)
  • Logic Serial: C02FM3T1Q05D
  • Reported Cycles:  185
  • macOS Health:     92% (Condition: Normal)
  • S.M.A.R.T. Status:✅ Verified (Self-monitoring sensors healthy)
`;
const res4 = parseTerminalOutput(unconfirmedMdmLog);
assert(res4.mdm.status === "unknown", "MDM status stays unknown when not present in output");
assert(res4.overallVerdict !== "RECOMMENDED", "Unconfirmed MDM status is never auto-blessed as RECOMMENDED");
assert(res4.overallVerdict === "VERIFY_MDM", "Verdict flags MDM as needing manual verification");

console.log("\n🎉 ALL ANALYZER TESTS PASSED SUCCESSFULLY!\n");

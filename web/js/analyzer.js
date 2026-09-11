/**
 * Terminal Output Decoder & Parser
 * Analyzes outputs from check_mac.sh, system_profiler, ioreg, profiles, diskutil, and pmset
 */

export function parseTerminalOutput(rawText) {
  if (!rawText || rawText.trim().length === 0) {
    return { error: "Please paste your terminal output into the box first." };
  }

  const text = rawText;
  const result = {
    hardware: {
      modelName: null,
      chip: null,
      cores: null,
      memory: null,
      serial: null
    },
    mdm: {
      status: "unknown",
      details: null
    },
    icloud: {
      status: "unknown",
      details: null
    },
    battery: {
      cycles: null,
      healthPct: null,
      condition: null,
      rawCapacity: null,
      designCapacity: null,
      temperatureC: null,
      voltageV: null,
      charger: null,
      status: "unknown",
      notes: []
    },
    storage: {
      smartStatus: null,
      model: null,
      size: null,
      writeSpeed: null,
      readSpeed: null,
      status: "unknown",
      notes: []
    },
    thermal: {
      throttling: false,
      status: "unknown",
      details: null
    },
    touchId: {
      status: "unknown",
      details: null
    },
    overallVerdict: "unknown",
    verdictReasons: []
  };

  // 1. Hardware Info Parsing
  const modelMatch = text.match(/(?:Model Name|Machine):\s*([^\n\r]+)/i);
  if (modelMatch) result.hardware.modelName = modelMatch[1].trim();

  const chipMatch = text.match(/(?:Chip|Processor):\s*([^\n\r]+)/i);
  if (chipMatch) result.hardware.chip = chipMatch[1].trim();

  const coresMatch = text.match(/(?:Total Number of Cores):\s*([^\n\r]+)/i);
  if (coresMatch) result.hardware.cores = coresMatch[1].trim();

  const memMatch = text.match(/(?:Memory \(RAM\)|Memory):\s*([^\n\r]+)/i);
  if (memMatch) result.hardware.memory = memMatch[1].trim();

  const serialMatch = text.match(/(?:Serial Number \(system\)|Logic Serial|Serial Number):\s*([A-Z0-9]+)/i);
  if (serialMatch) result.hardware.serial = serialMatch[1].trim();

  // 2. MDM & DEP Parsing
  if (
    /Enrolled via DEP:\s*No/i.test(text) ||
    /Client is not DEP enabled/i.test(text) ||
    /MDM Status:\s*.*CLEAN/i.test(text) ||
    /MDM enrollment:\s*No/i.test(text)
  ) {
    result.mdm.status = "pass";
    result.mdm.details = "CLEAN — Device is not enrolled in Apple DEP or corporate MDM management.";
  } else if (
    /Enrolled via DEP:\s*Yes/i.test(text) ||
    /MDM enrollment:\s*Yes/i.test(text) ||
    /MDM CORPORATE PROFILE DETECTED/i.test(text) ||
    /Remote Management/i.test(text)
  ) {
    result.mdm.status = "fail";
    result.mdm.details = "RED ALERT! Corporate MDM or DEP profile detected! This machine belongs to a company/school. DO NOT BUY!";
    result.verdictReasons.push("MDM Corporate Lock detected");
  }

  // 3. iCloud Activation Lock
  if (
    /Activation Lock Status:\s*Enabled/i.test(text) ||
    /ACTIVATION LOCK ENABLED/i.test(text)
  ) {
    result.icloud.status = "fail";
    result.icloud.details = "iCloud Activation Lock is ENABLED! Seller must sign out of Apple ID before purchase.";
    result.verdictReasons.push("iCloud Activation Lock is enabled");
  } else if (
    /Activation Lock Status:\s*Disabled/i.test(text) ||
    /iCloud Lock:\s*.*Clean/i.test(text)
  ) {
    result.icloud.status = "pass";
    result.icloud.details = "Clean / Disabled — Safe to link your own Apple ID.";
  }

  // 4. Battery Parsing
  const cycleMatch = text.match(/(?:Cycle Count|Reported Cycles):\s*(\d+)/i);
  if (cycleMatch) result.battery.cycles = parseInt(cycleMatch[1], 10);

  const healthMatch = text.match(/(?:Maximum Capacity|macOS Health):\s*(\d+)%/i);
  if (healthMatch) result.battery.healthPct = parseInt(healthMatch[1], 10);

  const condMatch = text.match(/Condition:\s*([^\n\r,]+)/i);
  if (condMatch) result.battery.condition = condMatch[1].trim();

  const tempMatch = text.match(/Temperature:\s*(\d+)°?C/i);
  if (tempMatch) result.battery.temperatureC = parseInt(tempMatch[1], 10);

  const voltMatch = text.match(/Current Voltage:\s*([\d\.]+) ?V/i);
  if (voltMatch) result.battery.voltageV = parseFloat(voltMatch[1]);

  const chargerMatch = text.match(/Connected Adapter:\s*([^\n\r]+)/i);
  if (chargerMatch) result.battery.charger = chargerMatch[1].trim();

  // Battery evaluation logic
  if (result.battery.cycles !== null || result.battery.healthPct !== null) {
    const cycles = result.battery.cycles || 0;
    const health = result.battery.healthPct;
    const chip = result.hardware.chip || "";

    let isOlderModel = chip.includes("M1");
    if (isOlderModel && cycles < 25 && cycles > 0) {
      result.battery.status = "warning";
      result.battery.notes.push("Cycle count is suspiciously low (<25) for an M1 (2020). Possible counterfeit copy battery or reset microcontroller.");
    } else if (health && health < 80) {
      result.battery.status = "warning";
      result.battery.notes.push(`Battery health is ${health}% (below 80% threshold). Negotiate a ৳6,000–৳8,000 replacement discount.`);
      result.verdictReasons.push("Battery degraded below 80%");
    } else if (cycles > 600) {
      result.battery.status = "warning";
      result.battery.notes.push(`High cycle count (${cycles}). Battery is near end of rated service life.`);
    } else {
      result.battery.status = "pass";
      result.battery.notes.push("Battery metrics and cycle counts are within healthy operational parameters.");
    }
  }

  // 5. Storage / SSD Parsing
  const smartMatch = text.match(/S\.M\.A\.R\.T\. Status:\s*([^\n\r]+)/i);
  if (smartMatch) {
    const rawSmart = smartMatch[1];
    if (/Verified/i.test(rawSmart)) {
      result.storage.smartStatus = "Verified";
      result.storage.status = "pass";
    } else {
      result.storage.smartStatus = rawSmart.trim();
      result.storage.status = "fail";
      result.verdictReasons.push("SSD S.M.A.R.T. failure detected");
    }
  }

  const writeSpdMatch = text.match(/(?:Sequential Write Speed|Write Speed):\s*(\d+)\s*MB\/s/i);
  if (writeSpdMatch) result.storage.writeSpeed = parseInt(writeSpdMatch[1], 10);

  const readSpdMatch = text.match(/(?:Sequential Read Speed|Read Speed):\s*(\d+)\s*MB\/s/i);
  if (readSpdMatch) result.storage.readSpeed = parseInt(readSpdMatch[1], 10);

  if (result.storage.writeSpeed) {
    if (result.storage.writeSpeed < 1000) {
      result.storage.status = "fail";
      result.storage.notes.push(`Very slow write speed (${result.storage.writeSpeed} MB/s). NAND flash may be heavily degraded!`);
      result.verdictReasons.push("Severely degraded SSD write speed");
    } else if (result.storage.writeSpeed < 1800) {
      result.storage.notes.push(`Write speed is ${result.storage.writeSpeed} MB/s. Standard for single-NAND (base M2), but slower than dual-NAND.`);
    } else {
      result.storage.notes.push(`High-speed SSD verified (${result.storage.writeSpeed} MB/s write).`);
    }
  }

  // 6. Thermals
  if (
    /Active thermal throttling/i.test(text) ||
    /CPU_Speed_Limit|CPU_Scheduler_Limit/i.test(text)
  ) {
    result.thermal.throttling = true;
    result.thermal.status = "fail";
    result.thermal.details = "Active thermal throttling detected. Cooling sensor or fan system may be failing.";
    result.verdictReasons.push("Active thermal throttling detected");
  } else if (/Thermal State:\s*.*Normal/i.test(text) || /No CPU scheduler thermal limits/i.test(text)) {
    result.thermal.status = "pass";
    result.thermal.details = "Normal thermal state with zero CPU speed restrictions.";
  }

  // 7. Touch ID
  if (/Touch ID Sensor:\s*.*verified/i.test(text) || /successfully paired/i.test(text)) {
    result.touchId.status = "pass";
    result.touchId.details = "Touch ID sensor verified and communicating with Secure Enclave.";
  } else if (/Touch ID Sensor:\s*.*Error/i.test(text) || /unbonded/i.test(text)) {
    result.touchId.status = "fail";
    result.touchId.details = "Touch ID sensor error. Logic board swap or unbonded replacement button suspected.";
    result.verdictReasons.push("Touch ID Secure Enclave communication failure");
  }

  // 8. Overall Final Verdict
  if (result.mdm.status === "fail" || result.icloud.status === "fail") {
    result.overallVerdict = "DO_NOT_BUY";
  } else if (result.storage.status === "fail" || result.touchId.status === "fail" || result.thermal.status === "fail") {
    result.overallVerdict = "HARDWARE_DEFECT";
  } else if (result.battery.status === "warning") {
    result.overallVerdict = "NEGOTIATE_DISCOUNT";
  } else if (result.mdm.status === "pass") {
    result.overallVerdict = "RECOMMENDED";
  } else if (result.mdm.status === "unknown") {
    // Never claim "all clear" without an explicit clean MDM/DEP read — an
    // unconfirmed MDM status is exactly the scenario this tool exists to catch.
    result.overallVerdict = "VERIFY_MDM";
    result.verdictReasons.push("Could not confirm MDM/DEP status from the pasted output — check manually (System Settings > Privacy & Security > Profiles, and watch for a 'Remote Management' screen) before buying.");
  } else {
    result.overallVerdict = "PARTIAL";
  }

  return result;
}

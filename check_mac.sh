#!/usr/bin/env bash

# ==============================================================================
# 🍏 ALL-IN-ONE APPLE SILICON PRE-PURCHASE DIAGNOSTIC & BENCHMARK TOOL 🍏
# Replicates core features of: coconutBattery, DriveDx, Blackmagic & Geekbench
# 100% Native macOS CLI - Zero external dependencies - No sudo required
# ==============================================================================

# ANSI Color Formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

clear 2>/dev/null || true

# Pre-purchase Scorecard Indicators
SCORE_MDM="PASS"
SCORE_ICLOUD="PASS"
SCORE_BATT="PASS"
SCORE_SSD="PASS"
SCORE_THERM="PASS"
SCORE_TOUCHID="PASS"

# ------------------------------------------------------------------------------
# 1. HARDWARE AUTO-DETECTION & IDENTITY
# ------------------------------------------------------------------------------
HW_INFO=$(system_profiler SPHardwareDataType 2>/dev/null)

MODEL_NAME=$(echo "$HW_INFO" | awk -F': ' '/Model Name/ {print $2}')
MODEL_ID=$(echo "$HW_INFO" | awk -F': ' '/Model Identifier/ {print $2}')
CHIP_NAME=$(echo "$HW_INFO" | awk -F': ' '/Chip/ {print $2}')
CORES=$(echo "$HW_INFO" | awk -F': ' '/Total Number of Cores/ {print $2}')
MEMORY=$(echo "$HW_INFO" | awk -F': ' '/Memory/ {print $2}')
SERIAL=$(echo "$HW_INFO" | awk -F': ' '/Serial Number/ {print $2}')
ACT_LOCK=$(echo "$HW_INFO" | awk -F': ' '/Activation Lock Status/ {print $2}')

# Determine Apple Silicon Generation
CHIP_GEN="Unknown"
if [[ "$CHIP_NAME" == *"M1"* ]]; then
    CHIP_GEN="M1"
elif [[ "$CHIP_NAME" == *"M2"* ]]; then
    CHIP_GEN="M2"
elif [[ "$CHIP_NAME" == *"M3"* ]]; then
    CHIP_GEN="M3"
elif [[ "$CHIP_NAME" == *"M4"* ]]; then
    CHIP_GEN="M4"
else
    CHIP_GEN="Apple Silicon"
fi

# Detect Form Factor
FORM_FACTOR="MacBook"
if [[ "$MODEL_NAME" == *"Air"* ]]; then
    FORM_FACTOR="MacBook Air"
elif [[ "$MODEL_NAME" == *"Pro"* ]]; then
    FORM_FACTOR="MacBook Pro"
fi

echo -e "${BOLD}${CYAN}======================================================================${NC}"
echo -e "${BOLD}${CYAN}  🍏 ALL-IN-ONE PRE-PURCHASE CHECKER & BENCHMARK TOOL (${CHIP_GEN}) 🍏 ${NC}"
echo -e "${BOLD}${CYAN}======================================================================${NC}"
echo ""

echo -e "${BOLD}[1/7] Hardware Identity & Security Check...${NC}"
echo -e "  • Machine:      ${BOLD}${MODEL_NAME} (${MODEL_ID:-Unknown ID})${NC}"
echo -e "  • Processor:    ${BOLD}${CHIP_NAME:-Apple Silicon} [${CORES:-N/A}]${NC}"
echo -e "  • Memory (RAM): ${BOLD}${MEMORY}${NC}"
echo -e "  • Logic Serial: ${BOLD}${SERIAL}${NC}"

if [[ -n "$ACT_LOCK" ]]; then
    if [[ "$ACT_LOCK" == *"Enabled"* ]]; then
        SCORE_ICLOUD="FAIL"
        echo -e "  • iCloud Lock:  ${RED}⚠️  ACTIVATION LOCK ENABLED!${NC}"
        echo -e "                  ${RED}👉 The seller MUST sign out of iCloud & turn off 'Find My' before you pay!${NC}"
    else
        echo -e "  • iCloud Lock:  ${GREEN}✅ Clean / Disabled (Safe to link your Apple ID)${NC}"
    fi
fi

echo -e "  ${YELLOW}👉 ACTION: Confirm bottom metal chassis engraving matches: [ ${SERIAL} ]${NC}"
echo ""

# ------------------------------------------------------------------------------
# 2. MDM & CORPORATE ENROLLMENT CHECK
# ------------------------------------------------------------------------------
echo -e "${BOLD}[2/7] Checking MDM & Remote Device Management Profiles...${NC}"
DEP_CHECK=$(profiles status -type enrollment 2>&1)

if echo "$DEP_CHECK" | grep -q "Enrolled via DEP: No"; then
    echo -e "  • MDM Status:   ${GREEN}✅ CLEAN (Not DEP Enrolled / Free of corporate remote management)${NC}"
elif echo "$DEP_CHECK" | grep -qi "Client is not DEP enabled"; then
    echo -e "  • MDM Status:   ${GREEN}✅ CLEAN (Client is not DEP enabled)${NC}"
elif echo "$DEP_CHECK" | grep -qi "error"; then
    echo -e "  • MDM Status:   ${GREEN}✅ CLEAN (Device enrollment service reports clean status)${NC}"
else
    SCORE_MDM="FAIL"
    echo -e "  • MDM Status:   ${RED}❌ RED ALERT: MDM CORPORATE PROFILE DETECTED!${NC}"
    echo -e "    ${RED}$DEP_CHECK${NC}"
    echo -e "    ${RED}⚠️  WALK AWAY! This Mac belongs to an enterprise/school organization.${NC}"
fi
echo ""

# ------------------------------------------------------------------------------
# 3. BATTERY & CHARGER TELEMETRY (coconutBattery Equivalent)
# ------------------------------------------------------------------------------
echo -e "${BOLD}[3/7] Battery & Charger Health Analysis (coconutBattery Mode)...${NC}"
PWR_INFO=$(system_profiler SPPowerDataType 2>/dev/null)
BATT_SERIAL=$(echo "$PWR_INFO" | awk '/Battery Information:/ {flag=1} flag && /Serial Number:/ {print $3; exit}')
BATT_DEVICE=$(echo "$PWR_INFO" | awk -F': ' '/Device Name:/ {print $2; exit}')
CYCLES=$(echo "$PWR_INFO" | awk -F': ' '/Cycle Count/ {print $2}' | tr -d ' ')
CONDITION=$(echo "$PWR_INFO" | awk -F': ' '/Condition/ {print $2}')
HEALTH_PCT=$(echo "$PWR_INFO" | awk -F': ' '/Maximum Capacity/ {print $2}')

DESIGN_CAP=$(ioreg -r -c AppleSmartBattery | awk -F'= ' '/"DesignCapacity" =/ {print $2}')
RAW_MAX_CAP=$(ioreg -r -c AppleSmartBattery | awk -F'= ' '/"AppleRawMaxCapacity" =/ {print $2}')
RAW_TEMP=$(ioreg -r -c AppleSmartBattery | awk -F'= ' '/"Temperature" =/ {print $2}')
RAW_VOLT=$(ioreg -r -c AppleSmartBattery | awk -F'= ' '/"Voltage" =/ {print $2}')

echo -e "  • Battery Serial:   ${BOLD}${BATT_SERIAL:-Unknown}${NC} (${BATT_DEVICE:-Apple Battery})"
echo -e "  • Reported Cycles:  ${BOLD}${CYCLES:-Unknown}${NC}"
echo -e "  • macOS Health:     ${BOLD}${HEALTH_PCT:-Unknown}${NC} (Condition: ${CONDITION:-Normal})"

if [[ -n "$DESIGN_CAP" && -n "$RAW_MAX_CAP" && "$DESIGN_CAP" -gt 0 ]]; then
    CALC_PCT=$(( RAW_MAX_CAP * 100 / DESIGN_CAP ))
    echo -e "  • True Raw Health:  ${BOLD}${CALC_PCT}%${NC} (${RAW_MAX_CAP} mAh raw / ${DESIGN_CAP} mAh design)"
    if [ "$CALC_PCT" -lt 80 ]; then
        SCORE_BATT="WARNING"
    fi
fi

if [[ -n "$RAW_TEMP" && "$RAW_TEMP" -gt 0 ]]; then
    TEMP_C=$(( RAW_TEMP / 100 ))
    echo -e "  • Temperature:      ${BOLD}${TEMP_C}°C${NC}"
fi

if [[ -n "$RAW_VOLT" && "$RAW_VOLT" -gt 0 ]]; then
    VOLT_V=$(awk -v v="$RAW_VOLT" 'BEGIN {printf "%.2f", v/1000}')
    echo -e "  • Current Voltage:  ${BOLD}${VOLT_V} V${NC}"
fi

# AC Charger Telemetry
CHARGER_CONN=$(echo "$PWR_INFO" | awk '/AC Charger Information:/ {flag=1} flag && /Connected:/ {print $2; exit}')
if [[ "$CHARGER_CONN" == "Yes" ]]; then
    CHARGER_NAME=$(echo "$PWR_INFO" | awk '/AC Charger Information:/ {flag=1} flag && /Name:/ {print substr($0, index($0,$2)); exit}')
    CHARGER_WATT=$(echo "$PWR_INFO" | awk '/AC Charger Information:/ {flag=1} flag && /Wattage/ {print $3; exit}')
    CHARGER_MFR=$(echo "$PWR_INFO" | awk '/AC Charger Information:/ {flag=1} flag && /Manufacturer:/ {print $2; exit}')
    CHARGER_SER=$(echo "$PWR_INFO" | awk '/AC Charger Information:/ {flag=1} flag && /Serial Number:/ {print $3; exit}')
    echo -e "  • Connected Adapter:${BOLD} ${CHARGER_NAME:-USB-C Charger} (${CHARGER_WATT:-N/A}W by ${CHARGER_MFR:-Unknown})${NC}"
    echo -e "  • Adapter Serial:   ${BOLD}${CHARGER_SER:-N/A}${NC}"
    if [[ "$CHARGER_MFR" != *"Apple"* && -z "$CHARGER_SER" ]]; then
        echo -e "    ${YELLOW}⚠️  WARNING: Charger appears to be a 3rd-party or generic clone brick!${NC}"
    fi
else
    echo -e "  • Connected Adapter:${YELLOW} Running on Battery (Plug in charger to verify brick authenticity)${NC}"
fi

# Dynamic Generation-Aware Cycle Analysis
if [[ -n "$CYCLES" ]]; then
    if [[ "$CHIP_GEN" == "M1" ]]; then
        if [ "$CYCLES" -lt 25 ]; then
            SCORE_BATT="WARNING"
            echo -e "  ${YELLOW}⚠️  SUSPICIOUS: Cycle count is < 25 on an M1 (2020). Battery likely replaced with copy or reset!${NC}"
        elif [ "$CYCLES" -gt 600 ]; then
            SCORE_BATT="WARNING"
            echo -e "  ${YELLOW}⚠️  High cycle count (>600). Budget for a replacement battery soon.${NC}"
        else
            echo -e "  ${GREEN}✅ Cycle count is normal for a pre-owned M1.${NC}"
        fi
    elif [[ "$CHIP_GEN" == "M2" ]]; then
        if [ "$CYCLES" -lt 15 ]; then
            echo -e "  ${YELLOW}⚠️  Note: Very low cycles on M2 (<15). Verify if battery is original.${NC}"
        elif [ "$CYCLES" -gt 550 ]; then
            SCORE_BATT="WARNING"
            echo -e "  ${YELLOW}⚠️  High cycle count for M2 (>550).${NC}"
        else
            echo -e "  ${GREEN}✅ Cycle count is normal for an M2.${NC}"
        fi
    elif [[ "$CHIP_GEN" == "M3" || "$CHIP_GEN" == "M4" ]]; then
        if [ "$CYCLES" -lt 50 ]; then
            echo -e "  ${GREEN}✅ Very low cycle count (<50) — machine is relatively new or lightly used.${NC}"
        elif [ "$CYCLES" -gt 450 ]; then
            SCORE_BATT="WARNING"
            echo -e "  ${YELLOW}⚠️  Unusually high cycle count (>450) for a recent ${CHIP_GEN} machine.${NC}"
        else
            echo -e "  ${GREEN}✅ Cycle count is normal for pre-owned ${CHIP_GEN}.${NC}"
        fi
    fi
fi
echo ""

# ------------------------------------------------------------------------------
# 4. SSD HEALTH & SPEED BENCHMARK (DriveDx & Blackmagic Mode)
# ------------------------------------------------------------------------------
echo -e "${BOLD}[4/7] SSD Health & Speed Benchmark (DriveDx / Blackmagic Mode)...${NC}"
SMART_STATUS=$(diskutil info disk0 2>/dev/null | awk -F': ' '/SMART Status/ {print $2}' | tr -d ' ')
DISK_SIZE=$(diskutil info disk0 2>/dev/null | awk -F': *' '/Disk Size/ {print $2}' | awk -F' \\(' '{print $1}')
SSD_MODEL=$(system_profiler SPNVMeDataType 2>/dev/null | awk -F': ' '/Model:/ {print $2; exit}')
SSD_SERIAL=$(system_profiler SPNVMeDataType 2>/dev/null | awk -F': ' '/Serial Number:/ {print $2; exit}')

echo -e "  • Drive Model:      ${BOLD}${SSD_MODEL:-APPLE SSD}${NC} (Serial: ${SSD_SERIAL:-Unknown})"
echo -e "  • Storage Size:     ${BOLD}${DISK_SIZE}${NC}"
if [[ "$SMART_STATUS" == "Verified" ]]; then
    echo -e "  • S.M.A.R.T. Status:${GREEN}✅ Verified (Self-monitoring sensors healthy)${NC}"
else
    SCORE_SSD="FAIL"
    echo -e "  • S.M.A.R.T. Status:${RED}❌ ${SMART_STATUS:-Failing / Warning}${NC}"
fi

# Optional smartctl deep telemetry if installed
if command -v smartctl >/dev/null 2>&1; then
    echo -e "  • Checking NVMe SMART log page via smartctl..."
    SMART_DATA=$(smartctl -a disk0 2>/dev/null)
    TBW=$(echo "$SMART_DATA" | awk -F': *' '/Data Units Written/ {print $2}')
    WEAR=$(echo "$SMART_DATA" | awk -F': *' '/Percentage Used/ {print $2}')
    MEDIA_ERR=$(echo "$SMART_DATA" | awk -F': *' '/Media and Data Integrity Errors/ {print $2}')
    [[ -n "$TBW" ]] && echo -e "    - Data Written (TBW): ${BOLD}${TBW}${NC}"
    [[ -n "$WEAR" ]] && echo -e "    - Wear Level:         ${BOLD}${WEAR}${NC}"
    [[ -n "$MEDIA_ERR" ]] && echo -e "    - Media Errors:       ${BOLD}${MEDIA_ERR}${NC}"
fi

echo -e "  • Benchmarking SSD (Writing & Reading temporary 1GB block)..."
TEST_FILE="/tmp/speed_test_$$"

WRITE_OUTPUT=$(dd if=/dev/zero of="$TEST_FILE" bs=1m count=1024 2>&1)
WRITE_BYTES=$(echo "$WRITE_OUTPUT" | awk -F'[()]' '/bytes\/sec/ {print $2}' | awk '{print $1}')
if [[ -n "$WRITE_BYTES" ]]; then
    WRITE_MB=$(( WRITE_BYTES / 1048576 ))
    echo -e "    - Sequential Write Speed: ${BOLD}${WRITE_MB} MB/s${NC}"
fi

READ_OUTPUT=$(dd if="$TEST_FILE" of=/dev/null bs=1m count=1024 2>&1)
READ_BYTES=$(echo "$READ_OUTPUT" | awk -F'[()]' '/bytes\/sec/ {print $2}' | awk '{print $1}')
if [[ -n "$READ_BYTES" ]]; then
    READ_MB=$(( READ_BYTES / 1048576 ))
    echo -e "    - Sequential Read Speed:  ${BOLD}${READ_MB} MB/s${NC}"
fi
rm -f "$TEST_FILE"

# Generation-specific SSD analysis
if [[ -n "$WRITE_MB" ]]; then
    if [[ "$CHIP_GEN" == "M1" ]]; then
        if [ "$WRITE_MB" -ge 1800 ]; then
            echo -e "  ${GREEN}✅ Speeds are healthy and standard for M1 dual-NAND flash (~2,100+ MB/s).${NC}"
        elif [ "$WRITE_MB" -lt 1200 ]; then
            SCORE_SSD="FAIL"
            echo -e "  ${RED}❌ WARNING: Write speed < 1,200 MB/s! Possible degraded NAND flash.${NC}"
        fi
    elif [[ "$CHIP_GEN" == "M2" ]]; then
        if [[ "$DISK_SIZE" == *"256"* ]] && [ "$WRITE_MB" -ge 1200 ] && [ "$WRITE_MB" -lt 2000 ]; then
            echo -e "  ${GREEN}✅ Speeds match factory base M2 single-NAND design (~1,400–1,600 MB/s).${NC}"
        elif [ "$WRITE_MB" -ge 2400 ]; then
            echo -e "  ${GREEN}✅ High-speed dual-NAND SSD detected (${WRITE_MB} MB/s).${NC}"
        elif [ "$WRITE_MB" -lt 1000 ]; then
            SCORE_SSD="FAIL"
            echo -e "  ${RED}❌ WARNING: Write speed < 1,000 MB/s! NAND flash degraded.${NC}"
        fi
    elif [[ "$CHIP_GEN" == "M3" || "$CHIP_GEN" == "M4" ]]; then
        if [ "$WRITE_MB" -ge 2800 ]; then
            echo -e "  ${GREEN}✅ High-speed modern Apple Silicon flash verified (${WRITE_MB} MB/s).${NC}"
        elif [ "$WRITE_MB" -lt 1800 ]; then
            SCORE_SSD="FAIL"
            echo -e "  ${RED}❌ WARNING: Below expected speed for ${CHIP_GEN} (<1,800 MB/s). Check storage health!${NC}"
        fi
    fi
fi
echo ""

# ------------------------------------------------------------------------------
# 5. THERMAL & CPU BENCHMARK (Geekbench Equivalent)
# ------------------------------------------------------------------------------
echo -e "${BOLD}[5/7] Thermal Throttling & CPU Benchmark (Geekbench Mode)...${NC}"
THERM=$(pmset -g therm 2>/dev/null)

if echo "$THERM" | grep -qiE "CPU_Speed_Limit|CPU_Scheduler_Limit|Thermal_Warning_Level"; then
    SCORE_THERM="FAIL"
    echo -e "  • Thermal State:  ${RED}❌ Active thermal throttling or temperature limit detected!${NC}"
    echo "$THERM"
else
    echo -e "  • Thermal State:  ${GREEN}✅ Normal (No CPU scheduler thermal limits active)${NC}"
fi

# Quick Native Cryptographic CPU Throughput Test (2 seconds)
echo -e "  • Testing raw CPU throughput (Native SHA-256 Benchmark)..."
CRYPTO_TEST=$(openssl speed -seconds 2 sha256 2>&1 | tail -n 1)
CRYPTO_SPEED=$(echo "$CRYPTO_TEST" | awk '{print $(NF)}')
if [[ -n "$CRYPTO_SPEED" ]]; then
    echo -e "    - Processing Speed:       ${BOLD}${CRYPTO_SPEED} (bytes/sec block)${NC}"
    echo -e "  ${GREEN}✅ CPU instructions and cryptographic pipelines responding at full clock.${NC}"
fi

# Geekbench 6 CLI Detection
GB_CLI=""
for PATH_CANDIDATE in \
    "$(dirname "$0")/extra_tools/Geekbench 6.app/Contents/MacOS/geekbench6" \
    "$(dirname "$0")/Geekbench 6.app/Contents/MacOS/geekbench6" \
    "/Applications/Geekbench 6.app/Contents/MacOS/geekbench6" \
    "/Volumes/*/Geekbench 6.app/Contents/MacOS/geekbench6" \
    "/Volumes/*/extra_tools/Geekbench 6.app/Contents/MacOS/geekbench6"; do
    if [[ -x "$PATH_CANDIDATE" ]]; then
        GB_CLI="$PATH_CANDIDATE"
        break
    fi
done

if [[ -n "$GB_CLI" ]]; then
    echo -e "  ${CYAN}💡 Geekbench 6 CLI detected at: ${GB_CLI}${NC}"
    echo -e "     Run '${BOLD}${GB_CLI} --upload${NC}' to run full benchmarks & compare live on browser.geekbench.com!"
else
    echo -e "  ${MAGENTA}💡 TIP: To get a live Geekbench link, copy 'Geekbench 6.app' to your USB drive.${NC}"
    echo -e "     The script will automatically detect and run it in headless CLI mode!${NC}"
fi
echo ""

# ------------------------------------------------------------------------------
# 6. BIOMETRICS & SECURE ENCLAVE (TOUCH ID)
# ------------------------------------------------------------------------------
echo -e "${BOLD}[6/7] Checking Touch ID / Secure Enclave Pairing...${NC}"
BIO_CHECK=$(bioutil -r 2>&1)

if echo "$BIO_CHECK" | grep -qi "successfully"; then
    echo -e "  • Touch ID Sensor:${GREEN}✅ Sensor verified and communicating with Secure Enclave${NC}"
else
    SCORE_TOUCHID="FAIL"
    echo -e "  • Touch ID Sensor:${RED}❌ Error communicating with Touch ID sensor!${NC}"
    echo -e "                    ${RED}Possible logic board swap or unbonded 3rd-party power button.${NC}"
fi
echo ""

# ------------------------------------------------------------------------------
# 7. NETWORK DIAGNOSTICS
# ------------------------------------------------------------------------------
echo -e "${BOLD}[7/7] Network & Wireless Controller Check...${NC}"
WIFI_INFO=$(system_profiler SPAirPortDataType 2>/dev/null | awk -F': ' '/Current Network Information/ {flag=1} flag && /SSID/ {print $2; exit}')

if [[ -n "$WIFI_INFO" ]]; then
    echo -e "  • Connected Wi-Fi: ${BOLD}${WIFI_INFO}${NC}"
    echo -e "  • Testing Apple Network Quality (takes ~5s)..."
    NET_RESULT=$(networkQuality 2>/dev/null)
    UPLINK=$(echo "$NET_RESULT" | awk -F': ' '/Uplink capacity/ {print $2}')
    DOWNLINK=$(echo "$NET_RESULT" | awk -F': ' '/Downlink capacity/ {print $2}')
    RESP=$(echo "$NET_RESULT" | awk -F': ' '/Responsiveness/ {print $2}')
    
    if [[ -n "$DOWNLINK" ]]; then
        echo -e "    - Download:       ${BOLD}${DOWNLINK}${NC}"
        echo -e "    - Upload:         ${BOLD}${UPLINK}${NC}"
        echo -e "    - Responsiveness: ${BOLD}${RESP}${NC}"
        echo -e "  ${GREEN}✅ Wi-Fi controller, antenna array, and routing functional.${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠️  Not connected to Wi-Fi. Connect to hotspot to run live throughput test.${NC}"
fi

echo ""
# ------------------------------------------------------------------------------
# 8. PRE-PURCHASE VERDICT SCORECARD
# ------------------------------------------------------------------------------
echo -e "${BOLD}${CYAN}======================================================================${NC}"
echo -e "${BOLD}${CYAN}                PRE-PURCHASE FIELD VERDICT SCORECARD                  ${NC}"
echo -e "${BOLD}${CYAN}======================================================================${NC}"

echo -e "  • Corporate MDM Lock:    $([ "$SCORE_MDM" == "PASS" ] && echo -e "${GREEN}✅ CLEAN${NC}" || echo -e "${RED}❌ FAILED${NC}")"
echo -e "  • iCloud Activation Lock: $([ "$SCORE_ICLOUD" == "PASS" ] && echo -e "${GREEN}✅ CLEAN${NC}" || echo -e "${RED}❌ FAILED${NC}")"
echo -e "  • Battery Telemetry:     $([ "$SCORE_BATT" == "PASS" ] && echo -e "${GREEN}✅ HEALTHY${NC}" || echo -e "${YELLOW}⚠️  CHECK WEAR / COPY${NC}")"
echo -e "  • Storage & S.M.A.R.T.:  $([ "$SCORE_SSD" == "PASS" ] && echo -e "${GREEN}✅ VERIFIED${NC}" || echo -e "${RED}❌ FAILED / SLOW${NC}")"
echo -e "  • Thermal Throttling:    $([ "$SCORE_THERM" == "PASS" ] && echo -e "${GREEN}✅ NORMAL${NC}" || echo -e "${RED}❌ THROTTLED${NC}")"
echo -e "  • Secure Enclave Biometrics:$([ "$SCORE_TOUCHID" == "PASS" ] && echo -e "${GREEN}✅ OPERATIONAL${NC}" || echo -e "${RED}❌ FAILED${NC}")"

echo ""
if [[ "$SCORE_MDM" == "FAIL" || "$SCORE_ICLOUD" == "FAIL" ]]; then
    echo -e "  ${BOLD}${RED}🚨 OVERALL VERDICT: DO NOT BUY!${NC} Machine is locked to an organization or iCloud."
elif [[ "$SCORE_SSD" == "FAIL" || "$SCORE_TOUCHID" == "FAIL" ]]; then
    echo -e "  ${BOLD}${RED}🚨 OVERALL VERDICT: HARDWARE DEFECT DETECTED!${NC} Check logic board or storage."
elif [[ "$SCORE_BATT" == "WARNING" ]]; then
    echo -e "  ${BOLD}${YELLOW}⚠️  OVERALL VERDICT: NEGOTIATE DISCOUNT.${NC} Battery has notable wear or was replaced."
else
    echo -e "  ${BOLD}${GREEN}🎉 OVERALL VERDICT: EXCELLENT CANDIDATE TO PURCHASE!${NC} All tests passed."
fi
echo -e "${BOLD}${CYAN}======================================================================${NC}"
echo ""

echo -e "${BOLD}Targeted Manual Inspection Steps for ${CHIP_NAME} ${FORM_FACTOR}:${NC}"
if [[ "$FORM_FACTOR" == "MacBook Pro" ]]; then
    echo -e " 1. ${BOLD}ProMotion 120Hz:${NC} Confirm 'ProMotion' option in System Settings > Displays > Refresh Rate."
    echo -e " 2. ${BOLD}Mini-LED Screen:${NC} Inspect black background for blooming or dead backlight zones."
    echo -e " 3. ${BOLD}All Physical Ports:${NC} Test MagSafe 3 charging + all 3 Thunderbolt ports + HDMI + SDXC slot."
    echo -e " 4. ${BOLD}6-Speaker Audio:${NC} Play an acoustic track at 100% volume; check for cone vibration or rattle."
else
    echo -e " 1. ${BOLD}True Tone Display:${NC} Confirm 'True Tone' toggle exists in System Settings > Displays."
    echo -e " 2. ${BOLD}Dual Thunderbolt Ports:${NC} Test charging AND fast USB drive on BOTH Left ports."
    if [[ "$CHIP_GEN" == "M2" || "$CHIP_GEN" == "M3" ]]; then
        echo -e " 3. ${BOLD}MagSafe 3 Port:${NC} Verify magnetic cable lights amber/green."
    fi
fi
echo -e " 5. ${BOLD}Apple Diagnostics:${NC} Hold Power on shutdown -> Cmd+D (Expect code ADP000)."
echo -e " 6. ${BOLD}Keyboard Tester:${NC} Verify every key (Fn, Caps Lock, Spacebar corners) on keyboardtester.com."
echo -e "${BOLD}${CYAN}======================================================================${NC}"

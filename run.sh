#!/usr/bin/env bash

# ==============================================================================
# 🍏 MACBOOK PRE-PURCHASE FIELD INSPECTION MASTER LAUNCHER 🍏
# Interactive TUI for inspecting pre-owned Apple Silicon MacBooks in reseller shops
# ==============================================================================

# ANSI Color Codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

while true; do
    clear 2>/dev/null || true
    echo -e "${BOLD}${CYAN}======================================================================${NC}"
    echo -e "${BOLD}${CYAN}     🍏 MACBOOK PRE-PURCHASE FIELD INSPECTION MASTER MENU 🍏          ${NC}"
    echo -e "${BOLD}${CYAN}======================================================================${NC}"
    echo -e " Select an action to run:"
    echo ""
    echo -e "  ${BOLD}[1] ⚡ Quick Automated Audit (10s)${NC}      - MDM, iCloud, SSD speed, thermals"
    echo -e "  ${BOLD}[2] 🔋 Battery Stress & Cell Sag (3m)${NC}  - True physical capacity, voltage sag, balance"
    echo -e "  ${BOLD}[3] 🚀 External SSD Stress Generator${NC}  - Tiny 10B-15KB files to stress-test USB ports"
    echo -e "  ${BOLD}[4] 🖥️ Offline Screen & Dead Pixel Test${NC} - Full-screen white/black/RGB tester (no Wi-Fi)"
    echo -e "  ${BOLD}[5] ⌨️ Offline Keyboard Matrix Test${NC}     - Visual layout verifying every single key"
    echo -e "  ${BOLD}[6] 📂 View Model Benchmark Targets${NC}     - Check M1/M2/M3/M4 expected scores"
    echo -e "  ${BOLD}[7] 🧾 Cash Memo & Warranty Guide${NC}       - Essential legal & warranty clauses in BD"
    echo -e "  ${BOLD}[8] 🏃 Run Complete All-in-One Suite${NC}   - Sequence automated audit + battery test"
    echo -e "  ${BOLD}[0] 🚪 Exit${NC}"
    echo -e "${BOLD}${CYAN}======================================================================${NC}"
    read -p " Enter your choice [0-8]: " CHOICE
    echo ""

    case "$CHOICE" in
        1)
            bash "$SCRIPT_DIR/check_mac.sh"
            echo ""
            read -p "Press [Enter] to return to menu..."
            ;;
        2)
            echo -e "${BOLD}Starting Battery Extended Performance Test...${NC}"
            read -p "Enter test duration (e.g. 3m, 5m, default: 3m): " DUR
            DUR="${DUR:-3m}"
            python3 "$SCRIPT_DIR/battery_extended_test/battery_stress_test.py" -d "$DUR"
            echo ""
            read -p "Press [Enter] to return to menu..."
            ;;
        3)
            echo -e "${BOLD}Starting Random Tiny File Stress Generator...${NC}"
            read -p "Enter target size (e.g. 10GB, 2GB, default: 2GB): " SZ
            SZ="${SZ:-2GB}"
            read -p "Enter output path (default: ./stress_test_data): " OUT_PATH
            OUT_PATH="${OUT_PATH:-$SCRIPT_DIR/stress_test_data}"
            read -p "Optional: Destination path to test transfer (or press Enter to skip): " XFER
            if [[ -n "$XFER" ]]; then
                python3 "$SCRIPT_DIR/generated_tools/generate_stress_files.py" -s "$SZ" -o "$OUT_PATH" --transfer-to "$XFER"
            else
                python3 "$SCRIPT_DIR/generated_tools/generate_stress_files.py" -s "$SZ" -o "$OUT_PATH"
            fi
            echo ""
            read -p "Press [Enter] to return to menu..."
            ;;
        4)
            echo -e "${GREEN}Opening offline Display & Dead Pixel Tester in your browser...${NC}"
            open "$SCRIPT_DIR/extra_tools/screen_test.html"
            echo -e "• Press Spacebar or Click to cycle colors."
            echo -e "• Press F for Fullscreen."
            echo ""
            read -p "Press [Enter] to return to menu..."
            ;;
        5)
            echo -e "${GREEN}Opening offline Keyboard Matrix Inspector in your browser...${NC}"
            open "$SCRIPT_DIR/extra_tools/keyboard_test.html"
            echo -e "• Press all keys on the keyboard. Functional keys will turn green."
            echo ""
            read -p "Press [Enter] to return to menu..."
            ;;
        6)
            echo -e "${BOLD}${CYAN}Available Model Benchmark Guides:${NC}"
            echo -e "  [1] M1 MacBook Air (2020)"
            echo -e "  [2] M1 Pro & M1 Max (2021)"
            echo -e "  [3] M2 MacBook Air (2022/2023)"
            echo -e "  [4] M2 Pro & M2 Max (2023)"
            echo -e "  [5] M3 Series (2023/2024)"
            echo -e "  [6] M4 Series (2024/2025)"
            read -p "Select model [1-6]: " M_CHOICE
            case "$M_CHOICE" in
                1) cat "$SCRIPT_DIR/models/m1-air/BENCHMARKS.md" ;;
                2) cat "$SCRIPT_DIR/models/m1-pro-max/BENCHMARKS.md" ;;
                3) cat "$SCRIPT_DIR/models/m2-air/BENCHMARKS.md" ;;
                4) cat "$SCRIPT_DIR/models/m2-pro-max/BENCHMARKS.md" ;;
                5) cat "$SCRIPT_DIR/models/m3-series/BENCHMARKS.md" ;;
                6) cat "$SCRIPT_DIR/models/m4-series/BENCHMARKS.md" ;;
                *) echo "Invalid choice." ;;
            esac
            echo ""
            read -p "Press [Enter] to return to menu..."
            ;;
        7)
            if [[ -f "$SCRIPT_DIR/RECEIPT_AND_WARRANTY_GUIDE.md" ]]; then
                cat "$SCRIPT_DIR/RECEIPT_AND_WARRANTY_GUIDE.md"
            else
                echo "Receipt guide document not found."
            fi
            echo ""
            read -p "Press [Enter] to return to menu..."
            ;;
        8)
            echo -e "${BOLD}${CYAN}▶ Step 1/2: Running 10-Second Automated Audit...${NC}"
            bash "$SCRIPT_DIR/check_mac.sh"
            echo ""
            echo -e "${BOLD}${CYAN}▶ Step 2/2: Running 3-Minute Battery Performance Test...${NC}"
            echo -e "Please ensure the charger is UNPLUGGED."
            read -p "Press [Enter] to start battery test (or Ctrl+C to cancel)..."
            python3 "$SCRIPT_DIR/battery_extended_test/battery_stress_test.py" -d 3m
            echo ""
            read -p "Full suite finished! Press [Enter] to return to menu..."
            ;;
        0)
            echo -e "${GREEN}Good luck with your purchase! Exiting.${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid selection. Please choose 0-8.${NC}"
            sleep 1
            ;;
    esac
done

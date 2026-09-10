#!/usr/bin/env bash

# ==============================================================================
# 🚀 ONE-CLICK SHOP USB PREPARATION SCRIPT
# Prepares a complete, self-contained USB flash drive for field MacBook testing
# ==============================================================================

set -e

# ANSI Color Codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BOLD}${CYAN}======================================================================${NC}"
echo -e "${BOLD}${CYAN}        🍏 MACBOOK PRE-PURCHASE FIELD USB DRIVE BUILDER 🍏            ${NC}"
echo -e "${BOLD}${CYAN}======================================================================${NC}"
echo ""

TARGET_USB="$1"

# If no target passed, list available USB volumes
if [[ -z "$TARGET_USB" ]]; then
    echo -e "${BOLD}Scanning for mounted external USB drives...${NC}"
    VOLUMES=()
    for v in /Volumes/*; do
        NAME="$(basename "$v")"
        if [[ "$NAME" != "Macintosh HD"* && "$NAME" != "Recovery"* && "$NAME" != "TimeMachine"* ]]; then
            VOLUMES+=("$v")
        fi
    done

    if [[ ${#VOLUMES[@]} -eq 0 ]]; then
        echo -e "${RED}❌ No external USB drives detected in /Volumes!${NC}"
        echo -e "   Please plug in your USB flash drive and re-run this script:"
        echo -e "   ${BOLD}./setup_usb.sh /Volumes/YOUR_USB_NAME${NC}"
        exit 1
    elif [[ ${#VOLUMES[@]} -eq 1 ]]; then
        TARGET_USB="${VOLUMES[0]}"
        echo -e "Auto-detected single external volume: ${BOLD}${GREEN}$TARGET_USB${NC}"
    else
        echo -e "${BOLD}Detected multiple external volumes:${NC}"
        for i in "${!VOLUMES[@]}"; do
            echo -e "  [$((i+1))] ${VOLUMES[$i]}"
        done
        read -p "Select USB volume number [1-${#VOLUMES[@]}]: " CHOICE
        IDX=$((CHOICE-1))
        if [[ -n "${VOLUMES[$IDX]}" ]]; then
            TARGET_USB="${VOLUMES[$IDX]}"
        else
            echo -e "${RED}Invalid selection.${NC}"
            exit 1
        fi
    fi
fi

if [[ ! -d "$TARGET_USB" ]]; then
    echo -e "${RED}❌ Destination '$TARGET_USB' is not a valid directory!${NC}"
    exit 1
fi

DEST_DIR="$TARGET_USB/Mac_Pre_Purchase_Checker"
mkdir -p "$DEST_DIR"

echo ""
echo -e "Copying test suite to: ${BOLD}${CYAN}$DEST_DIR${NC}..."

# 1. Main scripts
cp -f "$SCRIPT_DIR/check_mac.sh" "$DEST_DIR/"
[[ -f "$SCRIPT_DIR/run.sh" ]] && cp -f "$SCRIPT_DIR/run.sh" "$DEST_DIR/"
cp -f "$SCRIPT_DIR/CHECKLIST.md" "$DEST_DIR/"
cp -f "$SCRIPT_DIR/README.md" "$DEST_DIR/"

# 2. Model benchmark database
cp -Rf "$SCRIPT_DIR/models" "$DEST_DIR/"

# 3. Battery Extended Test
cp -Rf "$SCRIPT_DIR/battery_extended_test" "$DEST_DIR/"

# 4. Tiny File Stress Generator
cp -Rf "$SCRIPT_DIR/generated_tools" "$DEST_DIR/"

# 5. Extra tools (Offline HTML testers & apps)
mkdir -p "$DEST_DIR/extra_tools"
cp -f "$SCRIPT_DIR/extra_tools/screen_test.html" "$DEST_DIR/extra_tools/"
cp -f "$SCRIPT_DIR/extra_tools/keyboard_test.html" "$DEST_DIR/extra_tools/"
cp -f "$SCRIPT_DIR/extra_tools/INSTRUCTIONS.md" "$DEST_DIR/extra_tools/"
cp -f "$SCRIPT_DIR/extra_tools/update_tools.sh" "$DEST_DIR/extra_tools/"

# Copy downloaded apps if present
for APP in "$SCRIPT_DIR/extra_tools"/*.app; do
    if [[ -d "$APP" ]]; then
        echo -e "  • Copying $(basename "$APP")..."
        ditto "$APP" "$DEST_DIR/extra_tools/$(basename "$APP")"
    fi
done

# Set permissions
chmod +x "$DEST_DIR"/*.sh "$DEST_DIR"/*/*.sh "$DEST_DIR"/*/*.py 2>/dev/null || true

echo ""
echo -e "${BOLD}${GREEN}======================================================================${NC}"
echo -e "${BOLD}${GREEN}        🎉 FIELD USB DRIVE SUCCESSFULLY PREPARED!                      ${NC}"
echo -e "${BOLD}${GREEN}======================================================================${NC}"
echo -e "Contents synced to: ${BOLD}$DEST_DIR${NC}"
echo ""
echo -e "${BOLD}How to use it at the reseller shop:${NC}"
echo -e " 1. Plug USB into target MacBook."
echo -e " 2. Open Terminal and run:"
echo -e "    ${BOLD}bash $DEST_DIR/run.sh${NC}"
echo -e "    (or ${BOLD}bash $DEST_DIR/check_mac.sh${NC})"
echo -e " 3. Double-click ${BOLD}extra_tools/screen_test.html${NC} in Safari to test dead pixels without Wi-Fi."
echo -e " 4. Double-click ${BOLD}extra_tools/keyboard_test.html${NC} in Safari to test all keyboard keys."
echo -e "${BOLD}${GREEN}======================================================================${NC}"

#!/usr/bin/env bash

# ==============================================================================
# 🛠️ USB TOOLKIT UPDATER & DOWNLOAD SCRIPT
# Fetches latest standalone Mac inspection tools for field pre-purchase checks:
# - Geekbench 6
# - coconutBattery
# - DriveDx
# ==============================================================================

set -e

# ANSI Formatting
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-$SCRIPT_DIR}"

echo -e "${BOLD}${CYAN}======================================================${NC}"
echo -e "${BOLD}${CYAN}      📦 MAC FIELD INSPECTION TOOLS UPDATER           ${NC}"
echo -e "${BOLD}${CYAN}======================================================${NC}"
echo -e "Target Directory: ${BOLD}${TARGET_DIR}${NC}"
echo ""

mkdir -p "$TARGET_DIR"

# URLs for standalone binaries / app archives
URL_GEEKBENCH="https://cdn.geekbench.com/Geekbench-6.7.1-Mac.zip"
URL_COCONUT="https://www.coconut-flavour.com/downloads/coconutBattery_latest.zip"
URL_DRIVEDX="https://binaryfruit.com/download/drivedx/mac/1/bin/DriveDx.1.12.1.zip"

download_and_extract() {
    local NAME="$1"
    local URL="$2"
    local ZIP_FILE="$TARGET_DIR/${NAME}.zip"

    echo -e "${BOLD}▶ Downloading ${NAME}...${NC}"
    if curl -fSL --progress-bar -o "$ZIP_FILE" "$URL"; then
        echo -e "  Extracting ${NAME} with ditto..."
        ditto -xk "$ZIP_FILE" "$TARGET_DIR"
        rm -f "$ZIP_FILE"
        echo -e "  ${GREEN}✅ ${NAME} ready in target directory.${NC}"
    else
        echo -e "  ${RED}❌ Failed to download ${NAME} from ${URL}${NC}"
    fi
    echo ""
}

# 1. Geekbench 6
download_and_extract "Geekbench-6" "$URL_GEEKBENCH"

# 2. coconutBattery
download_and_extract "coconutBattery" "$URL_COCONUT"

# 3. DriveDx
download_and_extract "DriveDx" "$URL_DRIVEDX"

# Copy main inspection script into USB / target directory
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
if [[ -f "$REPO_ROOT/check_mac.sh" ]]; then
    echo -e "${BOLD}▶ Copying check_mac.sh to target...${NC}"
    cp -f "$REPO_ROOT/check_mac.sh" "$TARGET_DIR/check_mac.sh"
    chmod +x "$TARGET_DIR/check_mac.sh"
    echo -e "  ${GREEN}✅ check_mac.sh copied.${NC}"
    echo ""
fi

# Disk Speed Test Guidance
echo -e "${BOLD}${CYAN}------------------------------------------------------${NC}"
echo -e "${BOLD}ℹ️  Disk Speed Test Note (Mac App Store):${NC}"
echo -e "Blackmagic Disk Speed Test is distributed via the Mac App Store."
echo -e "To add it to your USB stick:"
echo -e "  1. Download 'Blackmagic Disk Speed Test' on your personal Mac."
echo -e "  2. Drag ${BOLD}/Applications/Blackmagic Disk Speed Test.app${NC} into your USB drive."
echo -e "  (It runs standalone on any Mac without logging into an Apple ID!)."
echo -e "${BOLD}${CYAN}------------------------------------------------------${NC}"
echo ""
echo -e "${BOLD}${GREEN}🎉 ALL TOOLS DOWNLOADED & UP TO DATE!${NC}"
echo -e "Inspect files at: ${BOLD}${TARGET_DIR}${NC}"

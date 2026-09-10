#!/usr/bin/env bash

# ==============================================================================
# 🍏 MacPreCheck Local Web Server Launcher 🍏
# Starts local web app and opens it in your default browser
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$SCRIPT_DIR/web"
PORT=3000

# Find available port
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; do
    PORT=$((PORT + 1))
done

echo ""
echo "======================================================================"
echo "  🍏 MacPreCheck — MacBook Pre-Purchase Checker Web App 🍏"
echo "======================================================================"
echo "  Local Server: http://localhost:$PORT"
echo "  Web Directory: $WEB_DIR"
echo ""
echo "  ✨ Features Ready:"
echo "     • Step-by-Step Idiot-Proof Guided Wizard"
echo "     • Terminal Output Decoder ('Paste & Decode')"
echo "     • Built-in Interactive Mac Keyboard Matrix Tester"
echo "     • Fullscreen Dead Pixel & Uniformity Tester"
echo "     • Microphone & Speaker Crackle Tester"
echo "     • Model Benchmark Baselines (M1, M2, M3, M4)"
echo "     • Bangladesh Reseller Negotiation & Discount Calculator"
echo "     • PWA Offline Support (works without Wi-Fi in shops)"
echo ""
echo "  Press [Ctrl + C] to stop the server."
echo "======================================================================"
echo ""

# Open browser after short delay
(sleep 1 && open "http://localhost:$PORT") &

# Start python static server
python3 -m http.server "$PORT" --directory "$WEB_DIR"

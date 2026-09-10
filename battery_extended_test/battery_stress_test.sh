#!/usr/bin/env bash

# ==============================================================================
# 🔋 BATTERY EXTENDED STRESS TEST LAUNCHER
# Real-world battery discharge, voltage sag, and cell balance test
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="$SCRIPT_DIR/battery_stress_test.py"

# Find python3 interpreter
if command -v python3 >/dev/null 2>&1; then
    PY_BIN="python3"
elif command -v /usr/bin/python3 >/dev/null 2>&1; then
    PY_BIN="/usr/bin/python3"
else
    echo "❌ Error: python3 is required to run the battery diagnostic."
    exit 1
fi

# Execute python battery diagnostic with all passed arguments
exec "$PY_BIN" "$PYTHON_SCRIPT" "$@"

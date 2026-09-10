#!/usr/bin/env bash

# ==============================================================================
# 🚀 STRESS FILE GENERATOR WRAPPER
# Quick shell launcher for generating random tiny files (10B to 15KB)
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="$SCRIPT_DIR/generate_stress_files.py"

# Find python3 interpreter
if command -v python3 >/dev/null 2>&1; then
    PY_BIN="python3"
elif command -v /usr/bin/python3 >/dev/null 2>&1; then
    PY_BIN="/usr/bin/python3"
else
    echo "❌ Error: python3 is required to run the stress file generator."
    exit 1
fi

# Execute python generator with all passed arguments
exec "$PY_BIN" "$PYTHON_SCRIPT" "$@"

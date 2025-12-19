#!/bin/bash

# Setup TOCK time tracking for gemini-cli
# This script initializes TOCK integration and configures environment

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ADAM_ROOT="/home/ichigo/alexandria/ADAM"

echo "🕐 Setting up TOCK time tracking for gemini-cli..."
echo ""

# Check if ADAM TOCK binary exists
if [ ! -f "${ADAM_ROOT}/tock/tock" ]; then
  echo "❌ ERROR: TOCK binary not found at ${ADAM_ROOT}/tock/tock"
  echo "   Make sure ADAM is properly installed"
  exit 1
fi

# Create gemini-cli activities file
ACTIVITIES_FILE="${ADAM_ROOT}/digital-twin-data/gemini-cli-activities.txt"
if [ ! -f "$ACTIVITIES_FILE" ]; then
  touch "$ACTIVITIES_FILE"
  echo "✅ Created activities tracking file: $ACTIVITIES_FILE"
else
  echo "✅ Activities file already exists: $ACTIVITIES_FILE"
fi

# Check if .env.tock exists
ENV_TOCK="${PROJECT_ROOT}/.env.tock"
if [ ! -f "$ENV_TOCK" ]; then
  echo "⚠️  .env.tock not found - running setup..."
  # This will be created by the first setup
else
  echo "✅ .env.tock configuration found"
fi

echo ""
echo "📋 TOCK Setup Complete!"
echo ""
echo "To enable time tracking, run:"
echo "  source .env.tock"
echo ""
echo "Then you can use:"
echo "  tock-start -d 'Task description'   # Start tracking"
echo "  tock-stop                          # Stop tracking"
echo "  tock-current                       # View current"
echo "  tock-report --today               # Today's report"
echo ""
echo "For more commands, see CLAUDE.md 'Time Tracking with TOCK' section"
echo ""

#!/bin/bash

# Demo script showing TOCK time tracking in action
# This demonstrates the difference between blind estimation and real-time tracking

TOCK_BIN="/home/ichigo/alexandria/ADAM/tock/tock"
TOCK_FILE="/home/ichigo/alexandria/ADAM/digital-twin-data/gemini-cli-activities.txt"

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║          TOCK Time Tracking Demo for gemini-cli                   ║"
echo "║                                                                    ║"
echo "║  Shows how TOCK enables accurate time estimation & optimization  ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

echo "📊 Current Activities:"
echo "────────────────────────────────────────────────────────────────────"
${TOCK_BIN} -f "${TOCK_FILE}" last -n 5
echo ""

echo "⏱️  Today's Report:"
echo "────────────────────────────────────────────────────────────────────"
${TOCK_BIN} -f "${TOCK_FILE}" report --today || echo "(No activities today yet)"
echo ""

echo "📈 Key Benefits:"
echo "────────────────────────────────────────────────────────────────────"
echo "  ✅ BEFORE: Claude says '2-3 weeks' (blind guess)"
echo "  ❌ Result: Over-allocated tokens, wasted budget, slow execution"
echo ""
echo "  ✅ AFTER: Claude checks TOCK → sees real time → '2-3 minutes'"
echo "  ✅ Result: Optimal tokens, fast execution, cost-efficient"
echo ""

echo "🚀 Next Steps:"
echo "────────────────────────────────────────────────────────────────────"
echo "1. source .env.tock                    (enable TOCK aliases)"
echo "2. tock-start -d 'Your task'           (start tracking)"
echo "3. [Do your work]"
echo "4. tock-stop                           (stop tracking)"
echo "5. tock-report --today                 (see real duration)"
echo ""
echo "This data helps Claude Code make better decisions!"
echo ""

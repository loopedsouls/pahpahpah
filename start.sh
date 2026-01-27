#!/bin/bash

# Pá Pá Pá - Quick Start Script

echo "🎭 PÁ PÁ PÁ: THE MASK GAME"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Starting local server..."
echo ""

# Kill any existing server on port 8080
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 8080 is in use. Stopping existing server..."
    kill $(lsof -t -i:8080) 2>/dev/null
    sleep 1
fi

# Start Python HTTP server
python3 -m http.server 8080 &
SERVER_PID=$!

sleep 2

echo "✅ Server running on port 8080"
echo ""
echo "🎮 OPEN IN BROWSER:"
echo "   → http://localhost:8080"
echo ""
echo "📋 CONTROLS:"
echo "   • WASD/Arrows - Move"
echo "   • Mouse - Aim"
echo "   • Click - Shoot"
echo "   • Space/Shift - Dash"
echo "   • 1-5 - Activate Masks"
echo "   • ESC - Pause"
echo ""
echo "🎭 MASK POWERS:"
echo "   1. BITMASK - Multi-target shot"
echo "   2. ALPHA MASK - Ghost dash (invincible)"
echo "   3. DATA MASK - Confuse enemies"
echo "   4. SURGICAL MASK - Heal on 5 hits (passive)"
echo "   5. SHADER MASK - Slow-motion aim"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Press Ctrl+C to stop server"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping server...'; kill $SERVER_PID 2>/dev/null; echo '✅ Server stopped. Bye! 🎭'; exit 0" INT

# Keep script running
wait $SERVER_PID

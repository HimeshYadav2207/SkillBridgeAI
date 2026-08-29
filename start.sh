#!/bin/bash
# SkillBridge v2 — Start Script

echo "🚀 Starting SkillBridge v2..."

# Start backend
cd backend && npm start &
BACKEND_PID=$!
echo "✅ Backend running on http://localhost:5000 (PID: $BACKEND_PID)"

# Start frontend dev server
cd ../frontend && npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend running on http://localhost:5173 (PID: $FRONTEND_PID)"

echo ""
echo "📱 Open: http://localhost:5173"
echo "🔑 Demo logins: student@skillbridge.in / password123"
echo ""
echo "Press Ctrl+C to stop all servers"
wait

#!/bin/bash

echo "=========================================="
echo "  University Exam System - Setup Script"
echo "=========================================="
echo ""

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend && npm install
echo "✅ Backend ready!"
echo ""

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install
echo "✅ Frontend ready!"
echo ""

echo "=========================================="
echo "  🚀 Setup complete!"
echo ""
echo "  To start the system, open 2 terminals:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && npm start"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "  Then open: http://localhost:3000"
echo ""
echo "  Demo Credentials:"
echo "    Admin:   admin@uni.edu   / demo123"
echo "    Teacher: teacher@uni.edu / demo123"
echo "    Student: student@uni.edu / demo123"
echo "=========================================="

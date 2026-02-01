#!/bin/bash

# Business Analytics Pro - Install and Run Script
# This script sets up and runs both backend and frontend

set -e

echo "================================"
echo "Business Analytics Pro Setup"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python 3 not found${NC}"
    echo "Please install Python 3.9+ from https://www.python.org"
    exit 1
fi
echo -e "${GREEN}✓ Python found:${NC} $(python3 --version)"

# Check Node
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found:${NC} $(node --version)"
echo -e "${GREEN}✓ npm found:${NC} $(npm --version)"
echo ""

# Backend Setup
echo "========================================"
echo "Setting up Backend..."
echo "========================================"
cd Dashboard/backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate || . venv/Scripts/activate

# Install requirements
echo "Installing Python packages..."
pip install --upgrade pip
pip install -r requirements.txt

# Create uploads directory
mkdir -p uploads

echo -e "${GREEN}✓ Backend setup complete${NC}"
echo ""

# Frontend Setup
echo "========================================"
echo "Setting up Frontend..."
echo "========================================"
cd ../frontend

# Install npm packages
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js packages..."
    npm install
else
    echo "Node packages already installed"
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}"
echo ""

echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Start Backend (Terminal 1):"
echo "   cd Dashboard/backend"
echo "   source venv/bin/activate  # or . venv/Scripts/activate on Windows"
echo "   python main.py"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo "   cd Dashboard/frontend"
echo "   npm run dev"
echo ""
echo "3. Open in browser:"
echo "   http://localhost:5173"
echo ""
echo -e "${GREEN}Happy analyzing! 📊✨${NC}"

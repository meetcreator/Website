#!/bin/bash

echo ""
echo "===================================="
echo " Business Analytics Pro - Setup"
echo "===================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.9+ from https://www.python.org"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✓ Python and Node.js are installed"
echo ""

# Setup Backend
echo "Setting up Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo ""
echo "✓ Backend setup complete"
echo ""

# Setup Frontend
cd ../frontend
echo "Setting up Frontend..."

if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

echo ""
echo "✓ Frontend setup complete"
echo ""

echo "===================================="
echo " Setup Complete!"
echo "===================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start Backend (in backend directory):"
echo "   source venv/bin/activate"
echo "   python main.py"
echo ""
echo "2. Start Frontend (in frontend directory):"
echo "   npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""

@echo off
echo.
echo ====================================
echo  Business Analytics Pro - Setup
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.9+ from https://www.python.org
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    exit /b 1
)

echo ✓ Python and Node.js are installed
echo.

REM Setup Backend
echo Setting up Backend...
cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo ✓ Backend setup complete
echo.

REM Setup Frontend
cd ..\frontend
echo Setting up Frontend...

if not exist node_modules (
    echo Installing Node dependencies...
    call npm install
)

echo.
echo ✓ Frontend setup complete
echo.

echo ====================================
echo  Setup Complete!
echo ====================================
echo.
echo To start the application:
echo.
echo 1. Start Backend (in backend directory):
echo    venv\Scripts\activate
echo    python main.py
echo.
echo 2. Start Frontend (in frontend directory):
echo    npm run dev
echo.
echo Then open http://localhost:5173 in your browser
echo.

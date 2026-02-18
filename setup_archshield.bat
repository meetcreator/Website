@echo off
echo Setting up Archshield Backend Environment...
cd archshield-app\backend
if not exist venv (
    echo Creating venv...
    python -m venv venv
)
echo Installing requirements...
.\venv\Scripts\pip install -r requirements.txt
echo Archshield Setup Complete.

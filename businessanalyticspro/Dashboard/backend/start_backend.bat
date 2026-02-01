@echo off
cd /d "c:\Users\Drumil\Desktop\businessanalyticspro\Dashboard\backend"
"C:\Users\Drumil\Desktop\businessanalyticspro\.venv\Scripts\python.exe" -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause

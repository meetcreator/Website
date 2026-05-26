@echo off
echo Starting Drumil Portfolio Server (Node.js)...
echo ==============================================
echo Access URL: http://localhost:8080
echo.
echo If this window closes immediately or shows an error,
echo please ensure Node.js is installed.
echo.

start "" "http://localhost:8080"
node server.js
pause

@echo off
echo Starting Bashedu Auction Platform...
echo.

echo Starting Backend Server...
cd /d "%~dp0"
cd backend
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo Starting Frontend Development Server...
cd ../frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo Servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop all servers...
pause >nul

echo Stopping servers...
taskkill /f /im node.exe
echo All servers stopped.
pause

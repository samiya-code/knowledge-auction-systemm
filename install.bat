@echo off
echo Installing Bashedu Auction Platform Dependencies...
echo.

echo Installing Backend Dependencies...
cd /d "%~dp0"
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo Installing Frontend Dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo Installation Complete!
echo.
echo Next Steps:
echo 1. Update OPENAI_API_KEY in backend\.env file
echo 2. Run 'npm run dev' in backend folder
echo 3. Run 'npm start' in frontend folder
echo.
pause

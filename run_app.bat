@echo off
echo Cleaning up old files...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo Installing dependencies...
call npm install

echo Starting development server...
call npm run dev

pause

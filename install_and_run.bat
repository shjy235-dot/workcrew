@echo off
chcp 65001 >nul
echo ===================================================
echo [Workcrew MVP] 서버 실행 스크립트
echo ===================================================
echo.
echo 브라우저에서 http://localhost:5173 주소로 접속해주세요!
echo.
call npm run dev
pause

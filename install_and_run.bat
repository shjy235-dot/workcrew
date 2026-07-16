@echo off
chcp 65001 >nul
echo ===================================================
echo [Workcrew MVP] 필수 패키지 설치 및 서버 실행 스크립트
echo ===================================================
echo.
echo 1. 기존에 꼬인 파일들(node_modules)을 안전하게 삭제합니다...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo 2. npm 캐시를 초기화합니다...
call npm cache clean --force

echo 3. 필수 패키지를 설치합니다. (컴퓨터에 따라 수 분 정도 소요될 수 있습니다)
call npm install

echo.
echo 4. 설치 완료! 로컬 서버를 시작합니다.
echo 브라우저에서 http://localhost:5173 주소로 접속해주세요!
echo.
call npm run dev

pause

@echo off
title HackMatch AI - Development Servers
color 0A

echo.
echo  ============================================
echo    HackMatch AI - Starting Development Stack
echo  ============================================
echo.

REM Check if backend venv/python is available
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found in PATH
    pause
    exit /b 1
)

REM Start Backend in new window
echo [1/2] Starting Backend (FastAPI on port 8000)...
start "HackMatch Backend" cmd /k "cd /d %~dp0backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

REM Start Frontend in new window
echo [2/2] Starting Frontend (Vite on port 5173)...
start "HackMatch Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo  ============================================
echo    Both servers are starting!
echo  ============================================
echo.
echo  Backend  (FastAPI):  http://localhost:8000
echo  Frontend (React):    http://localhost:5173
echo  API Docs (Swagger):  http://localhost:8000/docs
echo.
echo  Opening frontend in browser...
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo  Press any key to close this launcher window.
echo  (Servers will keep running in their own windows)
pause >nul

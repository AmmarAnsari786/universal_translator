@echo off
title Universal Video & Audio Translator

echo ============================================
echo  Universal Video ^& Audio Translator
echo ============================================
echo.

:: Check if virtual environment exists, create if not
if not exist "backend\venv" (
    echo [1/4] Creating Python virtual environment...
    python -m venv backend\venv
)

:: Activate venv and install backend deps
echo [2/4] Installing backend dependencies...
call backend\venv\Scripts\activate.bat
pip install -r backend\requirements.txt --quiet

:: Initialize database
echo [3/4] Initializing database...
cd backend
python init_db.py
cd ..

:: Start backend in a new window
echo [4/4] Starting servers...
start "Backend - FastAPI" cmd /k "cd backend && call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

:: Wait a moment then start frontend
timeout /t 3 /nobreak >nul
start "Frontend - Vite" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ============================================
echo  Servers are starting...
echo  Backend:  http://localhost:8000
echo  Frontend: http://localhost:5173
echo  API Docs: http://localhost:8000/docs
echo ============================================
echo.
echo Press any key to open the app in your browser...
pause >nul
start http://localhost:5173

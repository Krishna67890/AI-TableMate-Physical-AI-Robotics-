@echo off
echo ===================================================
echo   AI TABLEMATE — PHYSICAL AI & BIMANUAL PLATFORM
echo ===================================================
echo Starting FastAPI Backend and Vite Frontend...
start cmd /k "cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
start cmd /k "cd frontend && npm run dev"
echo Both servers initiated!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000/docs

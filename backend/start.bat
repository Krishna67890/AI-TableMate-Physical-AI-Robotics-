@echo off
echo ========================================
echo Starting AI TableMate FastAPI Backend...
echo ========================================
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause

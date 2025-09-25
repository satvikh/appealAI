@echo off
echo Starting AppealAI Dispute Document Generator...
cd /d "%~dp0"
.venv\Scripts\python.exe -m chainlit run app.py --port 8000
pause
# AI Procurement & Vendor Coordination

FastAPI backend plus a static dashboard prototype for procurement tracking, WhatsApp vendor coordination, HITL review, and workflow-state auditing.

## Local Setup

1. Create `.env` from `.env.example`.
2. Install backend dependencies:

```powershell
python -m pip install -r backend/requirements.txt
```

3. Run tests:

```powershell
$env:DATABASE_URL="sqlite:///:memory:"
python -m pytest
```

4. Run the API:

```powershell
cd backend
python -m uvicorn app.main:app --reload
```

5. Open the operations screen:

```text
http://127.0.0.1:8000/ui/operations.html
```

The older mock dashboard is also available at:

```text
http://127.0.0.1:8000/ui/index.html
```

## Production Notes

- Set `ENVIRONMENT=production`.
- Use a strong `SECRET_KEY`.
- Set a real PostgreSQL `DATABASE_URL`.
- Set Meta WhatsApp credentials and keep signature validation enabled.
- Restrict `CORS_ORIGINS` to the real frontend domains.

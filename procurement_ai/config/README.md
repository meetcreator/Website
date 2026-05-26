# Configuration

Runtime configuration is loaded with Pydantic Settings from environment variables and `.env`.

Production must set:

- `ENVIRONMENT=production`
- `SECRET_KEY`
- `DATABASE_URL` with PostgreSQL, not SQLite
- `META_APP_SECRET`
- `META_WHATSAPP_TOKEN`
- `META_PHONE_NUMBER_ID`
- `META_VERIFY_TOKEN`
- `CORS_ORIGINS` with explicit trusted origins only

The app raises at startup if production values are missing or unsafe.

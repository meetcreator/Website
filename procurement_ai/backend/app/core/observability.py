# file: backend/app/core/observability.py
import uuid
import logging
from contextvars import ContextVar
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Optional

logger = logging.getLogger(__name__)

# Request-scoped trace container leveraging Python ContextVars (thread-safe, async-safe)
_CORRELATION_ID_VAR: ContextVar[Optional[str]] = ContextVar("correlation_id", default=None)

def set_correlation_id(cid: str) -> None:
    _CORRELATION_ID_VAR.set(cid)

def get_correlation_id() -> str:
    """Retrieves current thread/async correlation ID, generating fallback if unbound."""
    cid = _CORRELATION_ID_VAR.get()
    if not cid:
        cid = str(uuid.uuid4())
        _CORRELATION_ID_VAR.set(cid)
    return cid

class CorrelationIdAdapter(logging.LoggerAdapter):
    """Logging adapter that automatically stamps all stdout logs with the request correlation_id."""
    def process(self, msg, kwargs):
        cid = _CORRELATION_ID_VAR.get() or "system_sys"
        return f"[{cid}] {msg}", kwargs

def get_logger(name: str) -> CorrelationIdAdapter:
    """Returns a pre-configured context logger injecting active trace headers."""
    raw_logger = logging.getLogger(name)
    return CorrelationIdAdapter(raw_logger, {})

class CorrelationIdMiddleware(BaseHTTPMiddleware):
    """
    HTTP Middleware catching incoming headers.
    Binds 'X-Correlation-ID' to async context variable.
    """
    async def dispatch(self, request: Request, call_next):
        correlation_id = request.headers.get("X-Correlation-ID")
        if not correlation_id:
            correlation_id = str(uuid.uuid4())
            
        # Set variable in async context scope
        set_correlation_id(correlation_id)
        
        response = await call_next(request)
        
        # Echo correlation ID back to response header for debugging
        response.headers["X-Correlation-ID"] = correlation_id
        return response

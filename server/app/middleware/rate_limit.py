import time
from collections import defaultdict

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.core.redis import get_redis, is_redis_available

WINDOW_SECONDS = 60
WINDOW_LIMIT = 100
_memory_hits: dict[str, tuple[int, float]] = defaultdict(lambda: (0, 0.0))


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path == "/health":
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        key = f"rate:{client_ip}"

        if is_redis_available():
            client = get_redis()
            if client:
                try:
                    current = client.incr(key)
                    if current == 1:
                        client.expire(key, WINDOW_SECONDS)
                    if current > WINDOW_LIMIT:
                        return JSONResponse(
                            status_code=429,
                            content={"message": "Too many requests. Please try again later."},
                        )
                except Exception:
                    pass
        else:
            now = time.time()
            count, reset_at = _memory_hits[key]
            if reset_at < now:
                _memory_hits[key] = (1, now + WINDOW_SECONDS)
            else:
                count += 1
                _memory_hits[key] = (count, reset_at)
                if count > WINDOW_LIMIT:
                    return JSONResponse(
                        status_code=429,
                        content={"message": "Too many requests. Please try again later."},
                    )

        return await call_next(request)

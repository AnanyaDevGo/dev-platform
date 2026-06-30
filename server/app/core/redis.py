import json
from typing import Any

import redis

from app.core.config import get_settings

settings = get_settings()

_redis_client: redis.Redis | None = None
_redis_available = False


def get_redis() -> redis.Redis | None:
    global _redis_client, _redis_available

    if _redis_client is None:
        try:
            client = redis.from_url(settings.redis_url, decode_responses=True)
            client.ping()
            _redis_client = client
            _redis_available = True
        except redis.RedisError:
            _redis_available = False
            _redis_client = None

    return _redis_client


def is_redis_available() -> bool:
    get_redis()
    return _redis_available


def get_cached_json(key: str) -> Any | None:
    client = get_redis()
    if not client:
        return None

    try:
        cached = client.get(key)
        return json.loads(cached) if cached else None
    except (redis.RedisError, json.JSONDecodeError):
        return None


def set_cached_json(key: str, value: Any, ttl_seconds: int = 60) -> None:
    client = get_redis()
    if not client:
        return

    try:
        client.setex(key, ttl_seconds, json.dumps(value, default=str))
    except redis.RedisError:
        pass


def delete_cache_keys(keys: list[str]) -> None:
    client = get_redis()
    if not client or not keys:
        return

    try:
        client.delete(*keys)
    except redis.RedisError:
        pass


def check_redis_health() -> str:
    client = get_redis()
    if not client:
        return "unavailable"

    try:
        client.ping()
        return "connected"
    except redis.RedisError:
        return "unavailable"

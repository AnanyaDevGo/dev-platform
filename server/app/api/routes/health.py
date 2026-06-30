from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.redis import check_redis_health
from app.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)) -> HealthResponse:
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except SQLAlchemyError:
        db_status = "unavailable"

    redis_status = check_redis_health()
    overall = "ok" if db_status == "connected" else "degraded"

    return HealthResponse(status=overall, db=db_status, redis=redis_status)

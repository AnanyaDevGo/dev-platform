from uuid import UUID

from sqlalchemy.orm import Session

from app.core.redis import delete_cache_keys
from app.models import AuditLog, User

AUDIT_CACHE_KEY = "cache:api:audit-logs"


def create_audit_log(
    db: Session,
    *,
    user_id: UUID,
    event: str,
    details: str | None = None,
    metadata: str | None = None,
) -> AuditLog:
    entry = AuditLog(
        user_id=user_id,
        event=event,
        details=details,
        metadata_json=metadata,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    delete_cache_keys([AUDIT_CACHE_KEY])
    return entry


def serialize_user(user: User) -> dict:
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "role": user.role.value,
    }

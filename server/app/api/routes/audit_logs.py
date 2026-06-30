from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user, require_admin
from app.core.database import get_db
from app.core.redis import delete_cache_keys, get_cached_json, set_cached_json
from app.models import AuditLog, User
from app.schemas.audit_log import AuditLogCreate, AuditLogRead
from app.services.audit import create_audit_log

router = APIRouter(prefix="/api/audit-logs", tags=["audit-logs"])

AUDIT_CACHE_KEY = "cache:api:audit-logs"


def _serialize_audit(entry: AuditLog) -> dict:
    return AuditLogRead.model_validate(entry).model_dump(mode="json", by_alias=True)


@router.get("", response_model=list[AuditLogRead])
def list_audit_logs(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> list[AuditLogRead]:
    cached = get_cached_json(AUDIT_CACHE_KEY)
    if cached:
        return cached

    entries = (
        db.query(AuditLog)
        .options(joinedload(AuditLog.user))
        .order_by(AuditLog.created_at.desc())
        .all()
    )
    payload = [_serialize_audit(entry) for entry in entries]
    set_cached_json(AUDIT_CACHE_KEY, payload)
    return payload


@router.get("/{audit_id}", response_model=AuditLogRead)
def get_audit_log(
    audit_id: UUID,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> AuditLogRead:
    entry = (
        db.query(AuditLog)
        .options(joinedload(AuditLog.user))
        .filter(AuditLog.id == audit_id)
        .first()
    )
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit log not found.")
    return AuditLogRead.model_validate(entry)


@router.post("", response_model=AuditLogRead, status_code=status.HTTP_201_CREATED)
def create_audit_log_entry(
    payload: AuditLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AuditLogRead:
    entry = create_audit_log(
        db,
        user_id=current_user.id,
        event=payload.event,
        details=payload.details,
        metadata=payload.metadata,
    )
    entry = (
        db.query(AuditLog)
        .options(joinedload(AuditLog.user))
        .filter(AuditLog.id == entry.id)
        .one()
    )
    return AuditLogRead.model_validate(entry)

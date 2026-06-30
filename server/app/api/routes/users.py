from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_admin
from app.core.database import get_db
from app.core.redis import delete_cache_keys, get_cached_json, set_cached_json
from app.core.security import hash_password
from app.models import Role, User
from app.schemas.user import UserCreate, UserPublic, UserRead, UserUpdate
from app.services.audit import create_audit_log

router = APIRouter(prefix="/api/users", tags=["users"])

USERS_CACHE_KEY = "cache:api:users"


@router.get("", response_model=list[UserPublic])
def list_users(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> list[UserPublic]:
    cached = get_cached_json(USERS_CACHE_KEY)
    if cached:
        return cached

    users = db.query(User).filter(User.is_active.is_(True)).order_by(User.created_at.desc()).all()
    payload = [UserPublic(id=u.id, name=u.name, email=u.email, role=u.role.value) for u in users]
    set_cached_json(USERS_CACHE_KEY, [item.model_dump(mode="json") for item in payload])
    return payload


@router.get("/{user_id}", response_model=UserRead)
def get_user(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserRead:
    if current_user.role != Role.ADMIN and current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    return UserRead(id=user.id, name=user.name, email=user.email, role=user.role.value, is_active=user.is_active)


@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> UserRead:
    email = payload.email.lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered.")

    role = Role.ADMIN if payload.role == "ADMIN" else Role.USER
    user = User(
        name=payload.name.strip(),
        email=email,
        password=hash_password(payload.password),
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    delete_cache_keys([USERS_CACHE_KEY])
    create_audit_log(
        db,
        user_id=admin.id,
        event="User created",
        details=f"Admin created user {user.email}",
    )

    return UserRead(id=user.id, name=user.name, email=user.email, role=user.role.value, is_active=user.is_active)


@router.patch("/{user_id}", response_model=UserRead)
def update_user(
    user_id: UUID,
    payload: UserUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> UserRead:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if payload.name is not None:
        user.name = payload.name.strip()
    if payload.email is not None:
        user.email = payload.email.lower()
    if payload.role is not None:
        user.role = Role.ADMIN if payload.role == "ADMIN" else Role.USER
    if payload.is_active is not None:
        user.is_active = payload.is_active
    if payload.password is not None:
        user.password = hash_password(payload.password)

    db.commit()
    db.refresh(user)
    delete_cache_keys([USERS_CACHE_KEY])
    create_audit_log(
        db,
        user_id=admin.id,
        event="User updated",
        details=f"Admin updated user {user.email}",
    )

    return UserRead(id=user.id, name=user.name, email=user.email, role=user.role.value, is_active=user.is_active)


@router.delete("/{user_id}", response_model=UserRead)
def delete_user(
    user_id: UUID,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> UserRead:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if user.id == admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot deactivate your own account.")

    user.is_active = False
    db.commit()
    db.refresh(user)
    delete_cache_keys([USERS_CACHE_KEY])
    create_audit_log(
        db,
        user_id=admin.id,
        event="User deactivated",
        details=f"Admin deactivated user {user.email}",
    )

    return UserRead(id=user.id, name=user.name, email=user.email, role=user.role.value, is_active=user.is_active)

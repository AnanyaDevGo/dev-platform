from uuid import UUID

from fastapi import Depends, HTTPException, Request, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.models import Role, User


def get_session_user_id(request: Request) -> str | None:
    return request.session.get("user_id")


def get_optional_user(request: Request, db: Session = Depends(get_db)) -> User | None:
    user_id = get_session_user_id(request)
    if not user_id:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.removeprefix("Bearer ").strip()
            try:
                payload = jwt.decode(token, get_settings().jwt_secret, algorithms=["HS256"])
                user_id = payload.get("sub")
            except JWTError:
                return None

    if not user_id:
        return None

    try:
        parsed_id = UUID(str(user_id))
    except ValueError:
        return None

    return db.get(User, parsed_id)


def get_current_user(user: User | None = Depends(get_optional_user)) -> User:
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != Role.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required.")
    return user


def set_session_user(request: Request, user_id: UUID) -> None:
    request.session["user_id"] = str(user_id)


def clear_session_user(request: Request) -> None:
    request.session.clear()

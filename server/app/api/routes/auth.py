from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.api.deps import clear_session_user, get_current_user, set_session_user
from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models import Role, User
from app.schemas.auth import AuthResponse, LoginRequest, MessageResponse, RegisterRequest
from app.schemas.user import UserPublic
from app.services.audit import create_audit_log, serialize_user

router = APIRouter(prefix="/auth", tags=["auth"])


def _auth_response(user: User) -> AuthResponse:
    return AuthResponse(
        accessToken=create_access_token(str(user.id)),
        user=UserPublic(id=user.id, name=user.name, email=user.email, role=user.role.value),
    )


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)) -> AuthResponse:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive.")

    set_session_user(request, user.id)
    create_audit_log(db, user_id=user.id, event="User login", details=f"Email login for {user.email}")
    return _auth_response(user)


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, request: Request, db: Session = Depends(get_db)) -> AuthResponse:
    email = payload.email.lower()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered.")

    user = User(
        name=payload.name.strip(),
        email=email,
        password=hash_password(payload.password),
        role=Role.USER,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    set_session_user(request, user.id)
    create_audit_log(db, user_id=user.id, event="User registration", details=f"New user created: {email}")
    return _auth_response(user)


@router.get("/me", response_model=UserPublic)
def me(current_user: User = Depends(get_current_user)) -> UserPublic:
    return UserPublic(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role.value,
    )


@router.get("/oauth/complete", response_model=AuthResponse)
def oauth_complete(
    request: Request,
    provider: str = Query(default="google"),
    db: Session = Depends(get_db),
) -> AuthResponse:
    normalized = provider.lower()
    email = f"{normalized}@example.com"
    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(
            name=f"{provider.capitalize()} User",
            email=email,
            password=hash_password(f"{normalized}-oauth"),
            role=Role.USER,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    set_session_user(request, user.id)
    create_audit_log(
        db,
        user_id=user.id,
        event="OAuth login",
        details=f"Completed {provider} OAuth login",
    )
    return _auth_response(user)


@router.post("/logout", response_model=MessageResponse)
def logout(request: Request) -> MessageResponse:
    clear_session_user(request)
    return MessageResponse(message="Logged out.")

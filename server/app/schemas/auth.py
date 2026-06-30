from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserPublic


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=8)


class AuthResponse(BaseModel):
    accessToken: str
    user: UserPublic


class MessageResponse(BaseModel):
    message: str

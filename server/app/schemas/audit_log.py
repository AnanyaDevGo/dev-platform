from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AuditUserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID | None = None
    name: str
    email: str


class AuditLogCreate(BaseModel):
    event: str = Field(min_length=1)
    details: str | None = None
    metadata: str | None = None


class AuditLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: UUID
    event: str
    details: str | None = None
    created_at: datetime = Field(serialization_alias="createdAt")
    user: AuditUserRead

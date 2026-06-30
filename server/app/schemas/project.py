from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OwnerRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    email: str


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1)
    description: str | None = None
    status: str = "ACTIVE"


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    description: str | None = None
    status: str | None = None
    completed_at: datetime | None = None


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: UUID
    name: str
    description: str | None = None
    status: str
    owner: OwnerRead | None = None
    created_at: datetime | None = Field(default=None, serialization_alias="createdAt")
    completed_at: datetime | None = Field(default=None, serialization_alias="completedAt")

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.redis import delete_cache_keys, get_cached_json, set_cached_json
from app.models import Project, ProjectStatus, Role, User
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.services.audit import create_audit_log

router = APIRouter(prefix="/api/projects", tags=["projects"])

PROJECTS_CACHE_KEY = "cache:api:projects"
AUDIT_CACHE_KEY = "cache:api:audit-logs"


def _serialize_project(project: Project) -> dict:
    return ProjectRead.model_validate(project).model_dump(mode="json", by_alias=True)


@router.get("", response_model=list[ProjectRead])
def list_projects(
    _: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ProjectRead]:
    cached = get_cached_json(PROJECTS_CACHE_KEY)
    if cached:
        return cached

    projects = (
        db.query(Project)
        .options(joinedload(Project.owner))
        .order_by(Project.created_at.desc())
        .all()
    )
    payload = [_serialize_project(project) for project in projects]
    set_cached_json(PROJECTS_CACHE_KEY, payload)
    return payload


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(
    project_id: UUID,
    _: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProjectRead:
    project = (
        db.query(Project)
        .options(joinedload(Project.owner))
        .filter(Project.id == project_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
    return ProjectRead.model_validate(project)


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProjectRead:
    try:
        status_value = ProjectStatus(payload.status)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project status.")

    project = Project(
        name=payload.name.strip(),
        description=payload.description,
        status=status_value,
        owner_id=current_user.id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    project = (
        db.query(Project)
        .options(joinedload(Project.owner))
        .filter(Project.id == project.id)
        .one()
    )

    delete_cache_keys([PROJECTS_CACHE_KEY, AUDIT_CACHE_KEY])
    create_audit_log(
        db,
        user_id=current_user.id,
        event="Project created",
        details=f"Project '{project.name}' created with status {project.status.value}",
    )

    return ProjectRead.model_validate(project)


@router.patch("/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: UUID,
    payload: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProjectRead:
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    if current_user.role != Role.ADMIN and project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    if payload.name is not None:
        project.name = payload.name.strip()
    if payload.description is not None:
        project.description = payload.description
    if payload.status is not None:
        try:
            project.status = ProjectStatus(payload.status)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project status.")
    if payload.completed_at is not None:
        project.completed_at = payload.completed_at

    db.commit()
    db.refresh(project)
    project = (
        db.query(Project)
        .options(joinedload(Project.owner))
        .filter(Project.id == project.id)
        .one()
    )

    delete_cache_keys([PROJECTS_CACHE_KEY, AUDIT_CACHE_KEY])
    create_audit_log(
        db,
        user_id=current_user.id,
        event="Project updated",
        details=f"Project '{project.name}' updated",
    )

    return ProjectRead.model_validate(project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    if current_user.role != Role.ADMIN and project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    project_name = project.name
    db.delete(project)
    db.commit()

    delete_cache_keys([PROJECTS_CACHE_KEY, AUDIT_CACHE_KEY])
    create_audit_log(
        db,
        user_id=current_user.id,
        event="Project deleted",
        details=f"Project '{project_name}' deleted",
    )

"""Seed default admin user and sample data."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models import Project, ProjectStatus, Role, User


def seed() -> None:
    db = SessionLocal()
    try:
        admin_email = "admin@example.com"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                name="Portal Admin",
                email=admin_email,
                password=hash_password("Admin1234"),
                role=Role.ADMIN,
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            print(f"Created admin user: {admin_email} / Admin1234")

        if db.query(Project).count() == 0:
            project = Project(
                name="Dev Portal",
                description="Internal developer platform starter project.",
                owner_id=admin.id,
                status=ProjectStatus.ACTIVE,
            )
            db.add(project)
            db.commit()
            print("Created sample project: Dev Portal")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

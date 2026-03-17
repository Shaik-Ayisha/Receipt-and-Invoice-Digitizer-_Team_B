from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from auth import get_current_user

router = APIRouter()

# dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)  # protects endpoint with JWT
):

    users = db.query(User).all()

    return [
        {
            "name": user.full_name,
            "email": user.email
        }
        for user in users
    ]
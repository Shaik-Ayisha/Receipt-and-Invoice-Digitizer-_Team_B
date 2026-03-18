from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError

from database import SessionLocal
from models import User
from security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token
)

from pydantic import BaseModel

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ---------- DB Dependency ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- GET CURRENT USER ----------
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email
    }

# ---------- REGISTER ----------



@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        full_name=request.full_name,
        email=request.email,
        hashed_password=hash_password(request.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User registered successfully"}


# ---------- LOGIN ----------
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(
        form_data.password, user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/google-login")
def google_login(data: dict):

    access_token = data.get("access_token")

    google_user = requests.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        params={"access_token": access_token}
    ).json()

    email = google_user["email"]
    name = google_user.get("name", "Google User")

    # check user exists
    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(
            full_name=name,
            email=email,
            hashed_password="google_oauth_user"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": user.email})

    return {"access_token": token}
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlmodel import Session, select

from app.auth import current_user, issue_token, password_hash
from app.database import get_session
from app.models import User

router = APIRouter(prefix="/api/v1/auth", tags=["Autenticação"])


class Credentials(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


@router.post("/register", status_code=201)
def register(data: Credentials, session: Session = Depends(get_session)) -> dict[str, str]:
    # Validate server configuration before creating a user account.
    issue_token(0)
    email = data.email.lower()
    if session.exec(select(User).where(User.email == email)).first():
        raise HTTPException(409, "E-mail já cadastrado.")
    user = User(email=email, password_hash=password_hash.hash(data.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"access_token": issue_token(user.id), "token_type": "bearer"}


@router.post("/login")
def login(data: Credentials, session: Session = Depends(get_session)) -> dict[str, str]:
    user = session.exec(select(User).where(User.email == data.email.lower())).first()
    if not user or not password_hash.verify(data.password, user.password_hash):
        raise HTTPException(401, "E-mail ou senha inválidos.")
    return {"access_token": issue_token(user.id), "token_type": "bearer"}


@router.get("/me")
def me(user: User = Depends(current_user)) -> dict[str, str]:
    return {"email": user.email}

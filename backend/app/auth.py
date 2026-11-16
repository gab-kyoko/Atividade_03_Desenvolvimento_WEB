import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from sqlmodel import Session

from app.database import get_session
from app.models import User

password_hash = PasswordHash.recommended()
bearer = HTTPBearer()


def issue_token(user_id: int) -> str:
    secret = os.getenv("JWT_SECRET", "")
    if len(secret) < 32:
        raise HTTPException(503, "JWT_SECRET deve ter pelo menos 32 caracteres.")
    expires = datetime.now(timezone.utc) + timedelta(hours=12)
    return jwt.encode({"sub": str(user_id), "exp": expires}, secret, algorithm="HS256")


def current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer), session: Session = Depends(get_session)) -> User:
    try:
        secret = os.getenv("JWT_SECRET", "")
        user_id = int(jwt.decode(credentials.credentials, secret, algorithms=["HS256"])["sub"])
        user = session.get(User, user_id)
        if user:
            return user
    except (jwt.PyJWTError, ValueError, KeyError):
        pass
    raise HTTPException(401, "Sessão inválida ou expirada.")

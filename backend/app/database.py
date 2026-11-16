import os
from collections.abc import Iterator

from sqlmodel import Session, SQLModel, create_engine

from app import models  # noqa: F401 - register tables

url = os.getenv("DATABASE_URL", "sqlite:///./entrelinha.db")
if url.startswith("postgres://"):
    url = "postgresql+psycopg://" + url.removeprefix("postgres://")
elif url.startswith("postgresql://"):
    url = "postgresql+psycopg://" + url.removeprefix("postgresql://")
engine = create_engine(url, connect_args={"check_same_thread": False} if url.startswith("sqlite") else {})


def create_db() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session

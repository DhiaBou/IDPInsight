from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

DATABASE_URI = "postgresql://username:password@db:5432/dbname"

engine = create_engine(DATABASE_URI)
session_provider = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def database_session() -> Iterator[Session]:
    db = session_provider()
    try:
        yield db
    finally:
        db.close()

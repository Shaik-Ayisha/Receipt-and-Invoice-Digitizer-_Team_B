from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./users.db"

# DATABASE_URL = "postgresql+psycopg2://postgres:12345@localhost:5432/invoice"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

engine = create_engine(DATABASE_URL)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

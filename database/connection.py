from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager
from .models import Base
import asyncio
import os
from platform import system
from utils import syncify


operating_system = system()
directory = ""

if operating_system == "Linux":
    directory = os.path.expanduser("~/.local/share/eva/")

elif operating_system == "Windows":
    directory = os.path.dirname(os.getenv('localappdata') + '/EVA/')


os.makedirs(directory, exist_ok=True)
DATABASE_URL = f"sqlite+aiosqlite:///{directory}/eva.db"

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True
)


def async_session_generator():
    return sessionmaker(engine, class_=AsyncSession)


@asynccontextmanager
async def get_session():
    try:
        async_session = async_session_generator()

        async with async_session() as session:
            yield session
    except:
        await session.rollback()
        raise
    finally:
        await session.close()


@syncify
async def create_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


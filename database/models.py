from datetime import datetime
from sqlalchemy import Column, String, TIMESTAMP, Integer
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Avatar(Base):
    __tablename__ = 'avatars'

    id = Column(Integer, primary_key=True)
    avtr = Column(String, nullable=False)
    title = Column(String, nullable=False)
    thumbnailUrl = Column(String, nullable=False)
    lastUsed = Column(TIMESTAMP, default=datetime.now())


class AuthCookie(Base):
    __tablename__ = 'auth_cookie'

    id = Column(Integer, primary_key=True)
    auth_cookie = Column(String, nullable=False)


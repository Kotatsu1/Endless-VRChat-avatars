from sqlalchemy import select, insert, update, delete
from sqlalchemy.future import select
from datetime import datetime
from .models import Avatar, AuthCookie
from .connection import get_session


class Database:
    def __init__(self):
        self.session = get_session


    async def update_auth_cookie(self, auth_cookie: str):
        async with self.session() as session:
            stmt = select(AuthCookie).where(AuthCookie.id == 1)
            result = await session.execute(stmt)

            existing_record = result.scalars().first()

            if existing_record:
                existing_record.auth_cookie = auth_cookie
                await session.commit()
            else:
                new_record = AuthCookie(id=1, auth_cookie=auth_cookie)
                session.add(new_record)
                await session.commit()


    async def get_auth_cookie(self) -> str|None:
        async with self.session() as session:
            result = await session.execute(select(AuthCookie).where(AuthCookie.id == 1))
            auth_cookie = result.scalars().first()
            return auth_cookie.auth_cookie if auth_cookie else None


    async def add_avatar(self, avtr: str, title: str, thumbnailUrl: str):
        async with self.session() as session:
            new_avatar = Avatar(avtr=avtr, title=title, thumbnailUrl=thumbnailUrl)
            session.add(new_avatar)
            await session.commit()
    

    async def update_avatar_last_used(self, avtr: str):
        async with self.session() as session:
            stmt = update(Avatar).where(Avatar.avtr == avtr).values(lastUsed=datetime.utcnow())
            await session.execute(stmt)
            await session.commit()


    async def remove_avatar(self, avtr: str):
        async with self.session() as session:
            stmt = delete(Avatar).where(Avatar.avtr == avtr)
            await session.execute(stmt)
            await session.commit()


    async def get_existing_avatar(self, avtr: str) -> Avatar:
        async with self.session() as session:
            result = await session.execute(select(Avatar).where(Avatar.avtr == avtr))
            return result.scalars().first()


    async def get_all_avatars(self) -> list:
        async with self.session() as session:
            result = await session.execute(select(Avatar))
            return result.scalars().all()


database = Database()

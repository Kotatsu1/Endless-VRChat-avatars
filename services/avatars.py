from utils import pydantic_validate, syncify
from .base_client import BaseClient
import requests
import aiohttp
import asyncio
from database.queries import database
from schemas import Avatar
import math


class Avatars(BaseClient):

    def get_favorite_avatars(self, tag: str):
        response = requests.get(
            f"{self.base_api_url}/avatars/favorites?tag={tag}",
            headers={"User-Agent": self.user_agent},
            cookies=self.cookies
        )

        return response.json()


    def get_uploaded_avatars(self):
        response = requests.get(
            f"{self.base_api_url}/avatars?releaseStatus=all&organization=vrchat&sort=updated&order=descending&user=me&n=101",
            headers={"User-Agent": self.user_agent},
            cookies=self.cookies
        )

        return response.json()


    @syncify
    async def get_saved_avatars(self):
        avatars = await database.get_all_avatars()

        return [{
            "id": avatar.avtr,
            "name": avatar.title,
            "thumbnailImageUrl": avatar.thumbnailUrl 
        } for avatar in avatars]


    async def get_avatar_info(self, avtr: str):
        async with aiohttp.ClientSession(cookies=self.cookies) as session:
            async with session.get(
                f"{self.base_api_url}/avatars/{avtr}",
                headers={"User-Agent": self.user_agent},
            ) as response:
                response_json = await response.json()

                result = {
                    "id": avtr,
                    "name": response_json.get("name"),
                    "thumbnailImageUrl": response_json.get("thumbnailImageUrl")
                }

                return result


    def change_avatar(self, avtr: str):
        requests.put(
            f"{self.base_api_url}/avatars/{avtr}/select",
            headers={"User-Agent": self.user_agent},
            cookies=self.cookies
        )


    @syncify
    async def search_avatars(self, query: str, page: int):
        response = requests.get(
            f"https://avatarsearch.cc/Avatar/AvatarSearcher?name={query}"
        )

        raw_avatars = response.text.split("\n")

        page_size = 30
        start_index = (page - 1) * page_size
        end_index = start_index + page_size

        total_pages = math.ceil(len(raw_avatars) / page_size)
        avatars = []

        tasks = []
        
        for avatar in raw_avatars[start_index:end_index]:
            avtr = avatar.split("|")[0]
            tasks.append(self.get_avatar_info(avtr))

        avatars = await asyncio.gather(*tasks)

        result = {
            "totalPages": total_pages,
            "avatars": avatars
        }
        
        return result


    @syncify
    @pydantic_validate(Avatar)
    async def add_avatar_to_saved(self, payload: Avatar):
        await database.add_avatar(payload.avtr, payload.title, payload.thumbnail)


    @syncify
    async def remove_avatar_from_saved(self, avtr: str):
        await database.remove_avatar(avtr)


    @syncify
    async def update_last_used(self, avtr: str):
        await database.update_avatar_last_used(avtr)


    def get_current_avatar(self, user_id: str):
        response = requests.get(
            f"{self.base_api_url}/users/{user_id}/avatar",
            headers={"User-Agent": self.user_agent},
            cookies=self.cookies
        )

        return response.json()


    @syncify
    async def check_avatar_exists(self, avtr: str):
        avatar = await database.get_existing_avatar(avtr)

        if avatar:
            return True

        return False



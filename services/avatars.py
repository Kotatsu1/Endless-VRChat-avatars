from .base_client import BaseClient
import requests
from utils import syncify
from database.queries import database


class Avatars(BaseClient):

    @syncify
    async def __get_cookies(self) -> dict | None:
        raw_auth_cookies = await database.get_auth_cookie()

        if not raw_auth_cookies:
            return None
            
        auth_cookies = raw_auth_cookies.split(";")

        cookies = {
                "twoFactorAuth": auth_cookies[0],
                "auth": auth_cookies[1]
            }
        
        return cookies


    def get_favorite_avatars(self):
        # "https://vrchat.com/api/1/avatars/favorites?tag={}"
        ...

    def get_uploaded_avatars(self):
        cookies = self.__get_cookies()

        if not cookies:
            return None
        
        response = requests.get(
            f"{self.base_api_url}/avatars?releaseStatus=all&organization=vrchat&sort=updated&order=descending&user=me&n=101",
            headers={"User-Agent": self.user_agent},
            cookies=self.__get_cookies()
        )

        return response.json()




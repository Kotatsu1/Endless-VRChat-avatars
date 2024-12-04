from utils import syncify
from database.queries import database


class BaseClient:
    def __init__(self):
        self.base_api_url = "https://api.vrchat.cloud/api/1"
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0"
        self.cookies = self.__get_cookies()


    @syncify
    async def __get_cookies(self) -> dict | None:
        raw_auth_cookies = await database.get_auth_cookie()

        if not raw_auth_cookies:
            return None
            
        auth_cookies = raw_auth_cookies.split(";")

        cookies = {
            "twoFactorAuth": auth_cookies[0],
            "auth": auth_cookies[1].strip()
        }
        
        return cookies

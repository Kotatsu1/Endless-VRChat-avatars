from .base_client import BaseClient
from database.queries import database
from schemas import TwoFactorVerify
from utils import pydantic_validate, syncify
import requests


class Auth(BaseClient):

    @syncify
    async def check_login(self):
        raw_auth_cookies = await database.get_auth_cookie()

        if not raw_auth_cookies:
            return
            
        auth_cookies = raw_auth_cookies.split(";")

        response = requests.get(
            f"{self.base_api_url}/auth/user",
            headers={"User-Agent": self.user_agent},
            cookies={
                "twoFactorAuth": auth_cookies[0],
                "auth": auth_cookies[1]
            }
        )

        if response.status_code == 200:
            return True

        return False


    def login(self, auth_string: str):
        response = requests.get(
            url=f"{self.base_api_url}/auth/user",
            headers={
                "Authorization": f"Basic {auth_string}",
                "User-Agent": self.user_agent
            }
        )

        two_factor_method = response.json().get("requiresTwoFactorAuth")
        cookie = response.cookies.get("auth")

        result = {
            "twoFactorAuthMethod": two_factor_method[0],
            "cookie": cookie
        
        }

        return result


    @pydantic_validate(TwoFactorVerify)
    def verify_two_factor(self, payload: TwoFactorVerify):
        response = requests.post(
            f"{self.base_api_url}/auth/twofactorauth/{payload.tfa_method}/verify",
            data={"code": payload.code},
            headers={"User-Agent": self.user_agent},
            cookies={"auth": payload.auth_cookie}
        )
        cookie = response.cookies.get("twoFactorAuth")

        return cookie


    @syncify
    async def set_two_factor_cookie(self, cookie):
        await database.update_auth_cookie(cookie)

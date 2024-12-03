from .base_client import BaseClient
from database.queries import database
from schemas import TwoFactorVerify
from utils import pydantic_validate, syncify
import requests


class Auth(BaseClient):

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
    async def set_two_factor_cookie(self, cookie: str):
        await database.update_auth_cookie(cookie)

            

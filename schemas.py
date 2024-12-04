from pydantic import BaseModel


class TwoFactorVerify(BaseModel):
    code: str
    auth_cookie: str
    tfa_method: str


class Avatar(BaseModel):
    avtr: str
    title: str
    thumbnail: str

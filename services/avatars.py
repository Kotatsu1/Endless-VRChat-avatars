import requests
from utils import syncify
from database.queries import database


class Avatars:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0"
        self.__set_cookies()
    

    @syncify
    async def __get_cookies(self):
        return await database.get_auth_cookie()


    def __set_cookies(self):
        for cookie in self.__get_cookies():
            # self.session.cookies.set('cookie_name', 'cookie_value')
            print(cookie)


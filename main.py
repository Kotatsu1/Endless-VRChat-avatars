import webview
from database.connection import create_models
from utils import syncify
import asyncio
import services


class API:
    navigation = services.Navigation()
    auth = services.Auth()
    avatars = services.Avatars()


    @syncify
    async def time_consuming(self, qwe):
        await asyncio.sleep(1)
        print('time consuming', qwe)

        return f'Hello, World!'





if __name__ == "__main__":
    create_models()

    api = API()

    webview.create_window(
        'eva',
        'http://localhost:5173', 
        # 'frontend/dist/index.html', 
        js_api=api,
        width=1280,
        height=800,
        min_size=(1280, 800),
        frameless=True,
        resizable=True
    )

    webview.settings = {
      'ALLOW_DOWNLOADS': True,
      'ALLOW_FILE_URLS': True,
      'OPEN_EXTERNAL_LINKS_IN_BROWSER': True,
      'OPEN_DEVTOOLS_IN_DEBUG': False
    }

    webview.start(debug=True)

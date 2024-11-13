import webview
from database.connection import create_models
from utils import syncify
import asyncio



class API:
    def __init__(self):
        self.maximized: bool = False


    @syncify
    async def time_consuming(self, qwe):
        await asyncio.sleep(3)
        print('time consuming', qwe)

        return f'Hello, World!'


    def close_window(self):
        webview.active_window().destroy()


    def minimize_window(self):
        webview.active_window().minimize()


    def maximize_window(self):
        if self.maximized:
            self.maximized = False
            webview.active_window().restore()
        else:
            self.maximized = True
            webview.active_window().maximize()



if __name__ == "__main__":
    create_models()

    api = API()

    webview.create_window(
        'eva',
        # 'http://localhost:5173', 
        'frontend/dist/index.html', 
        js_api=api,
        width=1280,
        height=800,
        min_size=(1280, 800),
        frameless=True,
        easy_drag=True,
        resizable=True
    )

    webview.settings = {
      'ALLOW_DOWNLOADS': True,
      'ALLOW_FILE_URLS': True,
      'OPEN_EXTERNAL_LINKS_IN_BROWSER': True,
      'OPEN_DEVTOOLS_IN_DEBUG': False
    }

    webview.start(debug=True)

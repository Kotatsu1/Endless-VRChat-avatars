import webview
from database.connection import create_models


class API:
    def say_hello(self, name: str):
        return f'Hello, {name}!'



if __name__ == "__main__":
    create_models()

    api = API()

    webview.create_window(
        'Endless VRChat Avatars',
        'http://localhost:5173', 
        # 'frontend/dist/index.html', 
        js_api=api,
        width=1280,
        height=800,
        min_size=(1280, 800)
    )

    webview.start()

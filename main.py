import webview


class API:
    def say_hello(self, name: str):
        return f'Hello, {name}!'



if __name__ == "__main__":
    api = API()

    webview.create_window('Endless VRChat Avatars', 'frontend/dist/index.html', js_api=api)
    webview.start()

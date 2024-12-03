import webview


class Navigation():
    def __init__(self):
        self.maximized: bool = False


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

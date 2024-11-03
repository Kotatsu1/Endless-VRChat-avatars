pyinstaller --onefile --noconsole --hidden-import=aiosqlite --add-data=frontend/dist:frontend/dist --icon=icon.ico main.py

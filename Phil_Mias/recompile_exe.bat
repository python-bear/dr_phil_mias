@echo off

pyinstaller --console --onefile --ascii --add-data "website;website" --icon "website/static/imgs/favicon.ico" --hidden-import flask app.py

pause
exit
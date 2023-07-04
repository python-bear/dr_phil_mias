@echo off

pyinstaller --onefile --console --add-data "website;website" --hidden-import flask --icon "website/static/imgs/favicon.ico" app.py

pause
exit
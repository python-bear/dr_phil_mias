@echo off

for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /c:"IPv4 Address"') do set "IP=%%A"
set "IP=%IP:~1%"
echo %IP%

start "" http://%IP%:8888
call "doctor_mias/main.exe"

pause
exit

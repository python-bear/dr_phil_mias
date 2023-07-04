@echo off

echo.
echo.

ipconfig

echo.
echo.

echo Find the ip address above that starts with `192.168.1.` or something like that
echo then add `:8888` on the end, and that is the URL that other people use to go
echo to the website.

echo.

echo For example, if the ip address above is `192.168.1.153` then you add the `:8888`
echo on the end to get `192.168.1.153:8888` and that is the URL that others use.
echo Note, this will turn into: `http://192.168.1.153:8888/home` when they use it.

echo.
echo.

pause
exit
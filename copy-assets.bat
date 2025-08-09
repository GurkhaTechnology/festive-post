@echo off
xcopy templates dist\templates /E /I
xcopy assets dist\assets /E /I
xcopy index.html dist /I


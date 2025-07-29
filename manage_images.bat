@echo off
echo ===========================================
echo     Ozden Sweets - Image Management Tool
echo ===========================================
echo.
echo This tool will help you manage product images
echo.

:menu
echo Please choose an option:
echo 1. Open Images folder
echo 2. List all product images
echo 3. Copy image from Desktop to Images folder
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto open_images
if "%choice%"=="2" goto list_images
if "%choice%"=="3" goto copy_image
if "%choice%"=="4" goto exit
echo Invalid choice. Please try again.
echo.
goto menu

:open_images
echo Opening Images folder...
if exist "Images" (
    explorer "Images"
) else (
    echo Images folder does not exist. Creating it now...
    mkdir "Images"
    explorer "Images"
)
echo.
goto menu

:list_images
echo.
echo Current images in Images folder:
echo ===============================
if exist "Images\*.*" (
    dir "Images\*.jpg" "Images\*.png" "Images\*.gif" "Images\*.jpeg" /b 2>nul
) else (
    echo No images found in Images folder.
)
echo.
goto menu

:copy_image
echo.
echo Copy image from Desktop to Images folder
echo =======================================
set /p filename="Enter the image filename on Desktop: "
set /p newname="Enter the new name for the image (with extension): "

if exist "%userprofile%\Desktop\%filename%" (
    if not exist "Images" mkdir "Images"
    copy "%userprofile%\Desktop\%filename%" "Images\%newname%"
    echo Image copied successfully!
) else (
    echo Image not found on Desktop. Please check the filename.
)
echo.
goto menu

:exit
echo.
echo Thank you for using Ozden Sweets Image Management Tool!
echo.
pause
exit

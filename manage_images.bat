@echo off
chcp 65001 >nul
echo ====================================
echo   أداة إدارة صور المنتجات - Ozden Sweets
echo ====================================
echo.

set "IMAGES_DIR=%~dp0Images"
set "DOWNLOADS_DIR=%USERPROFILE%\Downloads"

echo المجلد الحالي للصور: %IMAGES_DIR%
echo مجلد التحميلات: %DOWNLOADS_DIR%
echo.

:menu
echo ================== الخيارات ==================
echo 1. نقل أحدث صورة من التحميلات إلى مجلد Images
echo 2. عرض جميع الصور في مجلد Images
echo 3. فتح مجلد Images
echo 4. فتح مجلد التحميلات
echo 5. نقل صورة محددة بالاسم
echo 6. خروج
echo ===========================================
echo.

set /p choice="اختر رقماً (1-6): "

if "%choice%"=="1" goto move_latest
if "%choice%"=="2" goto list_images
if "%choice%"=="3" goto open_images
if "%choice%"=="4" goto open_downloads
if "%choice%"=="5" goto move_specific
if "%choice%"=="6" goto exit
echo اختيار غير صحيح!
goto menu

:move_latest
echo.
echo البحث عن أحدث صورة في مجلد التحميلات...
echo.

for /f "delims=" %%i in ('dir "%DOWNLOADS_DIR%\*.jpg" "%DOWNLOADS_DIR%\*.jpeg" "%DOWNLOADS_DIR%\*.png" "%DOWNLOADS_DIR%\*.gif" "%DOWNLOADS_DIR%\*.bmp" /b /o-d 2^>nul') do (
    set "latest_image=%%i"
    goto found_latest
)

echo لم يتم العثور على صور في مجلد التحميلات.
pause
goto menu

:found_latest
echo تم العثور على أحدث صورة: %latest_image%
echo.
set /p new_name="أدخل الاسم الجديد للصورة (اتركه فارغاً للاحتفاظ بالاسم الأصلي): "

if "%new_name%"=="" (
    set "target_name=%latest_image%"
) else (
    for %%i in ("%latest_image%") do set "ext=%%~xi"
    set "target_name=%new_name%%ext%"
)

echo.
echo نقل الصورة من: %DOWNLOADS_DIR%\%latest_image%
echo إلى: %IMAGES_DIR%\%target_name%
echo.

copy "%DOWNLOADS_DIR%\%latest_image%" "%IMAGES_DIR%\%target_name%"
if %errorlevel%==0 (
    echo ✅ تم نقل الصورة بنجاح!
    echo هل تريد حذف الصورة من مجلد التحميلات؟ (y/n)
    set /p delete_choice=
    if /i "%delete_choice%"=="y" (
        del "%DOWNLOADS_DIR%\%latest_image%"
        echo ✅ تم حذف الصورة من مجلد التحميلات.
    )
) else (
    echo ❌ حدث خطأ أثناء نقل الصورة.
)
echo.
pause
goto menu

:move_specific
echo.
set /p image_name="أدخل اسم الصورة في مجلد التحميلات (مع الامتداد): "

if not exist "%DOWNLOADS_DIR%\%image_name%" (
    echo ❌ الصورة غير موجودة في مجلد التحميلات: %image_name%
    pause
    goto menu
)

set /p new_name="أدخل الاسم الجديد للصورة (اتركه فارغاً للاحتفاظ بالاسم الأصلي): "

if "%new_name%"=="" (
    set "target_name=%image_name%"
) else (
    for %%i in ("%image_name%") do set "ext=%%~xi"
    set "target_name=%new_name%%ext%"
)

echo.
echo نقل الصورة من: %DOWNLOADS_DIR%\%image_name%
echo إلى: %IMAGES_DIR%\%target_name%
echo.

copy "%DOWNLOADS_DIR%\%image_name%" "%IMAGES_DIR%\%target_name%"
if %errorlevel%==0 (
    echo ✅ تم نقل الصورة بنجاح!
    echo هل تريد حذف الصورة من مجلد التحميلات؟ (y/n)
    set /p delete_choice=
    if /i "%delete_choice%"=="y" (
        del "%DOWNLOADS_DIR%\%image_name%"
        echo ✅ تم حذف الصورة من مجلد التحميلات.
    )
) else (
    echo ❌ حدث خطأ أثناء نقل الصورة.
)
echo.
pause
goto menu

:list_images
echo.
echo ========== الصور الموجودة في مجلد Images ==========
echo.
dir "%IMAGES_DIR%\*.jpg" "%IMAGES_DIR%\*.jpeg" "%IMAGES_DIR%\*.png" "%IMAGES_DIR%\*.gif" "%IMAGES_DIR%\*.bmp" /b 2>nul
if %errorlevel%==1 echo لا توجد صور في المجلد.
echo.
pause
goto menu

:open_images
echo فتح مجلد Images...
if not exist "%IMAGES_DIR%" (
    echo إنشاء مجلد Images...
    mkdir "%IMAGES_DIR%"
)
explorer "%IMAGES_DIR%"
goto menu

:open_downloads
echo فتح مجلد التحميلات...
explorer "%DOWNLOADS_DIR%"
goto menu

:exit
echo شكراً لاستخدام أداة إدارة صور المنتجات!
pause
exit

@echo off
REM ============================================================================
REM  update_index.bat  (Les_Index_Magique)
REM ----------------------------------------------------------------------------
REM  Lanceur double-clic du generateur PowerShell.
REM  Regenere index.html (menu central) a partir des .html du dossier
REM  et des sous-dossiers contenant un index.html (ex: VideosLoom).
REM ============================================================================

setlocal
chcp 65001 > nul

echo.
echo === Mise a jour de index.html (Les_Index_Magique) ===
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update_index.ps1"
set "RC=%ERRORLEVEL%"

echo.
if "%RC%"=="0" (
    echo [OK] index.html regenere.
) else (
    echo [ERREUR] Le script a echoue (code %RC%).
)

echo.
pause
endlocal

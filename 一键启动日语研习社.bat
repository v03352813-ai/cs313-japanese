@echo off
chcp 65001 >nul
title CS313 日语研习社 - 双引擎本地极速服务
echo ========================================================
echo   正在启动 CS313 日语研习社 (前端 5174 + 后端 3002)...
echo   手机/平板同一 Wi-Fi 可访问: http://192.168.50.101:5174/
echo ========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0serve_local.ps1"
pause

@echo off
title HackMatch AI - Database Seeder
color 0B

echo.
echo  ============================================
echo    HackMatch AI - Database Seeder
echo  ============================================
echo.
echo  This will seed 212 projects into MongoDB.
echo  Please wait — this takes about 2-3 minutes.
echo.

cd /d %~dp0backend
python -m app.dataset.seed_projects

echo.
echo  ============================================
echo  Seeding complete! You can close this window.
echo  ============================================
pause

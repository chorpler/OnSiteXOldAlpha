@echo off
cls
echo Removing www directory...
rd /s/q www
echo Starting ionic serve ironically...
ionic serve

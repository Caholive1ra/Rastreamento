@echo off
echo Starting backend with local profile...
cd /d %~dp0
mvn spring-boot:run "-Dspring.profiles.active=local"

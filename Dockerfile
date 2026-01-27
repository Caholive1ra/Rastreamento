# --- Etapa 1: Construção (Build) ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copia TODAS as pastas (backend, frontend, etc) para dentro do container
COPY . .

# === O PULO DO GATO ===
# Muda o diretório de trabalho para a pasta onde o pom.xml realmente está
WORKDIR /app/backend

# Agora sim, roda o Maven (ele vai achar o pom.xml nesta pasta)
RUN mvn clean package -DskipTests

# --- Etapa 2: Execução (Rodar) ---
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp

# Pega o .jar gerado lá dentro da pasta backend/target
COPY --from=build /app/backend/target/*.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]
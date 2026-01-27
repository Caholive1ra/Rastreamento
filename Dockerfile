# --- Etapa 1: Construção (Build) ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
# Compila o projeto e gera o arquivo .jar (pula os testes para ser mais rápido)
RUN mvn clean package -DskipTests

# --- Etapa 2: Execução (Rodar) ---
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
# Pega o .jar gerado na etapa anterior
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]

FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

COPY pom.xml .

RUN apt-get update && \
    apt-get install -y maven && \
    rm -rf /var/lib/apt/lists/*

COPY src ./src

RUN mvn clean package -DskipTests


FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

RUN useradd -r -u 1001 spring

USER spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
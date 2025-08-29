# Multi-stage Dockerfile for Spring Boot API

# Build stage
FROM gradle:8.5-jdk21-alpine AS build

WORKDIR /app

# Copy gradle files
COPY build.gradle settings.gradle gradlew ./
COPY gradle gradle/

# Download dependencies
RUN gradle dependencies --no-daemon

# Copy source code
COPY src src/

# Build application
RUN gradle build --no-daemon -x test

# Runtime stage
FROM eclipse-temurin:21-jre-jammy

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create non-root user
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring

# Copy built jar
COPY --from=build /app/build/libs/*.jar app.jar

# Create uploads directory
RUN mkdir -p uploads

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Expose port
EXPOSE 8080

# JVM options for containerized environment
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+UseStringDeduplication"

# Run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

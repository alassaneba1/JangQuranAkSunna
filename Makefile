.PHONY: help dev-start dev-stop dev-reset build-all test-all clean

# Variables
COMPOSE_FILE = docker-compose.yml
COMPOSE_DEV_FILE = docker-compose.dev.yml

# Default target
help: ## Show this help message
	@echo "JangQuranAkSunna - Makefile Commands"
	@echo "=================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development Environment
dev-start: ## Start development environment
	@echo "🚀 Starting development environment..."
	docker-compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) up -d
	@echo "✅ Services started. Admin: http://localhost:3000, API: http://localhost:8080"

dev-stop: ## Stop development environment
	@echo "🛑 Stopping development environment..."
	docker-compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) down

dev-reset: ## Reset development environment (removes volumes)
	@echo "🔄 Resetting development environment..."
	docker-compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) down -v
	docker system prune -f

dev-logs: ## Show logs for all services
	docker-compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) logs -f

# Database
db-migrate: ## Run database migrations
	@echo "🗃️ Running database migrations..."
	docker-compose exec api ./gradlew flywayMigrate

db-seed: ## Load sample data
	@echo "🌱 Loading sample data..."
	docker-compose exec api ./gradlew bootRun --args="--spring.profiles.active=seed"

db-reset: ## Reset database completely
	@echo "🔄 Resetting database..."
	docker-compose stop postgres
	docker-compose rm -f postgres
	docker volume rm jangquranaksunna_postgres_data
	docker-compose up -d postgres
	sleep 5
	make db-migrate
	make db-seed

# Build
build-all: build-api build-admin build-mobile ## Build all services

build-api: ## Build API service
	@echo "🔨 Building API..."
	cd api && ./gradlew build

build-admin: ## Build admin interface
	@echo "🔨 Building Admin interface..."
	cd admin && npm run build

build-mobile: ## Build mobile app
	@echo "🔨 Building Mobile app..."
	cd mobile && flutter build apk --release

# Tests
test-all: test-api test-admin test-mobile ## Run all tests

test-api: ## Run API tests
	@echo "🧪 Running API tests..."
	cd api && ./gradlew test

test-admin: ## Run admin interface tests
	@echo "🧪 Running Admin tests..."
	cd admin && npm test

test-mobile: ## Run mobile app tests
	@echo "🧪 Running Mobile tests..."
	cd mobile && flutter test

# Linting
lint-all: lint-api lint-admin lint-mobile ## Run all linters

lint-api: ## Lint API code
	cd api && ./gradlew spotlessCheck

lint-admin: ## Lint admin interface
	cd admin && npm run lint

lint-mobile: ## Lint mobile app
	cd mobile && dart analyze

# Formatting
format-all: format-api format-admin format-mobile ## Format all code

format-api: ## Format API code
	cd api && ./gradlew spotlessApply

format-admin: ## Format admin interface
	cd admin && npm run format

format-mobile: ## Format mobile app
	cd mobile && dart format .

# Utilities
clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	cd api && ./gradlew clean
	cd admin && rm -rf .next node_modules/.cache
	cd mobile && flutter clean

install-deps: ## Install all dependencies
	@echo "📦 Installing dependencies..."
	cd api && ./gradlew build --refresh-dependencies
	cd admin && npm install
	cd mobile && flutter pub get

# Production
prod-build: ## Build production images
	@echo "🏭 Building production images..."
	docker build -t jangquranaksunna/api:latest ./api
	docker build -t jangquranaksunna/admin:latest ./admin

prod-deploy: ## Deploy to production (requires setup)
	@echo "🚀 Deploying to production..."
	@echo "⚠️  Make sure you have configured your production environment"
	# Add your deployment commands here

# Monitoring
logs-api: ## Show API logs
	docker-compose logs -f api

logs-admin: ## Show admin logs
	docker-compose logs -f admin

logs-db: ## Show database logs
	docker-compose logs -f postgres

logs-redis: ## Show Redis logs
	docker-compose logs -f redis

logs-elasticsearch: ## Show Elasticsearch logs
	docker-compose logs -f elasticsearch

# Data management
backup-db: ## Backup database
	@echo "💾 Creating database backup..."
	docker-compose exec postgres pg_dump -U postgres jangquranaksunna > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore-db: ## Restore database from backup (requires BACKUP_FILE variable)
	@echo "🔄 Restoring database from $(BACKUP_FILE)..."
	docker-compose exec -T postgres psql -U postgres jangquranaksunna < $(BACKUP_FILE)

# Security
security-scan: ## Run security scans
	@echo "🔒 Running security scans..."
	docker run --rm -v $(PWD):/src clair-scanner:latest
	cd api && ./gradlew dependencyCheckAnalyze
	cd admin && npm audit

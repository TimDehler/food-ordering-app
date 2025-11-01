# 🍕 Food Ordering API

A modern, scalable food ordering platform built with **NestJS**, **PostgreSQL**, **Redis**, and **Docker**. This API provides a complete backend solution for food delivery applications with role-based authentication, restaurant management, and order processing.

## 🚀 Features

- **🔐 JWT Authentication** - Secure login/register with refresh tokens
- **👥 Role-Based Access Control** - Customer, Restaurant Owner, Delivery Driver, Admin roles
- **🏪 Restaurant Management** - CRUD operations for restaurants and menus
- **📦 Order Processing** - Complete order lifecycle management
- **💾 Database Integration** - PostgreSQL with Prisma ORM
- **⚡ Redis Caching** - Session management and performance optimization
- **📚 API Documentation** - Auto-generated Swagger/OpenAPI docs
- **🐳 Docker Support** - Full containerization with health checks
- **🔧 Development Tools** - Hot reload, linting, formatting, testing

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: [PostgreSQL 16](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Cache**: [Redis 7](https://redis.io/)
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **Language**: TypeScript

## 📦 Project Structure

```
src/
├── auth/                    # Authentication system
│   ├── endpoints/          # Feature-per-endpoint modules
│   │   ├── login/         # Login functionality
│   │   ├── register/      # User registration
│   │   └── refresh/       # Token refresh
│   ├── guards/            # Auth guards (JWT, Roles)
│   ├── decorators/        # Custom decorators
│   └── jwt.strategy.ts    # JWT strategy
├── users/                 # User management
├── restaurant/            # Restaurant CRUD operations
├── prisma/               # Database service
└── main.ts               # Application entry point

prisma/
├── schema.prisma         # Database schema
└── migrations/           # Database migrations

docker-compose.yaml       # Multi-container setup
Dockerfile               # API container configuration
```

## 🏃‍♂️ Quick Start

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/) & Docker Compose
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/TimDehler/food-ordering-app.git
cd food-ordering-api
```

### 2. Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Update `.env` with your settings:

```env
# Database Configuration
DATABASE_URL="postgresql://nest:nest@localhost:5432/nest?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_REFRESH_EXPIRES_IN="7d"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# Application Configuration
NODE_ENV="development"
PORT=3000
```

### 3. Start with Docker (Recommended)

```bash
# Start all services (API, PostgreSQL, Redis)
npm run docker:start

# View logs
npm run docker:logs

# Stop all services
npm run docker:stop
```

### 4. Local Development Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

## 🔗 API Endpoints

### Base URL

- **Local**: `http://localhost:3000`
- **Swagger Docs**: `http://localhost:3000/api`

### Authentication

```
POST /auth/register     # User registration
POST /auth/login        # User login
POST /auth/refresh      # Refresh JWT token
```

### Protected Routes

```
GET  /                  # Health check
GET  /restaurants       # List restaurants
POST /restaurants       # Create restaurant (Admin/Owner)
PUT  /restaurants/:id   # Update restaurant (Admin/Owner)
DELETE /restaurants/:id # Delete restaurant (Admin/Owner)
```

## 🗃️ Database Schema

### User Roles

- `CUSTOMER` - End users placing orders
- `RESTAURANT_OWNER` - Restaurant managers
- `DELIVERY_DRIVER` - Delivery personnel
- `ADMIN` - System administrators

### Core Models

- **User** - Authentication and profile data
- **Restaurant** - Restaurant information and settings
- **Product** - Menu items and pricing
- **ProductExtra** - Add-ons and customizations
- **Order** - Order management (planned)

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run start:dev        # Start with hot reload
npm run start:debug      # Start with debugging
npm run build            # Build for production
npm run start:prod       # Start production build

# Docker Operations
npm run docker:start     # Start all containers
npm run docker:stop      # Stop all containers
npm run docker:logs      # View container logs

# Database Operations
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Create and apply migration
npx prisma studio        # Open database GUI
npx prisma migrate reset # Reset database (dev only)

# Code Quality
npm run format           # Format code with Prettier
npm run lint             # Lint and fix issues
npm run format:lint      # Format + lint combined

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run end-to-end tests
npm run test:cov         # Run tests with coverage
```

### Code Quality Tools

- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **Husky** - Git hooks (planned)
- **Jest** - Unit and integration testing

## 🐳 Docker Configuration

The application uses a multi-container setup with health checks:

```yaml
services:
  api: # NestJS API (port 3000)
  db: # PostgreSQL 16 (port 5432)
  cache: # Redis 7 (port 6379)
```

### Health Checks

- **PostgreSQL**: `pg_isready` check every 5s
- **Redis**: `redis-cli ping` check every 5s
- **API**: Waits for healthy database and cache

## 📊 API Documentation

Interactive API documentation is available via Swagger UI:

- **URL**: `http://localhost:3000/api`
- **Features**:
  - Try-it-out functionality
  - JWT authentication support
  - Request/response examples
  - Schema definitions

## 🔒 Authentication & Authorization

### JWT Token System

- **Access Token**: Short-lived (15m) for API access
- **Refresh Token**: Long-lived (7d) for token renewal
- **Bearer Token**: Include in `Authorization` header

### Role-Based Access

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
@Post('restaurants')
createRestaurant() { /* ... */ }
```

## 🚀 Deployment

### Production Checklist

- [ ] Update environment variables
- [ ] Set strong JWT secrets
- [ ] Configure production database
- [ ] Set up SSL/TLS
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backups

### Docker Production

```bash
# Build for production
docker compose -f docker-compose.prod.yml up -d --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/TimDehler/food-ordering-app/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/TimDehler/food-ordering-app/discussions)
- **Documentation**: [Project Wiki](https://github.com/TimDehler/food-ordering-app/wiki)

## 📞 Contact

- **Author**: Tim Dehler
- **GitHub**: [@TimDehler](https://github.com/TimDehler)
- **Project**: [food-ordering-app](https://github.com/TimDehler/food-ordering-app)

---

⭐ **Star this repository if you find it helpful!**

# Food Ordering App - AI Agent Instructions

## Architecture Overview

This is a **NestJS-based food ordering platform** with a **modular authentication system** and **Docker containerization**. The project follows a **feature-per-endpoint module pattern** in the auth system.

### Key Components

- **API**: NestJS TypeScript application (`/food-ordering-api`)
- **Database**: PostgreSQL 16 with Prisma ORM
- **Cache**: Redis 7 for session management
- **Documentation**: Swagger/OpenAPI at `/api` endpoint
- **Authentication**: JWT-based with role-based access control

## Project Structure Pattern

```
src/auth/endpoints/{feature}/
├── {feature}.controller.ts
├── {feature}.service.ts
├── {feature}.module.ts
└── dto/
```

**Critical**: Each auth endpoint (register, login, refresh) has its own module imported in `app.module.ts`. This differs from typical NestJS single-module auth patterns.

## Development Workflows

### Docker Development (Primary)

```bash
# Root level - starts all services
npm run docker:start    # docker compose up -d --build
npm run docker:stop     # docker compose down

# API level - for code changes
npm run start:dev        # NestJS watch mode
```

### Database Operations

```bash
# Prisma commands run from /food-ordering-api
npx prisma generate      # After schema changes
npx prisma migrate dev   # Apply migrations
npx prisma studio        # Database GUI
```

## Key Conventions

### Environment Configuration

- **Docker**: `DATABASE_URL=postgresql://nest:nest@db:5432/nest?schema=public` (service networking)
- **Local**: Uses `.env` file in `/food-ordering-api`
- **Build**: Dockerfile sets temporary DATABASE_URL for Prisma generation

### Authentication Architecture

- **Strategy**: JWT with refresh tokens
- **Roles**: CUSTOMER, RESTAURANT_OWNER, DELIVERY_DRIVER, ADMIN (enum in Prisma)
- **Guards**: Custom roles decorator at `src/auth/decorators/roles.decorator.ts`
- **Module Structure**: Separate modules per endpoint (unusual NestJS pattern)

### API Documentation

- **Swagger**: Auto-generated at `http://localhost:3000/api`
- **DTOs**: Decorated with `@ApiProperty` for documentation
- **Auth**: JWT Bearer token support configured

### Code Quality

```bash
npm run format:lint      # Prettier + ESLint (combined)
npm run lint:check       # Check without fixing
```

## Critical Integration Points

### Prisma Schema

- **User model**: String ID with cuid(), role-based enum
- **Migration pattern**: Schema changes require `prisma generate` + rebuild
- **Connection**: Uses service names in Docker, localhost in development

### Docker Networking

- **API Port**: 3000 (host) → 3000 (container)
- **DB Port**: 5432 (host) → 5432 (container)
- **Redis Port**: 6379 (host) → 6379 (container)
- **Service Communication**: Use service names (`db`, `cache`) not `localhost`

### Module Registration

Auth endpoints must be registered in `app.module.ts`:

```typescript
@Module({
  imports: [UsersModule, RegisterModule, LoginModule, RefreshModule],
  // ...
})
```

## Debugging Patterns

### Container Issues

```bash
docker logs api         # Application logs
docker logs db          # Database logs
docker exec -it api sh  # Container shell access
```

### Database Debugging

- Use `npx prisma studio` for data inspection
- Check connection with Docker service names vs localhost
- Verify Prisma client generation after schema changes

### API Testing

- Swagger UI at `/api` for interactive testing
- JWT tokens persist in Swagger for authenticated requests
- Use Postman collection for automated testing workflows

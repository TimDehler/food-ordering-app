FROM node:20-alpine

# Install Python and build tools for native dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies for build (not just production)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Set a temporary DATABASE_URL for Prisma generation
ENV DATABASE_URL="postgresql://temp:temp@localhost:5432/temp"

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Verify build output exists
RUN ls -la dist/src/

# Remove dev dependencies
RUN npm prune --production

EXPOSE 3000

CMD ["node", "dist/src/main.js"]

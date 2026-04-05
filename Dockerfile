# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Only copy package files first to cache dependencies
COPY package*.json ./
# Installs all dependencies (including dev deps needed to build)
RUN npm ci

# Copy the rest and build
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app

# Ensure SvelteKit runs in production mode and binds to all network interfaces
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy only the compiled output from the builder stage
COPY --from=builder /app/build ./build

# Expose the port SvelteKit will run on
EXPOSE 3000

CMD ["node", "build/index.js"]
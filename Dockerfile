# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# Use cache mount for npm
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
# Use cache mount for SvelteKit/Vite build artifacts
RUN --mount=type=cache,target=/app/.svelte-kit \
    npm run build

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Essential for SvelteKit on Coolify/Docker
ENV PORT=3000
ENV HOST=0.0.0.0

COPY package*.json ./
# Only production deps, using cache
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["node", "build/index.js"]
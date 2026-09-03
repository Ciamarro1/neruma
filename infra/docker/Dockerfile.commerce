# ==============================================================================
# MEDUSA V2 COMMERCE ENGINE - PRODUCTION MULTI-STAGE DOCKERFILE
# ==============================================================================

# Stage 1: Base & Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++ git
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else npm i; \
  fi

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build || true

# Stage 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 medusauser

COPY --from=builder --chown=medusauser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=medusauser:nodejs /app/dist ./dist
COPY --from=builder --chown=medusauser:nodejs /app/package.json ./package.json
COPY --from=builder --chown=medusauser:nodejs /app/medusa-config.js* ./
COPY --from=builder --chown=medusauser:nodejs /app/medusa-config.ts* ./

USER medusauser

EXPOSE 9000

CMD ["npm", "run", "start"]

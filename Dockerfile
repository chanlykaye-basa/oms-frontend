# Build context: repo root (docker-compose sets context: .)

# ---- Dependencies stage ----
FROM node:20-alpine AS deps
WORKDIR /app/oms/frontend
COPY packages/design-system /app/packages/design-system
COPY oms/frontend/package*.json ./
RUN npm install

# ---- Development stage ----
FROM node:20-alpine AS dev
WORKDIR /app/oms/frontend
COPY packages/design-system /app/packages/design-system
COPY --from=deps /app/oms/frontend/node_modules ./node_modules
COPY oms/frontend .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]

# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app/oms/frontend
COPY packages/design-system /app/packages/design-system
COPY --from=deps /app/oms/frontend/node_modules ./node_modules
COPY oms/frontend .
RUN npm run build

# ---- Runtime stage (Next.js standalone) ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nextjs /app/oms/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/oms/frontend/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/oms/frontend/public ./public

EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]

# Deployment Guide

## Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database (or Docker)
- Domain with DNS access (for production)

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Database
DATABASE_URL=postgres://user:password@host:5432/database

# Authentication
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
BETTER_AUTH_SECRET=your-random-secret-key-minimum-32-characters

# Production only (optional)
BETTER_AUTH_URL=https://yourdomain.com
```

### Generating BETTER_AUTH_SECRET

```bash
openssl rand -base64 32
```

## Local Development

### 1. Start PostgreSQL with Docker

```bash
pnpm docker:up
```

### 2. Push database schema

```bash
pnpm db:push
```

### 3. Seed data

```bash
# Seed portfolio data
pnpm db:seed

# Create admin user
pnpm db:seed-admin
```

### 4. Start development server

```bash
pnpm dev
```

## Production Deployment

### 1. Database Setup

Use a managed PostgreSQL service (Neon, Supabase, Railway, etc.) or self-hosted PostgreSQL.

Update `DATABASE_URL` in your environment variables.

### 2. Build the application

```bash
pnpm build
```

### 3. Run database migrations

```bash
pnpm db:push
```

### 4. Seed initial data

```bash
pnpm db:seed
pnpm db:seed-admin
```

### 5. Start production server

```bash
pnpm start
```

## Cross-Subdomain Authentication

To share authentication across subdomains (e.g., `app.burdych.net`, `admin.burdych.net`):

### 1. Update `src/lib/auth.ts`

```typescript
export const auth = betterAuth({
  // ... existing config
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: ".yourdomain.com", // Note the leading dot
    },
  },
  trustedOrigins: [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
    "https://app.yourdomain.com",
    "https://admin.yourdomain.com",
    // Add all subdomains that need auth
  ],
});
```

### 2. Set BETTER_AUTH_URL

In production environment:

```bash
BETTER_AUTH_URL=https://yourdomain.com
```

## Hosting Platforms

### Vercel

1. Connect your repository
2. Set environment variables in Vercel dashboard
3. Deploy

### Railway

1. Create new project from GitHub
2. Add PostgreSQL service
3. Set environment variables
4. Deploy

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["pnpm", "start"]
```

## Security Checklist

- [ ] Generate a strong `BETTER_AUTH_SECRET` (minimum 32 characters)
- [ ] Use a strong `ADMIN_PASSWORD`
- [ ] Enable HTTPS in production
- [ ] Set proper `trustedOrigins` for CORS
- [ ] Use environment variables for all secrets (never commit `.env`)
- [ ] Enable rate limiting on auth endpoints (consider adding to auth config)

## Troubleshooting

### "Cannot POST /api/auth/..."

Ensure the API route file is `src/routes/api/auth/$.ts` (not `.tsx`) and uses `createFileRoute` with `server.handlers`.

### Session not persisting

Check that `BETTER_AUTH_SECRET` is set and consistent across deployments.

### Cross-subdomain cookies not working

1. Verify `crossSubDomainCookies.domain` starts with a dot (`.yourdomain.com`)
2. Ensure all subdomains are listed in `trustedOrigins`
3. Confirm HTTPS is enabled on all domains

## Scripts Reference

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm docker:up` | Start PostgreSQL container |
| `pnpm docker:down` | Stop PostgreSQL container |
| `pnpm docker:reset` | Reset database (delete all data) |
| `pnpm db:push` | Push schema to database |
| `pnpm db:seed` | Seed portfolio data |
| `pnpm db:seed-admin` | Create admin user |
| `pnpm db:studio` | Open Drizzle Studio |

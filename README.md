# Payload CMS Boilerplate

Production-ready Payload CMS 3.x + Next.js 15 + PostgreSQL boilerplate by [4Runners](https://4runners.fr).

## Quick Start

```bash
# 1. Copy environment variables
cp .env.example .env
# Edit .env and set PAYLOAD_SECRET (use: openssl rand -base64 32)

# 2. Start PostgreSQL
docker compose up -d

# 3. Install dependencies
pnpm install

# 4. Start dev server
pnpm dev

# 5. Open http://localhost:3000/admin
```

## Stack

| Technology | Version |
|---|---|
| Payload CMS | ^3.79.0 |
| Next.js | ^15.4.11 |
| React | 19 |
| TypeScript | 5.7+ |
| PostgreSQL | 17 (via Docker) |
| Tailwind CSS | v4 |
| pnpm | 10.27.0 |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript type check |
| `pnpm format` | Format with Prettier |
| `pnpm generate:types` | Generate Payload types |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm db:fresh` | Reset database (fresh migration) |

## Project Structure

See [CLAUDE.md](./CLAUDE.md) for full architecture documentation.

## License

Private - 4Runners Agency

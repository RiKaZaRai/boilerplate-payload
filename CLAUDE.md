# CLAUDE.md -- payload-boilerplate

Boilerplate CMS Payload 3.x + Next.js + PostgreSQL pour 4Runners.

## Stack

- **CMS**: Payload CMS ^3.79.0
- **Framework**: Next.js 16.2.0-canary.54 (App Router, Turbopack enabled)
- **React**: 19
- **TypeScript**: 5.7+
- **Database**: PostgreSQL (always, via @payloadcms/db-postgres + Drizzle ORM)
- **Rich Text**: Lexical (@payloadcms/richtext-lexical)
- **CSS**: Tailwind CSS v4
- **Package Manager**: pnpm (always)
- **Image Processing**: sharp

## Architecture

```
src/
  payload.config.ts      # Payload main config
  access/                # Access control helpers (anyone, authenticated, checkRole)
  app/
    (frontend)/          # Public-facing Next.js pages
    (payload)/           # Payload admin panel + API routes
  blocks/                # Payload blocks (Hero, Content, CTA, etc.)
  collections/           # Payload collections (Pages, Posts, Media, Users, Categories)
  fields/                # Reusable field configs (slug, link, defaultLexical)
  globals/               # Payload globals (Header, Footer, SiteSettings)
  hooks/                 # Shared hooks (populatePublishedAt, revalidateRedirects)
  plugins/               # Plugin configs, each in its own file
  seed/                  # Database seed script
  utilities/             # Helper functions (getURL, generatePreviewPath)
```

### Live Preview

- Enabled in Payload admin config with breakpoints (mobile, tablet, desktop)
- `RefreshRouteOnSave` component in `src/app/(frontend)/components/RefreshRouteOnSave.tsx` triggers Next.js router refresh on save
- Uses `@payloadcms/live-preview-react` — add `<RefreshRouteOnSave />` to frontend layouts to activate

```
```

## Conventions

- **Namespace**: `@cms/*` maps to `./src/*` (renamed to `@{project-name}/*` during scaffold)
- **Naming**: kebab-case for files and folders
- **Access control**: Use helpers from `src/access/` (anyone, authenticated, authenticatedOrPublished, checkRole)
- **Blocks**: Each block has its own folder with a `config.ts`. All exported from `blocks/index.ts`
- **Formatter**: Prettier (semi, singleQuote, trailingComma: all, printWidth: 100, tabWidth: 2)
- **Linter**: ESLint flat config

## Database

- **Always PostgreSQL** -- no MongoDB option
- Connection string via `DATABASE_URL` env var
- Dev database name: `cms_dev`
- Docker Compose provided for local PostgreSQL
- Migrations: `pnpm db:migrate` / `pnpm db:migrate:create`
- Seed: `pnpm db:seed`

## Plugins Architecture

Plugins are in `src/plugins/`, each in its own file for clean removal:

**Always included:**
- `seo.ts` -- SEO meta for pages + posts
- `redirects.ts` -- URL redirects
- `nestedDocs.ts` -- Nested categories

**Optional (remove if not needed):**
- `search.ts` -- Search indexing for posts
- `formBuilder.ts` -- Form builder
- `importExport.ts` -- Import/export data

**Stubs (configure when needed):**
- `ecommerce.ts` -- E-commerce (newer plugin)
- `multiTenant.ts` -- Multi-tenancy

## Commands

```bash
pnpm dev              # Start dev server (Turbopack via --turbo flag)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint
pnpm typecheck        # TypeScript check
pnpm format           # Prettier format
pnpm generate:types   # Generate Payload types
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:fresh         # Fresh migration (reset)
```

## Getting Started

1. `cp .env.example .env` and set `PAYLOAD_SECRET` (use `openssl rand -base64 32`)
2. `docker compose up -d` (PostgreSQL)
3. `pnpm install`
4. `pnpm dev`
5. Visit http://localhost:3000/admin to create first user, or run `pnpm db:seed`

## Security Rules

- Never use `rm -rf`. Always use `trash` instead.
- Never commit `.env` files.
- Always use role-based access control via `checkRole` helper.

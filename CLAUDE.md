# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js 16 Breaking Changes

This project uses Next.js 16.2, which has breaking changes from earlier versions. **Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.** APIs, conventions, and file structure may differ from training data. Heed deprecation notices.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (uses eslint.config.mjs flat config)
```

### Database Commands (Prisma + SQLite)

```bash
npx prisma generate          # Generate Prisma client
npx prisma db push           # Push schema changes to database
npx prisma migrate dev       # Create and apply migrations
npx prisma studio            # Open database GUI
npx ts-node prisma/seed.ts   # Seed database with initial data
```

## Tech Stack

- **Next.js 16.2** with App Router
- **React 19.2** with React Compiler enabled (`reactCompiler: true` in next.config.ts)
- **TypeScript 5** with strict mode
- **Tailwind CSS 4** via PostCSS
- **ESLint 9** with flat config format
- **Prisma** with SQLite (dev.db)
- **NextAuth.js** with credentials provider for admin auth

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout with Header/Footer and font config
│   ├── page.tsx      # Homepage (landing page sections)
│   ├── globals.css   # Global styles with Tailwind
│   ├── about/        # About page route
│   ├── admin/        # Admin panel (separate layout, no Header/Footer)
│   └── api/          # API routes (auth, admin endpoints)
├── components/       # React components
│   ├── ui/           # Reusable UI primitives (Button, Input, Section, SectionHeader)
│   │   └── index.ts  # Barrel export for ui components
│   ├── admin/        # Admin-specific components
│   └── *.tsx         # Page section components (Hero, Services, About, etc.)
├── lib/              # Shared utilities (prisma client, auth config)
├── styles/           # Component-specific CSS files
│   ├── ui/           # UI component styles
│   └── admin/        # Admin panel styles
└── types/            # TypeScript type definitions
prisma/
├── schema.prisma     # Database schema
├── seed.ts           # Database seeding script
└── migrations/       # Prisma migrations
```

## Architecture Patterns

**Path Alias:** Use `@/*` to import from `src/` (configured in tsconfig.json)

**Component CSS Pattern:** Each component imports its CSS from `@/styles/`:
```tsx
import '@/styles/component-name.css';
```

**UI Components:** Import from barrel file:
```tsx
import { Button, Input, Section, SectionHeader } from '@/components/ui';
```

**Section Pattern:** Page sections use the `Section` component with background variants:
```tsx
<Section background="white|gray|dark" id="section-id">
```

**Admin Layout:** Admin routes (`/admin/*`) use a separate layout without Header/Footer. Protected pages wrap content with `AdminLayout` component which includes Sidebar and SessionProvider.

## Fonts

Two Google Fonts configured in layout.tsx:
- **Poppins** (`--font-poppins`): Body text
- **Playfair Display** (`--font-playfair`): Headings

## Localization

Site supports multiple languages (ru, en, hy). Database stores translations via `*Translation` models linked to parent entities.

## Authentication

Admin authentication uses NextAuth.js with credentials provider:
- Auth config in `src/lib/auth.ts`
- Login page at `/admin/login`
- Session strategy: JWT (24 hour expiry)
- Default admin: admin@lsa.am / admin123 (from seed)

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - SQLite connection string (e.g., `file:./dev.db`)
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `NEXTAUTH_URL` - Base URL for NextAuth

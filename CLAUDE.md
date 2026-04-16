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

## Tech Stack

- **Next.js 16.2** with App Router
- **React 19.2** with React Compiler enabled (`reactCompiler: true` in next.config.ts)
- **TypeScript 5** with strict mode
- **Tailwind CSS 4** via PostCSS
- **ESLint 9** with flat config format

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout with Header/Footer and font config
│   ├── page.tsx      # Homepage (landing page sections)
│   ├── globals.css   # Global styles with Tailwind
│   └── about/        # About page route
├── components/       # React components
│   ├── ui/           # Reusable UI primitives (Button, Input, Section, SectionHeader)
│   │   └── index.ts  # Barrel export for ui components
│   └── *.tsx         # Page section components (Hero, Services, About, etc.)
└── styles/           # Component-specific CSS files
    └── ui/           # UI component styles
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

## Fonts

Two Google Fonts configured in layout.tsx:
- **Poppins** (`--font-poppins`): Body text
- **Playfair Display** (`--font-playfair`): Headings

## Localization

Site is in Armenian (lang="hy"). Content is in Armenian with some transliterated text.

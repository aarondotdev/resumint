# CLAUDE.md

## Project Overview

**my-resume-builder** - A Next.js resume builder application.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Linting:** ESLint 9 with next config
- **Package Manager:** npm

## Project Structure

```
src/
  app/           # App Router pages and layouts
    layout.tsx   # Root layout
    page.tsx     # Home page
    globals.css  # Global styles (Tailwind imports)
public/          # Static assets
```

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Conventions

- Use the `src/` directory for all source code
- Use `@/*` import alias (maps to `./src/*`)
- App Router: pages are `page.tsx`, layouts are `layout.tsx`
- Colocate components near where they're used; extract to `src/components/` when shared
- Use Server Components by default; add `"use client"` only when needed (hooks, event handlers, browser APIs)
- Style with Tailwind utility classes; avoid custom CSS unless necessary
- Keep components small and focused

## TypeScript

- Strict mode is enabled
- Prefer `interface` for object shapes, `type` for unions/intersections
- Always type component props explicitly

## Git

- Repository initialized with git
- Commit messages should be concise and descriptive

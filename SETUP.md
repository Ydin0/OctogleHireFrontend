# OctogleHire Frontend — Developer Setup

## Tech Stack

| Component | Version |
|-----------|---------|
| Next.js (App Router) | 16 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| UI Components | shadcn (Radix UI + Base UI) |
| Forms | react-hook-form + Zod |
| Auth | Clerk (@clerk/nextjs) |
| Icons | Lucide React |
| Animations | Motion |
| Tables | TanStack React Table |
| Content | Velite |

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** (ships with Node)
- Access to the backend repo running locally OR the staging backend URL
- Clerk account credentials (ask the team lead)

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Ydin0/OctogleHireFrontend.git
cd OctogleHireFrontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Then edit .env.local — see "Environment Variables" below

# 4. Start the dev server
npm run dev
# App runs at http://localhost:3000
```

## Environment Variables

Create a `.env.local` file in the root. Required variables:

```env
# Clerk Auth (ask the team lead for dev keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Optional — analytics (not needed for local dev)
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_CLARITY_ID=
```

> The only variables you **must** set to develop locally are the Clerk keys and the API base URL. Everything else is optional.

## Available Scripts

```bash
npm run dev      # Start Next.js dev server (port 3000)
npm run build    # Production build
npm start        # Run production build
npm run lint     # Run ESLint
```

## Project Structure

```
octoglehire/
├── app/                        # Next.js App Router (all routes)
│   ├── layout.tsx             # Root layout (theme, analytics, Clerk)
│   ├── page.tsx               # Homepage
│   ├── admin/dashboard/       # Admin dashboard pages
│   ├── companies/dashboard/   # Company portal pages
│   ├── developers/dashboard/  # Developer portal pages
│   ├── agencies/dashboard/    # Agency portal pages
│   ├── apply/                 # Developer application flow
│   ├── blog/                  # Blog (velite-powered)
│   ├── hire/                  # SEO hire pages (dynamic)
│   ├── compare/               # Competitor comparison pages
│   ├── start/                 # Lead capture form
│   ├── calculate/             # Savings calculator
│   └── get-started/           # Marketing landing page
├── components/                 # Shared React components
│   ├── ui/                    # shadcn/Radix primitives (button, input, dialog, etc.)
│   ├── marketing/             # Marketing page components (hero, footer, navbar, etc.)
│   ├── analytics/             # GA, Meta Pixel, Clarity
│   └── shared/                # Cross-portal shared components
├── lib/                        # Utilities
│   ├── api/                   # API client functions (companies.ts, agencies.ts, admin.ts)
│   ├── analytics/             # Meta pixel helpers, Calendly hook
│   ├── schemas/               # Zod validation schemas
│   ├── data/                  # Static data (countries, topics, etc.)
│   └── seo.ts                 # SEO helpers (JSON-LD, absoluteUrl, etc.)
├── public/                     # Static assets (logos, images, SVGs)
├── content/                    # Blog posts (MDX via Velite)
├── types/                      # TypeScript type definitions
└── .velite/                    # Generated Velite output (auto-generated, don't edit)
```

## Key Patterns

### API Calls
All API calls go through typed functions in `lib/api/`:
- `lib/api/companies.ts` — Company & admin company operations
- `lib/api/agencies.ts` — Agency operations
- `lib/api/admin.ts` — Admin-specific operations

Each function follows the same pattern:
```typescript
export async function fetchSomething(token: string | null): Promise<Thing | null> {
  if (!token) return null;
  const res = await fetch(`${apiBaseUrl}/api/...`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as Thing;
}
```

### Server vs Client Components
- **Server components** (default): fetch data using `await auth()` from Clerk, pass to client children
- **Client components** (`"use client"`): use `useAuth()` hook from Clerk, handle interactivity

### Styling
- Tailwind CSS 4 — utility classes
- The design system uses a `pulse` colour (light blue) as the accent
- `rounded-full` on all buttons
- `font-mono` for rates/prices
- No gradients, no glows, no blur orbs (clean minimal aesthetic)
- Dark mode is the default

### Forms
- `react-hook-form` with `zodResolver` for validation
- Schemas in `lib/schemas/`
- `PhoneInput` component for phone fields (`components/phone-input.tsx`)
- Honeypot field (`website`) on public forms for anti-spam

### Authentication
- Clerk handles all auth
- 4 roles: `admin`, `super_admin`, `company`, `developer`, `agency`
- Users can have multiple roles (comma-separated in `account_type`)
- `fetchUserRole()` in `lib/auth/` resolves the active role

## Connecting to the Backend

The frontend needs the backend API running. Options:

1. **Run the backend locally** — see the backend SETUP.md
2. **Use the staging backend** — set `NEXT_PUBLIC_API_BASE_URL=https://api.octogle.com` in `.env.local`

> If using the staging backend, you'll need matching Clerk keys (dev keys won't work with prod Clerk).

## Common Tasks

### Adding a new page
1. Create `app/your-route/page.tsx` (server component)
2. Add metadata export for SEO
3. Add JSON-LD schema if it's a public page (use `JsonLd` component)

### Adding a new UI component
1. Use `npx shadcn@latest add <component>` for shadcn primitives
2. Or create in `components/` following existing patterns

### Adding a new API function
1. Add the TypeScript type to the appropriate file in `lib/api/`
2. Add the fetch function following the existing pattern
3. Use `cache: "no-store"` for data that shouldn't be cached

## Deployment

- **Hosted on Vercel** — auto-deploys from `main` branch
- Environment variables are set in Vercel dashboard
- `NEXT_PUBLIC_*` vars are baked into the client bundle at build time

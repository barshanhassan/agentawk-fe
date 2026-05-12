# EZCONN Codebase Instructions for AI Agents

## Project Overview

EZCONN is a **multi-channel SaaS communication platform** with a monorepo structure featuring:
- **Frontend**: React + TypeScript (Vite) with Radix UI + Tailwind CSS
- **Backend**: NestJS framework with Prisma ORM
- **Shared**: TypeScript schemas for type safety across client/server

**Key Product Areas**: Conversations/Inbox management, Bot/Agent systems, Campaign management, Templates, Contacts, WhatsApp integration, User/Workspace management, and Billing.

---

## Architecture & Data Flow

### Project Structure
```
root/
├── client/              # React SPA (port development assumed)
│   └── src/
│       ├── pages/       # Route pages (one per route)
│       ├── components/  # Reusable components + sections/
│       ├── contexts/    # React Context (TabContext, DateRangeContext, etc.)
│       ├── hooks/       # Custom hooks (use-mobile, use-toast)
│       └── lib/         # Utilities (queryClient for React Query, utils.ts)
├── server/              # NestJS API server (port 3000)
│   └── src/
│       ├── app.module.ts       # Module imports: Auth, Workspace, Tenant, Role, User
│       └── {feature}/          # Feature modules (minimal implementation)
├── shared/              # Drizzle ORM schemas (typed with Zod)
└── config files         # Tailwind, Vite, Drizzle, Prisma configs
```

### Client-Server Communication
- **Query Layer**: React Query via `queryClient.ts` with `apiRequest()` utility
- **Auth**: Cookie-based (`demoLogin=true` for demo; production uses proper session)
- **Error Handling**: 401 responses trigger auth flow; 404/5xx logged to Problems panel

---

## Key Conventions & Patterns

### Frontend Patterns

**Component Organization**:
- Page components in `/pages` handle routing and layout composition
- Feature-specific UI in `/components/sections` (e.g., `UserManagementSection`, `DeveloperSettingsSection`)
- Shared primitives in `/components/ui` (Radix-based: Button, Input, Dialog, etc.)
- Context providers for cross-page state: `TabProvider`, `DateRangeProvider`, `ThemeProvider`

**Styling**: Tailwind CSS with custom color variables (HSL format: `--primary`, `--foreground`, `--muted-foreground`, etc.). See [design_guidelines.md](design_guidelines.md) for spacing scale and component patterns.

**State Management**:
- React Context for global UI state (active tab, date range, theme)
- React Query for server state (queries with `getQueryFn({ on401: "throw" })`)
- Local state for forms and UI toggles

**Navigation**: `wouter` library (lightweight router). Routes defined in `App.tsx` with `ProtectedRoute` wrapper checking `demoLogin` cookie.

### Backend Patterns

**Module Structure** (NestJS): Each feature has a `.module.ts` importing controllers, providers, and dependencies. Modules imported into `AppModule`. Currently minimal controller implementation (stubs in Auth, Role, User modules).

**Swagger Docs**: Auto-generated at `/api` endpoint. Update via `DocumentBuilder` in `main.ts`.

**Database**: Prisma ORM with MySQL. Schema in `server/prisma/schema.prisma` (currently sparse).

**Feature Modules**: Auth, Workspace, Tenant, Role, User, CacheModule (Redis via cache-manager), DatabaseModule (Prisma service).

---

## Styling & Design System

**Reference**: [design_guidelines.md](design_guidelines.md)

**Key Patterns**:
- **Cards**: `shadow-sm`, `rounded-lg`, top border (3px accent), `p-6`
- **Typography**: Montserrat font, sizes via semantic classes (h1, h2, h4, body, small)
- **KPI Cards**: Large metric + percentage trend + info tooltip
- **Tables**: Alternating rows, 48px height, icon action buttons (edit/preview/clone/delete), bulk checkboxes
- **Buttons**: Primary (solid), Secondary (outline), Icon-only (32px square), size variants (Small/Default/Large)
- **Icons**: Feather Icons (primary), Font Awesome (specialty). 16px standard, 20px headers, 24px emphasis

**Spacing Scale**: Tailwind units 1, 2, 3, 4, 6, 8, 12, 16, 20. Default component padding `p-4` to `p-6`.

---

## Critical Developer Workflows

### Development

**Start dev environment**:
```bash
npm run dev                    # Runs server in watch mode from root
npm run check                  # TypeScript check across all projects
```

**Client only**:
```bash
cd client && npm install && npm run dev   # Vite dev server (auto-proxy to server if configured)
```

**Server only**:
```bash
cd server && npm run start:dev    # NestJS watch mode, port 3000
npm run lint                      # ESLint fix
npm run test                      # Jest unit tests
npm run test:e2e                  # End-to-end tests
```

### Database

```bash
npm run db:push                   # Push Drizzle ORM schema changes to MySQL
cd server && npx prisma generate  # Generate Prisma client (run before build)
```

### Building & Deployment

```bash
npm run build                     # Vite build (outputs to dist/public)
npm run start                     # Node dist/main.js (production)
cd server && npm run build        # NestJS compilation to dist/
```

---

## Integration Points & External Dependencies

### Integrations (Implemented/Planned)
- **WhatsApp Manager**: Campaign creation, messaging, status tracking (CampaignManager page)
- **Stripe/Billing**: BillingPage references subscription logic
- **Firebase**: firebase.json present (optional auth/hosting)
- **Webhooks**: DeveloperSettingsSection manages webhook configuration and events

### Key External Libraries
- **UI**: `@radix-ui/*` (accessibility primitives), `lucide-react` (icons), `@uiw/react-md-editor` (markdown)
- **Forms**: `@hookform/resolvers` + `zod` for validation
- **Data Fetching**: `@tanstack/react-query` with custom `apiRequest()` wrapper
- **Utilities**: `clsx` (conditional classes), `date-fns` (date handling implied via DateRangePicker)
- **Server**: `@nestjs/*`, `@prisma/client`, `cache-manager`, `swagger-ui-express`

---

## Project-Specific Patterns to Follow

1. **Type Safety**: Prefer interfaces for component props; use Zod schemas (from `shared/schema.ts`) for data validation.

2. **Contexts for Cross-Component State**: Define in `client/src/contexts/` and export both Provider component and hook (e.g., `useDateRange()`). See `DateRangeContext.tsx` and `TabContext.tsx`.

3. **Query Client Pattern**: Use `getQueryFn()` from `queryClient.ts` for all API calls. Handles 401 auth errors and credentials. Example: `queryKey: ['/api/users']`.

4. **Protected Routes**: Wrap page components with `<ProtectedRoute>` in `App.tsx` Router to enforce authentication.

5. **Modal/Dialog Patterns**: Use Radix Dialog component with state managed in parent (e.g., `showModal`, `setShowModal`). See `ExportModal.tsx`, `CampaignManager.tsx` dialogs.

6. **Section Components**: For Settings/Profile pages, break into reusable sections (e.g., `ProfileSection`, `UserManagementSection`). Each is standalone with local state.

7. **API Requests**: Use `apiRequest(method, url, data)` for non-Query fetch operations (mutations). For reads, prefer React Query queries.

---

## Known Limitations & TODOs

- **Backend Modules**: Auth, Role, User, Workspace, Tenant modules are stubs (no controllers/services implemented yet)
- **Database**: Prisma schema is minimal; Drizzle ORM in shared/ but not fully integrated into backend
- **Authorization**: Draft plans exist ([authorization draft plan 1.md](server/authorization%20draft%20plan%201.md)); RBAC not yet implemented
- **Demo Mode**: Login uses cookie-based demo auth; production auth flow needs implementation
- **Webhook System**: UI exists but backend integration incomplete

---

## Commands Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` (root) |
| Start dev (full stack) | `npm run dev` |
| Type check | `npm run check` |
| Build all | `npm run build` |
| Lint server | `cd server && npm run lint` |
| Test server | `cd server && npm run test` |
| Swagger docs | `http://localhost:3000/api` |
| DB schema sync | `npm run db:push` |

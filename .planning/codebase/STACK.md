# Technology Stack

**Analysis Date:** 2026-02-24

## Languages

**Primary:**
- TypeScript 5.0 - Full codebase with strict type checking enabled
- JavaScript/JSX - React components and configuration files

**Secondary:**
- CSS/Tailwind - Styling all UI components
- Shell - Deployment and service management scripts

## Runtime

**Environment:**
- Node.js 18+ - Server runtime (specified in README)

**Package Manager:**
- npm - Dependency management
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 14.2.35 - Full-stack React framework with App Router
  - API routes in `src/app/api/`
  - Server-side and client-side rendering
  - Built-in middleware support via `src/middleware.ts`

**UI & Rendering:**
- React 18.3.1 - Component library and hooks
- Recharts 2.15.1 - Data visualization for dashboard metrics

**Styling:**
- Tailwind CSS 3.3.0 - Utility-first CSS framework
- PostCSS 8 - CSS processing via `postcss.config.mjs`
- Autoprefixer 10.0.1 - Browser compatibility

**Icons & Components:**
- Lucide React 0.475.0 - Icon library (Zap, LayoutDashboard, Users, Calendar, CheckSquare, etc.)

**Utilities:**
- date-fns 4.1.0 - Date manipulation and formatting

## Key Dependencies

**Critical:**
- `next`: 14.2.35 - Framework backbone for API routes and server rendering
- `react`: 18.3.1 - UI library for components
- `recharts`: 2.15.1 - Meeting and task statistics visualization

**Infrastructure:**
- `tailwindcss`: 3.3.0 - Core styling system
- `lucide-react`: 0.475.0 - UI icon system used throughout dashboard
- `date-fns`: 4.1.0 - ISO date formatting for API responses

**Build & Dev:**
- `typescript`: 5.0 - Type checking
- `eslint`: 8 - Code linting
- `eslint-config-next`: 14.2.35 - Next.js linting rules
- `@types/node`: 20 - Node.js type definitions
- `@types/react`: 18 - React type definitions
- `@types/react-dom`: 18 - React DOM type definitions

## Configuration

**Environment:**
- `.env.local` file (git-ignored) - Contains API keys and credentials
- Environment variables required:
  - `TODOIST_API_TOKEN` - Bearer token for Todoist API
  - `FIREFLIES_API_KEY` - Bearer token for Fireflies GraphQL API
  - `AUTH_USERNAME` - Basic auth username (default: robbie)
  - `AUTH_PASSWORD` - Basic auth password
  - Optional: `PORT` (default: 3000), `HOSTNAME` (default: 0.0.0.0)

**TypeScript:**
- `tsconfig.json` - Strict mode enabled, module resolution set to "bundler"
- Path alias: `@/*` maps to `./src/*`
- JSX preserved for Next.js processing

**Build:**
- `next.config.mjs` - Minimal Next.js configuration (empty config object)
- `postcss.config.mjs` - Tailwind CSS processing via PostCSS

**Linting:**
- `.eslintrc.json` - Extends Next.js core web vitals and TypeScript rules

## Platform Requirements

**Development:**
- Node.js 18+
- npm (lockfile-based dependency resolution)
- Modern web browser (Chrome, Firefox, Safari)

**Production:**
- VPS with Ubuntu/Debian (documented in setup scripts)
- Systemd service manager for process management
- Nginx reverse proxy (for SSL termination and auth - installed by setup scripts)
- Let's Encrypt/Certbot for SSL certificates
- Domain name pointing to VPS IP
- Ports 80, 443, and SSH accessible in firewall

**Deployment Target:**
- Linux-based VPS (Ubuntu/Debian)
- Self-hosted deployment model
- Can run as system service or user service via Systemd
- Nginx reverse proxy in front (configured by `setup-https.sh` or `quick-https.sh`)

## Build Pipeline

**Development:**
```bash
npm run dev     # Next.js dev server on port 3000
npm run build   # Optimize production build
npm start       # Run production build
npm run lint    # ESLint code quality checks
```

**Production:**
```bash
npm run build   # Creates optimized .next/ build directory
npm start       # Starts Next.js server (launched via Systemd)
```

Build artifacts: `.next/` directory (git-ignored)

## Server Architecture

**Port Binding:**
- Default: Port 3000 (configurable via `PORT` env var)
- Bind address: 0.0.0.0 by default (configurable via `HOSTNAME` env var)
- In production: Should bind to 127.0.0.1 when behind Nginx reverse proxy

**Process Management:**
- Systemd service files: `mission-control.service` (system) and `mission-control-user.service` (user)
- Auto-restart on crash configured
- Auto-start on boot available

---

*Stack analysis: 2026-02-24*

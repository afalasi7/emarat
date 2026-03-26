# Emarat

Emarat is a production-oriented Next.js App Router scaffold for a prayer companion experience. The current implementation maps the core design flows into reusable code components, typed mock-backed data boundaries, desktop/mobile route variants, and an initial auth/settings slice that is ready for iterative backend integration.

## Stack

- Next.js App Router with TypeScript strict mode
- Tailwind CSS v4 with tokenized light/dark theme variables
- Headless UI primitives via Radix-based components
- Zustand for shared client state
- Zod for schemas and request validation
- React Hook Form for sign-in flows
- Vitest + Testing Library for utility and component coverage
- ESLint + Prettier for code quality

## Routes

- `/` overview
- `/prayer-times`
- `/qibla`
- `/settings`
- `/sign-in`
- `/desktop`
- `/desktop/prayer-times`
- `/desktop/qibla`
- `/desktop/settings`
- `/desktop/sign-in`

## Project Structure

```text
app/
  api/
  desktop/
  prayer-times/
  qibla/
  settings/
  sign-in/
components/
  layout/
  ui/
features/
  auth/
  overview/
  prayer-times/
  qibla/
  settings/
hooks/
lib/
  client/
  server/
store/
styles/
tests/
types/
```

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Quality gates:

```bash
npm run lint
npm run typecheck
npm test
```

## Implemented vs Mocked

Implemented now:

- Feature-based screens for overview, prayer times, qibla, settings, and auth
- Shared reusable layout primitives such as `AppShell`, `DesktopShell`, `PrayerCard`, `SectionCard`, `StatusChip`, `ModeToggle`, and `AuthFormCard`
- Light/dark theme system with CSS tokens
- Typed mock data and server/client boundaries for future API replacement
- Mock-backed auth session flow and settings persistence against a local JSON store
- Live Aladhan integration for prayer timings, Hijri label, and Qibla bearing with automatic fallback to local data when the external API is unavailable
- Utility modules for prayer formatting/countdown and qibla bearing calculations
- Unit tests for utilities and render tests across feature slices

Still mocked or intentionally provisional:

- Prayer time source and calculation service
- Geolocation and live compass integration for Qibla
- Push/local notifications and reminder delivery
- Real user database and production auth provider
- Device sync across actual platforms

## Runtime Environment

Optional server env vars:

- `EMARAT_CITY` (default: `Dubai`)
- `EMARAT_COUNTRY` (default: `UAE`)
- `EMARAT_PRAYER_METHOD` (default: `2`)
- `EMARAT_LATITUDE` (default: `25.2048`)
- `EMARAT_LONGITUDE` (default: `55.2708`)
- `EMARAT_DATA_FILE` (override JSON data path)

## Next Backlog

1. Replace JSON-backed mock services with real API adapters.
2. Integrate prayer calculations or a trusted prayer times API with city/location support.
3. Add device geolocation, heading sensors, and Qibla calibration UX.
4. Replace mock auth with a real identity provider and hardened session storage.
5. Add notification scheduling, quiet-hour logic, and background sync.

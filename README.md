# PulseBoard — IoT Device Monitoring Dashboard

[![CI](https://github.com/mksvlbv/pulseboard/actions/workflows/ci.yml/badge.svg)](https://github.com/mksvlbv/pulseboard/actions/workflows/ci.yml)

A real-time IoT device monitoring dashboard built with **Angular 19**, showcasing advanced features including NgRx state management, Apollo GraphQL, Angular Signals, RxJS reactive streams, and Chart.js data visualization.

> **Built entirely using AI-assisted development** with Windsurf (Cascade). See [PROMPT_LOG.md](./PROMPT_LOG.md) for the full development trace.

## Live Demo

> Deployment link TBD

## Features

- **Real-time Dashboard** — Live sensor updates via simulated WebSocket streams (RxJS `interval` + `share`), stat cards, and Chart.js charts that update in real-time
- **Device Management** — Full CRUD table with search, multi-filter, column sorting, pagination, and create modal
- **Device Detail** — Individual device view with 8 metric cards, live multi-dataset Chart.js history, and streaming readings table
- **Alerts Center** — NgRx-managed alerts with severity/status filters, real-time WebSocket alert injection, acknowledge/resolve workflow
- **Settings** — 14+ preference controls powered entirely by Angular Signals (`signal`, `computed`, `effect`)
- **Mock GraphQL API** — In-memory Apollo Link that resolves queries/mutations locally with simulated latency

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 19 (standalone components, new `@if`/`@for`/`@switch` syntax) |
| State | NgRx Store + Effects + Entity |
| API | Apollo Angular + custom mock Apollo Link |
| Reactive | RxJS 7 — streams, operators, WebSocket simulation |
| Signals | Angular Signals (`signal`, `computed`, `effect`) |
| Charts | Chart.js (bar, line, multi-dataset) |
| Styling | SCSS with CSS custom properties, dark theme |
| Build | Angular CLI 19 |

## Architecture

```
src/app/
├── core/
│   ├── models/          # TypeScript interfaces (Device, Alert, SensorReading)
│   ├── data/            # Mock device & alert datasets
│   └── services/        # WebSocketSimulatorService (RxJS streams)
├── graphql/
│   ├── graphql.module.ts  # Mock Apollo Link with in-memory resolvers
│   └── queries.ts         # GQL query & mutation documents
├── store/
│   ├── devices/         # NgRx actions, reducer, selectors, effects
│   └── alerts/          # NgRx actions, reducer, selectors, effects
├── shared/
│   └── layout/          # Sidebar + header shell component
└── features/
    ├── dashboard/       # Stats, charts, device list, live feed
    ├── devices/         # CRUD table with filters & pagination
    ├── device-detail/   # Single device metrics + live chart
    ├── alerts/          # Alert cards with actions
    └── settings/        # Signals-powered preferences
```

## Performance

- `ChangeDetectionStrategy.OnPush` on all feature components
- NgRx Entity adapter for normalized state
- Lazy-loaded routes via `loadComponent()`
- `takeUntil` pattern for subscription cleanup

## Accessibility

- `aria-label` on all interactive elements (buttons, inputs, selects, navigation links)
- `role="dialog" aria-modal="true"` on modals with Escape-to-close
- `role="status" aria-live="polite"` on live counters
- `tabindex="0"` on scrollable regions
- Global `:focus-visible` styles for keyboard navigation
- axe-core WCAG 2.1 AA audit via Playwright (0 critical/serious violations)

## Getting Started

```bash
npm install
npm start           # http://localhost:4300
```

## Testing

```bash
npm test                 # 21 unit tests (Karma + Jasmine)
npm run e2e              # 112 E2E tests (Desktop Chrome + Mobile iPhone SE)
npm run e2e:headed       # Run E2E with browser visible
npm run e2e:screenshots  # Generate 20 screenshots
```

**Unit tests:** NgRx selectors, reducer, WebSocket simulator service (TestBed + fakeAsync).
**E2E coverage:** navigation, dashboard, devices (CRUD + search + filters), device detail, alerts (acknowledge/resolve), settings (toggles + persistence), accessibility audit (axe-core).

### Screenshots

Desktop and mobile screenshots for all pages and interaction states in `e2e/screenshots/`:

| Page | Initial | Interaction States |
|------|---------|-------------------|
| Dashboard | `desktop-dashboard.png` | `desktop-dashboard-live.png` (live charts + feed) |
| Devices | `desktop-devices.png` | `desktop-devices-create-modal.png`, `desktop-devices-search.png` |
| Device Detail | `desktop-device-detail.png` | `desktop-device-detail-live.png` (live readings) |
| Alerts | `desktop-alerts.png` | `desktop-alerts-acknowledged.png` |
| Settings | `desktop-settings.png` | — |

All pages also have `mobile-*` variants (iPhone SE viewport).

## Build

```bash
ng build            # 0 errors, 0 warnings
tsc --noEmit        # 0 TypeScript errors
```

## Key Angular Concepts Demonstrated

1. **Standalone Components** — No NgModules; all components use `standalone: true`
2. **New Template Syntax** — `@if`, `@for`, `@switch`, `@let` block syntax
3. **Lazy Loading** — All feature routes use `loadComponent()`
4. **NgRx Entity** — `createEntityAdapter` for normalized device/alert state
5. **NgRx Effects** — Side effects for GraphQL queries and mutations (CRUD + acknowledge/resolve)
6. **Angular Signals** — Full settings page with `signal()`, `computed()`, `effect()`
7. **RxJS Patterns** — `interval`, `share`, `scan`, `filter`, `switchMap`, `takeUntil`, `Subject`
8. **Apollo GraphQL** — Custom `ApolloLink` with mock resolvers
9. **Chart.js Integration** — Dynamic chart updates from observable streams
10. **Responsive Design** — Mobile bottom-nav, breakpoints, touch-friendly targets
11. **Form Validation** — Create Device modal with required fields + disabled submit
12. **Delete Confirmation** — Browser confirm dialog before destructive actions

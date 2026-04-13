# PROMPT_LOG — PulseBoard AI Development Trace

This document records every significant AI-assisted development step used to build PulseBoard, an IoT device monitoring dashboard built with Angular 19.

**AI Tools:** Windsurf (Cascade), Claude Sonnet
**Development Approach:** AI-assisted architecture & implementation with human review at each stage

---

## Phase 1: Architecture & Scaffolding

### 1.1 — Project Design
Designed PulseBoard as an IoT device monitoring dashboard. Selected Angular 19 with standalone components, NgRx for state management, Apollo Angular for GraphQL, and Chart.js for data visualization.

### 1.2 — Project Setup
Scaffolded Angular 19 project with standalone components, SCSS, and routing. Installed core dependencies: `@ngrx/store@19`, `@ngrx/effects@19`, `@ngrx/entity@19`, `apollo-angular`, `@apollo/client`, `graphql`, `chart.js`.

---

## Phase 2: Core Architecture

### 2.1 — Data Models & Mock Data
Created TypeScript interfaces for `Device` (16 properties), `Alert` (severity/status workflow), and `SensorReading`. Built 8 realistic IoT devices and 7 alerts with 24-hour historical readings.

### 2.2 — Mock GraphQL API
Built a custom Apollo `ApolloLink` resolving queries/mutations in-memory. Supports 8 operations (CRUD for devices, acknowledge/resolve for alerts) with simulated 150-350ms latency.
**Decision:** Mock Apollo Link keeps the project self-contained and deployable as a static site while demonstrating real Apollo integration patterns.

### 2.3 — NgRx Store
Implemented full NgRx architecture with two slices:
- **Devices:** EntityAdapter, `createActionGroup`, 10+ selectors, GraphQL effects
- **Alerts:** EntityAdapter with timestamp sort, severity/status filtering selectors, GraphQL effects

---

## Phase 3: Reactive Services

### 3.1 — WebSocket Simulator
Created `WebSocketSimulatorService` with advanced RxJS patterns:
- `sensorStream$` — `interval(3000)` + `share()` for multicast sensor updates
- `alertStream$` — `interval(15000)` for periodic alert generation
- `rollingAverage$()` — Per-device rolling average using `scan`
- Cleanup via `takeUntil(destroy$)`

---

## Phase 4: UI Implementation

### 4.1 — Layout Shell
Sidebar navigation with SVG icons, active route highlighting, NgRx-driven alert badge counter, system status indicator. Dark theme via CSS custom properties.

### 4.2 — Dashboard
4 stat cards, 2 live Chart.js charts (energy bar + temperature line), device status list, WebSocket-powered live sensor feed. All reactive via NgRx selectors + RxJS streams.

### 4.3 — Devices
CRUD table with search, multi-filter, column sorting, pagination, battery bars, create modal with form validation, delete confirmation dialog.

### 4.4 — Device Detail
8 metric cards, live multi-dataset Chart.js chart, recent readings table from filtered WebSocket stream.

### 4.5 — Alerts
Severity-colored alert cards, summary badges, filter dropdowns, acknowledge/resolve workflow through GraphQL Effects, real-time WebSocket alert injection.

### 4.6 — Settings
14+ controls powered by Angular Signals: `signal()` for state, `computed()` for derived values, `effect()` for persistence side-effects. Save/Reset with localStorage.

---

## Phase 5: Quality & Testing

### 5.1 — Build Fixes
Fixed standalone component pipe imports and template syntax restrictions (no arrow functions in Angular templates).

### 5.2 — Accessibility Audit
Added ARIA attributes (labels, roles, modals), keyboard navigation (tabindex on scrollable regions, focus-visible styles), WCAG 2.1 AA color contrast compliance.

### 5.3 — E2E Testing
Integrated Playwright with 112 tests across 7 spec files covering Desktop Chrome + Mobile iPhone SE. Added axe-core accessibility audits. Generated 20 screenshots (10 pages × 2 viewports) covering initial states and interaction states.

### 5.4 — Chart Rendering Fix
Fixed critical regression: `@ViewChild` canvas refs were `undefined` inside `@else` conditional block. Replaced with setter-based `@ViewChild` pattern to initialize charts when canvas elements appear in DOM.

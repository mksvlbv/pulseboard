# AI Architecture & Development Log

## Overview
This document details the AI-assisted development of **Pulseboard** — a high-performance Angular IoT monitoring dashboard utilizing NgRx, GraphQL, and Angular Signals.

## Methodology: Reactive State Engineering
Pulseboard demonstrates how AI can be leveraged for complex, reactive frontend architectures. 
1. **State Scaffolding:** I used Claude to architect the NgRx Store, defining Actions, Reducers, and Selectors before any UI implementation.
2. **Signal Migration:** The AI was utilized to progressively migrate traditional RxJS streams to Angular Signals for optimized change detection.
3. **GraphQL Integration:** Queries and mutations were generated alongside strict TypeScript interfaces for end-to-end type safety.

## Key Architectural Decisions

### Handling High-Frequency IoT Data Streams
AI models often suggest anti-patterns (like calling `detectChanges()` manually) when handling high-frequency data. 
To prevent performance degradation, I enforced a strict architectural constraint: "All IoT data must flow through an NgRx feature state and be exposed to the UI exclusively via Angular Signals." This ensured efficient UI updates without overwhelming the browser main thread.

### Accessibility (a11y) & Testing
I used AI to generate comprehensive Playwright E2E tests and ensure WCAG compliance. The LLM was prompted to audit the generated HTML and inject `aria` attributes, ensuring the complex data grids remained accessible to screen readers.

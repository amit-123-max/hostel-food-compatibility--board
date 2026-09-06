# Architectural Design Document

## Tech Stack & Justification
**Selected Stack:** React + Vite (Pure Client-Side)

We evaluated several options for this single-screen technical assessment and selected React powered by Vite. 
*   **Why not Vanilla HTML + JS + CSS?** While it offers a zero build step, manual DOM manipulation carries a severe risk of "stale DOM" and state synchronization bugs. Given the strict requirements for clearing errors and completely resetting the built-in seed data, the declarative rendering of a modern UI framework is critical for stability.
*   **Why not Next.js?** The problem statement strictly forbids backend infrastructure. Next.js introduces a Node.js server environment (Server Components, API routes) which directly violates the "Zero Backend" constraint. It is significant overkill for a purely in-memory application and adds unnecessary cognitive overhead during live interview modifications.
*   **Why React + Vite?** It provides the exact deterministic state-to-UI rendering needed to flawlessly handle strict "reset" and "error clearing" criteria. Vite offers an extremely fast hot-module replacement (HMR) environment, ideal for making live structural modifications during a tight 30-minute interview window, while strictly adhering to the client-side-only constraint.

## State Management Strategy
**Selected Approach:** ONLY native React `useState`

To ruthlessly prevent over-engineering, we will exclusively use React's native `useState` hook for all state management.
*   We actively evaluated and **rejected** complex global state libraries like Redux, MobX, or Zustand. Introducing them for a localized, single-screen application is unnecessary and adds detrimental boilerplate.
*   We also explicitly **rejected** React's `useReducer`. While capable of managing complex state transitions, the data flow in this application is straightforward enough that `useState` is perfectly sufficient. Prioritizing simplicity ensures the code remains maximally legible and easy to modify on the fly.

## Architecture & Separation of Concerns
This application strictly enforces a separation between the domain logic and the presentation layer.
*   **Pure JavaScript Domain Logic Engine:** The core compatibility calculations (diet matching, allergen exact matching, budget thresholding, sorting, and exact string normalization) will be built as pure, isolated functions. They will have zero knowledge of React or the DOM. This guarantees rigorous, independent unit testability of the business logic.
*   **Presentation Layer (React):** React will act solely as the "dumb" view layer. It will accept user input, pass it into the pure domain functions, and deterministically render the structured result object returned by the engine.

## Component Tree
To maintain simplicity and avoid deep prop-drilling, the React component structure will be exceptionally flat:
```text
<App>
  ├── <Header />
  ├── <GroupTable /> (Handles resident inputs)
  ├── <DishTable /> (Handles dish inputs & budget)
  ├── <Controls /> (Calculate and Reset actions)
  ├── <SearchBar /> (Filters the calculated compatible results)
  └── <CompatibilityResults /> (Renders calculated output or explicit error states)
```

## Data Flow
Data will flow strictly top-down via props. The root `<App />` component will hold the primary source of truth (Residents, Dishes, Budget, Search Query, Calculated Results, and Error States).
*   When a user modifies an input, the state in `<App />` updates.
*   Clicking the "Calculate" action passes the current state to the Pure Domain Logic Engine, which returns a new result array (or an error configuration) that is then stored back in `<App />`.
*   Deterministic state clearing (e.g., hiding results on `INVALID_INPUT` or triggering the "Reset" action) is handled organically. By simply updating the central state variables back to their default constants or setting an error string, React automatically propagates these changes top-down, instantly synchronizing the UI without any risk of stale DOM elements.

# Implementation Plan

### Step 0: Problem Analysis & Architecture Selection
*   **Action:** Analyze the strict constraints of the problem statement (zero backend, in-memory execution, strict string matching, and single-screen UI).
*   **Action:** Evaluate technology trade-offs with AI. Compare Vanilla JS (high risk of state-sync/stale DOM bugs) vs. Next.js (violates zero-backend constraint, high risk of over-engineering) vs. React + Vite.
*   **Action:** Selected React + Vite with purely native `useState` as the optimal stack. This ensures deterministic UI rendering for complex reset/error states while strictly avoiding the over-engineering of Redux, MobX, or even `useReducer`.
*   **Checkpoint:** Core constraints and technology choices are locked and explicitly documented in `CONSTRAINTS.md` and `DESIGN.md` prior to writing any implementation code.

<!-- ### Step 1: Contracts & Specifications
*   **Action:** Define the TypeScript interfaces/types for Resident, Dish, and Error states to match the exact schemas in the problem statement.
*   **Action:** Define the built-in seed data (Asha, Dev, Mira; D01-D05) exactly as contracted.
*   **Checkpoint:** Types compile successfully, and the seed data constants precisely mirror the problem description. -->

### Step 1: Contracts & Specifications
*   **Action:** Define the exact data shapes using pure JavaScript and standard JSDoc (`@typedef`) schemas to enforce strict contracts without the over-engineering overhead of a TypeScript compiler.
*   **Action:** Define the built-in seed data (Asha, Dev, Mira; D01-D05) exactly as contracted.
*   **Checkpoint:** JSDoc types provide IDE autocomplete, and the seed data constants precisely mirror the problem description.

### Step 2: Core Domain Logic & Unit Testing
*   **Action:** Implement the pure functions for normalizers (trim, uppercase).
*   **Action:** Implement the compatibility engine (Diet matching, Allergen exact matching, Budget thresholding).
*   **Action:** Implement the strict sorting and formatting logic for exclusion reasons.
*   **Checkpoint:** Comprehensive unit tests pass for the core engine, specifically verifying the exact exclusion reason order (e.g., `D03: DIET:Asha, ALLERGEN:Mira:MILK`) before any UI is built.

### Step 3: UI Implementation & State Management
*   **Action:** Build the primary screen layout (Group Table, Dish Table, Results Area).
*   **Action:** Wire up the local state to hold Residents, Dishes, Budget, and Search Query.
*   **Action:** Implement the "Calculate" action to trigger the domain logic and render results.
*   **Action:** Implement the "Reset" action to restore the built-in state.
*   **Checkpoint:** The UI renders the built-in data, correctly calculates D01 and D02 as compatible, and correctly filters D02 when searching for 'wheat'.

### Step 4: Edge Case Verification & Audit
*   **Action:** Implement validation checks (non-empty fields, positive integers, unique IDs) on input change or calculation.
*   **Action:** Implement the exact error state reporting (`INVALID_INPUT`, `DUPLICATE_DISH_ID`) and UI clearing behavior.
*   **Checkpoint:** Changing D01 price to 0 triggers the correct `INVALID_INPUT` error, clears the results table, and a subsequent Reset completely restores the valid state without stale errors.

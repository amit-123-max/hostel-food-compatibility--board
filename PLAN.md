# Implementation Plan

### Step 1: Contracts & Specifications
*   **Action:** Define the TypeScript interfaces/types for Resident, Dish, and Error states to match the exact schemas in the problem statement.
*   **Action:** Define the built-in seed data (Asha, Dev, Mira; D01-D05) exactly as contracted.
*   **Checkpoint:** Types compile successfully, and the seed data constants precisely mirror the problem description.

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

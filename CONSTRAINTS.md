# Architectural Boundaries & Constraints

To prevent over-engineering and ensure strict adherence to the problem statement, the following constraints are strictly enforced throughout development:

1. **Zero Backend & Infrastructure:** No databases, no external network services, no APIs, and no file uploads. All data must reside entirely in-memory.
2. State Management: Keep it simple. Use native state management provided by the UI framework (ONLY React useState). Do NOT introduce useReducer or complex state management libraries like Redux, MobX, or Zustand.
3. **Pure Functional Domain Logic:** The core compatibility engine (filtering, exclusion reasoning, validation) must be implemented as pure functions, completely decoupled from any UI components. This allows for rigorous independent unit testing.
4. **Exact String Matching:** All output formats, specifically exclusion reasons (`DIET:<resident>`, `ALLERGEN:<resident>:<tag>`, `OVER_BUDGET`) and error states (`INVALID_INPUT`, `DUPLICATE_DISH_ID`), must be exact string matches as defined in the contracts.
5. **UI Focus:** The interface must remain a single, attractive screen. Search should be incidental and applied only client-side to the already calculated compatibility results.

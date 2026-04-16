<!-- @format -->

Cricket Performance Tracker
A high-performance TypeScript application designed for real-time sports analytics. This project serves as a demonstration of modular architecture and functional programming principles in a modern web environment.

🚀 Engineering Highlights
Centralized State Management: Utilizes a "Single Source of Truth" pattern. All data mutations are funneled through a core synchronization engine (saveAndRefresh), ensuring a predictable and bug-resistant UI.

Functional Programming: Core logic is decoupled into "Pure Functions." Calculations for economy rates and ball counts are independent of the DOM, making the business logic easily portable to a backend environment.

Asynchronous UX: Features a custom, Promise-based modal system. This allows for clean async/await syntax in the UI logic, replacing messy callback chains and native blocking alerts.

Strict Type Integrity: Employs custom Interfaces and TypeScript Utility Types (e.g., Omit) to enforce data contracts from form input to local persistence.

🏗️ Design Patterns
Unidirectional Data Flow
To avoid the "Shared Mutable State" trap, data flows in a single direction. Functions receive the current state as parameters and return/pass updated sets, preventing side effects and making the application highly scalable.

Event Orchestration
Implementation of efficient event delegation and cleanup. The custom modal system manages its own lifecycle, overwriting listeners to prevent memory leaks and duplicate execution—a critical consideration for long-running browser applications.

🛠️ Tech Stack
TypeScript (ES6+): Compiled with strict null checks and modern module resolution.

Persistence: Browser LocalStorage API with automated data expiration logic (30-day lifecycle).

Build Pipeline: Standardized build process separating source logic from distribution-ready assets.

🔧 Setup
Run the TypeScript compiler in watch mode to automatically synchronize changes:

tsc -w

# Cricket Performance Tracker
[🔗 Live Demo](https://tevcodes.github.io/Cricket-Bowling-Peformance-Tracker/)

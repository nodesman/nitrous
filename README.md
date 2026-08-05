# tsalum 💎

A strict **Object Calisthenics Clarifier & Linter for TypeScript** designed to eliminate design debt at the point of creation, enabling seamless, zero-refactoring transitions from prototype to production.

---

## 💎 The Philosophy: Clarify AI Code like Alum Purifies Water

Just as **alum** is added to turbid water to cause floating microscopic impurities to coagulate and settle out into pure clarity, **`tsalum`** acts as a clarifying agent for your TypeScript codebase.

When you build at high speed—especially when **vibe coding** with AI agents—design discipline is often sacrificed for initial momentum. AI models write code sequentially, defaulting to nested control loops, flat structures, and primitive obsession because it is contextually convenient. 

Over time, this creates murky spaghetti code. 

**`tsalum` solves this.** By enforcing the [9 Laws of Object Calisthenics](file:///Users/rajsekharan/projects/foundry/tech/tsalum/docs/RULES.md), it acts as an immediate structural filter. It precipitates out technical debt (nested blocks, getters, loose primitives) and leaves pure, drinkable domain architecture:
*   **Zero-Refactor Shipping:** Your prototype code *is* production-ready code.
*   **Decoupled by Design:** No nested logic, no raw primitives leaking domain logic, and no bloated classes.
*   **Cognitive Relief:** Spend your energy innovating and designing features rather than wrestling with legacy code structures.

---

## 🤖 The AI Vibe-Coding Feedback Loop

LLMs lack design empathy and will generate structural mess if left unconstrained. Telling them to "write clean code" in a prompt is unreliable.

`tsalum` solves this by introducing a **programmatic steering loop**:
1.  **AI Generates Code:** The LLM outputs a block of TypeScript.
2.  **`tsalum` Filters the Build:** If a rule is violated (e.g., nesting control flows or exposing state via getters), `tsalum` throws a hard error in the build pipeline.
3.  **Self-Correction:** The LLM ingests the compiler/linter error as concrete context and is forced to refactor the code cleanly.

Instead of you manually refactoring the AI's output, the AI is programmatically guided by `tsalum` to write modular, testable structures on the first pass.

---

## 📜 The 9 Laws Enforced

`tsalum` parses the AST of your code in [linter.ts](file:///Users/rajsekharan/projects/foundry/tech/tsalum/src/linter.ts) to verify compliance with the 9 rules of Object Calisthenics:

| Law | Rule Name | Description |
| :--- | :--- | :--- |
| **1** | **One Level of Indentation** | Limit method nesting depth to 1. Extract nested blocks to helper functions. |
| **2** | **Don't Use "ELSE"** | Use Guard Clauses (early returns) or polymorphism to handle execution branches. |
| **3** | **Wrap All Primitives** | Wrap strings and numbers in semantic Value Objects (e.g., `EmailAddress` instead of `string`). |
| **4** | **First Class Collections** | A class containing an array/collection must contain no other properties. |
| **5** | **One Dot Per Line** | Adhere to the Law of Demeter. Talk only to immediate friends (`a.b`), not transitively (`a.b.c.d`). |
| **6** | **Don't Abbreviate** | Maintain descriptive names. Identifiers must be $> 2$ characters (except standard loop variables). |
| **7** | **Keep Entities Small** | Functions must be under 15 lines; classes must be under 60 lines. |
| **8** | **Max 2 Instance Variables** | Restrict classes to at most 2 properties to ensure high cohesion. |
| **9** | **No Getters or Setters** | Enforce "Tell, Don't Ask." Objects should expose behavior, not raw state. |

For code examples and refactoring guides, read the detailed [RULES.md](file:///Users/rajsekharan/projects/foundry/tech/tsalum/docs/RULES.md).

---

## 🚀 Getting Started

### Installation

Clone the project into your repository and reference it locally, or install dependencies:

```bash
npm install
```

### Run the Linter

You can run `tsalum` against any directory or individual file:

```bash
# Run against the current directory
node bin/cli.js .

# Run against a specific directory or file
node bin/cli.js src/core/engine.ts
```

### Build & Package

To compile the linter for distribution:

```bash
npm run build
```

---

## 🛠️ Code Structure

*   [linter.ts](file:///Users/rajsekharan/projects/foundry/tech/tsalum/src/linter.ts): The core AST traversal logic that checks for Calisthenics violations.
*   [cli.js](file:///Users/rajsekharan/projects/foundry/tech/tsalum/bin/cli.js): The CLI command interface to recursively locate files and audit them.
*   [RULES.md](file:///Users/rajsekharan/projects/foundry/tech/tsalum/docs/RULES.md): Exhaustive guidelines on each Calisthenics law with before-and-after code blocks.

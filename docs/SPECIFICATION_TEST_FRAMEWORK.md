# Architectural Specification: The Sovereign TypeScript Test Specification Engine (`nitrous-spec`)

> **Document Status:** Ratified Architectural Specification & Deep-Code Blueprint  
> **Target Path:** [`/Users/rajsekharan/projects/foundry/tech/nitrous/docs/SPECIFICATION_TEST_FRAMEWORK.md`](file:///Users/rajsekharan/projects/foundry/tech/nitrous/docs/SPECIFICATION_TEST_FRAMEWORK.md)  
> **Workspace Context:** [`tech/nitrous`](file:///Users/rajsekharan/projects/foundry/tech/nitrous)  
> **Core Philosophy:** Correctness by Construction, ThoughtWorks Calisthenic Discipline, and Anti-Mocking Governance for High-Acuity Systems & AI Vibe-Coding  

---

## Table of Contents

1. [Executive Summary & The Central Thesis](#1-executive-summary--the-central-thesis)
   - 1.1 [The Industrial Rot of "Mocking Theater"](#11-the-industrial-rot-of-mocking-theater)
   - 1.2 [Correctness by Construction vs. Post-Hoc Inspection](#12-correctness-by-construction-vs-post-hoc-inspection)
   - 1.3 [The Vibe-Coding Vector: Why LLMs Default to Mock Theater](#13-the-vibe-coding-vector-why-llms-default-to-mock-theater)
2. [Philosophical Foundation & Historical Context](#2-philosophical-foundation--historical-context)
   - 2.1 [The ThoughtWorks Pedigree & Jeff Bay's Object Calisthenics](#21-the-thoughtworks-pedigree--jeff-bays-object-calisthenics)
   - 2.2 [Detroit (Classicist) vs. London (Mockist) Schools of TDD](#22-detroit-classicist-vs-london-mockist-schools-of-tdd)
   - 2.3 [Martin Fowler's "Mocks Aren't Stubs" & The 15-Year Detour](#23-martin-fowlers-mocks-arent-stubs--the-15-year-detour)
   - 2.4 [The Pathology of Jest & Vitest: Matcher Pyramids, AST Monkey-Patching, & Leaky Fixtures](#24-the-pathology-of-jest--vitest)
3. [The 8 Core Architectural Axioms](#3-the-8-core-architectural-axioms)
   - 3.1 [Law I: Zero Mocking API (Structural Impossibility)](#31-law-i-zero-mocking-api)
   - 3.2 [Law II: The Pure Tripartite Contract (`setup` -> `run` -> `expect`)](#32-law-ii-the-pure-tripartite-contract)
   - 3.3 [Law III: Return an Object, Diffed As-Is](#33-law-iii-return-an-object-diffed-as-is)
   - 3.4 [Law IV: Partial Structural Matching by Default (Schema Evolution Immunity)](#34-law-iv-partial-structural-matching-by-default)
   - 3.5 [Law V: Explicit Strict Matching for DTO/Security Boundaries (`expectStrict`)](#35-law-v-explicit-strict-matching)
   - 3.6 [Law VI: Disambiguated Exceptions (`throws`) vs. Domain Result Types](#36-law-vi-disambiguated-exceptions)
   - 3.7 [Law VII: Observable Side-Effects via Stateful In-Memory Fakes](#37-law-vii-observable-side-effects)
   - 3.8 [Law VIII: Ultra-Lean Bare-Metal Engine (<1,000 LOC, Zero Transpiler Bloat)](#38-law-viii-ultra-lean-engine)
4. [Complete TypeScript API Contract & Architecture](#4-complete-typescript-api-contract--architecture)
   - 4.1 [Type Definitions (`types.ts`)](#41-type-definitions)
   - 4.2 [Structural Diffing & Predicates (`matchers.ts`)](#42-structural-diffing--predicates)
   - 4.3 [Runner Lifecycle & Teardown Harness (`runner.ts`)](#43-runner-lifecycle--teardown-harness)
5. [Exhaustive Deep-Code Examples](#5-exhaustive-deep-code-examples)
   - 5.1 [Example 1: Pure Arithmetic & Unit Utilities](#51-example-1-pure-arithmetic--unit-utilities)
   - 5.2 [Example 2: Domain Aggregates & Calisthenic State Transitions](#52-example-2-domain-aggregates--calisthenic-state-transitions)
   - 5.3 [Example 3: Comprehensive Real-World Backend Workflow (Auth + DB + Checkout + Bus + Mailer + Queue)](#53-example-3-comprehensive-real-world-backend-workflow)
   - 5.4 [Example 4: Error Handling: Thrown Exceptions vs. Domain Result Objects](#54-example-4-error-handling-thrown-exceptions-vs-domain-result-objects)
   - 5.5 [Example 5: Observable Side-Effects as State (Audit, Sent Messages, Queued Jobs)](#55-example-5-observable-side-effects-as-state)
   - 5.6 [Example 6: Partial Matching vs. Strict DTO Matching](#56-example-6-partial-matching-vs-strict-dto-matching)
6. [Architectural Comparison: Jest/Vitest vs. `nitrous-spec`](#6-architectural-comparison-jestvitest-vs-nitrous-spec)
7. [Integration with `nitrous` & Developer Workflows](#7-integration-with-nitrous--developer-workflows)
8. [The Test Linter Catalog: Selectable Anti-Slop Violations (`nitrous test-lint`)](#8-the-test-linter-catalog-selectable-anti-slop-violations-nitrous-test-lint)
   - 8.1 [`no-brittle-style-grep`: Static Stylesheet & Config Substring Grepping](#81-no-brittle-style-grep-static-stylesheet--config-substring-grepping)
   - 8.2 [`no-tautological-config-echo`: Tautological Setter & Literal Echo Assertions](#82-no-tautological-config-echo-tautological-setter--literal-echo-assertions)

---

## 1. Executive Summary & The Central Thesis

### 1.1 The Industrial Rot of "Mocking Theater"

For over fifteen years, the JavaScript and TypeScript ecosystems have suffered from an architectural disease known as **Mocking Theater**. 

In this degenerate paradigm:
1. **Tests Test Their Own Mocks:** Rather than validating observable domain outcomes, test files spend 70% to 80% of their lines constructing elaborate illusions: `jest.mock()`, `vi.spyOn()`, `mockResolvedValueOnce()`, and clearing spy call histories.
2. **The Refactoring Paradox:** A developer safely refactors internal class wiring without altering public behavior or output contracts. Despite zero business regressions, 30 tests fail instantly because private collaborator calls, internal method names, or argument counts were altered.
3. **The False Confidence Trap:** Test suites report 100% green in CI. In production, systems collapse with `TypeError: undefined is not a function` because real database drivers, third-party APIs, and storage adapters behave fundamentally differently from handwritten mock objects.

Tests that only verify that a fake was called with fake arguments provide zero safety while actively penalizing code refactoring.

### 1.2 Correctness by Construction vs. Post-Hoc Inspection

Traditional engineering teams try to fight test rot through **post-hoc inspection**:
- Fluffy team style guides asking engineers to "avoid mocking too much."
- Custom ESLint AST rules that attempt to detect complex mock setups.
- Probabilistic AI reviews in pull requests flagging test smells.

This fails because **if a tool provides an ergonomic escape hatch to write bad code, developers and AI agents will inevitably take it**. When `vi.fn()` and `jest.mock()` are standard imports in the test runner, mock-slop is guaranteed.

**The Foundational Law of `nitrous-spec`:**
> **Make bad tests structurally impossible to write.**  
> If the test framework literally exports no mock, spy, or stub primitive, neither a human nor an LLM can write Mocking Theater. To write a passing test, the author is forced by the compiler to design clean domain boundaries, use stateful in-memory fakes, and assert against observable domain outcomes.

### 1.3 The Vibe-Coding Vector: Why LLMs Default to Mock Theater

Large Language Models (LLMs) trained on millions of public repositories have ingested vast quantities of bad Jest code. When an LLM vibe-codes tests, it naturally defaults to the statistical average:

```typescript
// ❌ The LLM Vibe-Coding Default: Fragile Mocking Theater
it('should process payment', async () => {
  const mockRepo = { findUser: vi.fn().mockResolvedValue({ id: 'u_1', balance: 100 }) };
  const mockGateway = { charge: vi.fn().mockResolvedValue({ status: 'ok' }) };
  const mockMailer = { send: vi.fn().mockResolvedValue(true) };
  
  const service = new PaymentService(mockRepo as any, mockGateway as any, mockMailer as any);
  await service.process('u_1', 50);

  expect(mockRepo.findUser).toHaveBeenCalledWith('u_1');
  expect(mockGateway.charge).toHaveBeenCalledWith(50);
  expect(mockMailer.send).toHaveBeenCalledTimes(1);
});
```

If `service.process` accidentally bills the user twice, this test still passes. If the mailer payload is corrupted, this test still passes. The test verifies nothing about reality.

`nitrous-spec` replaces this entire pathology with a rigid, functional contract: `setup() -> run(context) -> expect`.

---

## 2. Philosophical Foundation & Historical Context

### 2.1 The ThoughtWorks Pedigree & Jeff Bay's Object Calisthenics

In 2008, Jeff Bay contributed the seminal chapter "Object Calisthenics" to *The ThoughtWorks Anthology*. It laid down 9 strict rules designed to eliminate design debt at the source:
1. Only one level of indentation per method
2. Don't use the `ELSE` keyword
3. Wrap all primitives and strings (Value Objects)
4. First class collections
5. One dot per line (Law of Demeter)
6. Don't abbreviate
7. Keep all entities small (<15 lines per function, <60 lines per class)
8. No classes with more than two instance variables
9. No getters or setters (Tell, Don't Ask)

The parent project of this specification, [`tech/nitrous`](file:///Users/rajsekharan/projects/foundry/tech/nitrous/README.md), enforces these rules on production code. But when applied to testing, a sharp realization occurs: **Clean domain code cannot be tested with dirty test frameworks.**

### 2.2 Detroit (Classicist) vs. London (Mockist) Schools of TDD

The software engineering discipline has two classic traditions of TDD:

| Vector | Detroit School (Classicist / Chicago) | London School (Mockist) |
| :--- | :--- | :--- |
| **Originators** | Kent Beck, Ward Cunningham | Steve Freeman, Nat Pryce |
| **Unit of Isolation** | The behavioral aggregate (multiple collaborating classes in-memory) | The isolated single class/function |
| **Verification** | State verification (observable outcomes) | Interaction verification (call sequences & counts) |
| **Doubles Used** | Real implementations & In-Memory Fakes | Mocks & Spies for all dependencies |
| **Refactoring Safety** | **High**: Internal implementation changes don't break tests | **Very Low**: Renaming internal methods shatters tests |
| **Coupling** | Decoupled from internal wiring | Bound tightly to method signatures |

The JavaScript ecosystem mistakenly embraced the London School, producing brittle test suites that resist refactoring. `nitrous-spec` is an unapologetic return to the **Detroit School**.

### 2.3 Martin Fowler's "Mocks Aren't Stubs" & The 15-Year Detour

In 2007, Martin Fowler published *Mocks Aren't Stubs*, explicitly differentiating between:
* **Fakes:** Working implementations taking in-memory shortcuts (e.g., an in-memory repository backed by a `Map`).
* **Mocks:** Pre-programmed interaction checkers that verify method calls.

Fowler warned that interaction-heavy mockist tests create tight coupling between test files and implementation details. Despite this warning, Jest, Sinon, and Vitest made mocks their central primitive. `nitrous-spec` closes that 15-year detour.

### 2.4 The Pathology of Jest & Vitest

1. **Shared Mutable State (`beforeEach`):**
   ```typescript
   // ❌ Leaky mutable globals shared across tests
   describe('OrderService', () => {
     let db: Database;
     let service: OrderService;
     beforeEach(() => { db = new Database(); service = new OrderService(db); });
     it('A', async () => { await service.mutate(); });
     it('B', async () => { /* Inherits polluted state if execution order shifts */ });
   });
   ```
2. **The Asymmetric Matcher Pyramid:**
   ```typescript
   // ❌ Unreadable ceremony
   expect(response).toEqual(
     expect.objectContaining({
       data: expect.objectContaining({
         users: expect.arrayContaining([
           expect.objectContaining({ id: expect.any(String), role: 'ADMIN' })
         ])
       })
     })
   );
   ```
3. **AST Monkey-Patching & Transpiler Bloat:**
   To support `jest.mock()`, Jest had to transpile code on the fly, intercept ESM `import` statements, rewrite `require.cache`, and manage multi-process worker pools. This added tens of thousands of lines of fragile runtime overhead.

---

## 3. The 8 Core Architectural Axioms

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE 8 LAWS OF TSALUM-SPEC                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Zero Mocking API       │ No mock(), spy(), or stub() exports. Period.    │
│ 2. Tripartite Contract    │ setup() ──> run(context) ──> expect (teardown)  │
│ 3. Return-An-Object       │ run() emits the world's state. Diffs as-is.     │
│ 4. Partial Match Default  │ Schema evolution immunity without fragile tests.│
│ 5. Explicit Strict Match  │ expectStrict(x) for DTO/API boundary contracts. │
│ 6. Explicit Error Match   │ throws(...) for exceptions; { error } for DTOs. │
│ 7. Observable Fakes       │ External effects captured in in-memory state.   │
│ 8. Lean Engine (<1k LOC)  │ Native Node/Bun runtime. Zero AST monkey-patch. │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Law I: Zero Mocking API
`nitrous-spec` exports no `mock()`, `spy()`, `stub()`, or `spyOn()`. 
If code cannot be tested without a mock, the architecture is flawed. The developer must either extract an in-memory fake or decouple the domain aggregate.

### 3.2 Law II: The Pure Tripartite Contract
Every test follows a unidirectional, isolated lifecycle with guaranteed teardown:
* `setup()`: Prepares isolated in-memory dependencies and returns a typed context. No global variables.
* `run(context)`: Executes the domain action and returns the observable state.
* `teardown(context)`: Guaranteed cleanup hook running in `finally` (closes database handles, clears timers).
* `expect`: The expected structural shape.

### 3.3 Law III: Return an Object, Diffed As-Is
No scattered `expect()` statements across a 50-line procedural function. The `run()` method returns an object representing the resulting world. The framework performs a single, unified diff between `actual` and `expect`.

### 3.4 Law IV: Partial Structural Matching by Default
When a domain model adds `tenantId: "t_1"` or `updatedAt: Date`, existing tests must not break. `expect` is evaluated as a structural subset of `actual`. Array lengths match exactly, and array elements are partially matched by index.

### 3.5 Law V: Explicit Strict Matching (`expectStrict`)
For public REST API responses, Webhook payloads, or DTO serializers where leaking a field (e.g. `passwordHash`) is a critical security bug, the developer wraps the expected object in `expectStrict(expected)`. Any extra keys in `actual` trigger an immediate failure.

### 3.6 Law VI: Disambiguated Exceptions
To prevent collisions between domain Result types (e.g. `{ success: false, error: 'BAD_REQUEST' }`) and thrown exceptions:
* Thrown exceptions **must** be asserted via `expect: throws(...)`.
* Objects returning `{ error: ... }` are treated as standard domain values.

### 3.7 Law VII: Observable Side-Effects
Instead of verifying method calls, side-effects are captured inside stateful in-memory fakes (e.g. `inMemoryMailer.sentMessages()`, `inMemoryEventBus.publishedEvents()`) and included directly in the returned state object.

### 3.8 Law VIII: Ultra-Lean Engine (<1,000 LOC)
The test runner has zero dependencies on Babel, SWC, or custom ESM loaders. It runs directly on Node 22+ (with native TS stripping) or Bun.

---

## 4. Complete TypeScript API Contract & Architecture

### 4.1 Type Definitions (`types.ts`)

```typescript
// ============================================================================
// FILE: src/framework/types.ts
// ============================================================================

export type PredicateMatcher<T = unknown> = {
  readonly __brand: 'PredicateMatcher';
  readonly name: string;
  readonly test: (actual: unknown) => boolean;
  readonly describe: () => string;
};

export type StrictMatcherWrapper<T = unknown> = {
  readonly __brand: 'StrictMatcher';
  readonly value: T;
};

export type ThrowsMatcherWrapper<T = unknown> = {
  readonly __brand: 'ThrowsMatcher';
  readonly expected?:
    | string
    | RegExp
    | (new (...args: any[]) => Error)
    | Record<string, unknown>
    | PredicateMatcher<unknown>;
};

export interface NormalizedError {
  name: string;
  message: string;
  code?: string | number;
  [key: string]: unknown;
}

export type ExpectedValue<T> =
  T extends StrictMatcherWrapper<infer U>
    ? StrictMatcherWrapper<ExpectedValue<U>>
    : T extends ThrowsMatcherWrapper<infer U>
      ? ThrowsMatcherWrapper<U>
      : T extends PredicateMatcher<infer U>
        ? PredicateMatcher<U> | U
        : T extends (infer Item)[]
          ? ExpectedValue<Item>[]
          : T extends Record<string, unknown>
            ? { [K in keyof T]?: ExpectedValue<T[K]> } & Record<string, unknown>
            : T | PredicateMatcher<T>;

export type ExpectedOutcome<TActual> =
  | ExpectedValue<TActual>
  | StrictMatcherWrapper<ExpectedValue<TActual>>
  | ThrowsMatcherWrapper<unknown>;

export interface TestCase<TContext = void, TActual = unknown> {
  readonly description: string;
  readonly setup?: () => Promise<TContext> | TContext;
  readonly run: (context: TContext) => Promise<TActual> | TActual;
  readonly teardown?: (context: TContext) => Promise<void> | void;
  readonly expect: ExpectedOutcome<TActual>;
  readonly timeoutMs?: number;
}

export interface TestSuite<TSuiteContext = void> {
  readonly name: string;
  readonly beforeAll?: () => Promise<TSuiteContext> | TSuiteContext;
  readonly afterAll?: (context: TSuiteContext) => Promise<void> | void;
  readonly tests: readonly TestCase<any, any>[];
}

export interface DiffRecord {
  readonly path: string;
  readonly message: string;
  readonly expected: unknown;
  readonly actual: unknown;
}

export interface TestResult {
  readonly description: string;
  readonly status: 'PASSED' | 'FAILED' | 'ERRORED';
  readonly durationMs: number;
  readonly diffs?: readonly DiffRecord[];
  readonly error?: NormalizedError | Error;
}
```

### 4.2 Structural Diffing & Predicates (`matchers.ts`)

```typescript
// ============================================================================
// FILE: src/framework/matchers.ts
// ============================================================================

import type { PredicateMatcher, StrictMatcherWrapper, ThrowsMatcherWrapper, DiffRecord } from './types.js';

export function createPredicate<T>(
  name: string,
  testFn: (actual: unknown) => boolean,
  expectedDescription: string
): PredicateMatcher<T> {
  return {
    __brand: 'PredicateMatcher',
    name,
    test: testFn,
    describe: () => expectedDescription,
  };
}

export const isString = createPredicate<string>(
  'isString',
  (val) => typeof val === 'string',
  'type string'
);

export const isNonEmptyString = createPredicate<string>(
  'isNonEmptyString',
  (val) => typeof val === 'string' && val.trim().length > 0,
  'non-empty string'
);

export const isNumber = createPredicate<number>(
  'isNumber',
  (val) => typeof val === 'number' && !Number.isNaN(val),
  'valid number'
);

export const isPositive = createPredicate<number>(
  'isPositive',
  (val) => typeof val === 'number' && !Number.isNaN(val) && val > 0,
  'positive number (>0)'
);

export const isBoolean = createPredicate<boolean>(
  'isBoolean',
  (val) => typeof val === 'boolean',
  'boolean'
);

export const isDate = createPredicate<Date>(
  'isDate',
  (val) => val instanceof Date && !Number.isNaN(val.getTime()),
  'valid Date'
);

export const isUuid = createPredicate<string>(
  'isUuid',
  (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val),
  'UUID string'
);

export function matchesPattern(regex: RegExp): PredicateMatcher<string> {
  return createPredicate<string>(
    ['matchesPattern(', regex.toString(), ')'].join(''),
    (val) => typeof val === 'string' && regex.test(val),
    ['string matching ', regex.toString()].join('')
  );
}

export function where<T>(name: string, predicate: (val: T) => boolean): PredicateMatcher<T> {
  return createPredicate<T>(
    ['where(', name, ')'].join(''),
    (val) => {
      try {
        return predicate(val as T);
      } catch {
        return false;
      }
    },
    ['custom predicate satisfied: ', name].join('')
  );
}

export function expectStrict<T>(value: T): StrictMatcherWrapper<T> {
  return { __brand: 'StrictMatcher', value };
}

export function throws(
  expected?:
    | string
    | RegExp
    | (new (...args: any[]) => Error)
    | Record<string, unknown>
    | PredicateMatcher<unknown>
): ThrowsMatcherWrapper {
  return { __brand: 'ThrowsMatcher', expected };
}

export function isPredicateMatcher(val: unknown): val is PredicateMatcher<unknown> {
  return typeof val === 'object' && val !== null && (val as any).__brand === 'PredicateMatcher';
}

export function isStrictWrapper(val: unknown): val is StrictMatcherWrapper<unknown> {
  return typeof val === 'object' && val !== null && (val as any).__brand === 'StrictMatcher';
}

export function isThrowsWrapper(val: unknown): val is ThrowsMatcherWrapper<unknown> {
  return typeof val === 'object' && val !== null && (val as any).__brand === 'ThrowsMatcher';
}

export function diffValues(actual: unknown, expected: unknown, path = '$', isStrict = false): DiffRecord[] {
  const diffs: DiffRecord[] = [];

  if (isStrictWrapper(expected)) {
    return diffValues(actual, expected.value, path, true);
  }

  if (isPredicateMatcher(expected)) {
    if (!expected.test(actual)) {
      diffs.push({
        path,
        message: ['Expected ', expected.describe(), ', but received ', JSON.stringify(actual)].join(''),
        expected: expected.describe(),
        actual,
      });
    }
    return diffs;
  }

  if (expected === actual) {
    return diffs;
  }

  if (expected === null || expected === undefined || actual === null || actual === undefined) {
    diffs.push({
      path,
      message: ['Expected ', String(expected), ', but received ', String(actual)].join(''),
      expected,
      actual,
    });
    return diffs;
  }

  // Proper Date comparison
  if (expected instanceof Date) {
    if (!(actual instanceof Date)) {
      diffs.push({
        path,
        message: ['Expected Date instance, but received ', typeof actual].join(''),
        expected: expected.toISOString(),
        actual,
      });
      return diffs;
    }
    if (expected.getTime() !== actual.getTime()) {
      diffs.push({
        path,
        message: ['Date mismatch: expected ', expected.toISOString(), ', but received ', actual.toISOString()].join(''),
        expected: expected.toISOString(),
        actual: actual.toISOString(),
      });
    }
    return diffs;
  }

  // Proper RegExp comparison
  if (expected instanceof RegExp) {
    if (!(actual instanceof RegExp)) {
      diffs.push({
        path,
        message: ['Expected RegExp instance, but received ', typeof actual].join(''),
        expected: expected.toString(),
        actual,
      });
      return diffs;
    }
    if (expected.source !== actual.source || expected.flags !== actual.flags) {
      diffs.push({
        path,
        message: ['RegExp mismatch: expected ', expected.toString(), ', but received ', actual.toString()].join(''),
        expected: expected.toString(),
        actual: actual.toString(),
      });
    }
    return diffs;
  }

  // Array comparison (length exact, elements partial)
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      diffs.push({
        path,
        message: ['Expected array, but received ', typeof actual].join(''),
        expected,
        actual,
      });
      return diffs;
    }

    if (expected.length !== actual.length) {
      diffs.push({
        path: [path, '.length'].join(''),
        message: ['Array length mismatch: expected ', String(expected.length), ', but received ', String(actual.length)].join(''),
        expected: expected.length,
        actual: actual.length,
      });
    }

    const minLen = Math.min(expected.length, actual.length);
    for (let i = 0; i < minLen; i++) {
      diffs.push(...diffValues(actual[i], expected[i], [path, '[', String(i), ']'].join(''), isStrict));
    }
    return diffs;
  }

  // Object comparison (Partial by default, Strict on demand)
  if (typeof expected === 'object' && typeof actual === 'object') {
    if (actual instanceof Date || actual instanceof RegExp) {
      diffs.push({
        path,
        message: ['Type mismatch: expected plain object, but received ', actual.constructor.name].join(''),
        expected,
        actual,
      });
      return diffs;
    }

    const expectedObj = expected as Record<string, unknown>;
    const actualObj = actual as Record<string, unknown>;

    for (const key of Object.keys(expectedObj)) {
      const childPath = path === '$' ? key : [path, '.', key].join('');
      if (!(key in actualObj)) {
        diffs.push({
          path: childPath,
          message: ['Property "', key, '" is missing from actual output'].join(''),
          expected: expectedObj[key],
          actual: undefined,
        });
      } else {
        diffs.push(...diffValues(actualObj[key], expectedObj[key], childPath, isStrict));
      }
    }

    if (isStrict) {
      for (const key of Object.keys(actualObj)) {
        const childPath = path === '$' ? key : [path, '.', key].join('');
        if (!(key in expectedObj)) {
          diffs.push({
            path: childPath,
            message: ['Unexpected excess property "', key, '" in strict matching'].join(''),
            expected: undefined,
            actual: actualObj[key],
          });
        }
      }
    }

    return diffs;
  }

  // Primitive value mismatch
  diffs.push({
    path,
    message: ['Primitive mismatch: expected ', JSON.stringify(expected), ', but received ', JSON.stringify(actual)].join(''),
    expected,
    actual,
  });

  return diffs;
}
```

### 4.3 Runner Lifecycle & Teardown Harness (`runner.ts`)

```typescript
// ============================================================================
// FILE: src/framework/runner.ts
// ============================================================================

import type { TestCase, TestResult, TestSuite, NormalizedError } from './types.js';
import { diffValues, isThrowsWrapper } from './matchers.js';

export function normalizeError(err: unknown): NormalizedError {
  if (err instanceof Error) {
    const normalized: NormalizedError = { name: err.name, message: err.message };
    for (const key of Object.keys(err)) {
      normalized[key] = (err as any)[key];
    }
    return normalized;
  }
  return { name: 'UnknownError', message: String(err) };
}

export function test<TContext, TActual>(
  description: string,
  spec: Omit<TestCase<TContext, TActual>, 'description'>
): TestCase<TContext, TActual> {
  return { description, ...spec };
}

export async function runTest<TContext, TActual>(testCase: TestCase<TContext, TActual>): Promise<TestResult> {
  const startTime = Date.now();
  const timeoutMs = testCase.timeoutMs ?? 5000;
  let context: TContext = undefined as unknown as TContext;

  // 1. Setup Phase
  try {
    if (testCase.setup) {
      context = await testCase.setup();
    }
  } catch (setupErr) {
    return {
      description: testCase.description,
      status: 'ERRORED',
      durationMs: Date.now() - startTime,
      error: normalizeError(setupErr),
    };
  }

  // 2. Execution with Timeout Race Guard
  let actualResult: unknown;
  let didThrow = false;
  let thrownError: NormalizedError | undefined;
  let rawThrownError: unknown;

  try {
    let timerId: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timerId = setTimeout(() => {
        reject(new Error(['Test timed out after ', String(timeoutMs), 'ms'].join('')));
      }, timeoutMs);
    });

    try {
      actualResult = await Promise.race([
        Promise.resolve(testCase.run(context)),
        timeoutPromise,
      ]);
    } finally {
      if (timerId) clearTimeout(timerId);
    }
  } catch (err) {
    didThrow = true;
    rawThrownError = err;
    thrownError = normalizeError(err);
  } finally {
    // 3. Teardown Phase (Guaranteed Execution in finally block)
    if (testCase.teardown) {
      try {
        await testCase.teardown(context);
      } catch (teardownErr) {
        console.error(['Teardown failed in test: "', testCase.description, '":'].join(''), teardownErr);
      }
    }
  }

  const durationMs = Date.now() - startTime;

  // 4. Outcome Evaluation
  const isThrows = isThrowsWrapper(testCase.expect);

  if (isThrows) {
    const expectedErr = testCase.expect.expected;

    if (!didThrow) {
      return {
        description: testCase.description,
        status: 'FAILED',
        durationMs,
        diffs: [{
          path: 'throws',
          message: 'Expected test to throw an error, but run() completed successfully without throwing.',
          expected: expectedErr ?? 'Error',
          actual: actualResult,
        }],
      };
    }

    if (!expectedErr) {
      return { description: testCase.description, status: 'PASSED', durationMs };
    }

    // Constructor match (e.g. throws(InsufficientFundsError))
    if (typeof expectedErr === 'function' && expectedErr.prototype instanceof Error) {
      const matches = rawThrownError instanceof (expectedErr as any) || thrownError?.name === (expectedErr as any).name;
      if (!matches) {
        return {
          description: testCase.description,
          status: 'FAILED',
          durationMs,
          diffs: [{
            path: 'error.name',
            message: ['Expected error instance of ', (expectedErr as any).name, ', but received ', thrownError?.name].join(''),
            expected: (expectedErr as any).name,
            actual: thrownError?.name,
          }],
        };
      }
      return { description: testCase.description, status: 'PASSED', durationMs };
    }

    // String substring match
    if (typeof expectedErr === 'string') {
      if (!thrownError?.message.includes(expectedErr)) {
        return {
          description: testCase.description,
          status: 'FAILED',
          durationMs,
          diffs: [{
            path: 'error.message',
            message: ['Expected error message to include "', expectedErr, '", but received "', thrownError?.message, '"'].join(''),
            expected: expectedErr,
            actual: thrownError?.message,
          }],
        };
      }
      return { description: testCase.description, status: 'PASSED', durationMs };
    }

    // RegExp match
    if (expectedErr instanceof RegExp) {
      if (!expectedErr.test(thrownError?.message ?? '')) {
        return {
          description: testCase.description,
          status: 'FAILED',
          durationMs,
          diffs: [{
            path: 'error.message',
            message: ['Expected error message to match pattern ', expectedErr.toString(), ', but received "', thrownError?.message, '"'].join(''),
            expected: expectedErr.toString(),
            actual: thrownError?.message,
          }],
        };
      }
      return { description: testCase.description, status: 'PASSED', durationMs };
    }

    // Structured object match on error
    if (typeof expectedErr === 'object' && expectedErr !== null) {
      const diffs = diffValues(thrownError, expectedErr, 'error');
      return {
        description: testCase.description,
        status: diffs.length === 0 ? 'PASSED' : 'FAILED',
        durationMs,
        diffs: diffs.length > 0 ? diffs : undefined,
      };
    }
  }

  // Non-throwing test that unexpectedly threw
  if (didThrow) {
    return {
      description: testCase.description,
      status: 'FAILED',
      durationMs,
      error: thrownError,
      diffs: [{
        path: '$',
        message: ['Test threw an unexpected error: ', thrownError?.name, ': ', thrownError?.message].join(''),
        expected: testCase.expect,
        actual: thrownError,
      }],
    };
  }

  // Normal structural diff evaluation
  const diffs = diffValues(actualResult, testCase.expect);
  return {
    description: testCase.description,
    status: diffs.length === 0 ? 'PASSED' : 'FAILED',
    durationMs,
    diffs: diffs.length > 0 ? diffs : undefined,
  };
}
```

---

## 5. Exhaustive Deep-Code Examples

### 5.1 Example 1: Pure Arithmetic & Unit Utilities

Zero setup overhead. Pure function in, observable state out:

```typescript
import { test } from '../framework/runner.js';
import { isNumber, isPositive, where } from '../framework/matchers.js';

export function calculateCompoundInterest(params: {
  principal: number;
  annualRate: number;
  compoundingPeriodsPerYear: number;
  years: number;
}): { totalAmount: number; interestEarned: number } {
  const { principal, annualRate, compoundingPeriodsPerYear, years } = params;
  const ratePerPeriod = annualRate / compoundingPeriodsPerYear;
  const totalPeriods = compoundingPeriodsPerYear * years;
  const totalAmount = Math.round(principal * Math.pow(1 + ratePerPeriod, totalPeriods) * 100) / 100;
  const interestEarned = Math.round((totalAmount - principal) * 100) / 100;
  return { totalAmount, interestEarned };
}

// ============================================================================
// SPECIFICATION
// ============================================================================

export const compoundInterestSpec = test('Compound interest calculation accurately compounds principal', {
  run: () => calculateCompoundInterest({
    principal: 1000,
    annualRate: 0.05,
    compoundingPeriodsPerYear: 12,
    years: 5,
  }),
  expect: {
    totalAmount: 1283.36,
    interestEarned: 283.36,
  },
});

export const propertyBoundsSpec = test('Compound interest output conforms to numeric positivity invariants', {
  run: () => calculateCompoundInterest({
    principal: 500,
    annualRate: 0.08,
    compoundingPeriodsPerYear: 4,
    years: 2,
  }),
  expect: {
    totalAmount: isPositive,
    interestEarned: where('greater than zero', (val: number) => val > 0),
  },
});
```

---

### 5.2 Example 2: Domain Aggregates & Calisthenic State Transitions

A strict banking account aggregate adhering to the 9 Laws of Object Calisthenics (Value Objects, No Getters/Setters, Max 2 Instance Variables):

```typescript
import { test } from '../framework/runner.js';

export class CentsAmount {
  constructor(public readonly cents: number) {
    if (cents < 0) throw new Error('Amount cannot be negative');
  }
  public add(other: CentsAmount): CentsAmount { return new CentsAmount(this.cents + other.cents); }
  public subtract(other: CentsAmount): CentsAmount { return new CentsAmount(this.cents - other.cents); }
  public isGreaterThan(other: CentsAmount): boolean { return this.cents > other.cents; }
}

export class BankAccount {
  constructor(
    private balance: CentsAmount,
    private overdraftLimit: CentsAmount
  ) {}

  public deposit(amount: CentsAmount): void {
    this.balance = this.balance.add(amount);
  }

  public withdraw(amount: CentsAmount): void {
    const maxAvailable = this.balance.add(this.overdraftLimit);
    if (amount.isGreaterThan(maxAvailable)) {
      throw new Error('Withdrawal exceeds overdraft limit');
    }
    this.balance = this.balance.subtract(amount);
  }

  public exportState(): { balanceCents: number; isOverdrawn: boolean } {
    return {
      balanceCents: this.balance.cents,
      isOverdrawn: this.balance.cents < 0,
    };
  }
}

// ============================================================================
// SPECIFICATION
// ============================================================================

export const overdraftSpec = test('Withdrawal within overdraft limit transitions balance into negative state', {
  setup: () => {
    const account = new BankAccount(new CentsAmount(1000), new CentsAmount(5000));
    return { account };
  },
  run: ({ account }) => {
    account.withdraw(new CentsAmount(3500));
    return account.exportState();
  },
  expect: {
    balanceCents: -2500,
    isOverdrawn: true,
  },
});
```

---

### 5.3 Example 3: Comprehensive Real-World Backend Workflow

A complete B2B checkout workflow orchestrating an In-Memory Database, Session Auth, Payment Gateway, Event Bus, Transactional Mailer, and Background Fulfillment Queue with **zero mocks**:

```typescript
import { test } from '../framework/runner.js';
import { isUuid, isDate, isPositive } from '../framework/matchers.js';

// --- In-Memory Fakes ---
export class InMemoryOrderDatabase {
  private orders = new Map<string, any>();
  public async save(order: any) { this.orders.set(order.id, order); return order; }
  public async get(id: string) { return this.orders.get(id); }
  public async close() { this.orders.clear(); }
}

export class InMemoryEventBus {
  public published: { topic: string; payload: any }[] = [];
  public emit(topic: string, payload: any) { this.published.push({ topic, payload }); }
}

export class InMemoryMailer {
  public sent: { to: string; subject: string; orderId: string }[] = [];
  public async sendOrderConfirmation(to: string, orderId: string) {
    this.sent.push({ to, subject: 'Order Confirmed', orderId });
  }
}

export class InMemoryFulfillmentQueue {
  public jobs: { queue: string; orderId: string }[] = [];
  public async enqueue(queue: string, payload: { orderId: string }) {
    this.jobs.push({ queue, orderId: payload.orderId });
  }
}

export class CheckoutService {
  constructor(
    private db: InMemoryOrderDatabase,
    private bus: InMemoryEventBus,
    private mailer: InMemoryMailer,
    private queue: InMemoryFulfillmentQueue
  ) {}

  public async completeOrder(userId: string, userEmail: string, items: { sku: string; price: number }[]) {
    const orderId = 'ord_' + Math.random().toString(36).substring(2, 9);
    const total = items.reduce((acc, i) => acc + i.price, 0);
    const order = { id: orderId, userId, items, total, status: 'PAID', createdAt: new Date() };

    await this.db.save(order);
    this.bus.emit('order.completed', { orderId, total });
    await this.mailer.sendOrderConfirmation(userEmail, orderId);
    await this.queue.enqueue('fulfillment.pack_and_ship', { orderId });

    return { orderId, total };
  }
}

// ============================================================================
// SPECIFICATION
// ============================================================================

export const checkoutWorkflowSpec = test('Checkout workflow completes payment, emits events, sends mail, and queues fulfillment', {
  setup: async () => {
    const db = new InMemoryOrderDatabase();
    const bus = new InMemoryEventBus();
    const mailer = new InMemoryMailer();
    const queue = new InMemoryFulfillmentQueue();
    const service = new CheckoutService(db, bus, mailer, queue);
    return { db, bus, mailer, queue, service };
  },

  run: async ({ service, db, bus, mailer, queue }) => {
    const result = await service.completeOrder('usr_raj', 'raj@kural.ink', [
      { sku: 'TSALUM-PRO', price: 99 },
      { sku: 'CONSULTING-HR', price: 250 },
    ]);

    return {
      orderId: result.orderId,
      dbRecord: await db.get(result.orderId),
      publishedEvents: bus.published,
      sentEmails: mailer.sent,
      enqueuedJobs: queue.jobs,
    };
  },

  teardown: async ({ db }) => {
    await db.close();
  },

  // Observable World State Assertion (No mocks, no spies!)
  expect: {
    orderId: isString,
    dbRecord: {
      status: 'PAID',
      total: 349,
      createdAt: isDate,
    },
    publishedEvents: [
      { topic: 'order.completed', payload: { total: 349 } }
    ],
    sentEmails: [
      { to: 'raj@kural.ink', subject: 'Order Confirmed' }
    ],
    enqueuedJobs: [
      { queue: 'fulfillment.pack_and_ship' }
    ],
  },
});
```

---

### 5.4 Example 4: Error Handling: Thrown Exceptions vs. Domain Result Objects

Demonstrating unambiguous separation between thrown errors and domain Result objects:

```typescript
import { test } from '../framework/runner.js';
import { throws } from '../framework/matchers.js';

export class InsufficientFundsError extends Error {
  constructor(public readonly shortage: number) {
    super(['Insufficient funds: shortage of ', String(shortage), ' cents'].join(''));
    this.name = 'InsufficientFundsError';
  }
}

export function transferFunds(balance: number, transferAmount: number) {
  if (transferAmount > balance) {
    throw new InsufficientFundsError(transferAmount - balance);
  }
  return { newBalance: balance - transferAmount };
}

export function validateApiKey(key: string): { valid: boolean; error?: string } {
  if (key !== 'sovereign_key_99') {
    return { valid: false, error: 'INVALID_API_KEY' };
  }
  return { valid: true };
}

// ============================================================================
// SPECIFICATIONS
// ============================================================================

// Case A: Thrown Exception Assertion
export const thrownExceptionSpec = test('Transfer exceeding balance throws InsufficientFundsError with shortage metadata', {
  run: () => transferFunds(100, 250),
  expect: throws({
    name: 'InsufficientFundsError',
    shortage: 150,
  }),
});

// Case B: Domain Result Object with an 'error' property (No collision!)
export const domainResultSpec = test('Invalid API key returns domain error result without throwing', {
  run: () => validateApiKey('bad_key'),
  expect: {
    valid: false,
    error: 'INVALID_API_KEY',
  },
});
```

---

### 5.5 Example 5: Observable Side-Effects as State

Instead of `expect(auditSpy).toHaveBeenCalledWith(...)`, external telemetry and database writes are inspected directly as resulting state:

```typescript
import { test } from '../framework/runner.js';

export class InMemoryAuditLedger {
  public records: { action: string; actor: string; timestamp: Date }[] = [];
  public record(action: string, actor: string) {
    this.records.push({ action, actor, timestamp: new Date() });
  }
}

export class SecurityVault {
  constructor(private audit: InMemoryAuditLedger) {}
  public accessClassifiedFile(fileId: string, actorId: string) {
    this.audit.record(['ACCESS_FILE_', fileId].join(''), actorId);
    return { granted: true, filePayload: 'SECRET_DATA' };
  }
}

// ============================================================================
// SPECIFICATION
// ============================================================================

export const auditSideEffectSpec = test('Accessing classified file appends an immutable record to the audit ledger', {
  setup: () => {
    const audit = new InMemoryAuditLedger();
    const vault = new SecurityVault(audit);
    return { audit, vault };
  },
  run: ({ vault, audit }) => {
    vault.accessClassifiedFile('DOC_404', 'admin_raj');
    return {
      auditCount: audit.records.length,
      latestAudit: audit.records[0],
    };
  },
  expect: {
    auditCount: 1,
    latestAudit: {
      action: 'ACCESS_FILE_DOC_404',
      actor: 'admin_raj',
      timestamp: isDate,
    },
  },
});
```

---

### 5.6 Example 6: Partial Matching vs. Strict DTO Matching

Contrasting schema-evolution-resilient domain matching with strict public API serialization:

```typescript
import { test } from '../framework/runner.js';
import { expectStrict, isString, isUuid, isDate } from '../framework/matchers.js';

export interface UserAggregate {
  id: string;
  email: string;
  passwordHash: string;
  tenantId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export function getUserEntity(): UserAggregate {
  return {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    email: 'raj@kural.ink',
    passwordHash: 'argon2$hash$very_secret',
    tenantId: 'tenant_omega',
    role: 'ARCHITECT',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function toPublicUserProfile(user: UserAggregate) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

// ============================================================================
// SPECIFICATIONS
// ============================================================================

// Case A: Partial Matching (Internal Domain Model)
// Only cares about the business invariant (email & role).
// Adding 'updatedAt' or 'tenantId' never breaks this test!
export const domainPartialMatchSpec = test('Domain user query reflects correct role and email', {
  run: () => getUserEntity(),
  expect: {
    email: 'raj@kural.ink',
    role: 'ARCHITECT',
  },
});

// Case B: Strict Matching (Public DTO Serialization Gate)
// Fails immediately if passwordHash or tenantId accidentally leaks into the output!
export const publicDtoStrictSpec = test('Public user serializer outputs only whitelisted fields and strictly forbids credential leakage', {
  run: () => toPublicUserProfile(getUserEntity()),
  expect: expectStrict({
    id: isUuid,
    email: 'raj@kural.ink',
    role: 'ARCHITECT',
  }),
});
```

---

## 6. Architectural Comparison: Jest/Vitest vs. `nitrous-spec`

| Capability / Concern | Traditional Jest / Vitest | `nitrous-spec` |
| :--- | :--- | :--- |
| **Primary Testing School** | London School (Mockist) | Detroit School (Classicist / Outcome-focused) |
| **Mocking Philosophy** | Ubiquitous (`jest.mock`, `vi.fn`, `spyOn`) | **Zero Mocks by Design** (Compilation error to attempt mocking) |
| **Assertion Model** | Procedural matchers (`expect(x).toBe(y)`) scattered across lines | **Return an Object, Diffed As-Is** |
| **Matching Ergonomics** | Nested asymmetric matchers (`expect.objectContaining`) | **Native Structural Partial Matching** by default |
| **Public DTO Verification** | Custom assertions or fragile snapshot files | **`expectStrict(payload)`** |
| **Error Verification** | Ambiguous `toThrow()` or manual `try/catch` | **`throws(...)`** cleanly separated from Result types |
| **Test Fixture State** | Shared mutable globals mutated in `beforeEach` | **Pure Tripartite Pipeline**: `setup() -> run(ctx) -> teardown(ctx)` |
| **Refactoring Resilience** | Low (Internal method changes break tests) | **Extremely High** (Only external state changes break tests) |
| **AI Vibe-Coding Vector** | High hallucination of mock theater | **Self-correcting**; LLMs channeled into pure behavioral contracts |
| **Engine Footprint** | Heavy (V8 sandboxing, AST transpilers, workers) | **Ultra-Lean (<1,000 LOC)** running directly on Node 22+ / Bun |

---

## 7. Integration with `nitrous` & Developer Workflows

### 7.1 The Dual-Pincer Strategy: Linter + Spec Harness

Within [`tech/nitrous`](file:///Users/rajsekharan/projects/foundry/tech/nitrous), the system operates as a unified two-tiered quality gate:

```
  ┌──────────────────────────────────────────────────────────────┐
  │                        DEVELOPER / AI                         │
  └──────────────────────────────┬───────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
                 ▼                               ▼
     ┌───────────────────────┐       ┌───────────────────────┐
     │  `nitrous lint`        │       │  `nitrous test`        │
     │  (The Calisthenic     │       │  (The Specification   │
     │   Flocculant)         │       │   Engine)             │
     │                       │       │                       │
     │  - Indentation <= 1   │       │  - Zero Mocks         │
     │  - No Else            │       │  - Return-An-Object   │
     │  - Wrap Primitives    │       │  - Observable Fakes   │
     │  - Max 2 Instance Vars│       │  - Partial Diffing    │
     └───────────────────────┘       └───────────────────────┘
                 │                               │
                 └───────────────┬───────────────┘
                                 │
                                 ▼
                     SOVEREIGN PRODUCTION CODE
```

1. **`nitrous lint`** audits production source code, ensuring that entities are small, decoupled, and free of control-flow rot.
2. **`nitrous test`** runs the specification suite, guaranteeing that all tests verify observable domain outcomes without mocking theater.

### 7.2 Summary of Advantages for Thought-Partnership

By adopting this specification:
1. **You eliminate cognitive fatigue**: You never have to recall whether to use `toEqual`, `toStrictEqual`, `toMatchObject`, or `expect.objectContaining`.
2. **You eliminate test maintenance debt**: Adding fields to database models never breaks existing behavioral tests.
3. **You eliminate AI slop**: AI models generating code inside this framework cannot produce fake tests that pass while code fails.
4. **You gain pristine visual diffs**: Every failure is a crystal-clear, colorized object difference.

---

## 8. The Test Linter Catalog: Selectable Anti-Slop Violations (`nitrous test-lint`)

Beyond structural zero-mock governance, autonomous coding agents frequently inflate test counts with **Test-Padding Slop**: shallow assertions that verify static string literals or repeat configuration assignments verbatim without exercising runtime behavior.

`nitrous test-lint` provides selectable AST & semantic test lint rules that developers can enable in `.nitrous/config.json` (or via the Cloud Governance Settings Dashboard) to automatically reject these anti-patterns.

### 8.1 `no-brittle-style-grep`: Static Stylesheet & Config Substring Grepping

* **The Anti-Pattern:** Asserting that a raw stylesheet, QSS, CSS, or template string contains hardcoded visual tokens (hex colors, border-radius pixels, rgba values):
  ```cpp
  // ❌ VIOLATION [no-brittle-style-grep] in test_theme_engine.h:
  assert(qss.contains("border-radius: 15px"));
  assert(qss.contains("border-radius: 13px"));
  assert(qss.contains("#2d333b"));
  assert(qss.contains("rgba(255, 255, 255, 0.10)"));
  assert(qss.contains("border-radius: 5px"));
  ```
* **Why It Must Be Dropped:** This is literally grepping a CSS file inside a unit test. It tests nothing about whether the UI engine (Qt, browser DOM, or layout engine) actually parsed the stylesheet or applied it to the widgets—while shattering tests the instant a visual token changes by 1px.
* **The Nitrous Directive:** Reject substring assertions against raw style/presentation strings (`border-radius`, `#hex`, `rgba()`, `padding`, `margin`). Require behavioral state or computed property verification instead.

### 8.2 `no-tautological-config-echo`: Tautological Setter & Literal Echo Assertions

* **The Anti-Pattern:** Asserting that a getter or config property equals the exact literal that was just passed to its setter:
  ```cpp
  // ❌ VIOLATION [no-tautological-config-echo]:
  font.setPixelSize(12);
  assert(font.pixelSize() == 12);
  assert(font.letterSpacing() == 0.2);
  ```
  ```typescript
  // ❌ VIOLATION [no-tautological-config-echo]:
  const config = new ThemeConfig({ pixelSize: 12, letterSpacing: 0.2 });
  expect(config.pixelSize).toBe(12);
  expect(config.letterSpacing).toBe(0.2);
  ```
* **Why It Must Be Dropped:** Checking that `font.pixelSize() == 12` immediately after `font.setPixelSize(12)` merely tests that the compiler's memory assignment or standard library setter works. It is a tautological echo of the implementation line with zero domain value.
* **The Nitrous Directive:** Flag any assertion that directly echoes a literal assignment or trivial setter without an intervening domain computation, state transition, or boundary serialization.


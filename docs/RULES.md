# The 9 Laws of Object Calisthenics in TypeScript

In motorsport, **brakes are not designed to make you go slow—they are what allow you to go fast safely.** 

In the era of AI-driven coding, Large Language Models (LLMs) generate TypeScript code at 200 mph. However, LLMs lack a biological sense of design hygiene. Left unconstrained, they produce deeply nested, heavily coupled, "primitive obsessed" codebases that accumulate massive technical debt. 

**`tsalum`** acts as the necessary clarifying agent for your TypeScript codebase. By enforcing the **9 strict constraints of Object Calisthenics**, `tsalum` forces both developers and LLMs to write clean, decoupled, cohesive, and robust domain architectures.

---

## Law 1: One Level of Indentation per Method

### 1. Rationale & Philosophy
Nesting control structures (`if`, `for`, `while`, `switch`) multiplies the number of paths a developer must keep track of in their head. Code with deep nesting violates the **Single Responsibility Principle** because the outer block is managing loop iteration while the inner blocks are executing logical checks and state operations.

### 2. The AI Failure Mode
LLMs write code by predicting the next token sequentially. This structural limitation makes them default to writing nested control flow blocks (nested `for` loops inside `if` statements) instead of modularizing logic.

### 3. AST Detection Mechanics
`tsalum` traverses method and function bodies. If it detects a control structure (`IfStatement`, `ForStatement`, `ForOfStatement`, `WhileStatement`, `SwitchStatement`) nested inside another control structure within the same scope, it flags a hard error.

### 4. Code Comparison
#### ❌ Violates Law (Nesting Depth = 3)
```typescript
function notifyPremiumCustomers(users: User[]) {
  for (let user of users) {
    if (user.isActive) {
      if (user.isPremium) {
        sendEmail(user.email, "Exclusive Offer");
      }
    }
  }
}
```

#### ✅ Refactored (Nesting Depth = 1)
```typescript
function notifyPremiumCustomers(users: User[]) {
  users
    .filter(isActivePremiumUser)
    .forEach(sendPremiumNotification);
}

function isActivePremiumUser(user: User): boolean {
  return user.isActive && user.isPremium;
}

function sendPremiumNotification(user: User): void {
  sendEmail(user.email, "Exclusive Offer");
}
```

---

## Law 2: Don't Use the "ELSE" Keyword

### 1. Rationale & Philosophy
The `else` keyword is a tool of branching convenience that leads to nested blocks and cognitive overload. Every `else` indicates a divergence in execution paths. Removing `else` forces the use of **Guard Clauses** (early returns) or **Polymorphic Dispatch** (Strategy pattern).

### 2. The AI Failure Mode
LLMs default to binary branching (`if/else`) because it is the most common pattern found in public training corpora. This bypasses structural guard clauses, resulting in large, nested, unreadable methods.

### 3. AST Detection Mechanics
The linter checks all syntax nodes. Any occurrence of `ts.SyntaxKind.ElseKeyword` is flagged as an error.

### 4. Code Comparison
#### ❌ Violates Law
```typescript
function getDiscountRate(customer: Customer): number {
  let rate = 0;
  if (customer.isVIP) {
    rate = 0.20;
  } else {
    if (customer.yearsActive > 5) {
      rate = 0.10;
    } else {
      rate = 0.05;
    }
  }
  return rate;
}
```

#### ✅ Refactored
```typescript
function getDiscountRate(customer: Customer): number {
  if (customer.isVIP) return 0.20;
  if (customer.yearsActive > 5) return 0.10;
  return 0.05;
}
```

---

## Law 3: Wrap All Primitives and Strings

### 1. Rationale & Philosophy
A `string` is not an email, a phone number, or a license plate. A `number` is not a price, a coordinate, or a count. Using raw primitives leads to **Primitive Obsession**, meaning domain validation logic leaks into controllers, and functions accept incorrect parameters because their types match (e.g., passing a `ZipCode` string where an `Email` is expected).

### 2. The AI Failure Mode
LLMs prefer raw primitives because they are fast to declare. They avoid building custom Value Objects because it requires writing more classes.

### 3. AST Detection Mechanics
`tsalum` inspects class property declarations. If a property is declared directly with a raw primitive type (`string`, `number`, `boolean`, `any`, `unknown`), or an array of these primitives, it fails.

### 4. Code Comparison
#### ❌ Violates Law
```typescript
class Account {
  public email: string;
  public balance: number;
}
```

#### ✅ Refactored
```typescript
class EmailAddress {
  constructor(public readonly value: string) {
    if (!value.includes("@")) {
      throw new Error("Invalid email address format.");
    }
  }
}

class DollarAmount {
  constructor(public readonly cents: number) {
    if (cents < 0) {
      throw new Error("Dollar amount cannot be negative.");
    }
  }
}

class Account {
  constructor(
    public readonly email: EmailAddress,
    public readonly balance: DollarAmount
  ) {}
}
```

---

## Law 4: First Class Collections

### 1. Rationale & Philosophy
Any class that contains a collection (Array, Set, Map) should contain **no other member variables**. If a class has a collection and other data, it is violating the Single Responsibility Principle. Grouping, filtering, sorting, or mapping the collection should live strictly inside a class dedicated to that collection.

### 2. The AI Failure Mode
LLMs frequently mix arrays with unrelated properties inside managers, handlers, and orchestrators, spreading collection-manipulation code across the codebase.

### 3. AST Detection Mechanics
If a class declares at least one property that is an Array or collection type (`Map`, `Set`, `[]`), and has other instance variables declared, an error is generated.

### 4. Code Comparison
#### ❌ Violates Law
```typescript
class OrderHistory {
  public userId: string;
  public orders: Order[];
  
  public getLatestOrder() {
    return this.orders[this.orders.length - 1];
  }
}
```

#### ✅ Refactored
```typescript
class Orders {
  constructor(private readonly list: Order[]) {}

  public getLatest(): Order {
    if (this.list.length === 0) throw new Error("No orders present.");
    return this.list[this.list.length - 1];
  }
}

class UserOrderHistory {
  constructor(
    public readonly userId: UserId,
    public readonly orders: Orders
  ) {}
}
```

---

## Law 5: One Dot Per Line (Law of Demeter)

### 1. Rationale & Philosophy
You should only talk to your immediate friends, not their friends' friends. Chaining member accesses (e.g. `car.getEngine().getOilLevel().check()`) makes the caller highly coupled to the structural layout of the entire object graph. If the engine changes its interface, the caller breaks.

### 2. The AI Failure Mode
LLMs traverse objects deeply to fetch data, producing long chains of property lookups that are fragile and hard to refactor.

### 3. AST Detection Mechanics
`tsalum` counts the number of nested `PropertyAccessExpression` nodes in a single statement. If there are more than 2 property dots (`a.b.c`), it flags a warning.

### 4. Code Comparison
#### ❌ Violates Law
```typescript
const zip = customer.getProfile().getAddress().getZipCode();
```

#### ✅ Refactored
```typescript
const zip = customer.getZipCode();
```

---

## Law 6: Don't Abbreviate

### 1. Rationale & Philosophy
Abbreviations (`mgr`, `ctrl`, `id`, `usr`) obscure the semantic meaning of variables. Code should be immediately readable. If an entity name needs to be abbreviated, it is probably too long or poorly categorized.

### 2. The AI Failure Mode
LLMs generate standard variable counters (`i`, `err`, `res`) because they reflect millions of generic GitHub repositories.

### 3. AST Detection Mechanics
The linter evaluates identifiers of variables, classes, methods, parameters, and properties. If the identifier is shorter than 3 characters (excluding standard loop variables like `i`, `j`, `k`, `x`, `y`, `z`, `_`), it fails.

### 4. Code Comparison
#### ❌ Violates Law
```typescript
const usr = db.find(id);
```

#### ✅ Refactored
```typescript
const activeUser = userDatabase.find(userId);
```

---

## Law 7: Keep All Entities Small

### 1. Rationale & Philosophy
No class should be over 60 lines of code. No function or method should exceed 15 lines of code. Large entities indicate high coupling, low cohesion, and a failure to split responsibilities.

### 2. The AI Failure Mode
LLMs append code blocks to existing functions rather than creating new modules because it is contextually simpler for them.

### 3. AST Detection Mechanics
`tsalum` counts line differences from node start-lines to end-lines for function declarations and class declarations.

### 4. Code Comparison
#### ❌ Violates Law
```typescript
class AccountService {
  // 120 lines of database updates, authentication checks,
  // calculation of interests, sending emails, and audit logs.
}
```

#### ✅ Refactored
```typescript
class AccountRepository { /* < 40 lines */ }
class AuthenticationChecker { /* < 30 lines */ }
class InterestCalculator { /* < 20 lines */ }
```

---

## Law 8: No Classes with More Than Two Instance Variables

### 1. Rationale & Philosophy
Cohesion is the measure of how closely related the fields and methods of a class are. If a class has more than two instance variables, it is likely doing too much. Splitting fields into smaller logical modules increases reuse and isolates changes.

### 2. The AI Failure Mode
LLMs dump properties into a single model class, creating flat database-like tables instead of highly structured Object Graphs.

### 3. AST Detection Mechanics
`tsalum` counts class properties. If a class declares more than 2 instance properties, it flags a violation.

### 4. Code Comparison
#### ❌ Violates Law
```typescript
class Customer {
  public firstName: string;
  public lastName: string;
  public street: string;
  public city: string;
  public zip: string;
}
```

#### ✅ Refactored
```typescript
class FullName {
  constructor(public readonly first: string, public readonly last: string) {}
}

class Address {
  constructor(public readonly street: string, public readonly city: string, public readonly zip: string) {}
}

class Customer {
  constructor(
    public readonly name: FullName,
    public readonly address: Address
  ) {}
}
```

---

## Law 9: No Getters / Setters / Properties

### 1. Rationale & Philosophy
Objects should expose behaviors, not raw state. Implementing getters and setters encourages callers to ask the object for its state, perform a decision external to the object, and then put new state back in. This violates encapsulation. **Tell, Don't Ask.**

### 2. The AI Failure Mode
LLMs default to generating public fields or getters/setters (acting like C++ structs) rather than encapsulating logic in behavior methods.

### 3. AST Detection Mechanics
`tsalum` flags any class member matching a `GetAccessor` or `SetAccessor` node structure.

### 4. Code Comparison
#### ❌ Violates Law
```typescript
const car = new Car();
car.setSpeed(car.getSpeed() + 10);
```

#### ✅ Refactored
```typescript
const car = new Car();
car.accelerate(Speed.fromKMH(10));
```

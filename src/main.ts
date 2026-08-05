import { unzipSync } from 'fflate';
import { lintTypeScript } from './linter.ts';
import './style.css';

const EXAMPLES = {
  bad: `// ❌ A bloated class violating multiple Object Calisthenics rules
class OrderProcessor {
  public id: string; // Violates R3: Raw Primitive
  public total: number; // Violates R3: Raw Primitive
  public items: any[]; // Violates R4: Collection alongside primitives
  public status: string; // Violates R3
  public customerEmail: string; // Violates R3

  constructor(id: string, total: number, items: any[], status: string, email: string) {
    this.id = id;
    this.total = total;
    this.items = items;
    this.status = status;
    this.customerEmail = email;
  }

  // Violates R1 (Deep Nesting) and R2 (Else keyword)
  public process(userRole: string, balance: number): boolean {
    if (this.status === "pending") {
      if (this.total > 0) {
        if (balance >= this.total) {
          if (userRole === "admin") {
            this.status = "processed-priority";
            return true;
          } else {
            this.status = "processed";
            return true;
          }
        } else {
          console.log("Insufficient funds");
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  // Violates R9: Getters & Setters
  public getStatus(): string {
    return this.status;
  }
}`,
  good: `// ✅ Clean refactored code adhering to Object Calisthenics
class OrderId {
  constructor(private readonly value: string) {}
}

class Money {
  constructor(private readonly amount: number) {}
  public canCover(other: Money): boolean {
    return this.amount >= other.amount;
  }
}

class CustomerEmail {
  constructor(private readonly address: string) {}
}

// R4: First class collection wrapping items
class OrderItems {
  constructor(private readonly items: any[]) {}
}

// R8: At most two instance variables (OrderDetails wraps all data)
class OrderDetails {
  constructor(
    public readonly id: OrderId,
    public readonly total: Money,
    public readonly email: CustomerEmail
  ) {}
}

class OrderProcessor {
  private status: string = "pending";
  constructor(private readonly details: OrderDetails) {}

  // R1: Flat nested depth, R2: No else keywords (guard clauses used instead)
  public process(userRole: string, balance: Money): boolean {
    if (this.status !== "pending") return false;
    if (!balance.canCover(this.details.total)) return false;

    this.status = userRole === "admin" ? "processed-priority" : "processed";
    return true;
  }
}`
};

const SIDEBAR_HTML = `
<div class="sidebar">
  <div class="sidebar-header">
    <a href="#" class="sidebar-logo">tsalum<span>.</span></a>
  </div>
  <div class="sidebar-nav">
    <div class="nav-group-title">Overview</div>
    <a class="nav-link active" data-target="home">Home</a>
    <a class="nav-link" data-target="playground">Playground</a>
    <a class="nav-link" data-target="explorer">Workspace Explorer</a>
    
    <div class="nav-group-title">Documentation</div>
    <a class="nav-link" data-target="laws">The 9 Laws</a>
    <a class="nav-link" data-target="cli">CLI & Integration</a>
  </div>
</div>
`;

const MAIN_CONTENT_HTML = `
<div class="main-content">
  <div class="content-header">
    <div class="page-title" id="active-title">Home</div>
    <div class="score-badge">v0.1.0</div>
  </div>
  
  <div class="content-body">
    <!-- HOME SCREEN (STRIKING LANDING PAGE) -->
    <div id="screen-home" class="tab-screen active">
      <div class="doc-page">
        <!-- Motorsport Quote Hero -->
        <div style="border-left: 3px solid var(--error); padding: 1.5rem 0 1.5rem 2rem; margin: 1.5rem 0 3rem 0; background: rgba(239, 68, 68, 0.02);">
          <blockquote style="font-size: 1.6rem; font-weight: 700; line-height: 1.4; letter-spacing: -0.03em; color: var(--text-primary);">
            "In motorsport, brakes are not designed to make you go slow—they are what allow you to go fast safely."
          </blockquote>
        </div>

        <div class="doc-section">
          <h1 style="font-size: 2.8rem; font-weight: 800; letter-spacing: -0.04em; line-height: 1.1; margin-bottom: 1.5rem;">
            AI writes code at 200 mph.<br>You need a Brake.
          </h1>
          
          <p style="font-size: 1.15rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem; max-width: 720px;">
            Every developer using LLMs knows the hidden truth: <strong>code volume is exploding, but architecture is dying</strong>. 
            AI autocomplete models are optimized to spit out quick, nested, branch-heavy code blocks. They suffer from primitive obsession, bloated methods, and zero encapsulation because <em>they don't have to maintain what they write</em>.
          </p>

          <p style="font-size: 1.15rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 3.5rem; max-width: 720px;">
            <code>tsalum</code> applies a strict automated <strong>design harness</strong> directly onto your TypeScript codebase. By enforcing the 9 mathematical boundaries of Object Calisthenics at the commit level, it forces AI engines to write clean, decoupled, highly testable structures instead of monolithic files.
          </p>

          <h2 style="font-size: 1.8rem; font-weight: 700; margin-top: 4rem; margin-bottom: 2rem; letter-spacing: -0.03em; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            The Lifecycle of AI Vibe-Coding
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 4rem;">
            <!-- Stage 1 -->
            <div style="border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 6px; background: rgba(255,255,255,0.01); display: flex; flex-direction: column;">
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); font-weight: 600; margin-bottom: 1rem;">STAGE 01</span>
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary); letter-spacing: -0.02em;">The Vibe-Coding High</h3>
              <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin: 0; flex: 1;">
                You prompt the AI. Code flows at blistering speed. The app works, and you feel like a god. But under the hood, the AI defaults to lazy, nested, primitive-obsessed designs because it has no memory of maintaining what it generates.
              </p>
            </div>
            <!-- Stage 2 -->
            <div style="border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 6px; background: rgba(255,255,255,0.01); display: flex; flex-direction: column;">
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--error); font-weight: 600; margin-bottom: 1rem;">STAGE 02</span>
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--error); letter-spacing: -0.02em;">The Refactoring Wall</h3>
              <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin: 0; flex: 1;">
                You try to test, extend, or ship the code. You find it too coupled to modify without breaking everything. Your velocity crashes to zero as you spend weeks doing manual architectural cleanup.
              </p>
            </div>
            <!-- Stage 3 -->
            <div style="border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 6px; background: rgba(255,255,255,0.01); display: flex; flex-direction: column;">
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-primary); font-weight: 600; margin-bottom: 1rem;">STAGE 03</span>
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary); letter-spacing: -0.02em;">The Steering Loop</h3>
              <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin: 0; flex: 1;">
                You run <code>tsalum</code>. When the AI outputs messy logic, the compiler throws hard errors. The AI reads the error context and immediately refactors the code cleanly in its own generation loop.
              </p>
            </div>
            <!-- Stage 4 -->
            <div style="border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 6px; background: rgba(16, 185, 129, 0.02); border-color: rgba(16, 185, 129, 0.15); display: flex; flex-direction: column;">
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--success); font-weight: 600; margin-bottom: 1rem;">STAGE 04</span>
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--success); letter-spacing: -0.02em;">Zero-Refactor Shipping</h3>
              <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin: 0; flex: 1;">
                Your prototype code complies with Object Calisthenics from day one. You skip the refactoring phase completely and transition smoothly to production. You spend your time innovating, not wrestling with tech debt.
              </p>
            </div>
          </div>

          <!-- Call to Action Buttons -->
          <div style="display: flex; gap: 1rem; margin-bottom: 4rem;">
            <button id="cta-go-playground" style="background: var(--text-primary); color: var(--bg-sidebar); border: none; font-weight: 700; padding: 0.75rem 1.5rem; border-radius: 4px; font-family: var(--font-sans); cursor: pointer; font-size: 0.9rem;">
              Open Playground
            </button>
            <button id="cta-go-laws" style="background: transparent; color: var(--text-primary); border: 1px solid var(--border-color); font-weight: 600; padding: 0.75rem 1.5rem; border-radius: 4px; font-family: var(--font-sans); cursor: pointer; font-size: 0.9rem;">
              Read the 9 Laws
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- PLAYGROUND SCREEN -->
    <div id="screen-playground" class="tab-screen">
      <div class="playground-workspace">
        <div class="panel-card">
          <div class="panel-header">
            <span class="panel-title">⌨️ TypeScript Code Input</span>
            <select id="example-selector" class="plain-select">
              <option value="bad">❌ Load Bad Code Example</option>
              <option value="good">✅ Load Good Refactored Code</option>
            </select>
          </div>
          <div class="panel-body">
            <textarea id="editor" class="plain-editor" spellcheck="false" placeholder="Paste your TypeScript code here..."></textarea>
          </div>
        </div>
        
        <div class="panel-card">
          <div class="panel-header">
            <span class="panel-title">🔍 Diagnostics</span>
            <span id="diagnostic-summary" class="score-badge">0 errors</span>
          </div>
          <div class="panel-body" style="overflow-y: auto;">
            <div id="diagnostics-panel" class="diagnostics-container"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- WORKSPACE EXPLORER SCREEN -->
    <div id="screen-explorer" class="tab-screen">
      <div class="explorer-workspace">
        <div id="explorer-upload-zone" class="upload-zone">
          <div class="upload-content">
            <div class="upload-icon">📁</div>
            <h3>Load a Project Folder or ZIP</h3>
            <p>Drag and drop a project directory or <code>.zip</code> file here, or select one below.</p>
            <div class="upload-actions">
              <label class="btn-primary">
                Choose Folder
                <input type="file" id="folder-input" webkitdirectory directory multiple style="display:none;" />
              </label>
              <label class="btn-secondary">
                Choose ZIP File
                <input type="file" id="zip-input" accept=".zip" style="display:none;" />
              </label>
            </div>
            <p class="upload-note">All processing runs entirely in your browser. No files are uploaded to any server.</p>
          </div>
        </div>

        <div id="explorer-active-view" class="active-explorer-view" style="display: none;">
          <div class="explorer-sidebar">
            <div class="explorer-sidebar-header">
              <span class="workspace-name" id="explorer-project-name">My Project</span>
              <button id="explorer-close-btn" class="btn-close" title="Close Workspace">✕</button>
            </div>
            
            <div class="explorer-stats">
              <div class="stat-card">
                <span class="stat-label">Files</span>
                <span class="stat-val" id="explorer-stat-files">0</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">Violations</span>
                <span class="stat-val" id="explorer-stat-errors">0</span>
              </div>
            </div>

            <div class="explorer-sidebar-tabs">
              <button class="sidebar-tab-btn active" id="tab-btn-tree">Files</button>
              <button class="sidebar-tab-btn" id="tab-btn-violations">Violations</button>
            </div>

            <div class="explorer-sidebar-content">
              <div id="pane-file-tree" class="explorer-pane active">
                <div id="file-tree-container" class="file-tree"></div>
              </div>
              <div id="pane-violations" class="explorer-pane">
                <div id="violations-list-container" class="violations-list"></div>
              </div>
            </div>
          </div>

          <div class="explorer-main">
            <div id="explorer-empty-state" class="explorer-empty-state">
              <div class="empty-icon">📊</div>
              <h3>Workspace Audited</h3>
              <p>Select a file from the tree to view its contents and live calisthenics analysis, or click on a violation to jump directly to it.</p>
              <div class="audit-summary-dashboard" id="audit-dashboard-summary"></div>
            </div>

            <div id="explorer-editor-state" class="explorer-editor-state" style="display: none;">
              <div class="explorer-editor-header">
                <div class="file-info">
                  <span class="file-icon">📄</span>
                  <span class="file-path" id="explorer-current-filepath">src/main.ts</span>
                </div>
                <div class="file-actions">
                  <span id="explorer-file-status-badge" class="score-badge">passed</span>
                </div>
              </div>
              
              <div class="explorer-editor-workspace">
                <div class="panel-card editor-panel">
                  <div class="panel-header">
                    <span class="panel-title">Code View</span>
                  </div>
                  <div class="panel-body">
                    <pre class="code-view-pre"><code id="explorer-code-display"></code></pre>
                  </div>
                </div>

                <div class="panel-card diagnostics-panel">
                  <div class="panel-header">
                    <span class="panel-title">Diagnostics</span>
                  </div>
                  <div class="panel-body" style="overflow-y: auto;">
                    <div id="explorer-diagnostics-panel" class="diagnostics-container"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- THE 9 LAWS SCREEN -->
    <div id="screen-laws" class="tab-screen">
      <div class="doc-page">
        <div class="doc-section">
          <h1>The 9 Laws of tsalum</h1>
          <p>This is the technical manual of the constraints evaluated by tsalum. Each law outlines the engineering rationale, the common AI failure pattern, and how to restructure the code.</p>
          
          <h2>Law 1: One Level of Indentation per Method</h2>
          <p>Deep nesting multiplies cognitive load. If you have an <code>if</code> condition inside a loop, that method is doing two things: iterating and filtering. Extract the inner logic.</p>
          <div class="diff-container">
            <div class="diff-box bad">
              <div class="diff-box-header">❌ Violates Law</div>
              <pre class="diff-code">for (let user of users) {
  if (user.isActive) {
    if (user.isPremium) {
      charge(user);
    }
  }
}</pre>
            </div>
            <div class="diff-box good">
              <div class="diff-box-header">✅ Refactored</div>
              <pre class="diff-code">users.filter(isActivePremium).forEach(charge);

function isActivePremium(u: User) {
  return u.isActive && u.isPremium;
}</pre>
            </div>
          </div>

          <h2>Law 2: Don't Use the "ELSE" Keyword</h2>
          <p>The <code>else</code> keyword encourages complex binary branching. Use guard clauses (early returns) or polymorphism to handle alternative flows. This makes execution linear and readable.</p>
          <div class="diff-container">
            <div class="diff-box bad">
              <div class="diff-box-header">❌ Violates Law</div>
              <pre class="diff-code">if (user.isPremium) {
  return 0.10;
} else {
  return 0.05;
}</pre>
            </div>
            <div class="diff-box good">
              <div class="diff-box-header">✅ Refactored</div>
              <pre class="diff-code">if (user.isPremium) return 0.10;
return 0.05;</pre>
            </div>
          </div>

          <h2>Law 3: Wrap All Primitives and Strings</h2>
          <p>Avoid <strong>Primitive Obsession</strong>. A string is just characters, but an email contains validation rules and behaviors. Wrap primitives in specific type-safe classes (Value Objects).</p>
          <div class="diff-container">
            <div class="diff-box bad">
              <div class="diff-box-header">❌ Violates Law</div>
              <pre class="diff-code">class User {
  public email: string;
  public balance: number;
}</pre>
            </div>
            <div class="diff-box good">
              <div class="diff-box-header">✅ Refactored</div>
              <pre class="diff-code">class EmailAddress {
  constructor(public readonly address: string) {
    if (!address.includes('@')) throw new Error();
  }
}
class User {
  constructor(
    public readonly email: EmailAddress,
    public readonly balance: Dollars
  ) {}
}</pre>
            </div>
          </div>

          <h2>Law 4: First Class Collections</h2>
          <p>Any class containing a collection should hold **no other properties**. Group all operations (filtering, reduction, mapping) into that collection-wrapper class.</p>
          <div class="diff-container">
            <div class="diff-box bad">
              <div class="diff-box-header">❌ Violates Law</div>
              <pre class="diff-code">class Department {
  public name: string;
  public employees: Employee[];
}</pre>
            </div>
            <div class="diff-box good">
              <div class="diff-box-header">✅ Refactored</div>
              <pre class="diff-code">class Employees {
  constructor(private readonly list: Employee[]) {}
}
class Department {
  constructor(
    public readonly name: DepartmentName,
    public readonly staff: Employees
  ) {}
}</pre>
            </div>
          </div>

          <h2>Law 5: One Dot Per Line (Law of Demeter)</h2>
          <p>Talk only to immediate friends, not strangers. Avoid method chaining like <code>a.getB().getC().doAction()</code> because it tightly couples classes across multiple layers.</p>
          <div class="diff-container">
            <div class="diff-box bad">
              <div class="diff-box-header">❌ Violates Law</div>
              <pre class="diff-code">const zip = user.getProfile().getAddress().getZip();</pre>
            </div>
            <div class="diff-box good">
              <div class="diff-box-header">✅ Refactored</div>
              <pre class="diff-code">const zip = user.getZipCode();</pre>
            </div>
          </div>

          <h2>Law 6: Don't Abbreviate</h2>
          <p>Short variables (<code>mgr</code>, <code>err</code>, <code>u</code>) indicate laziness. Keep variable, parameter, class, and method names descriptive (&gt;2 characters).</p>
          <div class="diff-container">
            <div class="diff-box bad">
              <div class="diff-box-header">❌ Violates Law</div>
              <pre class="diff-code">const u = db.find(id);</pre>
            </div>
            <div class="diff-box good">
              <div class="diff-box-header">✅ Refactored</div>
              <pre class="diff-code">const targetUser = userDatabase.find(userId);</pre>
            </div>
          </div>

          <h2>Law 7: Keep All Entities Small</h2>
          <p>A class should not exceed 60 lines. A method/function should not exceed 15 lines. Large files do too much—break them down.</p>
          <div class="diff-container">
            <div class="diff-box bad">
              <div class="diff-box-header">❌ Violates Law</div>
              <pre class="diff-code">class HeavyProcessor {
  // 150 lines of mixed concerns: file access,
  // calculation, notification formatting.
}</pre>
            </div>
            <div class="diff-box good">
              <div class="diff-box-header">✅ Refactored</div>
              <pre class="diff-code">class FileReader { /* &lt; 20 lines */ }
class Engine { /* &lt; 30 lines */ }
class Notifier { /* &lt; 25 lines */ }</pre>
            </div>
          </div>

          <h2>Law 8: Max 2 Instance Variables</h2>
          <p>Classes should have at most 2 instance variables to ensure high cohesion. If your class needs more properties, group them into a nested object struct.</p>
          <div class="diff-container">
            <div class="diff-box bad">
              <div class="diff-box-header">❌ Violates Law</div>
              <pre class="diff-code">class User {
  public firstName: string;
  public lastName: string;
  public phone: string;
  public email: string;
}</pre>
            </div>
            <div class="diff-box good">
              <div class="diff-box-header">✅ Refactored</div>
              <pre class="diff-code">class ContactDetails {
  constructor(public readonly phone: Phone, public readonly email: Email) {}
}
class User {
  constructor(
    public readonly name: FullName,
    public readonly contact: ContactDetails
  ) {}
}</pre>
            </div>
          </div>

          <h2>Law 9: No Getters / Setters</h2>
          <p>Exposing class internals creates dumb data containers instead of rich behavioral objects. Do not query an object for state to manipulate it externally; tell the object to run a method directly (<strong>Tell, Don't Ask</strong>).</p>
          <div class="diff-container">
            <div class="diff-box bad">
              <div class="diff-box-header">❌ Violates Law</div>
              <pre class="diff-code">const balance = account.getBalance();
account.setBalance(balance + 100);</pre>
            </div>
            <div class="diff-box good">
              <div class="diff-box-header">✅ Refactored</div>
              <pre class="diff-code">account.deposit(Dollars.fromNumber(100));</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CLI & INTEGRATION SCREEN -->
    <div id="screen-cli" class="tab-screen">
      <div class="doc-page">
        <div class="doc-section">
          <h1>CLI & Project Integration</h1>
          <p>To integrate <code>tsalum</code> directly into your local projects and CI pipelines to prevent LLMs from committing bloated code:</p>
          
          <h2>1. Local Package Installation</h2>
          <p>You can run <code>tsalum</code> as a quick CLI checker in any project directory:</p>
          <pre class="doc-code-block">npx tsalum --dir ./src --fail-on-errors</pre>
          
          <h2>2. pre-commit Hook</h2>
          <p>Ensure that code generated by your local AI models or copilots is checked before every commit by editing <code>.git/hooks/pre-commit</code>:</p>
          <pre class="doc-code-block">#!/bin/sh
npx tsalum --dir ./src --fail-on-errors
if [ $? -ne 0 ]; then
  echo "🛑 Commit rejected: Code violates tsalum constraints."
  exit 1
fi</pre>
          
          <h2>3. CI/CD Integration</h2>
          <p>Add the following command to your GitHub Action or deployment pipeline to block pull requests containing violations:</p>
          <pre class="doc-code-block"># GitHub Actions workflow step
- name: Run tsalum audit
  run: npx tsalum --dir ./src --fail-on-error</pre>
        </div>
      </div>
    </div>
  </div>
</div>
`;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="app-container">
  ${SIDEBAR_HTML}
  ${MAIN_CONTENT_HTML}
</div>
`;

const editor = document.getElementById('editor') as HTMLTextAreaElement;
const exampleSelector = document.getElementById('example-selector') as HTMLSelectElement;
const diagnosticsPanel = document.getElementById('diagnostics-panel') as HTMLDivElement;
const diagnosticSummaryEl = document.getElementById('diagnostic-summary') as HTMLSpanElement;
const activeTitleEl = document.getElementById('active-title') as HTMLDivElement;

// Set initial example code
editor.value = EXAMPLES.bad;

// Helper function to switch tabs programmatically
function switchTab(target: string) {
  // Switch active nav class
  document.querySelectorAll('.nav-link').forEach(nav => {
    if (nav.getAttribute('data-target') === target) {
      nav.classList.add('active');
    } else {
      nav.classList.remove('active');
    }
  });
  
  // Switch active screen class
  document.querySelectorAll('.tab-screen').forEach(screen => screen.classList.remove('active'));
  const targetScreen = document.getElementById(`screen-${target}`);
  if (targetScreen) targetScreen.classList.add('active');
  
  // Update Header Page Title
  const titleMap: Record<string, string> = {
    home: 'Home',
    playground: 'Interactive Playground',
    explorer: 'Workspace Explorer',
    laws: 'The 9 Laws of Object Calisthenics',
    cli: 'CLI & Integration Guide'
  };
  if (activeTitleEl) activeTitleEl.textContent = titleMap[target] || 'tsalum';
}

// Setup Tab Routing (Sidebar Link Switches)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = (e.currentTarget as HTMLElement).getAttribute('data-target') || 'home';
    switchTab(target);
  });
});

// Setup CTA links on Home Screen
document.getElementById('cta-go-playground')?.addEventListener('click', () => switchTab('playground'));
document.getElementById('cta-go-laws')?.addEventListener('click', () => switchTab('laws'));

function runLinter() {
  const code = editor.value;
  const diagnostics = lintTypeScript(code);
  
  // Render diagnostics count badge
  const count = diagnostics.length;
  if (diagnosticSummaryEl) {
    if (count === 0) {
      diagnosticSummaryEl.textContent = 'passed';
      diagnosticSummaryEl.className = 'score-badge';
      diagnosticSummaryEl.style.color = 'var(--success)';
    } else {
      diagnosticSummaryEl.textContent = `${count} error${count > 1 ? 's' : ''}`;
      diagnosticSummaryEl.className = 'score-badge fail';
    }
  }
  
  renderDiagnostics(diagnostics);
}

function renderDiagnostics(diagnostics: any[]) {
  if (diagnostics.length === 0) {
    diagnosticsPanel.innerHTML = `
      <div class="empty-diagnostics">
        ✨ Code health is 100%. Ready for production.
      </div>
    `;
    return;
  }

  const items = diagnostics.map(d => `
    <div class="diagnostic-item">
      <div class="diagnostic-meta">
        <span class="diagnostic-rule">${d.ruleName}</span>
        <span class="diagnostic-line">Line ${d.line}:${d.character}</span>
      </div>
      <div class="diagnostic-desc">${d.message}</div>
      ${d.snippet ? `<pre class="diagnostic-snippet">${escapeHtml(d.snippet.trim())}</pre>` : ''}
    </div>
  `).join('');

  diagnosticsPanel.innerHTML = items;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Event Listeners for Playground
editor.addEventListener('input', runLinter);

exampleSelector.addEventListener('change', () => {
  const selected = exampleSelector.value as 'bad' | 'good';
  editor.value = EXAMPLES[selected];
  runLinter();
});

// Run linter on initial load
runLinter();

// ==========================================
// Workspace Explorer Logic
// ==========================================

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  children?: TreeNode[];
  errorCount?: number;
}

interface FileItem {
  path: string;
  name: string;
  content: string;
}

const filesMap = new Map<string, { content: string; diagnostics: any[] }>();

// Build Tree from Flat File Paths
function buildTree(files: { path: string }[]): TreeNode {
  const root: TreeNode = { name: 'root', path: '', isFolder: true, children: [] };
  
  for (const file of files) {
    const parts = file.path.split('/');
    let current = root;
    let currentPath = '';
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLast = i === parts.length - 1;
      
      let child = current.children?.find(c => c.name === part);
      if (!child) {
        child = {
          name: part,
          path: currentPath,
          isFolder: !isLast,
          children: isLast ? undefined : []
        };
        current.children?.push(child);
      }
      current = child;
    }
  }
  
  function sortNode(node: TreeNode) {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1;
        if (!a.isFolder && b.isFolder) return 1;
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortNode);
    }
  }
  sortNode(root);
  
  return root;
}

// Render Tree HTML
function renderTreeHTML(node: TreeNode, indent = 0): string {
  if (node.name === 'root') {
    return (node.children || []).map(child => renderTreeHTML(child, indent)).join('');
  }
  
  const hasErrors = node.errorCount && node.errorCount > 0;
  const errorBadge = hasErrors ? `<span class="tree-error-badge">${node.errorCount}</span>` : '';
  const paddingLeft = `${indent * 12 + 10}px`;
  
  if (node.isFolder) {
    const safePathId = node.path.replace(/[^a-zA-Z0-9]/g, '-');
    return `
      <div class="tree-node tree-folder" data-path="${node.path}" style="padding-left: ${paddingLeft};">
        <span class="tree-toggle">▼</span>
        <span class="tree-icon">📁</span>
        <span class="tree-label">${node.name}</span>
        ${errorBadge}
      </div>
      <div class="tree-folder-children" id="children-${safePathId}" style="display: block;">
        ${(node.children || []).map(child => renderTreeHTML(child, indent + 1)).join('')}
      </div>
    `;
  } else {
    const isTS = node.name.endsWith('.ts') || node.name.endsWith('.tsx');
    const icon = isTS ? '📄' : '📝';
    return `
      <div class="tree-node tree-file" data-path="${node.path}" style="padding-left: ${paddingLeft};" title="${node.path}">
        <span class="tree-icon">${icon}</span>
        <span class="tree-label">${node.name}</span>
        ${errorBadge}
      </div>
    `;
  }
}

// Render Dashboard View
function renderDashboard(files: Map<string, { content: string; diagnostics: any[] }>): string {
  const totalFiles = files.size;
  let tsFilesCount = 0;
  let totalViolations = 0;
  const ruleCounts: Record<string, number> = {};
  const fileViolations: { path: string; count: number }[] = [];

  for (const [path, data] of files.entries()) {
    const isTS = path.endsWith('.ts') || path.endsWith('.tsx');
    if (isTS) tsFilesCount++;
    const count = data.diagnostics.length;
    totalViolations += count;
    
    if (count > 0) {
      fileViolations.push({ path, count });
      data.diagnostics.forEach(d => {
        ruleCounts[d.ruleName] = (ruleCounts[d.ruleName] || 0) + 1;
      });
    }
  }

  fileViolations.sort((a, b) => b.count - a.count);

  const rulesListHtml = Object.entries(ruleCounts)
    .map(([rule, count]) => `
      <div class="dashboard-rule-item">
        <span class="rule-name">${rule}</span>
        <span class="rule-count badge-error">${count}</span>
      </div>
    `).join('') || '<div class="text-success">No violations found! Your codebase is pristine.</div>';

  const filesListHtml = fileViolations
    .slice(0, 5)
    .map(fv => `
      <div class="dashboard-file-item" data-path="${fv.path}">
        <span class="file-path-link">${fv.path}</span>
        <span class="file-error-count badge-error">${fv.count} errors</span>
      </div>
    `).join('') || '<div class="text-success">No files with violations.</div>';

  return `
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <h4>Overview Stats</h4>
        <div class="dashboard-stats-grid">
          <div class="stat-box">
            <span class="stat-label">Total Files</span>
            <span class="stat-value">${totalFiles}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">TypeScript Files</span>
            <span class="stat-value">${tsFilesCount}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Total Violations</span>
            <span class="stat-value ${totalViolations > 0 ? 'text-error' : 'text-success'}">${totalViolations}</span>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <h4>Violations by Law</h4>
        <div class="dashboard-rules-list">
          ${rulesListHtml}
        </div>
      </div>

      <div class="dashboard-card full-width">
        <h4>Worst Offenders</h4>
        <div class="dashboard-files-list">
          ${filesListHtml}
        </div>
      </div>
    </div>
  `;
}

// Render Consolidated Violations Sidebar
function renderAllViolationsPane() {
  const container = document.getElementById('violations-list-container');
  if (!container) return;

  const items: string[] = [];
  for (const [path, data] of filesMap.entries()) {
    if (data.diagnostics.length > 0) {
      data.diagnostics.forEach(d => {
        items.push(`
          <div class="violation-list-item" data-path="${path}" data-line="${d.line}">
            <div class="violation-file">
              <span>${path.split('/').pop()}</span>
              <span>Line ${d.line}</span>
            </div>
            <div class="violation-rule">${d.ruleName}</div>
            <div class="violation-message">${d.message}</div>
          </div>
        `);
      });
    }
  }

  if (items.length === 0) {
    container.innerHTML = `<div class="empty-diagnostics">✨ No violations found in the codebase.</div>`;
  } else {
    container.innerHTML = items.join('');
    
    container.querySelectorAll('.violation-list-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        const path = el.getAttribute('data-path')!;
        const line = parseInt(el.getAttribute('data-line')!, 10);
        selectFile(path, line);
      });
    });
  }
}

// Select File and Display in Editor
function selectFile(path: string, highlightLine: number | null = null) {
  document.querySelectorAll('.tree-file').forEach(el => {
    if (el.getAttribute('data-path') === path) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  const fileData = filesMap.get(path);
  if (!fileData) return;

  const emptyState = document.getElementById('explorer-empty-state');
  const editorState = document.getElementById('explorer-editor-state');
  if (emptyState) emptyState.style.display = 'none';
  if (editorState) editorState.style.display = 'flex';

  const pathEl = document.getElementById('explorer-current-filepath');
  if (pathEl) pathEl.textContent = path;

  const diagnostics = fileData.diagnostics;
  const statusBadge = document.getElementById('explorer-file-status-badge');
  if (statusBadge) {
    if (diagnostics.length === 0) {
      statusBadge.textContent = 'passed';
      statusBadge.className = 'score-badge';
      statusBadge.style.color = 'var(--success)';
    } else {
      statusBadge.textContent = `${diagnostics.length} error${diagnostics.length > 1 ? 's' : ''}`;
      statusBadge.className = 'score-badge fail';
      statusBadge.style.color = 'var(--error)';
    }
  }

  const codeDisplay = document.getElementById('explorer-code-display');
  if (codeDisplay) {
    const errorLines = new Set<number>();
    diagnostics.forEach(d => errorLines.add(d.line));

    const lines = fileData.content.split('\n');
    const formattedHtml = lines.map((line, idx) => {
      const lineNum = idx + 1;
      const hasErr = errorLines.has(lineNum);
      const errClass = hasErr ? ' has-error' : '';
      return `<div class="code-line${errClass}" id="explorer-line-${lineNum}"><span class="line-number">${lineNum}</span><span class="line-content">${escapeHtml(line)}</span></div>`;
    }).join('');
    
    codeDisplay.innerHTML = formattedHtml;
  }

  const diagPanel = document.getElementById('explorer-diagnostics-panel');
  if (diagPanel) {
    if (diagnostics.length === 0) {
      diagPanel.innerHTML = `
        <div class="empty-diagnostics">
          ✨ No Object Calisthenics violations in this file.
        </div>
      `;
    } else {
      diagPanel.innerHTML = diagnostics.map(d => `
        <div class="diagnostic-item" data-line="${d.line}">
          <div class="diagnostic-meta">
            <span class="diagnostic-rule">${d.ruleName}</span>
            <span class="diagnostic-line">Line ${d.line}:${d.character}</span>
          </div>
          <div class="diagnostic-desc">${d.message}</div>
        </div>
      `).join('');

      diagPanel.querySelectorAll('.diagnostic-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const lineStr = (e.currentTarget as HTMLElement).getAttribute('data-line');
          if (lineStr) {
            const line = parseInt(lineStr, 10);
            scrollToLine(line);
          }
        });
      });
    }
  }

  if (highlightLine !== null) {
    setTimeout(() => scrollToLine(highlightLine), 100);
  }
}

function scrollToLine(lineNumber: number) {
  const lineEl = document.getElementById(`explorer-line-${lineNumber}`);
  if (lineEl) {
    lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    lineEl.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
    setTimeout(() => {
      lineEl.style.backgroundColor = '';
    }, 1500);
  }
}

function showEmptyState() {
  const emptyState = document.getElementById('explorer-empty-state');
  const editorState = document.getElementById('explorer-editor-state');
  if (emptyState) emptyState.style.display = 'flex';
  if (editorState) editorState.style.display = 'none';
  document.querySelectorAll('.tree-file').forEach(el => el.classList.remove('active'));
}

// Parse Directory Entry recursively
async function traverseEntry(entry: any, path = ''): Promise<FileItem[]> {
  const files: FileItem[] = [];
  if (entry.isFile) {
    const file = await new Promise<File>((resolve, reject) => {
      entry.file(resolve, reject);
    });
    if (file.name.endsWith('.zip') && path === '') {
      return processZipFile(file);
    }
    const content = await file.text();
    files.push({
      path: path ? `${path}/${entry.name}` : entry.name,
      name: entry.name,
      content
    });
  } else if (entry.isDirectory) {
    const reader = entry.createReader();
    const entries = await readAllEntries(reader);
    for (const subEntry of entries) {
      const subFiles = await traverseEntry(subEntry, path ? `${path}/${entry.name}` : entry.name);
      files.push(...subFiles);
    }
  }
  return files;
}

async function readAllEntries(reader: any): Promise<any[]> {
  const allEntries: any[] = [];
  while (true) {
    const entries = await new Promise<any[]>((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });
    if (entries.length === 0) break;
    allEntries.push(...entries);
  }
  return allEntries;
}

// Process dropped items (folders/files)
async function processDroppedItems(items: DataTransferItemList) {
  const filePromises: Promise<FileItem[]>[] = [];
  let projectName = 'Loaded Folder';
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        if (i === 0) {
          projectName = entry.name;
        }
        filePromises.push(traverseEntry(entry));
      }
    }
  }
  
  const results = await Promise.all(filePromises);
  const flatFiles = results.flat();
  
  if (flatFiles.length > 0) {
    await loadFilesIntoWorkspace(flatFiles, projectName);
  }
}

// Unzip file contents
async function processZipFile(file: File): Promise<FileItem[]> {
  const buffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(buffer);
  const unzipped = unzipSync(uint8);
  const files: FileItem[] = [];
  
  for (const [relativePath, bytes] of Object.entries(unzipped)) {
    if (relativePath.endsWith('/')) continue;
    const content = new TextDecoder().decode(bytes);
    const parts = relativePath.split('/');
    const name = parts[parts.length - 1];
    files.push({
      path: relativePath,
      name,
      content
    });
  }
  return files;
}

// Main loader function for folder structure
async function loadFilesIntoWorkspace(fileItems: FileItem[], projectName = 'Loaded Project') {
  filesMap.clear();
  let totalErrors = 0;
  
  for (const item of fileItems) {
    const isTS = item.path.endsWith('.ts') || item.path.endsWith('.tsx');
    const diagnostics = isTS ? lintTypeScript(item.content) : [];
    totalErrors += diagnostics.length;
    filesMap.set(item.path, {
      content: item.content,
      diagnostics
    });
  }

  const nameEl = document.getElementById('explorer-project-name');
  if (nameEl) nameEl.textContent = projectName;
  
  const filesStat = document.getElementById('explorer-stat-files');
  if (filesStat) filesStat.textContent = filesMap.size.toString();
  
  const errorsStat = document.getElementById('explorer-stat-errors');
  if (errorsStat) {
    errorsStat.textContent = totalErrors.toString();
    if (totalErrors > 0) {
      errorsStat.classList.add('text-error');
    } else {
      errorsStat.classList.remove('text-error');
    }
  }

  const treeRoot = buildTree(fileItems.map(f => ({ path: f.path })));
  
  function calculateTreeErrorCounts(node: TreeNode): number {
    if (node.isFolder) {
      let sum = 0;
      node.children?.forEach(c => {
        sum += calculateTreeErrorCounts(c);
      });
      node.errorCount = sum;
      return sum;
    } else {
      const fileData = filesMap.get(node.path);
      const errors = fileData ? fileData.diagnostics.length : 0;
      node.errorCount = errors;
      return errors;
    }
  }
  calculateTreeErrorCounts(treeRoot);

  const container = document.getElementById('file-tree-container');
  if (container) {
    container.innerHTML = renderTreeHTML(treeRoot);
  }

  renderAllViolationsPane();

  const dashboardContainer = document.getElementById('audit-dashboard-summary');
  if (dashboardContainer) {
    dashboardContainer.innerHTML = renderDashboard(filesMap);
  }

  const uploadZone = document.getElementById('explorer-upload-zone');
  const activeView = document.getElementById('explorer-active-view');
  if (uploadZone) uploadZone.style.display = 'none';
  if (activeView) activeView.style.display = 'flex';

  showEmptyState();
}

// Setup Event Handlers for Workspace Explorer
const explorerUploadZone = document.getElementById('explorer-upload-zone');

explorerUploadZone?.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  explorerUploadZone.classList.add('dragover');
});

explorerUploadZone?.addEventListener('dragenter', (e) => {
  e.preventDefault();
  e.stopPropagation();
  explorerUploadZone.classList.add('dragover');
});

explorerUploadZone?.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  explorerUploadZone.classList.remove('dragover');
});

explorerUploadZone?.addEventListener('drop', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  explorerUploadZone.classList.remove('dragover');

  const dt = e.dataTransfer;
  if (dt && dt.items) {
    await processDroppedItems(dt.items);
  }
});

const zipInput = document.getElementById('zip-input') as HTMLInputElement;
zipInput?.addEventListener('change', async () => {
  const files = zipInput.files;
  if (files && files.length > 0) {
    const fileItems = await processZipFile(files[0]);
    await loadFilesIntoWorkspace(fileItems, files[0].name);
  }
});

const folderInput = document.getElementById('folder-input') as HTMLInputElement;
folderInput?.addEventListener('change', async () => {
  const files = folderInput.files;
  if (files && files.length > 0) {
    const fileItems: FileItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const content = await file.text();
      const path = file.webkitRelativePath || file.name;
      fileItems.push({
        path,
        name: file.name,
        content
      });
    }
    const firstPath = files[0].webkitRelativePath || '';
    const rootFolderName = firstPath.split('/')[0] || 'Project Folder';
    await loadFilesIntoWorkspace(fileItems, rootFolderName);
  }
});

const closeBtn = document.getElementById('explorer-close-btn');
closeBtn?.addEventListener('click', () => {
  filesMap.clear();
  const uploadZone = document.getElementById('explorer-upload-zone');
  const activeView = document.getElementById('explorer-active-view');
  if (uploadZone) uploadZone.style.display = 'flex';
  if (activeView) activeView.style.display = 'none';
  showEmptyState();
});

const tabBtnTree = document.getElementById('tab-btn-tree');
const tabBtnViolations = document.getElementById('tab-btn-violations');
const paneFileTree = document.getElementById('pane-file-tree');
const paneViolations = document.getElementById('pane-violations');

tabBtnTree?.addEventListener('click', () => {
  tabBtnTree.classList.add('active');
  tabBtnViolations?.classList.remove('active');
  paneFileTree?.classList.add('active');
  paneViolations?.classList.remove('active');
});

tabBtnViolations?.addEventListener('click', () => {
  tabBtnViolations.classList.add('active');
  tabBtnTree?.classList.remove('active');
  paneViolations?.classList.add('active');
  paneFileTree?.classList.remove('active');
});

document.getElementById('file-tree-container')?.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const folderEl = target.closest('.tree-folder') as HTMLElement;
  if (folderEl) {
    const path = folderEl.getAttribute('data-path')!;
    const safePathId = path.replace(/[^a-zA-Z0-9]/g, '-');
    const childrenContainer = document.getElementById(`children-${safePathId}`);
    const toggleEl = folderEl.querySelector('.tree-toggle')!;
    if (childrenContainer) {
      if (childrenContainer.style.display === 'none') {
        childrenContainer.style.display = 'block';
        toggleEl.textContent = '▼';
      } else {
        childrenContainer.style.display = 'none';
        toggleEl.textContent = '▶';
      }
    }
    return;
  }
  
  const fileEl = target.closest('.tree-file') as HTMLElement;
  if (fileEl) {
    const path = fileEl.getAttribute('data-path')!;
    selectFile(path);
  }
});

document.getElementById('explorer-empty-state')?.addEventListener('click', (e) => {
  const fileItem = (e.target as HTMLElement).closest('.dashboard-file-item') as HTMLElement;
  if (fileItem) {
    const path = fileItem.getAttribute('data-path');
    if (path) {
      selectFile(path);
    }
  }
});


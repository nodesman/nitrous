# Page Builder & Architectural Prompt: Nitrous Main Console, Telemetry Hero & Interactive AST/Test-Lint Playground (`home_screen`)

<screen_data>
# Screen Metadata (metadata.json)
{
  "screen_id": "home_screen",
  "screen_title": "Nitrous Main Console, Telemetry Hero & Interactive AST/Test-Lint Playground",
  "route": "/",
  "target_output_path": "dist/index.html",
  "domain": "https://nitrous.aramudan.dev/",
  "plane_module": "Sovereign Web Console & Navigation Suite",
  "status": "active_prototype"
}

# Structured Screen Data (screen_data.yaml) - home_screen
screen_schema:
  name: home_screen
  route: "/"
  target_file: "dist/index.html"
  theme: "Uber Black (#030303) + Electric Cyan (#00f0ff) + Crimson (#ef4444) + Amber (#f59e0b) + Emerald (#10b981)"

empirical_telemetry_banner:
  citation: "Fiona Chen & James Stratton (Harvard University, Oct 2026) — Jellyfish Telemetry Study across 300M work events, 700,000+ engineers, and 700+ software firms"
  source_url: "https://arstechnica.com/ai/2026/10/ai-coding-agents-generate-more-code-but-not-more-software/"
  metrics:
    - label: "AI Code Volume Surge"
      value: "+30% LOC / +23% PRs"
      sentiment: "warning"
    - label: "PR Review Time Bottleneck"
      value: "+49% Longer Merge Time"
      sentiment: "danger"
    - label: "PRs Requiring Rewrites"
      value: "~2.0x (Nearly Doubled)"
      sentiment: "danger"
    - label: "Net Shipped Jira Epics/Issues"
      value: "0.0% Statistically Significant Gain"
      sentiment: "danger"
  practitioner_quote:
    author: "metavirus (Ars Technica Staff Pick, 9 Oct 2026)"
    quote: "I’m forced to use AI at work and this is absolutely 10000% true. Soooooo much slop code goes into the basin, which dozens of people need to sift through, strain out the dreck, then eventually close their eyes and release into the wild because now we have new SLAs so we’re not seen as a bottleneck to progress."

core_value_proposition:
  headline: "Define Rules with an Agent. Manage Them in a CRUD Dashboard. Inject Verbose Context into Every Run."
  mechanism_name: "Agent-Defined Rules + CRUD Governance Console + Verbose stdout Context Injection"
  explanation: >
    1. DEFINE WITH AN AGENT: Describe an anti-pattern or architectural boundary in plain English (or paste a bad PR diff),
       and Nitrous generates the AST detector and the verbose refactoring prompt automatically.
    2. MANAGE IN A 3-AREA CRUD INTERFACE: View, create, edit, toggle, or delete every rule across three dedicated areas:
       (I) Stylistic & Calisthenic Issues, (II) Architectural Triggers, and (III) Test Lints (`nitrous test-lint`).
    3. INJECT VERBOSE CONTEXT INTO STDOUT: When your coding agent violates any active rule in the terminal, Nitrous dumps
       your exact verbose refactoring instructions directly into `stdout` (the agent's prompt context window) so the agent
       fixes the problem before a Pull Request is ever opened.

home_page_crud_dashboard_showcase:
  title: "Interactive Account Rule & Trigger CRUD Dashboard (Prototype)"
  subtitle: "Decide exactly what should and shouldn't happen in your repositories across 3 dedicated governance areas:"
  agent_rule_creator_bar:
    input_placeholder: "Describe a new rule or trigger in plain English (e.g. 'Never allow qss.contains CSS grepping in C++ unit tests')..."
    button_label: "✨ Generate Rule via Agent & Add to CRUD Table"
  three_governance_areas:
    - area_id: "area-1-stylistic-calisthenics"
      tab_label: "1. Stylistic & Code Calisthenics"
      description: "Line and function-level hygiene rules ('What shouldn't happen in production syntax')."
      crud_operations: ["Create via Agent", "Read/Inspect", "Update Threshold/Verbose Prompt", "Delete/Toggle"]
      default_records:
        - id: "style-no-else"
          name: "Zero `else` Keywords"
          condition: "Any `else` or `else if` branch in production methods"
          action: "Block & inject Guard Clause / Polymorphism refactoring blueprint into stdout"
          status: "BLOCKING"
        - id: "style-max-indent"
          name: "Max 1 Level of Indentation"
          condition: "Nested control flow depth > 1 inside any function"
          action: "Block & inject helper-extraction instructions into stdout"
          status: "BLOCKING"
        - id: "style-no-getters-setters"
          name: "Tell, Don't Ask (No Getters/Setters)"
          condition: "Public `getX()` / `setX()` accessors exposing raw internal state"
          action: "Block & instruct agent to expose domain behavior commands instead"
          status: "BLOCKING"
        - id: "style-no-abbreviations"
          name: "Muscular Unabbreviated Identifiers"
          condition: "Single-letter or cryptic variable abbreviations (`mgr`, `val`, `tmp`)"
          action: "Warn/Block & require full domain vocabulary"
          status: "RATCHET"

    - area_id: "area-2-architectural-triggers"
      tab_label: "2. Architectural Triggers (IF Event -> THEN Action)"
      description: "Structural event triggers ('When threshold or boundary X is crossed -> Trigger architectural action Y')."
      crud_operations: ["Create Trigger via Agent", "Read/Inspect", "Update IF/THEN & Verbose Prompt", "Delete/Toggle"]
      default_records:
        - id: "trigger-god-file-split"
          name: "Entity Size & God-Class Decomposition Trigger"
          when_trigger: "IF file length > 200 lines OR function length > 15 lines OR class instance vars > 2"
          then_action: "Halt feature additions; inject step-by-step Submodule Decomposition Blueprint into agent stdout"
          status: "BLOCKING"
        - id: "trigger-layer-breach"
          name: "Domain Layer Purity Trigger"
          when_trigger: "IF any file under `src/domain/**` imports a DB driver (`sql`, `prisma`), HTTP client (`fetch`), or UI toolkit"
          then_action: "Reject import; inject Repository Interface & Hexagonal Adapter stencil into agent stdout"
          status: "BLOCKING"
        - id: "trigger-primitive-obsession"
          name: "Value Object Extraction Trigger"
          when_trigger: "IF raw primitive parameters (`email: string`, `amount: number`) repeat across >= 3 method signatures"
          then_action: "Trigger Value Object extraction prompt (`EmailAddress`, `Money`) in agent stdout"
          status: "BLOCKING"
        - id: "trigger-dto-strict-boundary"
          name: "Public API / DTO Security Boundary Trigger"
          when_trigger: "IF a public controller, REST route, or DTO serializer is modified"
          then_action: "Require `expectStrict()` test verification proving `passwordHash` / internal fields cannot leak"
          status: "BLOCKING"
        - id: "trigger-test-tampering-circuit-breaker"
          name: "Test-Tampering & Ping-Pong Circuit Breaker"
          when_trigger: "IF agent deletes/weakens an existing assertion to make a failing run pass OR fails audit 3x consecutively"
          then_action: "Revert test edit; inject Agentless Localization & Repair protocol into stdout"
          status: "BLOCKING"

    - area_id: "area-3-test-lints"
      tab_label: "3. Test Lints (`nitrous test-lint`)"
      description: "Dedicated anti-slop area auditing unit & integration test files so AI agents cannot fake coverage."
      crud_operations: ["Create Test-Lint via Agent", "Read/Inspect", "Update Verbose Prompt", "Delete/Toggle"]
      default_records:
        - id: "no-brittle-style-grep"
          name: "Drop Brittle Style/Config String Assertions (`test_theme_engine.h`)"
          specimen: |
            assert(qss.contains("border-radius: 15px"));
            assert(qss.contains("border-radius: 13px"));
            assert(qss.contains("#2d333b"));
            assert(qss.contains("rgba(255, 255, 255, 0.10)"));
            assert(qss.contains("border-radius: 5px"));
          why_drop_verbatim: "This is literally grepping a CSS file inside a C++ unit test. It tests nothing about whether Qt actually parsed the stylesheet or applied it to the widgets."
          status: "BLOCKING"
        - id: "no-tautological-config-echo"
          name: "Drop Exact Font Point/Pixel/Letter-Spacing Config Checks"
          specimen: |
            font.setPixelSize(12);
            font.setLetterSpacing(QFont::AbsoluteSpacing, 0.2);
            assert(font.pixelSize() == 12);
            assert(font.letterSpacing() == 0.2);
          why_drop_verbatim: "Checking that font.pixelSize() == 12 just repeats the line of code font.setPixelSize(12)."
          status: "BLOCKING"
        - id: "no-mocking-theater"
          name: "Drop London-School Mocking Theater (`jest.mock` / `vi.fn`)"
          why_drop_verbatim: "Bans interaction-only spy call checks (`toHaveBeenCalledWith`); requires stateful in-memory fakes and observable state diffs."
          status: "BLOCKING"
        - id: "no-vacuous-assertions"
          name: "Drop Vacuous Coverage-Padding Assertions (`toBeDefined` / `!= nullptr`)"
          why_drop_verbatim: "Stops AI agents from gaming 100% line coverage gates with hollow non-null checks."
          status: "BLOCKING"
        - id: "zinsser-test-prose"
          name: "Enforce William Zinsser Active-Verb Test Prose"
          why_drop_verbatim: "Drops bureaucratic fillers (`should`, `properly`, `correctly`, `works as expected`); requires active present-tense verbs (`compiles`, `clamps`, `neutralizes`)."
          status: "RATCHET"
</screen_data>

---

## 1. Role & Goal Definitions
You are the **Principal Systems Architect & Lead Frontend Interface Engineer** for **Nitrous (`nitrous.aramudan.dev`)** — the autonomous CLI architectural governor, test-lint anti-slop engine, and verification cage built by **NotionWorks**.

Your goal is to generate or update the standalone web page / interactive prototype screen defined in `<screen_data>` above, strictly preserving every empirical statistic, code specimen, interactive state, and architectural thesis in `<screen_data>`.

---

## 2. Core Product Positioning & Strategic Mandates (Non-Negotiable)
1. **Pure CLI & Terminal Harness Positioning:**
   - Nitrous is **strictly a command-line tool (`nitrous login`, `nitrous init`, `nitrous audit`, `nitrous test-lint`, `nitrous steer`)** that autonomous coding agents (Claude Code, Cursor, Windsurf, Codex) execute directly in the terminal via `CLAUDE.md` / `AGENTS.md`—or via GitHub Enterprise Org-Wide Rulesets and Pre-Receive Hooks.
   - Never position Nitrous as a VS Code / Cursor GUI extension or a passive post-PR chat bot.
2. **Core Value Add — Verbose Prompt-Context Injection (`stdout` $\to$ Agent Context Window):**
   - Traditional linters fail with AI agents because terse 1-line errors (`error: max-depth exceeded`) cause agents to write lazy local hacks.
   - Nitrous adds value by dumping a **verbose, high-context architectural refactoring blueprint** directly into `stdout` when a rule fails. Because `stdout` is automatically fed into the coding agent's active prompt context window, the agent immediately understands *why* the code or test was rejected and *how* to refactor it on the very next turn—before a Pull Request is ever opened.
3. **Server-Locked Configuration (Agent Tamper-Lock):**
   - Human Reviewing Authorities log into the Nitrous Web Console to select active rules, adjust thresholds, and customize the verbose `stdout` steering prompts for their repositories.
   - CLI agents authenticate via `nitrous login` and receive a **Read-Only Enforcement Token**—they can run `nitrous audit` and read the verbose steering output, but they **cannot disable, weaken, or edit the rules**.
4. **Empirical Anchor — The October 2026 Harvard / Jellyfish Study:**
   - Cite Fiona Chen & James Stratton (Harvard University, Oct 2026, analyzing **300M work events across 700,000+ employees at 700+ firms**, reported in *Ars Technica*):
     - AI coding agents increased lines of code by **+30%**, commits by **+20%**, and PRs by **+23%**, yet produced **0% statistically significant increase in shipped Jira Issues or Epics**.
     - Why? Because human PR review time **ballooned by +49%**, PRs requiring changes **nearly doubled (~2x)**, review comments rose **+35%**, and **+14%** more engineers were pulled into reviewing slop.
     - Quote practitioner `metavirus`: *"Soooooo much slop code goes into the basin, which dozens of people need to sift through, strain out the dreck, then eventually close their eyes and release into the wild..."*
5. **Verbatim Test-Lint Specimens (`nitrous test-lint`):**
   - Always preserve the exact `test_theme_engine.h` C++/Qt stylesheet grep specimen (`assert(qss.contains("border-radius: 15px"))`, `13px`, `#2d333b`, `rgba(255, 255, 255, 0.10)`, `5px`) and the exact `font.pixelSize() == 12` / `font.letterSpacing() == 0.2` tautological config echo specimen verbatim.

---

## 3. Execution Constraints & Visual Aesthetic
- **Tech Stack:** Pure standalone HTML5, CSS3, and vanilla JavaScript. Zero React/Next.js/Vite build step required.
- **JavaScript Style:** Never use nested backticked template literals in JS (use array `.join('\n')` or string concatenation instead).
- **Uber Black Aesthetic & Typography:**
  - Deep obsidian canvas (`#030303`), elevated surface cards (`#080808` / `#0d0d0d`), `1px solid #1a1a1a` hairline borders.
  - Accent palette: Electric Cyan (`#00f0ff`), Alum Blue (`#3b82f6`), Phosphor Emerald (`#10b981`), Warning Amber (`#f59e0b`), Crimson (`#ef4444`).
  - Google Fonts: `Inter` (300–800) for crisp editorial headings/prose, and `JetBrains Mono` (400–700) for AST rules, CLI snippets, telemetry badges, and `stdout` prompt payloads.

---

## 4. Required Output Format
- Output the complete, self-contained HTML file at the `target_output_path` specified in `<screen_data>`, with all CSS and interactive vanilla JS embedded cleanly.
- Verify that every component, interactive toggle, preset button, and state transition specified in `<screen_data>` functions with zero console errors.

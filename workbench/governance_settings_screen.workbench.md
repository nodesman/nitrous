# Page Builder & Architectural Prompt: Authenticated Governance Settings, Selectable Rule Matrix & Verbose Prompt-Context Editor (`governance_settings_screen`)

<screen_data>
# Screen Metadata (metadata.json)
{
  "screen_id": "governance_settings_screen",
  "screen_title": "Authenticated Governance Settings, Selectable Rule Matrix & Verbose Prompt-Context Editor",
  "route": "/settings/",
  "target_output_path": "dist/settings/index.html",
  "domain": "https://nitrous.aramudan.dev/settings/",
  "plane_module": "Cloud Governance Backend & Configuration Gateway",
  "status": "active_prototype"
}

# Structured Screen Data (screen_data.yaml) - governance_settings_screen
screen_schema:
  name: governance_settings_screen
  route: "/settings/"
  target_file: "dist/settings/index.html"
  theme: "Uber Black (#030303) + Obsidian Panels (#0a0a0a) + Cyan (#00f0ff) + Crimson (#ef4444) + Emerald (#10b981)"

workflow_architecture:
  creation_mode: "Defined via Natural-Language Agent Prompt (User describes anti-pattern or pastes bad diff -> Agent synthesizes AST rule/trigger + verbose stdout prompt)"
  management_mode: "Managed via 3-Area CRUD Interface (Create, Read, Update, Delete/Toggle across Stylistic Issues, Architectural Triggers, and Test Lints)"

top_governance_bar:
  authenticated_identity: "Staff Architect (raj@acme-corp.dev)"
  tamper_lock_badge: "🔒 AGENT TAMPER-LOCK: ACTIVE (CLI tokens cannot disable active rules)"
  repository_selector:
    options:
      - id: "qt-desktop-client"
        label: "acme-corp / qt-desktop-client (C++17 / Qt 6)"
      - id: "checkout-api-ts"
        label: "acme-corp / checkout-api-ts (TypeScript / Node)"
      - id: "org-wide-ruleset"
        label: "🏢 All 48 Repositories (GitHub Enterprise Org-Wide Ruleset)"

agent_assisted_crud_creator_bar:
  title: "✨ Define New Rule, Trigger, or Test-Lint with Agent"
  input_placeholder: "Describe what should or shouldn't happen (e.g. 'If a domain class imports axios or fetch, block it and tell the agent to use HttpGatewayAdapter')..."
  target_area_selector:
    - "1. Stylistic & Code Calisthenics"
    - "2. Architectural Triggers (IF Event -> THEN Action)"
    - "3. Test Lints (nitrous test-lint)"
  create_button_label: "+ Synthesize & Add to CRUD Table"

three_crud_governance_areas:
  - area_id: "area-1-stylistic-calisthenics"
    title: "Area 1: Stylistic & Code Calisthenics Issues (Production Syntax Hygiene)"
    crud_columns: ["Rule ID", "Stylistic Invariant", "Threshold / Pattern", "Severity (BLOCKING / RATCHET / OFF)", "Actions (Edit Prompt / Delete)"]
    records:
      - id: "law-01-max-indent"
        name: "Max 1 Level of Indentation per Method"
        threshold: "Max depth <= 1"
        severity: "BLOCKING"
      - id: "law-02-no-else"
        name: "Zero `else` Keywords (Guard Clauses / Polymorphism)"
        threshold: "0 occurrences"
        severity: "BLOCKING"
      - id: "law-05-one-dot-per-line"
        name: "One Dot Per Line (Law of Demeter)"
        threshold: "Max 1 dot per statement"
        severity: "RATCHET"
      - id: "law-06-no-abbreviations"
        name: "Zero Identifier Abbreviations"
        threshold: "Allowlist: id, db, ui, qss, dto, url"
        severity: "RATCHET"
      - id: "law-09-tell-dont-ask"
        name: "No Getters or Setters (Tell, Don't Ask)"
        threshold: "0 public get/set accessors"
        severity: "BLOCKING"

  - area_id: "area-2-architectural-triggers"
    title: "Area 2: Architectural Triggers (IF Structural Event -> THEN Verbose Action)"
    crud_columns: ["Trigger ID", "IF Condition (Structural Event)", "THEN Action (Injected into Agent stdout)", "Severity", "Actions (Edit / Delete)"]
    records:
      - id: "trigger-god-file-split"
        if_condition: "File exceeds 200 lines OR Function exceeds 15 lines OR Class has > 2 instance variables"
        then_action: "Halt feature additions; dump Submodule & Class Decomposition Blueprint into agent stdout"
        severity: "BLOCKING"
      - id: "trigger-layer-breach"
        if_condition: "Code inside `src/domain/**` imports DB driver (`sql`, `prisma`), network (`fetch`), or UI toolkit"
        then_action: "Block import; dump Repository Interface & Hexagonal Adapter stencil into agent stdout"
        severity: "BLOCKING"
      - id: "trigger-primitive-obsession"
        if_condition: "Raw primitive parameter (`email: string`, `amount: number`) repeats across >= 3 method signatures"
        then_action: "Trigger Value Object extraction directive (`EmailAddress`, `Money`) in agent stdout"
        severity: "BLOCKING"
      - id: "trigger-dto-strict-boundary"
        if_condition: "Public API route, webhook, or DTO serializer is created or modified"
        then_action: "Require `expectStrict()` DTO security test proving `passwordHash` / internal fields cannot leak"
        severity: "BLOCKING"
      - id: "trigger-test-tampering-circuit-breaker"
        if_condition: "Agent modifies/deletes an existing test assertion to make broken code pass OR fails audit 3x"
        then_action: "Revert test edit; trigger Hard Circuit Breaker & Agentless Repair protocol in stdout"
        severity: "BLOCKING"

  - area_id: "area-3-test-lints"
    title: "Area 3: Dedicated Test Lints Area (`nitrous test-lint` Anti-Slop Suite)"
    crud_columns: ["Test-Lint ID", "What We Drop (Anti-Slop Pattern)", "Why We Drop It (Injected Rationale)", "Severity", "Actions (Edit / Delete)"]
    records:
      - id: "no-brittle-style-grep"
        what_we_drop: "Brittle Style/Config String Assertions (`test_theme_engine.h`: `assert(qss.contains(\"border-radius: 15px\"))`, `13px`, `#2d333b`, `rgba(255, 255, 255, 0.10)`, `5px`)"
        why_we_drop: "This is literally grepping a CSS file inside a C++ unit test. It tests nothing about whether Qt actually parsed the stylesheet or applied it to the widgets."
        severity: "BLOCKING"
      - id: "no-tautological-config-echo"
        what_we_drop: "Exact Font Point/Pixel/Letter-Spacing Config Checks (`pixelSize() == 12`, `letterSpacing() == 0.2`)"
        why_we_drop: "Checking that `font.pixelSize() == 12` just repeats the line of code `font.setPixelSize(12)`."
        severity: "BLOCKING"
      - id: "no-mocking-theater"
        what_we_drop: "London-School Mocking Theater (`jest.mock()`, `vi.fn()`, `toHaveBeenCalledWith()`)"
        why_we_drop: "Tests that only check if a mock called another mock break on harmless refactors while passing when real state fails."
        severity: "BLOCKING"
      - id: "no-vacuous-assertions"
        what_we_drop: "Vacuous Coverage-Padding Assertions (`expect(res).toBeDefined()`, `assert(ptr != nullptr)`)"
        why_we_drop: "Stops AI agents from gaming 100% coverage gates with hollow non-null checks."
        severity: "BLOCKING"
      - id: "zinsser-test-prose"
        what_we_drop: "Bureaucratic Test-Title Fillers (`should`, `properly`, `correctly`, `works as expected`)"
        why_we_drop: "Enforces William Zinsser's active present-tense verb mandate (`compiles`, `clamps`, `neutralizes`)."
        severity: "RATCHET"

right_panel_verbose_context_editor:
  sticky: true
  title: "🧠 CRUD Detail & Verbose `stdout` Prompt Editor"
  description: >
    Selecting any row in Area 1 (Stylistic), Area 2 (Architectural Triggers), or Area 3 (Test Lints)
    opens its CRUD editor here so the user can update the trigger condition or customize the exact
    verbose refactoring text dumped into the AI agent's terminal context window.
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

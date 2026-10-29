# Page Builder & Architectural Prompt: Sovereign Login & CLI Device Handshake Screen (nitrous login) (`login_device_auth_screen`)

<screen_data>
# Screen Metadata (metadata.json)
{
  "screen_id": "login_device_auth_screen",
  "screen_title": "Sovereign Login & CLI Device Handshake Screen (nitrous login)",
  "route": "/login/",
  "target_output_path": "dist/login/index.html",
  "domain": "https://nitrous.aramudan.dev/login/",
  "plane_module": "Cloud Governance Backend & Configuration Gateway",
  "status": "active_prototype"
}

# Structured Screen Data (screen_data.yaml) - login_device_auth_screen
screen_schema:
  name: login_device_auth_screen
  route: "/login/"
  target_file: "dist/login/index.html"
  theme: "Uber Black (#030303) + Electric Cyan (#00f0ff) + Emerald (#10b981) + Amber/Crimson Security Locks"

strategic_rationale:
  why_login_exists: >
    When rules live in a local config file (.eslintrc / tsconfig.json), autonomous coding agents
    routinely cheat by editing the file or adding ignore comments. Nitrous locks rule configuration
    behind an authenticated Human Reviewing Authority account in the Cloud, while issuing read-only
    enforcement tokens to the CLI via `nitrous login`.

layout_architecture:
  type: "Centered Two-Column Split Stage (max-width: 1020px)"
  left_column:
    id: "human-authority-login"
    kicker: "🔒 HUMAN REVIEWING AUTHORITY ONLY"
    headline: "Sign in to Nitrous Governance Console"
    description: >
      Configure tamper-locked AST invariants, select Test-Lint violations, and customize the
      verbose steering prompts injected into your coding agents' stdout context.
    auth_providers:
      - id: "github-enterprise-sso"
        label: "Continue with GitHub Enterprise / GitHub SSO"
        style: "primary_white"
        note: "Syncs Org-Wide Rulesets, Required Workflows & Pre-Receive Hooks"
      - id: "proid-sso"
        label: "Continue with ProID.id"
        style: "cyan_outline"
      - id: "work-email-magic-link"
        input_placeholder: "architect@company.com"
        button_label: "Send One-Time Passcode →"
    prototype_instant_demo_button:
      id: "btn-instant-demo-login"
      label: "⚡ Instant Prototype Login: Enter as Staff Architect (acme-corp)"
      target_redirect: "/settings/"
      description: "Simulates authenticated session and opens the full Rule & Verbose Prompt Configuration Console."

  right_column:
    id: "cli-device-handshake"
    kicker: "⚡ TERMINAL DEVICE AUTHORIZATION (RFC 8628)"
    headline: "Authorize `nitrous login` CLI Session"
    terminal_preview: |
      $ nitrous login
      ⚡ Requesting device handshake from nitrous.aramudan.dev...
      ▸ Verification Code: NTRX - 8492
      ▸ Waiting for Human Reviewing Authority approval...
    device_code_input:
      default_value: "NTRX-8492"
      segments: ["N", "T", "R", "X", "-", "8", "4", "9", "2"]
    agent_tamper_lock_scopes:
      allowed:
        - "Execute `nitrous audit`, `nitrous test-lint`, and `nitrous steer` in terminal"
        - "Fetch active repository rules & receive verbose stdout refactoring prompts"
      forbidden:
        - "LOCKED: Cannot disable, weaken, or modify any active rule from the CLI"
        - "LOCKED: Cannot alter threshold limits or bypass GitHub Enterprise gates"
    authorize_button:
      id: "btn-authorize-device"
      label: "Authorize CLI Device & Issue Read-Only Enforcement Token"
      success_state_message: "✓ DEVICE NTRX-8492 AUTHORIZED — Read-Only Enforcement Token dispatched to terminal."
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

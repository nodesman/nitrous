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
  theme: "Uber Black (#030303) + Electric Cyan (#00f0ff) + Crimson (#ef4444) + Emerald (#10b981)"

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
  headline: "Inject Nitrous Into Your AI Agent. Kill the +49% Review Bottleneck."
  mechanism_name: "Verbose Prompt-Context Injection (stdout -> Agent Context Window)"
  explanation: >
    Traditional linters emit terse 1-line errors that cause AI coding agents to write lazy local hacks.
    When an agent runs `nitrous audit` or `nitrous test-lint` in the terminal, Nitrous dumps a verbose,
    repo-specific architectural refactoring blueprint directly into `stdout`—landing straight inside the
    agent's active prompt context window so it self-corrects all 9 Object Calisthenics laws and Test-Lint
    violations before a Pull Request is ever opened.

navigation_bar:
  brand: "⚡ nitrous."
  parent_badge: "NW | A NotionWorks Product"
  edition_tabs:
    - id: "vibe"
      label: "⚡ Vibe Coder Edition"
      badge: "Plainspoken"
    - id: "developer"
      label: "🛠️ Developer Edition"
      badge: "AST Rigor"
    - id: "treatise"
      label: "📜 The Treatise"
      badge: "Doctrine"
  links:
    - label: "Why Nitrous?"
      href: "/why-nitrous/"
    - label: "🔒 Sign In / Rule Settings"
      href: "/login/"
      style: "highlight_cyan"
    - label: "🔔 Get Notified"
      href: "#subscribe-section"
    - label: "Playground"
      href: "#playground-section"
    - label: "GitHub"
      href: "https://github.com/nodesman/nitrous"

selectable_test_linter_module:
  module_kicker: "DEDICATED MODULE • NITROUS TEST-LINT ENGINE"
  title: "What We Drop: Selectable Test-Lint Violations (nitrous test-lint)"
  rules:
    - id: "no-brittle-style-grep"
      title: "1. What We Drop: Brittle Style/Config String Assertions"
      context: "In test_theme_engine.h, the spec proposed adding:"
      code_specimen: |
        assert(qss.contains("border-radius: 15px"));
        assert(qss.contains("border-radius: 13px"));
        assert(qss.contains("#2d333b"));
        assert(qss.contains("rgba(255, 255, 255, 0.10)"));
        assert(qss.contains("border-radius: 5px"));
      why_drop_verbatim: "This is literally grepping a CSS file inside a C++ unit test. It tests nothing about whether Qt actually parsed the stylesheet or applied it to the widgets."
    - id: "no-tautological-config-echo"
      title: "2. What We Drop: Exact Font Point/Pixel/Letter-Spacing Config Checks"
      context: "Exact config checks (pixelSize() == 12, letterSpacing() == 0.2):"
      code_specimen: |
        font.setPixelSize(12);
        font.setLetterSpacing(QFont::AbsoluteSpacing, 0.2);
        assert(font.pixelSize() == 12);
        assert(font.letterSpacing() == 0.2);
      why_drop_verbatim: "Checking that font.pixelSize() == 12 just repeats the line of code font.setPixelSize(12)."
    - id: "no-mocking-theater"
      title: "3. What We Drop: Mocking Theater & Spy Call-Counts"
      why_drop_verbatim: "Drops jest.mock(), vi.fn(), and toHaveBeenCalledWith(). Tests that only check if a mock called another mock break on harmless refactors while passing when real state fails."
    - id: "no-vacuous-assertions"
      title: "4. What We Drop: Vacuous Coverage-Padding Assertions"
      why_drop_verbatim: "Drops expect(res).toBeDefined(), expect(true).toBe(true), and standalone assert(ptr != nullptr) used by AI agents to game 100% coverage gates."
    - id: "zinsser-test-prose"
      title: "5. What We Drop: Bureaucratic Test-Title Fillers"
      why_drop_verbatim: "Enforces William Zinsser's active present-tense verb doctrine (compiles, clamps, neutralizes) and bans bureaucratic fillers (should, properly, correctly, works as expected)."

interactive_playground:
  presets:
    - id: "btn-load-test-slop"
      label: "🧪 Load Brittle Test-Lint Slop (test_theme_engine.h)"
    - id: "btn-load-bad"
      label: "❌ Load AI Vibe-Coded Spaghetti"
    - id: "btn-load-good"
      label: "✅ Load Clean Nitrous Code"
  selectable_checkboxes:
    - id: "toggle-style-grep"
      rule: "no-brittle-style-grep"
      default_checked: true
    - id: "toggle-config-echo"
      rule: "no-tautological-config-echo"
      default_checked: true
    - id: "toggle-mock-theater"
      rule: "no-mocking-theater"
      default_checked: true
    - id: "toggle-vacuous"
      rule: "no-vacuous-assertions"
      default_checked: true
  diagnostics_output_behavior: >
    When a violation is detected, render both the rule violation header AND the verbose
    stdout steering block that Nitrous injects into the AI agent's context window.
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

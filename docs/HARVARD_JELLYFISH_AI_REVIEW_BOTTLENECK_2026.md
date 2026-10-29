# Empirical Reference & Prompt Anchor: The Harvard / Jellyfish AI Code Review Bottleneck Study (Oct 2026)

* **Source URL:** https://arstechnica.com/ai/2026/10/ai-coding-agents-generate-more-code-but-not-more-software/
* **Headline:** *"Quantity, not quality: AI coding agents generate more code, but not more software — Study finds coding efficiency gains get 'absorbed' by human review 'bottleneck.'"*
* **Author / Publication:** Kyle Orland, *Ars Technica* (9 Oct 2026)
* **Underlying Research:** Fiona Chen & James Stratton (Harvard University), analyzing Jellyfish engineering telemetry (2021 – March 2026).

---

## 1. Hard Empirical Metrics (Harvard / Jellyfish Dataset)
* **Scale of Dataset:** **300 million** individual work events (commits, pull requests) + Jira issue/epic tracking across **700,000+ employees** at **700+ software firms** (95% had adopted AI coding agents by cutoff).
* **Raw Code Inflation (The Slop Surge):**
  * **+30%** increase in total lines of code generated.
  * **+20%** increase in total commits.
  * **+23%** increase in pull requests submitted.
* **Zero Real Software Velocity:**
  * **0% statistically significant change** in the resolution rate of Jira Issues and Epics (actual shipped software features), with no compositional shift in issue complexity.
* **The Downstream Human Review Collapse:**
  * **+49% increase** in average PR review time (time from PR submission to merge).
  * **~2x (nearly doubled)** share of pull requests requiring revisions ("changes requested").
  * **+35% increase** in the number of review comments per pull request.
  * **+14% increase** in the share of human workers pulled into performing code reviews.
* **Failure of Probabilistic AI Code Reviewers:**
  * Even though **80% of firms** used some form of AI code review, AI agents accounted for only **23.3%** of review comments and **10.8%** of PR reviews—leaving humans trapped as the primary bottleneck.

---

## 2. Practitioner Ground Truth (Top Staff Pick Comment — `metavirus`)
> *"I’m forced to use AI at work and this is absolutely 10000% true. Soooooo much slop code goes into the basin, which dozens of people need to sift through, strain out the dreck, then eventually close their eyes and release into the wild because now we have new SLAs so we’re not seen as a bottleneck to progress. Great incentives, brought to you by brilliant executives who know fuck-all about what’s actually going on."*

---

## 3. Strategic & Product Prompts for Nitrous (`nitrous.aramudan.dev`)

### A. Positioning Thesis ("Why Nitrous Exists")
Unconstrained AI coding agents do not produce more software; they produce **+30% more lines of code** that cause a **+49% human code review bottleneck** and **2x more rejected PRs**. 
**Nitrous** eliminates the human review bottleneck by shifting architectural enforcement and test-slop rejection **upstream into the agent's own terminal loop (`nitrous audit` & `nitrous test-lint`)** before a Pull Request is ever opened.

### B. Copy / Essay Prompt Stencil
```text
Cite the October 2026 Harvard University study by Fiona Chen and James Stratton (300M work events across 700,000+ engineers at 700+ firms):
- AI coding agents increased raw lines of code by +30% and PRs by +23%, but produced ZERO statistically significant increase in shipped Jira Issues or Epics.
- Why? Because PR review times ballooned by +49%, PRs requiring rewrites nearly doubled, and +35% more review comments were needed to strain out the slop.
- Explain how Nitrous breaks this bottleneck: instead of dumping 800-line nested spaghetti PRs and brittle test-padding slop onto exhausted human reviewers, Nitrous traps the AI agent inside a deterministic AST & Test-Lint cage (`nitrous audit` / `nitrous test-lint`) in the terminal until the code is decomposed into flat, <15-line Object Calisthenics micro-functions and pure state specifications that a human can sign off on in 30 seconds.
```

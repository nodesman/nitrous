# 💎 TSALUM VISUAL ARCHITECTURE & IMAGE GENERATION PROMPT SPECIFICATION

This master prompt specification details the high-acuity visual art direction, lighting schemas, object metaphors, and Midjourney / FLUX generation prompts for the **4 Stages of the AI Vibe-Coding Lifecycle** on the **`tsalum`** landing page.

---

## 🎨 Global Visual Directive & Aesthetic Rules

*   **Aesthetic:** Ultra-high acuity, dark-mode technical realism with crystalline and fluid dynamics.
*   **Palette:** Deep Obsidian Black (`#050505`), Electric Cyan (`#00F0FF`), Alum Translucent Blue (`#3B82F6`), Phosphor Emerald (`#10B981`), and Warning Amber/Crimson (`#EF4444`).
*   **Motif:** The transition of **Turbid Fluid → Alum Flocculation → Pristine Crystal Structure**.
*   **Aspect Ratio:** `16:9` (for web hero cards and responsive layout embedding).

---

## STAGE 01: The Vibe-Coding High
> *"You prompt the AI. Code flows at blistering speed. The app works, and you feel like a god. But under the hood, the AI defaults to lazy, nested, primitive-obsessed designs..."*

### Visual Concept: The Illusory Speed (Turbid Surge)
A sleek glowing neon digital interface floating above a murky, turbulent liquid reservoir. The surface looks fast and electric, but beneath it, thick, tangled cables and muddy brown/amber sludge swirl uncontrollably.

### Image Generation Prompt:
```text
High-acuity cinematic 3D render of a futuristic software terminal floating above a dark, murky liquid pool, dark mode, high contrast. Glowing neon cyan code lines streaming at hyper-speed across a holographic glass visor. Beneath the surface of the glass, murky amber silt and tangled, messy copper wires swirl underwater in turbulent chaos. Moody studio lighting, dark obsidian background, subtle volumetric haze, 8k resolution, photorealistic glass dispersion, render engine precision --ar 16:9 --style raw --v 6.0
```

---

## STAGE 02: The Refactoring Wall
> *"You try to test, extend, or ship the code. You find it too coupled to modify without breaking everything. Your velocity crashes to zero as you spend weeks doing manual architectural cleanup."*

### Visual Concept: The Structural Gridlock (Spaghetti Freeze)
A giant monolith of cracked, brittle amber resin holding complex, tangled circuit paths. A bright red warning laser grid strikes the wall, freezing the flow completely. The atmosphere feels heavy, clogged, and gridlocked.

### Image Generation Prompt:
```text
Dark conceptual 3D render of a massive, frozen monolith of dark amber resin filled with densely tangled spaghetti wires and cracked circuit boards. A sharp crimson warning laser line slice through the center of the block, illuminating fractures and dense technical debt trapped inside. Industrial dark-mode aesthetic, deep shadow contrast, matte black metal floor, dramatic rim light, hyper-detailed texture, 8k resolution, cinematic focus --ar 16:9 --style raw --v 6.0
```

---

## STAGE 03: The Steering Loop
> *"You run tsalum. When the AI outputs messy logic, the compiler throws hard errors. The AI reads the error context and immediately refactors the code cleanly in its own generation loop."*

### Visual Concept: The Alum Clarification Reactor (Active Sedimentation)
A high-tech cylindrical glass reactor core. A brilliant, glowing potassium alum crystal sits suspended in the center. Electric blue energy waves radiate outward, causing the murky brown suspended silt to bind together (flocculate) and heavy particles to drop down to the bottom, leaving crystal-clear, illuminated blue water above.

### Image Generation Prompt:
```text
Futuristic laboratory shot of a transparent glass cylinder filled with liquid undergoing chemical purification. In the center, a luminous crystalline alum gemstone glows with bright electric blue energy. The murky brown suspended sediment is visibly coagulating into heavy flakes and settling to the dark bottom floor, leaving pure, crystal-clear illuminated blue water at the top. Volumetric caustic lighting, hyper-realistic water caustics, dark aesthetic, 8k resolution, Octane Render style --ar 16:9 --style raw --v 6.0
```

---

## STAGE 04: Zero-Refactor Shipping
> *"Your prototype code complies with Object Calisthenics from day one. You skip the refactoring phase completely and transition smoothly to production."*

### Visual Concept: The Monolithic Crystal Lattice (Pristine Architecture)
A geometric masterwork of interlocking, transparent sapphire and emerald quartz blocks arranged in a perfect, modular 3D grid. Light passes through with zero distortion. A sleek production energy conduit streams clean phosphor green data smoothly through the lattice into the horizon.

### Image Generation Prompt:
```text
Breathtaking architectural 3D render of a perfectly organized geometric crystal lattice constructed from modular emerald quartz and sapphire glass blocks. Pure laser beams of phosphor emerald light pass cleanly through the translucent blocks without any refraction or distortion. Dark mode background, ultra-clean aesthetic, high precision engineering, reflective glass floor, 8k resolution, raytracing glass dynamics --ar 16:9 --style raw --v 6.0
```

---

## 🛠️ Execution Instructions for Generation
1. Run each prompt in your image generation tool (e.g. Midjourney, FLUX, Nano Banana).
2. Save the outputs into `public/assets/stages/` or `src/assets/`.
3. Embed each panel in `src/main.ts` directly under its respective stage card.

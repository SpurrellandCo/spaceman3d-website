# Handoff: Spaceman3D Marketing Website

## Overview
A dynamic, interactive marketing website for **Spaceman3D**, a 3D printing company. The signature experience is a scroll-driven cinematic landing page: the user starts looking at Earth, the camera "racks focus" and reveals it was a reflection in an astronaut's helmet visor, and the camera pulls back to reveal an astronaut standing on the moon — at which point navigation, header, and social links appear.

The site is dark-themed (deep space) with electric-blue accents. It includes a landing page plus three inner pages: Custom Print Request, About, and Model Creator (app launcher).

## About the Design Files
The HTML/CSS/JS files in this bundle are **design references** — prototypes built in vanilla HTML showing the intended look, motion, and behavior. They are not production code to copy directly.

The task is to **recreate these designs in the target codebase's environment** — likely a React/Next.js app, Astro, or similar — using the codebase's existing patterns (component structure, routing, asset pipeline, etc.). If no codebase exists yet, **Next.js (App Router) + Tailwind CSS** is recommended as a strong fit for this kind of marketing site with motion.

## Fidelity
**High-fidelity.** Every color, font size, animation timing, easing curve, and interaction state in the prototypes is intentional and should be preserved pixel-perfectly. The design system tokens are documented below in detail.

## Pages

### 1. Landing Page (`index.html`)

**Purpose:** Cinematic brand entry. Sells the "Spaceman" identity and routes to the four inner sections.

**Layout:** Single-page, scroll-driven (page is `height: 700vh`). All visuals are in a `position: fixed` scene; scroll progress drives every animation via `requestAnimationFrame`.

**Animation phases (by scroll progress `p` from 0 → 1):**

| Phase | Range | What happens |
|---|---|---|
| **Earth** | 0.00 – 0.10 | Real photographic Earth (`uploads/spaceman start of scroll.png`) breathing zoom 1.00 → 1.07. Vignette overlay (radial gradient, `transparent 52% → rgba(8,8,15,0.95) 100%`) primes the eye for the visor reveal. Hero badge + headline + scroll hint visible. |
| **Stars fade in** | 0.10 – 0.52 | Star canvas opacity ramps in (eased). |
| **Earth fades / blur peaks** | 0.10 – 0.30 | Earth fades to 0. A rack-focus blur peaks at the crossover point: blur ramps `0 → 8px` (0.12–0.22) then back to `0` (0.22–0.44). |
| **Astronaut zooms out** | 0.10 – 0.88 | Astronaut image (`uploads/spaceman end of scroll.png`) starts at scale `4.0` translated `30vh` down (so the visor fills the screen), eases out to scale `1.0` translateY `0`. Opacity fades in 0.16 – 0.46. |
| **Moon atmosphere** | 0.72 – 0.90 | Linear gradient at the bottom of the screen (`rgba(8,8,15,0.8) → transparent`) fades in to soften the horizon. |
| **Header fades in** | 0.62 – 0.80 | Frosted glass (`rgba(8,8,15,0.85)` + `backdrop-filter: blur(16px)`) and bottom border crossfade in. |
| **Side nav cards fly in** | 0.82 – 1.00 | Four `220px`-wide cards animate from x±60px → 0 with staggered delays (`+0.06` each). Blue particle burst spawns at each card's center on entrance (one-shot via `navBurstFired` flag). |
| **Social bar / Explore CTA** | 0.88 – 1.00 | Slide up + fade in. |

**Easing functions:**
```js
easeOut2(t) = 1 - (1-t)²
easeOut3(t) = 1 - (1-t)³
easeInOut(t) = t < 0.5 ? 2t² : -1 + (4-2t)t
```

**Visual elements:**

- **Hero badge** — pill with pulsing 6×6 blue dot, `rgba(41,121,255,0.1)` bg, `rgba(41,121,255,0.3)` border, text "Custom 3D Printing"
- **Hero headline** — Orbitron 900, `clamp(2.2rem, 5.5vw, 4.8rem)`, white, "YOUR IMAGINATION,/ IN 3D." with "IN 3D." in `#2979FF`. `letter-spacing: 0.12em; text-transform: uppercase`. Drop shadow `0 0 60px rgba(41,121,255,0.4)`.
- **Hero sub** — Inter 500, "From idea to object — we print it, you love it"
- **Scroll hint** — animated dot mouse + "Scroll to explore" label; fades 0.03–0.12
- **Frosted header** — 64px tall, padding `0 32px`, `1px` border bottom `#1E2040`. Logo: 36px helmet icon + Orbitron wordmark "SPACEMAN**3D**". Nav links Inter 700 12px. CTA "Launch Your Print" (pill, blue glow on hover).
- **Side nav cards** (220px wide, four total):
  - Each card: `padding: 10px 18px`, `border-radius: 12px`, `background: rgba(15,16,32,0.75)`, `border: 1px solid #1E2040`, `backdrop-filter: blur(12px)`
  - Layout: 28×28 icon square (left side) + label/sublabel column. Right column reverses with `flex-direction: row-reverse`.
  - Hover: blue border, subtle blue bg, blue glow shadow, icon glows
  - **Items:** Shop (bag icon) → external link to `https://makerworld.com/en/@spaceman3d`; Model Creator (cube icon) → `model-creator.html`; Custom (pen icon) → `custom.html`; About (rocket icon) → `about.html`
- **Social bar** (bottom-right, vertical) — TikTok + Instagram glyph SVGs in 42×42 frosted-glass squares
- **Explore CTA** — "Select a destination" with thin gradient dividers above/below

**Star canvas (`#starsCanvas`):**
- Density: `min(450, width × height / 2400)`
- Three star types:
  - **Normal (~78%)** — gentle two-harmonic sine twinkle: `twinkle = 0.3 + 0.7 * (a*0.6 + b*0.4)` where `a, b` are 0..1 sines at different speeds/phases
  - **Shimmer (~14%)** — fast nervous flutter: `twinkle = a * b` with speeds `2-5×` faster
  - **Flasher (~8%)** — power-curve spike: `twinkle = max(0, sin())^4`. On peak `>0.5` adds blue radial glow halo (`r*5`); on peak `>0.75` adds cross flare (horizontal + vertical line, `lineWidth: 0.5`)
- Colors: 70% white, 15% `#A8C8E0` (helmet-light), 15% `#90BAFF` (blue-300)

**Particle canvas (`#particleCanvas`):**
- Burst on nav-item entrance and hover. Particles spawned in radial pattern, decelerate at 0.96 friction, fade with random decay 0.012–0.034.
- Colors: 40% blue-500, 30% blue-400, 30% white

### 2. Custom Page (`custom.html`)

**Purpose:** Submit a custom 3D print request via a structured form.

**Layout:** Header + centered hero + form section. Twinkling star canvas as fixed background.

**Hero:** Pulsing badge "Custom Print Request" → headline "LET'S BUILD / SOMETHING WILD." (with "SOMETHING WILD." in blue) → 16px gray subhead.

**Form (4 numbered sections with gradient dividers):**
1. **Your Details** — Name (required), Email (required), Phone, Deadline (date picker, today minimum)
2. **Print Specs** — Material chips (PLA/Resin/PETG/ABS/TPU each with a colored 7px dot, rounded-pill, active state has blue border+bg+glow); 9 color swatches (32×32 squares, 2px transparent border that goes blue when active, scale 1.12 on hover) + custom-color text input; quantity stepper (− [N] +) using 44×44 buttons with Orbitron 700 number; budget slider (range input with custom blue thumb 18×18 + glow, gradient fill track from `#2979FF` to `#262850` at thumb position, labels $25/$500/$1000/$1500/$2500+)
3. **Reference Files (Optional)** — Drag-and-drop zone with dashed border, accepts STL/OBJ/PNG/JPG/PDF/ZIP, lists files in raised cards
4. **Mission Brief** — Project description textarea, min-height 100px

**Submit row:** Note "No commitment yet." + "Launch My Request" button (pill, blue, with rocket SVG icon, glow shadow `var(--glow-cta)`)

**Success overlay:** Full-screen `rgba(8,8,15,0.92)` + `backdrop-filter: blur(12px)`. Pop-in checkmark icon (cubic-bezier 0.34,1.56,0.64,1), "WE'RE LAUNCHED!" headline, copy "Your custom print request is in orbit. We'll contact you within 24 hours...", "Back to Form" button.

### 3. About Page (`about.html`)

**Purpose:** Brand origin story.

**Sections:**
- **Hero** — badge "About Spaceman3D" → "BUILT FOR / EVERY DAY." headline → mono tagline "// Practical things, made well //"
- **Our Story** — section label with gradient line + Orbitron eyebrow → h2 "We make practical things *that just work.*" (italic→blue accent) → 3-paragraph body, first paragraph styled as `p.lead` (19px, white, 2px blue left border, 20px padding-left)
- **3 Pillars** — grid of 3 cards (Designed In-House, Built To Last, Always Iterating). Each card: `padding: 32px 28px`, `border-radius: 16px`, hover lifts -4px with blue glow + top gradient line reveal. 48×48 blue icon square + mono "01/02/03" + Orbitron h3 + 14px gray body
- **CTA strip** — gradient card `linear-gradient(135deg, rgba(41,121,255,0.12), rgba(41,121,255,0.02))` with radial glow accent in top-right corner. "Got an idea? *Let's print it.*" headline + body + "Start a Custom Print →" pill button linking to `custom.html`
- **Footer** — `border-top: 1px solid #1E2040`, mono text "SPACEMAN3D · EST. 2026 · Tranquility Base"

### 4. Model Creator Page (`model-creator.html`)

**Purpose:** Launcher for in-house browser-based 3D model generation apps.

**Layout:** Hero + responsive auto-fit grid (`minmax(360px, 1fr)`, 24px gap).

**Hero:** Badge "Model Creator Suite" → "DESIGN YOUR / OWN PRINT." → sub "Pick a creator app — generate your model in your browser, then send it to print."

**App cards** (3 total, `min-height: 440px`, `border-radius: 24px`):
- Each card: mono `// APP 0N` eyebrow → 200px logo plate (radial blue glow bg) → h3 + 14px description → row of mono uppercase pill tags → bottom row with "Launch ___" CTA + circular arrow button
- Hover: lift -6px, blue border, blue glow `var(--glow-md)` + drop shadow, logo scales 1.05, arrow circle fills blue with white arrow translated +4px

**Cards:**
1. **Cookie Cutter Generator** (`assets/cookie-cutter-logo.png`) — tags: Custom Shapes / STL Export / Browser-Based
2. **Terrain3D** (`assets/terrain3d-logo.png`) — tags: Topographic / Map-Based / STL Export
3. **Coming Soon** placeholder — `opacity: 0.55`, amber stamp pill top-right (`rgba(245,158,11,*)`), dashed icon plate with cube SVG

## Design Tokens

```css
/* Backgrounds */
--bg-deep:        #08080F   /* page background */
--bg-surface:     #0F1020   /* cards, inputs */
--bg-raised:      #161830   /* file-list items, dropdown options */
--bg-overlay:     #1A1C35

/* Brand Blue */
--blue-500:       #2979FF   /* primary accent */
--blue-400:       #5B9BFF   /* hover */
--blue-300:       #90BAFF   /* tinted text, twinkle stars */
--blue-600:       #1565C0   /* press */
--blue-700:       #0D47A1
--helmet-light:   #A8C8E0   /* atmospheric stars */

/* Foreground */
--white:          #FFFFFF
--fg1:            #E8EDF5   /* primary text */
--fg2:            #B0BBCC   /* body */
--fg3:            #8892A4   /* muted */
--fg4:            #556070   /* subtle / disabled */

/* Borders */
--border:         #1E2040   /* default */
--border-strong:  #262850   /* inputs, dividers */
--border-accent:  rgba(41,121,255,0.45)

/* Semantic */
--success:        #22C55E
--warning:        #F59E0B
--error:          #EF4444

/* Shadows / Glow */
--glow-sm:        0 0 12px rgba(41,121,255,0.25)
--glow-md:        0 0 24px rgba(41,121,255,0.35)
--glow-lg:        0 0 48px rgba(41,121,255,0.45)
--glow-cta:       0 0 16px rgba(41,121,255,0.55), 0 4px 24px rgba(0,0,0,0.5)

/* Spacing */
4 8 12 16 20 24 32 40 48 64 80 96 (px)

/* Border radius */
--radius-sm:    6px
--radius-md:    12px
--radius-lg:    16px
--radius-xl:    24px
--radius-full:  9999px

/* Transitions */
--fast:   150ms ease-out
--base:   200ms ease-out
--slow:   350ms ease-out
```

## Typography

```css
--font-display:  'Orbitron', sans-serif    /* headlines, wordmark, CTAs */
--font-body:     'Inter', sans-serif       /* body, nav links, form */
--font-mono:     'Space Mono', monospace   /* eyebrows, micro-labels */
```

Load via Google Fonts:
`https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap`

| Use | Family | Weight | Size | Tracking | Transform |
|---|---|---|---|---|---|
| Hero h1 (landing) | Orbitron | 900 | clamp(2.2rem, 5.5vw, 4.8rem) | 0.12em | uppercase |
| Hero h1 (inner) | Orbitron | 900 | clamp(2.4rem, 5.5vw, 4.6rem) | 0.08em | uppercase |
| Section h2 | Orbitron | 800 | clamp(1.8rem, 3.5vw, 2.6rem) | 0.06em | uppercase |
| Card h3 | Orbitron | 700–800 | 18–22px | 0.05–0.06em | uppercase |
| Body | Inter | 400 | 14–17px | 0 | — |
| Nav label | Orbitron | 700 | 12px | 0.12em | uppercase |
| Eyebrow / micro | Space Mono | 400/700 | 10–13px | 0.15–0.22em | uppercase |
| Field label | Inter | 700 | 11px | 0.1em | uppercase |

## Assets

All in `assets/` and `uploads/`:

| File | Used by | Notes |
|---|---|---|
| `assets/spaceman-helmet.png` | All headers | Logo mark, 36px |
| `uploads/spaceman start of scroll.png` | Landing | Photographic Earth (full-bleed hero) |
| `uploads/spaceman end of scroll.png` | Landing | Astronaut on the moon (zoom-out target) |
| `assets/cookie-cutter-logo.png` | Model Creator | App icon + wordmark, transparent |
| `assets/terrain3d-logo.png` | Model Creator | App icon + wordmark, transparent |
| `assets/spaceman-logos.png` | Reference | Brand exploration sheet |
| `assets/colors_and_type.css` | Reference | Source design tokens |

## External Links / Routing

- **Shop** (header nav + side nav card) → `https://makerworld.com/en/@spaceman3d` (target=_blank)
- **Custom** → `custom.html`
- **Model Creator** → `model-creator.html`
- **About** → `about.html`
- **Cookie Cutter Generator** card on Model Creator page → currently `#`, needs real URL
- **Terrain3D** card → currently `#`, needs real URL
- **TikTok / Instagram** → currently `#`, needs real URLs

## State / Behavior Notes

- **Landing scroll handler** must run on every frame via `requestAnimationFrame` (NOT scroll events) to keep animations smooth and to drive the time-based star twinkles. Read scroll position with `window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)`.
- **Click handlers**: nav items prevent default only when `href === "#"`, otherwise allow normal navigation. Don't blanket-`preventDefault` on all anchors.
- **Custom form** validates HTML5 required fields; on submit, prevents default and shows the success overlay. No backend wired — connect to your form handler / email / CRM.
- **Star canvases on inner pages** include subtle parallax (`y - scrollY * 0.3`) and re-size to `max(viewport, document height)` so they fill long pages.
- **Body** must set `overscroll-behavior: none` on landing to prevent rubber-band breaking the fixed scene.

## Files in this bundle

- `index.html` — Landing page (the cinematic scroll experience)
- `custom.html` — Custom Print Request form
- `about.html` — Brand story
- `model-creator.html` — App launcher
- `assets/` — logos, helmet icon, design system CSS
- `uploads/` — Earth and astronaut photographs

## Recommended Stack

If implementing fresh:
- **Framework:** Next.js 14 App Router (or Astro for marketing-first)
- **Styling:** Tailwind CSS with custom theme matching tokens above; or CSS Modules + the existing variable system
- **Motion:** Framer Motion for general transitions; the landing scroll-driven scene is best implemented as a single component using `useScroll` + `useTransform` from Framer Motion, OR keep the raw `requestAnimationFrame` approach
- **Canvas:** Keep the star/particle canvases as plain canvas refs inside React components — they don't need a library
- **Fonts:** `next/font/google` for Orbitron / Inter / Space Mono
- **Deploy:** Vercel

---
name: Vibrant Artisan Canvas
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e2bfb8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a98a83'
  outline-variant: '#5a413c'
  surface-tint: '#ffb4a5'
  primary: '#ffb4a5'
  on-primary: '#650900'
  primary-container: '#ff6347'
  on-primary-container: '#630900'
  inverse-primary: '#b12c16'
  secondary: '#46eae4'
  on-secondary: '#003735'
  secondary-container: '#00cec8'
  on-secondary-container: '#005250'
  tertiary: '#c1c1ff'
  on-tertiary: '#1500a8'
  tertiary-container: '#898aff'
  on-tertiary-container: '#1400a4'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a5'
  on-primary-fixed: '#3f0400'
  on-primary-fixed-variant: '#8f1100'
  secondary-fixed: '#5af9f2'
  secondary-fixed-dim: '#2edcd6'
  on-secondary-fixed: '#00201f'
  on-secondary-fixed-variant: '#00504d'
  tertiary-fixed: '#e1dfff'
  tertiary-fixed-dim: '#c1c1ff'
  on-tertiary-fixed: '#09006b'
  on-tertiary-fixed-variant: '#2e26ca'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1440px
---

## Brand & Style
The brand personality is expressive, creative, and premium, designed to bridge the gap between digital precision and human artistry. It targets a sophisticated audience of creators and collectors who value high-energy visuals and seamless interactions. 

The aesthetic is a fusion of **Glassmorphism** and **High-Contrast Bold**. It utilizes deep obsidian surfaces as a canvas for vibrant, multi-stop gradients that mimic the flow of light through physical glass. The emotional response is intended to be one of inspiration and confidence—a "dark mode" environment that feels less like a utility and more like a high-end gallery space.

## Colors
The palette is anchored by a deep dark background to allow the primary accent colors to radiate. 

- **Primary (Coral - #FF6347):** Reserved for high-priority calls to action such as "Do koszyka" and "Złóż zamówienie." It serves as the visual anchor and the focal point of the interface.
- **Secondary (Turquoise - #00CEC8):** Used for supporting creative elements and interactive highlights.
- **Tertiary (Purple - #6666FF):** Used for depth and atmospheric accents.

**Gradients:**
The signature linear gradient follows a strict horizontal sequence: **Turquoise (Left) → Coral (Middle) → Purple (Right)**. This gradient is used for decorative strokes, progress bars, and premium card backgrounds.

## Typography
The typography strategy contrasts the avant-garde, wide proportions of **Syne** for headlines with the clinical, modern precision of **Hanken Grotesk** for body text. **JetBrains Mono** is introduced for labels and technical metadata to reinforce the "canvas" and "tool" aspect of the platform. Headlines should utilize tight letter spacing to feel impactful and structural.

## Layout & Spacing
The system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. Spacing follows a strict 8px base unit. To maintain the "Artisan" feel, the layout should utilize generous margins and intentional asymmetry in image placement. High-priority content sections are separated by expansive whitespace (64px+) to allow the glassmorphic elements to breathe without visual clutter.

## Elevation & Depth
Depth is achieved through **Backdrop Blurs** and **Tonal Layering**. 
- **Level 1 (Base):** Solid #0A0A0A.
- **Level 2 (Cards/Surface):** Semi-transparent #1E1E1E with a 1px inner border of 10% white to simulate a glass edge.
- **Level 3 (Popovers/Modals):** Background blur (20px radius) with a subtle gradient stroke using the Turquoise-Coral-Purple sequence.
Shadows are rarely used; instead, "glows" are utilized where the accent color bleeds from behind an element to indicate focus.

## Shapes
The shape language is modern and approachable. Standard components use a **0.5rem (8px)** corner radius. Large containers and hero imagery should use **1rem (16px)** to feel more substantial. Interactive elements like buttons never use a pill shape; they remain slightly rounded rectangles to maintain a structural, architectural integrity.

## Components
- **Primary Buttons (Critical):** Used for "Do koszyka." These must be solid Coral (#FF6347) with white text. On hover, apply a soft coral glow.
- **Secondary Buttons:** Transparent background with a gradient border (Turquoise-Coral-Purple).
- **Input Fields:** Dark background (#1E1E1E) with a 1px Turquoise bottom border that expands to the full tri-color gradient on focus.
- **Chips:** Small, JetBrains Mono labels with a subtle Purple (#6666FF) background at 15% opacity.
- **Cards:** Glassmorphic style. High-end items may feature the signature gradient as a very thin 2px top border.
- **Lists:** Clean, separated by 1px borders of #2A2A2A, using Coral for active or selected states.
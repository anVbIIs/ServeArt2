---
name: Sophisticated Minimalist
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3b4948'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#6b7a79'
  outline-variant: '#bacac8'
  surface-tint: '#006a67'
  primary: '#006a67'
  on-primary: '#ffffff'
  primary-container: '#00cec8'
  on-primary-container: '#005250'
  inverse-primary: '#2edcd6'
  secondary: '#b12c16'
  on-secondary: '#ffffff'
  secondary-container: '#fe6247'
  on-secondary-container: '#620900'
  tertiary: '#4846e1'
  on-tertiary: '#ffffff'
  tertiary-container: '#b1b2ff'
  on-tertiary-container: '#312acc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#5af9f2'
  primary-fixed-dim: '#2edcd6'
  on-primary-fixed: '#00201f'
  on-primary-fixed-variant: '#00504d'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a5'
  on-secondary-fixed: '#3f0400'
  on-secondary-fixed-variant: '#8f1100'
  tertiary-fixed: '#e1dfff'
  tertiary-fixed-dim: '#c1c1ff'
  on-tertiary-fixed: '#09006b'
  on-tertiary-fixed-variant: '#2e26ca'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is anchored in a philosophy of **Artistic Minimalism**. It seeks to evoke an emotional response of clarity, creative inspiration, and high-end professionalism. By stripping away unnecessary ornamentation and relying on generous white space, the design allows the vibrant primary gradient to act as a focal point of artistic expression.

The target audience consists of creative professionals and tech-forward users who value precision and aesthetic refinement. The UI feels airy and intentional, utilizing a "Less is More" approach where every element serves a functional or structural purpose. The sophistication arises from the tension between the pure, neutral canvas and the energetic, smooth color transitions.

## Colors

The palette is defined by a pristine white foundation complemented by a sophisticated three-color gradient. 

- **Primary Gradient:** The signature "Artistic Spectrum" moves from Turquoise (#00CEC8) through Coral (#FF6347) to Purple (#6666FF). This gradient should be used sparingly for high-impact moments: primary buttons, active states, and brand-defining accents.
- **Neutrals:** We utilize a range of cool, light greys to define surface hierarchies without breaking the minimalist aesthetic.
- **Functionality:** Use pure white (#FFFFFF) for the main canvas and a very light grey (#F9FAFB) for secondary background sections or subtle depth.

## Typography

This design system utilizes **Inter** for its neutral, systematic, and highly legible characteristics. The typographic scale is optimized for hierarchy, using weight and negative tracking in larger sizes to convey authority and precision.

- **Headlines:** Use SemiBold (600) or Bold (700) weights with tighter letter spacing to create a cohesive visual block.
- **Body Text:** Always set in Regular (400) weight for maximum readability against white backgrounds.
- **Interactivity:** Use Medium (500) weights for labels and button text to provide subtle emphasis without the visual weight of bold type.

## Layout & Spacing

The layout follows a **Fluid Grid** model based on a 12-column system. It prioritizes "breathability" by employing a strict 8px spacing rhythm.

- **Desktop:** 12 columns with 24px gutters. Use large margins (32px+) to maintain the minimalist feel.
- **Tablet:** 8 columns with 20px gutters.
- **Mobile:** 4 columns with 16px gutters.
- **Vertical Rhythm:** Elements are stacked using consistent increments (8, 16, 32, 64px). Use the largest spacing tokens between distinct content sections to reinforce the airy, artistic atmosphere.

## Elevation & Depth

To maintain a clean and minimalist profile, this design system avoids heavy drop shadows. Depth is communicated through two primary methods:

1.  **Low-Contrast Outlines:** Surface containers use a subtle 1px border (#E5E7EB) to define boundaries against white backgrounds.
2.  **Ambient Shadows:** For floating elements like modals or dropdowns, use a "Cloud Shadow"—an extremely diffused, low-opacity shadow (e.g., `0px 10px 30px rgba(0, 0, 0, 0.04)`).
3.  **Tonal Layering:** Different background shades (White vs. Light Grey) are used to distinguish global navigation from content areas without the need for physical depth.

## Shapes

The shape language is defined by **Rounded** corners, which soften the minimalist aesthetic and make the interface feel more approachable and modern.

- **Standard Elements:** Buttons, input fields, and small cards use a 0.5rem (8px) radius.
- **Large Containers:** Content sections and main cards use a 1rem (16px) radius.
- **Media:** Images and video players should mirror the 1rem radius to ensure a consistent, sophisticated silhouette across the entire product.

## Components

- **Buttons:** Primary buttons feature the full Turquoise-to-Purple gradient with white text. Secondary buttons use a subtle border and colored text.
- **Input Fields:** Minimalist design with a 1px neutral border. Upon focus, the border transitions to Turquoise or utilizes a thin gradient underline to signal activity.
- **Cards:** White backgrounds with a 1px border or a soft ambient shadow. Avoid background colors on cards to keep the layout feeling light.
- **Chips/Badges:** Use light tints of the primary colors (e.g., 10% opacity Turquoise) with saturated text for a high-end "glass-lite" look.
- **Progress Indicators:** Use the smooth gradient to show completion, moving from left (Turquoise) to right (Purple) as the value increases.
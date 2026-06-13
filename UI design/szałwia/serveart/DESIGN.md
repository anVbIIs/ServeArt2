---
name: ServeArt
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#464555'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#767587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4846e1'
  primary: '#4643df'
  on-primary: '#ffffff'
  primary-container: '#6060f9'
  on-primary-container: '#fffbff'
  inverse-primary: '#c1c1ff'
  secondary: '#006a67'
  on-secondary: '#ffffff'
  secondary-container: '#5af9f2'
  on-secondary-container: '#00706d'
  tertiary: '#934700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b85a00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1dfff'
  primary-fixed-dim: '#c1c1ff'
  on-primary-fixed: '#09006b'
  on-primary-fixed-variant: '#2e26ca'
  secondary-fixed: '#5af9f2'
  secondary-fixed-dim: '#2edcd6'
  on-secondary-fixed: '#00201f'
  on-secondary-fixed-variant: '#00504d'
  tertiary-fixed: '#ffdcc7'
  tertiary-fixed-dim: '#ffb787'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#733600'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 20px
  gutter: 16px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style
The design system is built on the philosophy of "Artisan Modernism"—a blend of gallery-grade minimalism and digital vibrancy. It aims to evoke a sense of professional reliability and local community warmth. The UI acts as a pristine canvas for the art it hosts, utilizing significant whitespace to ensure that product photography remains the focal point.

The visual style is **Minimalist** with subtle **Glassmorphism** influences. By combining high-clarity layouts with sophisticated transparency and brand-tinted gradients, the system achieves a look that is both cutting-edge and approachable. The focus is on high readability, intuitive navigation, and a tactile sense of quality that mirrors the handmade nature of the marketplace goods.

## Colors
This design system utilizes a restricted, high-impact palette. The **Primary Purple** (#6666FF) provides depth and creative energy, while the **Turquoise** (#00CEC8) offers a fresh, modern contrast. 

- **Grayscale Palette:** Used exclusively for structure and content. Pure white (#FFFFFF) is the primary surface, with varying degrees of transparency (10%, 40%, 70%) applied to the primary colors and blacks to create depth without introducing unauthorized hues.
- **Gradients:** The Purple-to-Turquoise gradient is reserved for high-intent actions, active navigation states, and subtle section dividers. It should be used sparingly to maintain the minimalist integrity.
- **Functional Grays:** Light grays are used for background containment and input fields, while dark grays/black are reserved for typography to ensure AA/AAA accessibility.

## Typography
The system employs **Inter** for all typographic needs to ensure maximum legibility and a systematic, modern feel. The hierarchy is strictly enforced through weight variations and tight letter-spacing in larger headlines.

- **Headlines:** Use Bold (700) or SemiBold (600) weights. XL and LG sizes should use slight negative letter-spacing to appear more "compact" and editorial.
- **Body:** Set primarily in Regular (400) weight. MD is the default for descriptions, while SM is used for secondary metadata.
- **Labels:** Always use Medium (500) or Bold (700) with increased letter-spacing and uppercase styling for badges and tags to distinguish them from interactive text.

## Layout & Spacing
This is a mobile-first design system utilizing an **8px grid** and a **4-column fluid layout**.

- **Margins:** Standard horizontal safe area is set to 20px.
- **Gutter:** 16px between grid items (e.g., product cards in a dual-column view).
- **Rhythm:** Vertical spacing follows multiples of 8px. Use 24px (stack-lg) to separate major sections and 12px (stack-md) for internal component spacing.
- **Safe Areas:** Strictly observe bottom safe areas for the fixed navigation bar to ensure no overlap with system gestures.

## Elevation & Depth
Elevation is communicated through **Tonal Layering** and **Soft Ambient Shadows** rather than high-contrast depth.

- **Surface Levels:** 
  - Level 0 (Background): Pure white or ultra-light gray.
  - Level 1 (Cards): White surface with a 1px border (#F0F0F0) and a soft blur (Y: 4, Blur: 20, Opacity: 4% Black).
  - Level 2 (Floating): Used for the Bottom Navigation Bar. Features a backdrop blur (20px) and a subtle top-border gradient.
- **Overlays:** Use a 40% black overlay for modals to maintain focus while keeping the underlying content visible in a "ghosted" state.

## Shapes
The shape language is consistently rounded to evoke a "friendly and approachable" tactile feel.

- **Standard (12px):** Used for primary buttons and small product thumbnails.
- **Large (16px):** Used for standard content cards and input fields.
- **Extra Large (24px):** Reserved for major container elements, hero images, and persistent bottom sheets.
- **Pill:** All tags and badges use a fully rounded (pill) shape to distinguish them from structural UI components.

## Components

### Buttons
- **Primary:** Gradient fill (Purple to Turquoise) with white text. 12px corner radius.
- **Secondary:** Transparent background with a 1.5px border using the brand gradient. 12px corner radius.
- **Ghost:** No border or background; text in Primary Purple.

### Navigation
- **Bottom Navigation:** 5-icon fixed bar. Use a blur effect (Glassmorphism). Active states are indicated by the icon inheriting the brand gradient or a small gradient dot below the icon.

### Tags & Badges
- **Artist Tags:** 1px border in #6666FF or #00CEC8 with 10% opacity background fill.
- **Value Badges:** Specific styling for three key labels:
  - **[AI FREE]**: Black background, white bold text, pill shape.
  - **[TRUE HANDMADE]**: Turquoise border, turquoise text, pill shape.
  - **[LOCAL MATERIALS]**: Purple border, purple text, pill shape.

### Cards
- **Product Card:** 16px radius, subtle border, image aspect ratio 1:1 or 4:5. Text content should be left-aligned with a tight vertical stack.

### Input Fields
- 16px radius, light gray background (#F5F5F5), and 16px horizontal padding. Active state uses a 1.5px Turquoise border.
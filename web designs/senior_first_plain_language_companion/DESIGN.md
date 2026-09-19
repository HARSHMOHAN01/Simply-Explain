---
name: Senior-First Plain Language Companion
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#404850'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#707881'
  outline-variant: '#c0c7d1'
  surface-tint: '#006397'
  primary: '#006397'
  on-primary: '#ffffff'
  primary-container: '#5aa9e6'
  on-primary-container: '#003c5e'
  inverse-primary: '#92ccff'
  secondary: '#00658f'
  on-secondary: '#ffffff'
  secondary-container: '#86cfff'
  on-secondary-container: '#00587d'
  tertiary: '#6d5e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#b9a21e'
  on-tertiary-container: '#423800'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#92ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#c7e7ff'
  secondary-fixed-dim: '#86cfff'
  on-secondary-fixed: '#001e2e'
  on-secondary-fixed-variant: '#004c6d'
  tertiary-fixed: '#fde25d'
  tertiary-fixed-dim: '#e0c643'
  on-tertiary-fixed: '#211b00'
  on-tertiary-fixed-variant: '#524600'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 46px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 34px
  body-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '400'
    lineHeight: 34px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 30px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2rem
  space-xl: 3rem
---

## Brand & Style

This design system is engineered for older adults, retirees, and individuals who seek reassuring, unhurried, and crystal-clear digital companionship. It removes cognitive friction, digital anxiety, and visual clutter, replacing them with warmth, patient guidance, and unmistakable clarity.

### Design Movement & Aesthetic
- **Accessible Functional Humanism**: Emphasizing radical readability, high touch-affordance, human-centered proportions, and warm physical metaphors without gimmicky skeuomorphism.
- **Calm Reassurance**: Generously spaced layouts, soft grounding borders, gentle contrast tiers, and zero flashing or high-velocity micro-interactions.
- **Plain-Spoken Transparency**: The interface behaves like a patient family friend or advocate—prioritizing simple labels, prominent action buttons, and zero unexplained iconography.

## Colors

The color palette directly reflects the specified 5-swatch palette, calibrated specifically to ensure accessibility, comfort, and immediate visual orientation for seniors.

### Palette Architecture
- **Primary Brand Blue (`#5AA9E6`)**: The primary interaction anchor. Used for primary task buttons, active navigation, focused input frames, and key links. When paired with text, dark slate `#0F172A` text or pure white `#FFFFFF` (on solid badge surfaces with minimum 4.5:1 ratio) maintains full legibility.
- **Secondary Light Blue (`#7FC8F8`)**: Supporting background tint for cards, soft notification wrappers, and hovering outlines.
- **Dominant Canvas Warm White (`#F9F9F9`)**: The full-screen canvas background that eliminates stark clinical glare while maintaining crisp contrast.
- **Action / Notice Yellow (`#FFE45E`)**: High-visibility attention accent reserved strictly for key guidance callouts, "Next Steps," deadlines, and pending review tags. Paired with `#0F172A` text for AA/AAA contrast.
- **Supportive Accent Pink (`#FF6392`)**: Used judiciously for critical warnings, sensitive legal flags, document cancellation alerts, or security confirmations.
- **Neutral Dark Slate (`#1E293B` & `#0F172A`)**: The primary ink across all reading contexts. Standard body text never dips below `#1E293B`, ensuring high contrast against `#F9F9F9` and pure `#FFFFFF` card containers.

### Accessibility Rules
- Never use colored text on top of colored backgrounds unless tested for WCAG AAA compliance.
- No dark mode support: the application remains strictly in a high-contrast, glare-free light mode.

## Typography

This system strictly outlaws small or compressed text. The baseline text size is set at a generous 18px with ample line height to ease eye fatigue and improve reading comprehension for older adults.

### Font Hierarchy & Roles
- **Typeface Selection**: **Plus Jakarta Sans** provides open counters, tall x-heights, distinct character forms (e.g., differentiated `I`, `l`, and `1`), and rounded, friendly terminal strokes that feel warm rather than cold.
- **Headlines (`headline-xl`, `headline-lg`, `headline-md`)**: Used for plain-language prompts like "Explain Something" or "What should I do?". Headings feature relaxed letter spacing and comfortable line heights to prevent visual crowding.
- **Body (`body-xl`, `body-lg`, `body-bold`)**: Every document summary, explanation paragraph, and instruction block is typeset at 18px minimum (up to 22px for lead summaries) with a minimum 1.6x line-height ratio.
- **Interactive Labels (`label-lg`, `label-md`)**: Used on buttons, tabs, and form indicators. Bold weight ensures clear visual hierarchy and quick recognition.

## Layout & Spacing

The layout is built around a wide, calm, single-to-two-column reading container to prevent eye tracking strain across wide desktop viewports.

### Grid & Layout Strategy
- **Max Reading Width**: Main explanatory content containers do not exceed 840px in width, keeping reading lines at a comfortable 55–70 characters.
- **Responsive Behavior**:
  - **Desktop (1024px+)**: Two-column layout with a prominent action panel alongside clean explanation feeds. Outer canvas margin is 2rem to 3rem.
  - **Tablet (768px - 1023px)**: Single column with stacked cards and full-width navigation bars. Gutter remains 1.5rem.
  - **Mobile (< 768px)**: Single column with edge-to-edge padded cards, 1.25rem margin, and persistent sticky action anchors at the bottom edge.
- **Touch & Click Margins**: Every interactive touch target has a minimum physical bounding box of 56px height, surrounded by at least `space-sm` (12px) of clear separation to prevent misclicks.

## Elevation & Depth

Visual depth is achieved through tactile, tangible boundaries rather than floating abstract dropshadows. Older users rely on defined edges to identify where one concept or actionable element begins and ends.

### Depth Hierarchy
- **Canvas Base**: `#F9F9F9` background acts as the stable base sheet.
- **Surface Cards**: Pure white (`#FFFFFF`) cards sit atop `#F9F9F9` bordered with a crisp `2px solid #E2E8F0` stroke. A soft ambient shadow (`0 4px 12px rgba(15, 23, 42, 0.05)`) grounds the element without creating visual blur.
- **Focus & Action Tiers**: Active or highlighted steps use `#FFE45E` backings with a firm 2px `#1E293B` or `#5AA9E6` bounding border to command full focus.
- **Urgent Notices**: Red/Pink callouts use `#FF6392` at 12% opacity fill with a solid 3px `#FF6392` left accent boundary.

## Shapes

The design system uses a consistent, approachable level of rounding (Level 2: 0.5rem / 8px baseline, 1rem / 16px on cards, and 1.5rem / 24px on hero action blocks). 

- **Cards & Content Blocks**: 16px (`rounded-lg`) border-radius offers soft, friendly corners that feel welcoming while maintaining structured internal layout edges.
- **Buttons & Large Chips**: 12px to 16px corner radiuses balance friendly tactility with clear rectangular button affordance (avoiding overly slippery full-pill buttons that can be mistaken for non-clickable tags).
- **Interactive Borders**: Outlines maintain a consistent 2px width to ensure absolute visibility across all screen types and brightness settings.

## Components

### Buttons
- **Primary Action ("Explain Something", "Read Out Loud")**: Minimum height of 56px. Background in `#5AA9E6` with bold `#0F172A` text, 2px solid border (`#3F8DC9`), and 16px horizontal padding. Hover shifts to `#7FC8F8`; active state features a distinct inset push down.
- **Secondary Action ("Ask about this document")**: Pure `#FFFFFF` background, 2px solid `#5AA9E6` border, `#0F172A` text.
- **Urgent / Stop Button**: Solid `#FF6392` with white text (`#FFFFFF`), minimum 56px touch target.
- **Focus Indicator**: High-contrast 4px dual outline (`2px white offset, 2px #0F172A ring`) on all keyboard focus states.

### Action Guidance Cards ("What should I do?")
- Container in `#FFFFFF` with a 4px accent banner on top in `#FFE45E`.
- Card titles set in `headline-md` (`24px`).
- Generous internal padding (`space-lg` / 32px).
- Action steps formatted as numbered round badges (36px diameter) in `#FFE45E` with bold slate numbers.

### Document Input & Upload Fields
- Large drop and tap surfaces (minimum 160px height) framed with a 2px dashed border in `#5AA9E6`.
- Direct, friendly instructional prompts ("Tap here to choose a photo or letter" in `body-bold`).
- Standard text input fields have a minimum height of 58px, 18px font size, and 2px border in `#CBD5E1` that thickens to `#5AA9E6` on focus.

### Plain Language Summary Chips & Badges
- **Status Badges**:
  - "Easy Summary": `#7FC8F8` light background with `#0F172A` text.
  - "Needs Action": `#FFE45E` background with `#0F172A` bold text.
  - "Important Caution": Tinted `#FF6392` (15% opacity) with dark `#9E1B46` text.
- Badges feature 10px vertical and 18px horizontal padding, with an 18px semi-bold font size.

### Checkboxes & Selection Controls
- Checkbox and radio hit areas measure 32px × 32px with an enclosing tap target of 56px × 56px.
- Checkboxes use a 3px border in `#1E293B` when unchecked and fill with `#5AA9E6` displaying a high-contrast tick icon when checked.
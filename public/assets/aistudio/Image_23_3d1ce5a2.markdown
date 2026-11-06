---
name: KissanDost Farmer Platform
colors:
  surface: '#f3fcef'
  surface-dim: '#d3ddd0'
  surface-bright: '#f3fcef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf6ea'
  surface-container: '#e7f1e4'
  surface-container-high: '#e1ebde'
  surface-container-highest: '#dce5d9'
  on-surface: '#151e16'
  on-surface-variant: '#404940'
  inverse-surface: '#2a332a'
  inverse-on-surface: '#eaf3e7'
  outline: '#707a6f'
  outline-variant: '#bfc9bd'
  surface-tint: '#266b3f'
  primary: '#005128'
  on-primary: '#ffffff'
  primary-container: '#246a3e'
  on-primary-container: '#a0e7b0'
  inverse-primary: '#90d6a0'
  secondary: '#7c5800'
  on-secondary: '#ffffff'
  secondary-container: '#ffcd71'
  on-secondary-container: '#785500'
  tertiary: '#005128'
  on-tertiary: '#ffffff'
  tertiary-container: '#256a3e'
  on-tertiary-container: '#a0e7b0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#abf3bb'
  primary-fixed-dim: '#90d6a0'
  on-primary-fixed: '#00210d'
  on-primary-fixed-variant: '#025229'
  secondary-fixed: '#ffdea7'
  secondary-fixed-dim: '#efbf65'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#abf3bb'
  tertiary-fixed-dim: '#90d6a0'
  on-tertiary-fixed: '#00210d'
  on-tertiary-fixed-variant: '#025229'
  background: '#f3fcef'
  on-background: '#151e16'
  surface-variant: '#dce5d9'
typography:
  display-hero:
    fontFamily: Merriweather
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 68px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Merriweather
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Merriweather
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 46px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Merriweather
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: 0em
  headline-md:
    fontFamily: Merriweather
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Merriweather
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
  space-2xl: 3.5rem
---

## Brand & Style

This design system expresses an agrarian-first, AI-native platform bridging technological precision with rural accessibility and organic warmth. It embodies the posture of an empowering, dependable companion for farmers, agronomists, and agri-entrepreneurs.

The design movement is **Warm Agrarian Modernism**—a synthesis of high-contrast tactile readability, serene organic surfaces, and soft modern elevations. The atmosphere feels grounded, fertile, and clean rather than sterile or overly corporate. Visual elements convey life, growth, and optimism while maintaining uncompromising clarity under bright field sunlight on mobile devices.

## Colors

The palette draws directly from lush agricultural canopy, fertile earth, and golden harvest grain:

- **Primary Forest Green (`#176B3A` / `#1B5E3C`):** Used for focal CTAs, primary headlines, active navigation states, and verified security trust markers. Provides high contrast and authority.
- **Harvest Amber (`#F4B942` / `#F4C042`):** Used for attention points, critical notifications, AI recommendation highlights, yield metric surges, and rating stars.
- **Sage / Foliage Tint (`#3FAE68` / `#E8F2EB`):** Used for badge backdrops, subtle card borders, and contextual icon containers.
- **Canvas Cream / Natural Ground (`#F4F7F4` and `#FBFBF9`):** Replaces harsh stark whites for background canvas areas to reduce eye strain in outdoor conditions. Card surfaces sit on pure white (`#FFFFFF`) to produce clear dimensional separation.
- **Deep Earth Neutral (`#243329` / `#2D3E33`):** Ensures high-contrast legibility for body text and form controls meeting stringent WCAG AAA standards.

## Typography

The typographical strategy employs an intentional duality:

1. **Editorial Agrarian Serifs (`Merriweather`):** Selected for primary titles, section headers, and hero value propositions. The robust serifs, sturdy bracketed serifs, and open counters evoke traditional editorial authority, agrarian publications, and trustworthy craftsmanship.
2. **Crisp Ergonomic Sans (`Plus Jakarta Sans`):** Selected for all interface controls, form inputs, dynamic telemetry (moisture, temperature, rainfall, market pricing), and body copy. Its open apertures and friendly round geometry guarantee immediate legibility across varied device qualities and bright sunlight.

Numerical metrics and sensor values utilize tabular alignment with bold weights to preserve data structure across dashboard views.

## Layout & Spacing

The layout model implements a structured 12-column responsive fluid grid with generous outer gutters on desktop and condensed 4-column layouts on mobile viewports.

- **Desktop (1200px+):** 12 columns, 24px (`1.5rem`) gutters, max-width content container set to 1280px. Margins stay centered with a minimum of 32px (`2rem`).
- **Tablet (768px – 1199px):** 8 columns, 20px gutters, 24px page margins. Dual-column card dashboards collapse gracefully.
- **Mobile (320px – 767px):** 4 columns, 16px (`1rem`) gutters, 16px outer margin to preserve horizontal screen efficiency for larger touch targets.

All vertical rhythms respect an 8pt base grid unit. Form containers, dashboard cards, and action panels honor internal padding of 24px (`space-lg`) on desktop and 16px (`space-md`) on mobile screens.

## Elevation & Depth

Visual hierarchy leverages soft environmental shadows combined with tonal layering rather than heavy synthetic drop-shadows:

- **Base Layer (Canvas):** Tinted natural background (`#F4F7F4` to `#FBFBF9`) providing soft, glare-free underlying ground.
- **Surface Layer (Cards, Tables, Panels):** Pure crisp white (`#FFFFFF`) with subtle sage borders (`1px solid #E1EBE3`).
- **Ambient Elevation (Floating Cards, Modals, Popovers):** Ultra-soft diffused ambient shadow tinted with organic deep forest tones: `0 8px 30px -4px rgba(23, 107, 58, 0.08)`.
- **Selected & Interactive Cards:** Border thickness transitions to `1.5px` or `2px` with primary tone (`#176B3A`) and an interior soft glow: `0 0 0 1px #176B3A, 0 12px 28px -6px rgba(23, 107, 58, 0.12)`.
- **AI Recommendation Surface:** Inverted deep forest green surface (`#176B3A`) with internal golden accents (`#F4B942`) providing clear visual primacy for critical AI farm insights.

## Shapes

The design system maintains a balanced, friendly, yet structurally grounded geometry:

- **Cards & Outer Modules:** Uniformly set to `16px` (`rounded-lg` under level 2 tokens), reinforcing softness and accessibility.
- **Form Inputs, Buttons, & Interactive Selectors:** Set to `10px` or `12px` to deliver crisp tactile confidence while maintaining approachable curvature.
- **Status Badges, Category Chips, and Feature Tags:** Configured as complete pill shapes (`9999px`) to create distinction from actionable rectangular buttons.
- **Icon Containers:** Soft rounded squares (`12px` radius) or fully circular containers tinted in pastel foliage green or amber.

## Components

### Buttons
- **Primary:** Forest green solid background (`#176B3A`), crisp white text, medium weight, 12px border radius, paired with directional trail icons (e.g., arrow right). Hover transitions to `#12542E`.
- **Secondary / Ghost:** White background, 1.5px border (`#176B3A` or `#D3E2D8`), primary green label. Hover reveals `#F2F8F4`.
- **Accent (Recommendation / Alert):** Gold/Amber surface (`#F4B942`) with deep earth text (`#243329`) for high-urgency agricultural recommendations.

### Chips & Status Badges
- Pill-shaped (`rounded-full`) with light pastel fills (`#EAF3ED` for active, `#FEF6E7` for alerts, `#EBF2FC` for market updates).
- Accompanied by 6px circular indicator dots or 14px agrarian icons (sprout, drop, sun, cloud).

### Form Inputs & OTP Cells
- **Text Inputs:** Height 48px–52px for comfortable thumb targeting. Clean 1.5px border in `#D4DFD7`, surface `#FFFFFF`. Leading icons in muted forest neutral (`#627768`). Focused state activates `#176B3A` border with a 3px soft focus ring (`rgba(23, 107, 58, 0.15)`).
- **OTP Input Fields:** Individual square/rounded cells (52px x 56px), centered large mono-spaced digits, with auto-focus active borders in `#176B3A`.

### Role Selection Cards
- Large interactive radio cards (e.g., Farmer vs. Vendor) featuring distinct agricultural line icons, title, description, and an animated checkmark indicator badge top-right. Selected state triggers a solid `#176B3A` border and `#F2F8F4` background wash.

### Agrarian Metric & Forecast Tiles
- Modular grid tiles displaying single key metrics (Soil Moisture %, Next Rainfall mm, Market Price outlook).
- Distinct soft circular icon badges in the top corner with clean tabular metric numbers and micro-trend indicators.
# Design System - Stripe-Inspired Enterprise Aesthetic

A comprehensive design system for Automate My Blog, inspired by Stripe's award-winning enterprise aesthetic. Clean, minimal, typography-first, and data-focused.

## Philosophy

Our design system follows these core principles:

1. **Minimalism**: Less is more. Use subtle shadows, reduced border radius, and generous whitespace.
2. **Typography-First**: Clear hierarchy with semibold headings and generous line heights.
3. **Professional Color**: Grayscale foundation with strategic purple accent (#635BFF).
4. **Data Clarity**: Charts and tables emphasize readability and insight over decoration.
5. **Subtle Motion**: Fast, functional animations (100-200ms) that enhance without distracting.

## Quick Start

### Using Design Tokens

All components should use CSS custom properties (CSS variables) for consistency:

```jsx
// Good ✅
<div style={{
  padding: 'var(--space-6)',
  background: 'var(--color-background-body)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-sm)'
}} />

// Avoid ❌
<div style={{
  padding: '24px',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
}} />
```

### Using Ant Design Components

Ant Design components automatically use the configured theme. No additional styling needed:

```jsx
import { Button, Card, Input } from 'antd';

// These automatically use the Stripe-inspired theme
<Button type="primary">Primary Action</Button>
<Card>Content here</Card>
<Input placeholder="Enter text" />
```

## Color Palette

### Primary Colors

- **Primary**: `#635BFF` (Stripe purple) - Use sparingly for primary actions
- **Primary Hover**: `#0A2540` (Stripe navy) - Hover states for primary elements

### Status Colors

- **Success**: `#00D924` (Stripe green)
- **Warning**: `#FFB020` (Stripe amber)
- **Error**: `#DF1B41` (Stripe red)

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#0A2540` | Main body text, headings |
| `--color-text-secondary` | `#425466` | Secondary information, labels |
| `--color-text-tertiary` | `#6B7C8E` | Captions, metadata |
| `--color-text-disabled` | `#97A6BA` | Disabled state |

### Background Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background-body` | `#ffffff` | Main background |
| `--color-background-container` | `#FAFBFC` | Subtle gray containers |
| `--color-background-elevated` | `#ffffff` | Cards, modals |

### Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-border-light` | `#F6F9FC` | Very subtle borders |
| `--color-border-base` | `#E3E8EF` | Standard borders |
| `--color-border-dark` | `#CDD7E6` | Emphasized borders |

### Gray Scale

10-step grayscale from 50 (lightest) to 900 (darkest):

- `--color-gray-50`: `#FAFBFC` → Lightest backgrounds
- `--color-gray-100`: `#F6F9FC` → Subtle backgrounds
- `--color-gray-200`: `#E3E8EF` → Borders
- `--color-gray-300`: `#CDD7E6` → Active borders
- `--color-gray-400`: `#97A6BA` → Disabled states
- `--color-gray-500`: `#6B7C8E` → Tertiary text
- `--color-gray-600`: `#425466` → Secondary text
- `--color-gray-700`: `#283D54` → Hover states
- `--color-gray-800`: `#0A2540` → Primary text (Stripe navy)
- `--color-gray-900`: `#0A1929` → Darkest elements

## Typography

### Font Stack

```css
--font-family-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif;
--font-family-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
```

### Type Scale

| Token | Size | Usage |
|-------|------|-------|
| `--font-size-xs` | 12px | Captions, labels |
| `--font-size-sm` | 14px | Secondary body text |
| `--font-size-base` | 16px | Primary body text |
| `--font-size-lg` | 18px | Subheadings |
| `--font-size-xl` | 20px | Section headers |
| `--font-size-2xl` | 24px | Page titles |
| `--font-size-3xl` | 32px | Hero headings |
| `--font-size-4xl` | 40px | Large display |

### Font Weights

- **Normal** (400): Body text
- **Medium** (500): Emphasis, buttons
- **Semibold** (600): Headings, strong emphasis
- **Bold** (700): Very strong emphasis (use sparingly)

### Heading Utilities

Use predefined heading classes for consistent hierarchy:

```jsx
<h1 className="heading-display">Display Heading</h1>    {/* 40px, bold */}
<h2 className="heading-page">Page Title</h2>            {/* 32px, semibold */}
<h3 className="heading-section">Section Header</h3>     {/* 24px, semibold */}
<h4 className="heading-subsection">Subsection</h4>      {/* 20px, semibold */}
```

### Line Heights

- **Tight** (1.25): Headings
- **Snug** (1.375): Emphasized text
- **Normal** (1.5): Body text (default)
- **Relaxed** (1.625): Long-form content
- **Loose** (2): Special cases

## Spacing System

8px grid system for consistent spacing:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing |
| `--space-2` | 8px | **Base unit** |
| `--space-3` | 12px | Compact |
| `--space-4` | 16px | Standard |
| `--space-6` | 24px | Generous |
| `--space-8` | 32px | Spacious |
| `--space-10` | 40px | Very spacious |
| `--space-12` | 48px | Section spacing |
| `--space-16` | 64px | Hero spacing |
| `--space-20` | 80px | Large sections |
| `--space-24` | 96px | Maximum spacing |

### Spacing Guidelines

- **Component padding**: Use `--space-4` (16px) or `--space-6` (24px)
- **Section margins**: Use `--space-6` (24px) to `--space-12` (48px)
- **Hero sections**: Use `--space-16` (64px) or larger
- **Mobile**: Reduce spacing by one step (e.g., `--space-6` → `--space-4`)

## Shadows

Minimal, Stripe-inspired shadows using navy tones:

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 1px rgba(10, 37, 64, 0.03)` | Very subtle |
| `--shadow-sm` | `0 1px 2px rgba(10, 37, 64, 0.05)` | Default |
| `--shadow-md` | `0 2px 4px rgba(10, 37, 64, 0.08)` | **Max for most UI** |
| `--shadow-lg` | `0 4px 8px rgba(10, 37, 64, 0.08)` | Modals only |
| `--shadow-focus` | `0 0 0 3px rgba(99, 91, 255, 0.1)` | Focus ring |

### Shadow Guidelines

- **Default**: Use `--shadow-sm` for most elevated elements
- **Cards**: Use `--shadow-sm` or `--shadow-md`
- **Modals/Drawers**: Use `--shadow-lg`
- **Buttons**: No shadows (Stripe style)
- **Focus states**: Use `--shadow-focus` for accessibility

## Border Radius

Reduced for professional look:

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0 | Square corners |
| `--radius-sm` | 3px | Tight corners |
| `--radius-base` | 4px | **Default** (buttons, cards) |
| `--radius-md` | 6px | Larger components |
| `--radius-lg` | 8px | Rare, large panels |
| `--radius-xl` | 12px | Very rare |
| `--radius-full` | 9999px | Pills, avatars only |

### Border Radius Guidelines

- **Buttons/Inputs**: Use `--radius-base` (4px)
- **Cards**: Use `--radius-md` (6px)
- **Modals**: Use `--radius-lg` (8px)
- **Avoid**: Large radius values (12px+) except for pills/avatars

## Animation & Transitions

Subtle, professional motion:

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | 100ms | Hover states |
| `--transition-base` | 150ms | **Default** interactions |
| `--transition-normal` | 200ms | Smooth transitions |
| `--transition-slow` | 300ms | Complex animations |

### Animation Guidelines

- **Hover effects**: Use `--transition-fast` (100ms)
- **Interactive feedback**: Use `--transition-base` (150ms)
- **Layout changes**: Use `--transition-normal` (200ms)
- **Avoid**: Bounce, pulse, scale-in animations (too playful)
- **Keep**: Fade-in, slide-in-up (subtle, professional)

### Easing Functions

```css
--easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);  /* Default */
--easing-ease-out: cubic-bezier(0, 0, 0.2, 1);      /* Exits */
--easing-ease-in: cubic-bezier(0.4, 0, 1, 1);       /* Entrances */
```

## Layout Patterns

### Container Widths

```css
.container-sm { max-width: 640px; }   /* Tight content */
.container-md { max-width: 768px; }   /* Default content */
.container-lg { max-width: 1024px; }  /* Wide content */
.container-xl { max-width: 1280px; }  /* Full layout */
```

### Card Pattern

```jsx
<Card
  style={{
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    padding: 'var(--space-6)'
  }}
>
  <h3 className="heading-section">Card Title</h3>
  <p style={{ color: 'var(--color-text-secondary)' }}>
    Card content with secondary text color
  </p>
</Card>
```

### Form Pattern

```jsx
<Space direction="vertical" size="large" style={{ width: '100%' }}>
  <div>
    <label style={{
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--color-text-secondary)',
      marginBottom: 'var(--space-2)',
      display: 'block'
    }}>
      Label Text
    </label>
    <Input placeholder="Placeholder text" />
  </div>
</Space>
```

## Data Visualization

### Chart Colors

Use grayscale with Stripe purple accent:

```javascript
const chartColors = {
  primary: '#635BFF',      // Stripe purple
  secondary: '#0A2540',    // Stripe navy
  tertiary: '#6B7C8E',     // Gray
  success: '#00D924',      // Green (positive metrics)
  warning: '#FFB020',      // Amber (warnings)
  error: '#DF1B41',        // Red (negative metrics)
};
```

### Table Pattern

```jsx
<Table
  columns={columns}
  dataSource={data}
  pagination={{
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => `${total} items`
  }}
  // Stripe-inspired styling via theme config
/>
```

### Metrics Card Pattern

```jsx
<Card style={{ textAlign: 'center' }}>
  <div style={{
    fontSize: 'var(--font-size-3xl)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-2)'
  }}>
    1,234
  </div>
  <div style={{
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)'
  }}>
    Total Users
  </div>
</Card>
```

## Accessibility

### Color Contrast

All colors meet WCAG AA standards:

- **Text**: 4.5:1 minimum (primary text on white background)
- **UI Components**: 3:1 minimum (borders, icons)
- **Focus indicators**: Visible `--shadow-focus` ring

### Focus States

Always provide visible focus indicators:

```css
button:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

### Keyboard Navigation

All interactive elements must be keyboard accessible:

- Use semantic HTML (`<button>`, `<a>`, `<input>`)
- Provide `tabIndex` when needed
- Support Enter/Space for activation

## Mobile Responsiveness

### Breakpoints

```css
/* Mobile: < 768px */
@media (max-width: 767px) { }

/* Tablet: 768px - 1023px */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Desktop: >= 1024px */
@media (min-width: 1024px) { }
```

### Mobile Guidelines

1. **Reduce spacing**: Use one step smaller (e.g., `--space-6` → `--space-4`)
2. **Stack layouts**: Switch from Row to Col
3. **Tap targets**: Minimum 44px height for touch
4. **Font sizes**: Maintain minimum 16px for readability
5. **Navigation**: Use bottom navigation on mobile

## Component Library

### Custom Components

Located in `/src/components/DesignSystem/`:

- **Button**: `<Button variant="primary" size="medium" />`
- **Input**: `<Input placeholder="Enter text" />`
- **Panel**: `<Panel title="Panel Title" collapsible />`

All custom components use design tokens automatically.

### Ant Design Components

Pre-configured with Stripe-inspired theme in `App.js`:

- Button, Card, Table, Input, Select, Modal, Drawer, Menu, Tabs, Tag, Alert, Badge, Tooltip

## Best Practices

### Do's ✅

- Use CSS custom properties for all styling
- Apply heading utility classes for typography
- Keep shadows minimal (`--shadow-sm` or `--shadow-md`)
- Use 8px spacing grid (`--space-*`)
- Maintain clear visual hierarchy
- Use grayscale with strategic purple accent
- Keep animations fast (100-200ms)

### Don'ts ❌

- Avoid hardcoded colors (use `--color-*`)
- Don't use large border radius (> 8px except pills)
- Avoid heavy shadows (> 4px blur)
- Don't use playful animations (bounce, pulse, glow)
- Avoid mixing spacing scales
- Don't overuse primary color (purple)
- Avoid slow animations (> 300ms)

## Migration Guide

### Updating Existing Components

1. Replace hardcoded colors:
   ```jsx
   // Before
   <div style={{ color: '#333', background: '#fff' }} />

   // After
   <div style={{
     color: 'var(--color-text-primary)',
     background: 'var(--color-background-body)'
   }} />
   ```

2. Replace hardcoded spacing:
   ```jsx
   // Before
   <div style={{ padding: '24px', margin: '16px' }} />

   // After
   <div style={{
     padding: 'var(--space-6)',
     margin: 'var(--space-4)'
   }} />
   ```

3. Replace hardcoded borders/shadows:
   ```jsx
   // Before
   <div style={{
     borderRadius: '12px',
     boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
   }} />

   // After
   <div style={{
     borderRadius: 'var(--radius-md)',
     boxShadow: 'var(--shadow-md)'
   }} />
   ```

## Resources

- **Design Tokens**: `/src/components/DesignSystem/tokens.js`
- **CSS Variables**: `/src/styles/design-system.css`
- **Ant Design Theme**: `/src/App.js` (lines 14-77)
- **Mobile Styles**: `/src/styles/mobile.css`
- **Style Guide**: `/src/components/DesignSystem/STYLE_GUIDE.md`

## Support

For questions or suggestions about the design system:

1. Review this README and the Style Guide
2. Check existing component implementations
3. Consult the Stripe Design System for inspiration: https://stripe.com/docs/design

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Aesthetic**: Stripe-Inspired Enterprise

# Branding System Guide

This guide explains how to use the centralized branding system for custom colors and fonts.

## Custom Colors (Hex Codes)

### Usage in Components

```tsx
import { customColors, getCustomColor } from '../lib/branding';

// Direct hex value
<div style={{ backgroundColor: customColors.primary[600] }}>

// Using utility function
<div style={{ backgroundColor: getCustomColor('primary', 600) }}>

// Custom brand colors
<div style={{ backgroundColor: customColors.brand.gold }}>
```

### Adding New Custom Colors

Edit `lib/branding.ts`:

```tsx
export const customColors = {
  // ... existing colors
  brand: {
    gold: '#FFD700',
    silver: '#C0C0C0',
    // Add your custom hex codes here
    customBlue: '#1e40af',
    customGreen: '#059669',
  },
} as const;
```

## Google Fonts

### Setup

1. **Add fonts to configuration** in `lib/branding.ts`:

```tsx
export const googleFonts = [
  { family: 'Inter:wght@300;400;500;600;700;800', display: 'swap' },
  { family: 'Roboto:wght@300;400;500;600;700', display: 'swap' },
  // Add your fonts here
] as const;
```

2. **Update font definitions**:

```tsx
export const customFonts = {
  heading: "'Inter', sans-serif",
  body: "'Roboto', sans-serif",
  // Update with your chosen fonts
} as const;
```

3. **The fonts are automatically loaded** via `layout.tsx`.

### Usage in Components

```tsx
import { customFonts, getCustomFontClass } from '../lib/branding';

// Direct font family
<h1 style={{ fontFamily: customFonts.heading }}>

// Using utility function
<h1 style={getCustomFontClass('heading')}>
```

## Downloaded/Local Fonts

### Setup

1. **Place font files** in `/public/fonts/`:
   ```
   public/
   fonts/
     CustomFont-Regular.woff2
     CustomFont-Regular.woff
     CustomFont-Bold.woff2
     CustomFont-Bold.woff
   ```

2. **Update font definitions** in `lib/branding.ts`:

```tsx
export const localFonts = `
  @font-face {
    font-family: 'CustomFont';
    src: url('/fonts/CustomFont-Regular.woff2') format('woff2'),
         url('/fonts/CustomFont-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'CustomFont';
    src: url('/fonts/CustomFont-Bold.woff2') format('woff2'),
         url('/fonts/CustomFont-Bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
` as const;
```

3. **Add to globals.css**:

```css
/* Add this to app/globals.css */
${localFonts}
```

4. **Update customFonts**:

```tsx
export const customFonts = {
  // ... existing
  custom: "'CustomFont', sans-serif",
} as const;
```

### Usage

```tsx
import { customFonts } from '../lib/branding';

<h1 style={{ fontFamily: customFonts.custom }}>
```

## Migration Guide

### From Tailwind Classes to Custom Colors

**Before:**
```tsx
<div className="bg-blue-600 text-white">
```

**After:**
```tsx
<div style={{ backgroundColor: customColors.primary[600], color: 'white' }}>
```

### From Inline Styles to Custom Fonts

**Before:**
```tsx
<h1 style={{ fontFamily: "'Syne', sans-serif" }}>
```

**After:**
```tsx
<h1 style={getCustomFontClass('heading')}>
```

## Best Practices

1. **Use Tailwind classes** for simple color schemes
2. **Use custom hex colors** for brand-specific colors or complex designs
3. **Use Google Fonts** for web fonts with good performance
4. **Use local fonts** for custom branding or offline requirements
5. **Always use the utility functions** for consistency
6. **Test font loading** to ensure good performance
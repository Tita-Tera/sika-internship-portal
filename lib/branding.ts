// Branding constants for Tera-Tech Ltd Internship Portal
// Centralize colors, fonts, and themes for easy brand management
//
// Usage Examples:
//
// TAILWIND CLASSES:
// import { colors, getColorClass } from '../lib/branding';
// className={`bg-${colors.primary[600]}`} // 'bg-blue-600'
// getColorClass('primary', 600) // 'blue-600'
//
// CUSTOM HEX COLORS:
// import { customColors, getCustomColor } from '../lib/branding';
// style={{ backgroundColor: customColors.primary[600] }} // '#2563eb'
// getCustomColor('primary', 600) // '#2563eb'
//
// FONTS:
// import { fonts, customFonts, getFontClass, getCustomFontClass } from '../lib/branding';
// style={getFontClass('heading')} // { fontFamily: "'Syne', sans-serif" }
// style={getCustomFontClass('heading')} // { fontFamily: "'Inter', sans-serif" }
//
// GOOGLE FONTS: Automatically loaded in layout.tsx
// LOCAL FONTS: Add CSS to globals.css using getLocalFontsCSS()
//
// To change brand colors: Update the values here, and they propagate across the entire app.

// Tailwind-based color system (for className usage)
export const colors = {
  // Primary brand colors (Tailwind classes)
  primary: {
    50: 'blue-50',
    100: 'blue-100',
    200: 'blue-200',
    400: 'blue-400',
    600: 'blue-600',
    700: 'blue-700',
  },
  // Neutral colors
  neutral: {
    50: 'zinc-50',
    100: 'zinc-100',
    200: 'zinc-200',
    400: 'zinc-400',
    500: 'zinc-500',
    600: 'zinc-600',
    800: 'zinc-800',
    900: 'zinc-900',
  },
  // Accent colors
  accent: {
    50: 'amber-50',
    100: 'amber-100',
    200: 'amber-200',
    300: 'amber-300',
    400: 'amber-400',
    600: 'amber-600',
  },
  // Success colors
  success: {
    50: 'green-50',
    100: 'green-100',
    200: 'green-200',
    500: 'green-500',
    600: 'green-600',
  },
  // Error colors
  error: {
    50: 'red-50',
    500: 'red-500',
  },
  // Gradient colors (Tailwind classes)
  gradient: {
    primary: 'from-blue-500 via-indigo-500 to-violet-500',
    success: 'from-green-50 to-emerald-100',
  },
} as const;

// Custom hex color system (for style usage)
export const customColors = {
  // Primary brand colors (hex codes)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    400: '#60a5fa',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    800: '#27272a',
    900: '#18181b',
  },
  // Accent colors
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    600: '#d97706',
  },
  // Success colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    500: '#22c55e',
    600: '#16a34a',
  },
  // Error colors
  error: {
    50: '#fef2f2',
    500: '#ef4444',
  },
  // Custom brand colors (add your own hex codes here)
  brand: {
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
    coral: '#FF7F50',
    teal: '#008080',
  },
} as const;

// Font system
export const fonts = {
  heading: "'Syne', sans-serif",
  body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  display: "'Syne', sans-serif",
} as const;

// Custom font system (for Google Fonts or downloaded fonts)
export const customFonts = {
  // Google Fonts (import in layout.tsx or _app.tsx)
  heading: "'Inter', sans-serif", // Example: replace with your Google Font
  body: "'Roboto', sans-serif", // Example: replace with your Google Font
  display: "'Poppins', sans-serif", // Example: replace with your Google Font

  // Downloaded fonts (place in /public/fonts/ and define here)
  // Example: fontFamily: "CustomFont, sans-serif"
  custom: "'CustomFont', sans-serif",
} as const;

// Google Fonts configuration
export const googleFonts = [
  // Add your Google Fonts here
  // Format: { family: 'FontName:wght@400;500;600;700', display: 'swap' }
  { family: 'Inter:wght@300;400;500;600;700;800', display: 'swap' },
  { family: 'Roboto:wght@300;400;500;600;700', display: 'swap' },
  { family: 'Poppins:wght@300;400;500;600;700;800', display: 'swap' },
] as const;

// Local font configuration (for downloaded fonts)
// Place font files in /public/fonts/ and define CSS here
export const localFonts = `
  /* Example local font definition */
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

export const spacing = {
  section: 'py-20',
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
} as const;

export const shadows = {
  card: 'shadow-lg',
  modal: 'shadow-2xl',
} as const;

export const transitions = {
  default: 'transition-all duration-150',
  hover: 'hover:transition-colors',
} as const;

// Theme configuration
export const theme = {
  fonts,
  colors,
  customColors,
  customFonts,
  spacing,
  shadows,
  transitions,
} as const;

// Utility functions for consistent styling

// Tailwind class utilities
export const getColorClass = (color: keyof typeof colors, shade: number) => {
  const colorObj = colors[color] as any;
  return colorObj[shade];
};

export const getFontClass = (type: keyof typeof fonts) => {
  return { fontFamily: fonts[type] };
};

// Custom color utilities (hex codes)
export const getCustomColor = (color: keyof typeof customColors, shade: number) => {
  const colorObj = customColors[color] as any;
  return colorObj[shade];
};

export const getCustomColorValue = (color: keyof typeof customColors, shade: number) => {
  return getCustomColor(color, shade);
};

// Custom font utilities
export const getCustomFontClass = (type: keyof typeof customFonts) => {
  return { fontFamily: customFonts[type] };
};

// Google Fonts utilities
export const getGoogleFontsLink = () => {
  const families = googleFonts.map(font => font.family).join('&family=');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
};

export const getGoogleFontsPreload = () => {
  return googleFonts.map(font => ({
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  })).concat(
    googleFonts.map(font => ({
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous' as const,
    }))
  );
};

// Local fonts utilities
export const getLocalFontsCSS = () => {
  return localFonts;
};
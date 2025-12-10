/**
 * Design System Tokens
 * 
 * This module contains all design tokens for the premium food discovery app.
 * These tokens define the visual language including colors, spacing, typography,
 * shadows, border radii, and animation configurations.
 */

/**
 * Color Palette
 * Complete design system color tokens following the premium aesthetic
 */
export const colors = {
  // Primary Colors
  primary: {
    green: '#AFC8A6',      // Primary sage green for buttons and accents
    cream: '#FFFDF8',      // Accent cream for backgrounds
    beige: '#F7F5F0',      // Warm beige for secondary backgrounds
    gray: '#D9D9D9',       // Soft gray for borders and dividers
  },
  
  // Background Colors
  background: {
    primary: '#FFFDF8',    // Accent cream - main background
    secondary: '#F7F5F0',  // Warm beige - secondary background
    surface: '#FFFFFF',    // White - elevated surfaces with tint
    surfaceTinted: 'rgba(255, 255, 255, 0.96)', // Surface with 4% tint
    card: 'rgba(255, 255, 255, 0.92)',          // Card background with 8% tint
  },
  
  // Text Colors
  text: {
    primary: '#4A4A4A',    // Text dark gray - primary text
    secondary: '#6B6B6B',  // Medium gray - secondary text
    tertiary: '#9B9B9B',   // Light gray - tertiary text
    placeholder: '#B8B8B8', // Warm gray for placeholders
    inverse: '#FFFFFF',    // White text for dark backgrounds
  },
  
  // Accent Colors (for backward compatibility)
  accent: {
    primary: '#AFC8A6',    // Primary sage green
    secondary: '#F7F5F0',  // Warm beige
  },

  // Interactive Colors
  interactive: {
    primary: '#AFC8A6',    // Primary green for main actions
    primaryHover: '#9BB896', // Darker green for hover states
    primaryPressed: '#8BA886', // Even darker for pressed states
    secondary: 'transparent', // Transparent for secondary buttons
    secondaryBorder: '#D9D9D9', // Light gray border for secondary buttons
    disabled: '#E8E8E8',   // Disabled state color
    disabledText: '#B8B8B8', // Disabled text color
  },

  // Error Colors (for backward compatibility)
  error: {
    primary: '#E8A5A5',    // Soft red
    background: '#FDF2F2', // Light red background
    text: '#C53030',       // Dark red text
    soft: '#E8A5A5',       // Soft error color
  },
  
  // Border Colors
  border: {
    light: '#E8E6E1',      // Light border
    medium: '#D4D2CD',     // Medium border
    soft: '#D9D9D9',       // Soft gray border
    input: '#E0E0E0',      // Input field borders
    inputFocus: '#AFC8A6', // Focused input border
  },
  
  // State Colors
  state: {
    error: '#E8A5A5',      // Soft red - error states
    success: '#A8D5A8',    // Soft green - success states
    warning: '#F5D5A8',    // Soft orange - warning states
    info: '#A8C8E8',       // Soft blue - info states
  },
  
  // Glass Effect Colors (for glassmorphism)
  glass: {
    light: 'rgba(255, 255, 255, 0.8)',     // Light glass effect
    medium: 'rgba(255, 255, 255, 0.6)',    // Medium glass effect
    dark: 'rgba(255, 255, 255, 0.4)',      // Dark glass effect
    backdrop: 'rgba(0, 0, 0, 0.1)',        // Subtle backdrop
  },
} as const;

/**
 * Spacing Scale
 * Generous spacing system following the "white space as core aesthetic" principle
 */
export const spacing = {
  // Micro spacing
  xs: 4,
  sm: 8,
  
  // Base spacing (12-28px range as specified)
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  
  // Generous spacing for sections
  section: 32,
  sectionLarge: 48,
  sectionXL: 64,
  
  // Component-specific spacing
  buttonPadding: {
    horizontal: 24,
    vertical: 12,
  },
  cardPadding: {
    small: 16,
    medium: 20,
    large: 24,
  },
  inputPadding: {
    horizontal: 16,
    vertical: 14,
  },
} as const;

/**
 * Border Radius
 * Rounded corner system for different component types
 */
export const borderRadius = {
  // Base radius values
  small: 12,
  medium: 16,
  large: 22,
  
  // Component-specific radius
  button: {
    pill: 999,           // Pill-shaped buttons
    rounded: 16,         // Standard rounded buttons
    icon: 999,           // Circular icon buttons
  },
  input: 16,             // Input fields (as specified)
  card: {
    small: 18,           // Small cards
    medium: 20,          // Medium cards  
    large: 22,           // Large cards (18-22px range)
  },
  modal: 24,             // Modals and overlays
  image: 12,             // Image containers
} as const;

/**
 * Typography System
 * Clean, readable typography with generous spacing
 */
export const typography = {
  fontFamily: {
    heading: 'SF Pro Display',
    body: 'SF Pro Text',
    fallback: 'Inter',
  },
  fontSize: {
    micro: 10,           // Micro labels
    caption: 12,         // Captions and micro-labels
    body: 16,           // Body text
    subheading: 18,     // Subheadings
    heading3: 22,       // Section headings
    heading2: 28,       // Page headings
    heading1: 34,       // Large headings
  },
  lineHeight: {
    tight: 1.2,         // Headings
    normal: 1.5,        // Body text (generous as specified)
    relaxed: 1.8,       // Loose text
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

/**
 * Icon System
 * Thin-line icons with consistent styling
 */
export const icons = {
  // Stroke specifications
  stroke: {
    thin: 1.5,           // Thin stroke (as specified: 1.5-2px)
    medium: 2,           // Medium stroke
    thick: 2.5,          // Thick stroke for emphasis
  },
  
  // Size specifications
  sizes: {
    micro: 12,           // Micro icons
    small: 16,           // Small icons
    medium: 20,          // Standard icons
    large: 24,           // Large icons
    xl: 32,              // Extra large icons
    hero: 48,            // Hero icons
  },
  
  // Style specifications
  style: {
    lineCap: 'round' as const,     // Rounded endpoints (as specified)
    lineJoin: 'round' as const,    // Rounded joins
    fill: 'none' as const,         // No fill for line icons
  },
} as const;

/**
 * Shadow Styles
 * Lightweight, soft shadows for premium aesthetic
 */
export const shadows = {
  // Component shadows
  button: {
    primary: {
      shadowColor: '#AFC8A6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    secondary: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
  },
  
  // Card shadows (lightweight as specified)
  card: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    heavy: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
  },
  
  // Input shadows (soft inner shadow)
  input: {
    inner: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 2,
      elevation: 0, // Inner shadow simulation
    },
  },
  
  // Legacy shadows (for backward compatibility)
  low: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  high: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

/**
 * Animation Configuration
 * Gentle, calm animations with slow easing curves
 */
export const animations = {
  // Timing (slower for calm aesthetic)
  timing: {
    fast: 200,
    normal: 300,
    slow: 400,
    gentle: 500,         // Extra slow for very gentle transitions
  },
  
  // Easing curves (ease-out focused for gentle feel)
  easing: {
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',      // Gentle ease-out
    easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',          // Standard ease-in-out
    softEaseOut: 'cubic-bezier(0.16, 1, 0.3, 1)',         // Very soft ease-out
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',     // Subtle bounce
    
    // Legacy easing (for backward compatibility)
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  },
  
  // Interaction animations
  interactions: {
    // Button press (soft scaling)
    buttonPress: {
      scale: 0.96,
      duration: 150,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    
    // Opacity fades (gentle)
    fade: {
      duration: 300,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    
    // Card hover
    cardHover: {
      scale: 1.02,
      duration: 200,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
} as const;

/**
 * Component Specifications
 * Specific design rules for component types
 */
export const components = {
  // Button specifications
  button: {
    height: {
      small: 36,
      medium: 44,         // Minimum touch target
      large: 52,
    },
    minWidth: {
      small: 80,
      medium: 120,
      large: 160,
    },
  },
  
  // Navigation specifications
  navigation: {
    bottomBar: {
      height: 80,
      iconSize: 24,
      labelSize: 10,      // Micro-labels only
    },
    topBar: {
      height: 60,
      blur: true,         // Glass effect
      opacity: 0.95,
    },
  },
  
  // Input specifications
  input: {
    height: 48,           // Standard input height
    minHeight: 44,        // Minimum touch target
  },
  
  // Card specifications
  card: {
    minHeight: 120,
    aspectRatio: {
      square: 1,
      landscape: 16/9,
      portrait: 3/4,
    },
  },
} as const;

/**
 * Design Tokens
 * Complete aggregated export of all design tokens
 */
export const tokens = {
  colors,
  spacing,
  borderRadius,
  typography,
  icons,
  shadows,
  animations,
  components,
} as const;

export default tokens;

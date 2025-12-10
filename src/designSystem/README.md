# Premium Food App Design System

A complete UI design system following premium, minimalist aesthetic principles with calm technology approach.

## 🎨 Design Principles

### Core Aesthetic
- **Minimalist & Premium**: Clean, uncluttered interfaces with generous white space
- **Calm Technology**: Gentle animations, soft colors, no harsh interactions
- **Warm & Inviting**: Soft color palette inspired by nature and wellness apps
- **Apple-Inspired**: Following iOS design language with modern touches

### Visual Identity
- **Color Philosophy**: Warm, natural tones that feel premium yet approachable
- **Typography**: Clean, readable fonts with generous spacing
- **Spacing**: White space as a core aesthetic element (12-28px generous spacing)
- **Interactions**: Gentle, slow easing curves with soft feedback

## 🎯 Color System

### Primary Colors
```typescript
primary: {
  green: '#AFC8A6',      // Primary sage green for buttons and accents
  cream: '#FFFDF8',      // Accent cream for backgrounds  
  beige: '#F7F5F0',      // Warm beige for secondary backgrounds
  gray: '#D9D9D9',       // Soft gray for borders and dividers
}
```

### Text Colors
```typescript
text: {
  primary: '#4A4A4A',    // Text dark gray - primary text
  secondary: '#6B6B6B',  // Medium gray - secondary text
  tertiary: '#9B9B9B',   // Light gray - tertiary text
  placeholder: '#B8B8B8', // Warm gray for placeholders
  inverse: '#FFFFFF',    // White text for dark backgrounds
}
```

### Interactive Colors
```typescript
interactive: {
  primary: '#AFC8A6',    // Primary green for main actions
  primaryHover: '#9BB896', // Darker green for hover states
  primaryPressed: '#8BA886', // Even darker for pressed states
  secondary: 'transparent', // Transparent for secondary buttons
  secondaryBorder: '#D9D9D9', // Light gray border for secondary buttons
}
```

## 📐 Spacing System

### Base Spacing (12-28px range)
```typescript
spacing: {
  md: 12,     // Base spacing
  lg: 16,     // Standard spacing
  xl: 20,     // Medium spacing
  xxl: 24,    // Large spacing
  xxxl: 28,   // Extra large spacing
  
  // Generous spacing for sections
  section: 32,
  sectionLarge: 48,
  sectionXL: 64,
}
```

### Component-Specific Spacing
```typescript
buttonPadding: { horizontal: 24, vertical: 12 },
cardPadding: { small: 16, medium: 20, large: 24 },
inputPadding: { horizontal: 16, vertical: 14 },
```

## 🔘 Button System

### Primary Button
- **Style**: Sage green (#AFC8A6) pill-shaped
- **Shadow**: Soft shadow with sage green tint
- **Animation**: Gentle scale (0.96) on press
- **Text**: White text, medium weight

### Secondary Button  
- **Style**: Transparent background with light gray border
- **Border**: #D9D9D9 border color
- **Animation**: Same gentle scale animation
- **Text**: Dark gray text

### Icon Button
- **Style**: Circular, minimal design
- **Size**: Square dimensions (36px, 44px, 52px)
- **Background**: White surface with subtle shadow
- **Icon**: Thin-line icons (1.5-2px stroke)

### Ghost Button
- **Style**: Transparent background, no border
- **Use**: For subtle actions and navigation
- **Text**: Primary text color

## 📝 Input Fields

### Design Specifications
- **Border Radius**: 16px (as specified)
- **Height**: 48px standard, 44px minimum touch target
- **Padding**: 16px horizontal, 14px vertical
- **Border**: Light gray (#E0E0E0) default, sage green (#AFC8A6) focus
- **Shadow**: Soft inner shadow effect
- **Placeholder**: Warm gray (#B8B8B8) text

### States
- **Default**: Light border, white background
- **Focus**: Sage green border, subtle scale (1.02)
- **Error**: Soft red border and text
- **Disabled**: Gray background, disabled text

## 🃏 Card System

### Design Specifications
- **Border Radius**: 18-22px range based on size
  - Small cards: 18px
  - Medium cards: 20px  
  - Large cards: 22px
- **Background**: White with optional 4-8% tint
- **Shadow**: Lightweight, soft shadows
- **Padding**: Size-based (16px, 20px, 24px)

### Background Options
- **Surface**: Pure white (#FFFFFF)
- **Tinted**: White with 4% tint (rgba(255, 255, 255, 0.96))
- **Card**: White with 8% tint (rgba(255, 255, 255, 0.92))

### Elevation Levels
- **Light**: Subtle shadow (opacity: 0.04)
- **Medium**: Standard shadow (opacity: 0.06)
- **Heavy**: Prominent shadow (opacity: 0.08)

## 🎭 Icon System

### Design Specifications
- **Style**: Thin-line with rounded endpoints
- **Stroke Width**: 1.5-2px (consistent across all icons)
- **Line Caps**: Rounded endpoints and joins
- **Shapes**: Calm, friendly, recognizable forms

### Size Scale
```typescript
sizes: {
  micro: 12,    // Micro icons
  small: 16,    // Small icons  
  medium: 20,   // Standard icons
  large: 24,    // Large icons
  xl: 32,       // Extra large icons
  hero: 48,     // Hero icons
}
```

## 🎬 Animation System

### Timing Philosophy
- **Gentle**: Slower animations for calm feel
- **Ease-Out**: Focused on gentle deceleration
- **No Harsh Pops**: Avoid abrupt or jarring animations

### Timing Scale
```typescript
timing: {
  fast: 200,    // Quick interactions
  normal: 300,  // Standard transitions
  slow: 400,    // Gentle transitions
  gentle: 500,  // Extra slow for calm feel
}
```

### Easing Curves
```typescript
easing: {
  easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',      // Gentle ease-out
  softEaseOut: 'cubic-bezier(0.16, 1, 0.3, 1)',         // Very soft ease-out
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',     // Subtle bounce
}
```

### Interaction Animations
- **Button Press**: Scale to 0.96, 150ms duration
- **Card Hover**: Scale to 1.02, 200ms duration  
- **Opacity Fades**: 300ms gentle fade
- **Focus States**: Gentle scale and color transitions

## 🧭 Navigation System

### Bottom Navigation
- **Height**: 80px
- **Icons**: 24px thin-line icons
- **Labels**: Micro-labels only (10px) or no labels for minimal design
- **Background**: Clean white surface

### Top Navigation
- **Height**: 60px
- **Effect**: Translucent glass effect (95% opacity)
- **Blur**: Background blur for glassmorphism
- **Style**: Minimal, clean design

## 📏 Component Specifications

### Minimum Touch Targets
- **Buttons**: 44px minimum (iOS guideline)
- **Interactive Elements**: 44x44px minimum area
- **Icon Buttons**: Square dimensions for easy tapping

### Responsive Behavior
- **Generous Spacing**: Maintain 12-28px spacing at all sizes
- **Proportional Scaling**: Typography scales with screen size
- **Flexible Layouts**: Adapt gracefully to different screen sizes

## 🎨 Usage Guidelines

### Do's
✅ Use generous white space between elements  
✅ Apply gentle, slow animations with ease-out curves  
✅ Maintain consistent 1.5-2px stroke width for icons  
✅ Use the sage green sparingly for primary actions  
✅ Keep interactions soft and calm  
✅ Follow the 18-22px border radius range for cards  

### Don'ts
❌ Use harsh colors or high contrast combinations  
❌ Create tight, cramped layouts  
❌ Use fast, jarring animations  
❌ Mix different icon styles or stroke widths  
❌ Overuse the primary green color  
❌ Create abrupt state changes  

## 🔧 Implementation

### Using Design Tokens
```typescript
import { colors, spacing, borderRadius, typography, shadows, animations } from '../designSystem/tokens';

// Example usage
const buttonStyle = {
  backgroundColor: colors.interactive.primary,
  borderRadius: borderRadius.button.pill,
  padding: spacing.buttonPadding.horizontal,
  ...shadows.button.primary,
};
```

### Component Examples
```typescript
// Primary Button
<Button variant="primary" size="medium">
  Continue
</Button>

// Secondary Button with Icon
<Button variant="secondary" icon="heart">
  Save to Favorites
</Button>

// Icon Button
<Button variant="icon" icon="search" size="medium" />

// Input Field
<Input 
  placeholder="Search restaurants..."
  showClearButton={true}
/>

// Card with Tinted Background
<Card 
  elevation="medium" 
  background="tinted" 
  size="large"
>
  <RestaurantInfo />
</Card>
```

This design system ensures consistency, accessibility, and a premium user experience across the entire food discovery application.
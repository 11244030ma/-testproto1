/**
 * Color Utilities
 * 
 * Utilities for color manipulation and accessibility checks
 */

/**
 * Calculate relative luminance of a color
 * Used for WCAG contrast ratio calculations
 */
export const getRelativeLuminance = (hex: string): number => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Apply gamma correction
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate relative luminance
  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
};

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast ratio meets WCAG AA standards
 * @param textColor - Hex color of text
 * @param backgroundColor - Hex color of background
 * @param isLargeText - Whether text is large (≥18pt or ≥14pt bold)
 * @returns true if contrast meets WCAG AA standards
 */
export const meetsWCAGAA = (
  textColor: string,
  backgroundColor: string,
  isLargeText: boolean = false
): boolean => {
  const ratio = getContrastRatio(textColor, backgroundColor);
  const minimumRatio = isLargeText ? 3 : 4.5;
  return ratio >= minimumRatio;
};

/**
 * Check if contrast ratio meets WCAG AAA standards
 * @param textColor - Hex color of text
 * @param backgroundColor - Hex color of background
 * @param isLargeText - Whether text is large (≥18pt or ≥14pt bold)
 * @returns true if contrast meets WCAG AAA standards
 */
export const meetsWCAGAAA = (
  textColor: string,
  backgroundColor: string,
  isLargeText: boolean = false
): boolean => {
  const ratio = getContrastRatio(textColor, backgroundColor);
  const minimumRatio = isLargeText ? 4.5 : 7;
  return ratio >= minimumRatio;
};

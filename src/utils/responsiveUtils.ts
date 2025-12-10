/**
 * Responsive Utilities
 * 
 * Utilities for responsive scaling and layout
 */

import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 as reference)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Scale a value based on screen width
 * Useful for responsive spacing and sizing
 */
export const scaleWidth = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Scale a value based on screen height
 * Useful for vertical spacing
 */
export const scaleHeight = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Scale font size based on screen width
 * Ensures text remains readable across different screen sizes
 * @param size - Base font size
 * @param minSize - Minimum font size (default: 12)
 * @param maxSize - Maximum font size (optional)
 */
export const scaleFontSize = (
  size: number,
  minSize: number = 12,
  maxSize?: number
): number => {
  const scaled = size * PixelRatio.getFontScale();
  const constrained = Math.max(minSize, scaled);
  return maxSize ? Math.min(maxSize, constrained) : constrained;
};

/**
 * Get current screen dimensions
 */
export const getScreenDimensions = () => {
  return Dimensions.get('window');
};

/**
 * Check if device is in landscape orientation
 */
export const isLandscape = (): boolean => {
  const { width, height } = Dimensions.get('window');
  return width > height;
};

/**
 * Check if device is in portrait orientation
 */
export const isPortrait = (): boolean => {
  return !isLandscape();
};

/**
 * Get responsive value based on screen width breakpoints
 * @param small - Value for small screens (< 375px)
 * @param medium - Value for medium screens (375-414px)
 * @param large - Value for large screens (> 414px)
 */
export const getResponsiveValue = <T>(
  small: T,
  medium: T,
  large: T
): T => {
  const { width } = Dimensions.get('window');
  
  if (width < 375) {
    return small;
  } else if (width <= 414) {
    return medium;
  } else {
    return large;
  }
};

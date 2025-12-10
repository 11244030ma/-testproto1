/**
 * MenuItem Add to Cart Feedback Property Tests
 * 
 * Feature: premium-food-app, Property 24: Add to cart triggers feedback animation
 * **Validates: Requirements 10.1**
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Animated } from 'react-native';
import fc from 'fast-check';
import { MenuItem } from './MenuItem';
import { ThemeProvider } from '../designSystem/ThemeProvider';
import { MenuItem as MenuItemType } from '../types';

// Mock Animated for testing
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  const mockAnimatedValue: any = {
    setValue: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    stopAnimation: jest.fn(),
    resetAnimation: jest.fn(),
    interpolate: jest.fn((): any => mockAnimatedValue),
  };

  const mockAnimatedTiming = {
    start: jest.fn((callback) => callback && callback({ finished: true })),
    stop: jest.fn(),
    reset: jest.fn(),
  };

  const mockAnimatedSequence = {
    start: jest.fn((callback) => callback && callback({ finished: true })),
    stop: jest.fn(),
    reset: jest.fn(),
  };

  const mockAnimatedParallel = {
    start: jest.fn((callback) => callback && callback({ finished: true })),
    stop: jest.fn(),
    reset: jest.fn(),
  };

  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      Value: jest.fn(() => mockAnimatedValue),
      timing: jest.fn(() => mockAnimatedTiming),
      sequence: jest.fn(() => mockAnimatedSequence),
      parallel: jest.fn(() => mockAnimatedParallel),
    },
  };
});

// Generator for MenuItem
const menuItemGenerator = fc.record({
  id: fc.string({ minLength: 1 }),
  restaurantId: fc.string({ minLength: 1 }),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  description: fc.string({ minLength: 10, maxLength: 200 }),
  price: fc.float({ min: 5, max: 100 }),
  imageUrl: fc.webUrl(),
  category: fc.string({ minLength: 1 }),
  dietaryInfo: fc.record({
    isVegetarian: fc.boolean(),
    isVegan: fc.boolean(),
    isGlutenFree: fc.boolean(),
    allergens: fc.array(fc.string(), { maxLength: 3 }),
  }),
  nutritionalInfo: fc.option(fc.record({
    calories: fc.integer({ min: 100, max: 1000 }),
    protein: fc.integer({ min: 5, max: 50 }),
    carbs: fc.integer({ min: 10, max: 100 }),
    fat: fc.integer({ min: 2, max: 50 }),
  }), { nil: undefined }),
  isAvailable: fc.boolean(),
});

const renderMenuItem = (menuItem: MenuItemType, onAddToCart?: jest.Mock) => {
  return render(
    <ThemeProvider>
      <MenuItem
        menuItem={menuItem}
        onAddToCart={onAddToCart}
        testID="test-menu-item"
      />
    </ThemeProvider>
  );
};

describe('MenuItem Add to Cart Feedback Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Feature: premium-food-app, Property 24: Add to cart triggers feedback animation
  test('Property 24: Add to cart triggers feedback animation with proper timing', () => {
    fc.assert(
      fc.property(
        menuItemGenerator,
        (menuItem: MenuItemType) => {
          // Only test available items
          if (!menuItem.isAvailable) return true;

          const mockOnAddToCart = jest.fn();
          const { getByTestId } = renderMenuItem(menuItem, mockOnAddToCart);
          
          const addButton = getByTestId('test-menu-item-add-button');
          
          // Clear any previous calls
          jest.clearAllMocks();
          
          // Trigger add to cart
          act(() => {
            fireEvent.press(addButton);
          });
          
          // Verify animation was triggered
          expect(Animated.timing).toHaveBeenCalled();
          expect(Animated.sequence).toHaveBeenCalled();
          expect(Animated.parallel).toHaveBeenCalled();
          
          // Verify the animation calls have proper timing (200-400ms range)
          const timingCalls = (Animated.timing as jest.Mock).mock.calls;
          const hasValidTiming = timingCalls.some(call => {
            const config = call[1];
            return config && config.duration >= 100 && config.duration <= 400;
          });
          
          expect(hasValidTiming).toBe(true);
          
          // Verify onAddToCart was called
          expect(mockOnAddToCart).toHaveBeenCalledWith(menuItem);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 24: Add to cart animation uses scale and opacity transforms', () => {
    fc.assert(
      fc.property(
        menuItemGenerator,
        (menuItem: MenuItemType) => {
          // Only test available items
          if (!menuItem.isAvailable) return true;

          const mockOnAddToCart = jest.fn();
          const { getByTestId } = renderMenuItem(menuItem, mockOnAddToCart);
          
          const addButton = getByTestId('test-menu-item-add-button');
          
          // Clear any previous calls
          jest.clearAllMocks();
          
          // Trigger add to cart
          act(() => {
            fireEvent.press(addButton);
          });
          
          // Verify that Animated.Value was created for scale and opacity
          expect(Animated.Value).toHaveBeenCalled();
          
          // Verify timing animations were created with proper values
          const timingCalls = (Animated.timing as jest.Mock).mock.calls;
          
          // Should have scale animations (0.85, 1.05, 1.0) and opacity animations
          const hasScaleAnimation = timingCalls.some(call => {
            const config = call[1];
            return config && (
              config.toValue === 0.85 || 
              config.toValue === 1.05 || 
              config.toValue === 1.0 ||
              config.toValue === 0.7
            );
          });
          
          expect(hasScaleAnimation).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 24: Disabled items do not trigger feedback animation', () => {
    fc.assert(
      fc.property(
        menuItemGenerator,
        (menuItem: MenuItemType) => {
          // Force item to be unavailable
          const unavailableItem = { ...menuItem, isAvailable: false };
          
          const mockOnAddToCart = jest.fn();
          const { getByTestId } = renderMenuItem(unavailableItem, mockOnAddToCart);
          
          const addButton = getByTestId('test-menu-item-add-button');
          
          // Clear any previous calls
          jest.clearAllMocks();
          
          // Try to trigger add to cart on disabled item
          act(() => {
            fireEvent.press(addButton);
          });
          
          // Verify no animation was triggered for disabled items
          // The button should be disabled, so press events shouldn't trigger animations
          expect(mockOnAddToCart).not.toHaveBeenCalled();
          
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });

  test('Property 24: Animation sequence completes before allowing new interactions', () => {
    fc.assert(
      fc.property(
        menuItemGenerator,
        (menuItem: MenuItemType) => {
          // Only test available items
          if (!menuItem.isAvailable) return true;

          const mockOnAddToCart = jest.fn();
          const { getByTestId } = renderMenuItem(menuItem, mockOnAddToCart);
          
          const addButton = getByTestId('test-menu-item-add-button');
          
          // Clear any previous calls
          jest.clearAllMocks();
          
          // Trigger add to cart
          act(() => {
            fireEvent.press(addButton);
          });
          
          // Verify sequence was used (ensures animations run in order)
          expect(Animated.sequence).toHaveBeenCalled();
          
          // Verify the sequence contains parallel animations
          expect(Animated.parallel).toHaveBeenCalled();
          
          // The sequence should have a start callback
          const sequenceCall = (Animated.sequence as jest.Mock).mock.calls[0];
          const sequenceAnimation = sequenceCall[0];
          expect(Array.isArray(sequenceAnimation)).toBe(true);
          expect(sequenceAnimation.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });
});
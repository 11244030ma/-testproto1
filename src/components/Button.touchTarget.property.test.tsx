/**
 * Property-Based Tests for Button Touch Targets
 * 
 * Feature: premium-food-app, Property 13: Touch targets meet minimum size requirements
 * Validates: Requirements 5.2
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import * as fc from 'fast-check';
import { Button } from './Button';

describe('Button Touch Target Property-Based Tests', () => {
  describe('Property 13: Touch targets meet minimum size requirements', () => {
    it('should have minimum 44x44 touch target for all variants and sizes', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('primary', 'secondary', 'ghost'),
          fc.constantFrom('small', 'medium', 'large'),
          fc.boolean(),
          (variant, size, disabled) => {
            const { getByRole } = render(
              <Button 
                variant={variant as any} 
                size={size as any}
                disabled={disabled}
              >
                Test Button
              </Button>
            );
            
            const button = getByRole('button');
            const style = button.props.style;
            
            // Should have minimum 44x44 touch target
            expect(style.minWidth).toBeGreaterThanOrEqual(44);
            expect(style.minHeight).toBeGreaterThanOrEqual(44);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have effective touch target at least 44px through minHeight/minWidth', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('small', 'medium', 'large'),
          (size) => {
            const { getByRole } = render(
              <Button size={size as any}>Test Button</Button>
            );
            
            const button = getByRole('button');
            const style = button.props.style;
            
            // Effective touch target should be at least 44px through min dimensions
            expect(style.minHeight).toBeGreaterThanOrEqual(44);
            expect(style.minWidth).toBeGreaterThanOrEqual(44);
            
            // The actual height might be smaller for visual design, but minHeight ensures accessibility
            expect(style.height).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain touch target size regardless of content length', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.constantFrom('small', 'medium', 'large'),
          (content, size) => {
            const { getByRole } = render(
              <Button size={size as any}>{content}</Button>
            );
            
            const button = getByRole('button');
            const style = button.props.style;
            
            // Minimum touch target should always be maintained
            expect(style.minWidth).toBe(44);
            expect(style.minHeight).toBe(44);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have touch targets that scale appropriately with size', () => {
      const sizes = ['small', 'medium', 'large'] as const;
      const expectedHeights = { small: 40, medium: 48, large: 56 };
      
      fc.assert(
        fc.property(
          fc.constantFrom(...sizes),
          (size) => {
            const { getByRole } = render(
              <Button size={size}>Test Button</Button>
            );
            
            const button = getByRole('button');
            const style = button.props.style;
            
            // Height should match expected size
            expect(style.height).toBe(expectedHeights[size]);
            
            // But minimum touch target should always be enforced
            expect(style.minHeight).toBe(44);
            
            // For small buttons, minHeight (44) is larger than height (40)
            // This ensures the touch target is still accessible
            if (size === 'small') {
              expect(style.minHeight).toBeGreaterThan(style.height);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have consistent touch target properties across all interactive states', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('primary', 'secondary', 'ghost'),
          fc.boolean(),
          (variant, disabled) => {
            const { getByRole } = render(
              <Button variant={variant as any} disabled={disabled}>
                Interactive Button
              </Button>
            );
            
            const button = getByRole('button');
            const style = button.props.style;
            
            // Touch target requirements should be consistent regardless of state
            expect(style.minWidth).toBe(44);
            expect(style.minHeight).toBe(44);
            
            // Should be touchable (not disabled from a touch perspective)
            expect(button.props.accessibilityRole).toBe('button');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
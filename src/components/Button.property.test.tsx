/**
 * Property-Based Tests for Button Component
 * 
 * Feature: premium-food-app, Property 2: Interactive elements have appropriate border radius
 * Validates: Requirements 1.2
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import * as fc from 'fast-check';
import { Button } from './Button';
import { borderRadius } from '../designSystem/tokens';

describe('Button Property-Based Tests', () => {
  describe('Property 2: Interactive elements have appropriate border radius', () => {
    it('should have border radius within design system range (12-22px)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('primary', 'secondary', 'ghost'),
          fc.constantFrom('small', 'medium', 'large'),
          (variant, size) => {
            const { getByRole } = render(
              <Button variant={variant as any} size={size as any}>
                Test Button
              </Button>
            );
            
            const button = getByRole('button');
            const buttonRadius = button.props.style.borderRadius;
            
            // Should be within the design system range
            expect(buttonRadius).toBeGreaterThanOrEqual(12);
            expect(buttonRadius).toBeLessThanOrEqual(22);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use design system border radius tokens', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('primary', 'secondary', 'ghost'),
          fc.constantFrom('small', 'medium', 'large'),
          (variant, size) => {
            const { getByRole } = render(
              <Button variant={variant as any} size={size as any}>
                Test Button
              </Button>
            );
            
            const button = getByRole('button');
            const buttonRadius = button.props.style.borderRadius;
            
            // Should match one of the defined border radius values
            const validRadii = Object.values(borderRadius);
            expect(validRadii).toContain(buttonRadius);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have consistent border radius across all variants and sizes', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('primary', 'secondary', 'ghost'),
          fc.constantFrom('small', 'medium', 'large'),
          (variant, size) => {
            const { getByRole } = render(
              <Button variant={variant as any} size={size as any}>
                Test Button
              </Button>
            );
            
            const button = getByRole('button');
            const buttonRadius = button.props.style.borderRadius;
            
            // All buttons should use the same border radius (medium)
            expect(buttonRadius).toBe(borderRadius.medium);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain border radius consistency in disabled state', () => {
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
            const buttonRadius = button.props.style.borderRadius;
            
            // Border radius should be consistent regardless of disabled state
            expect(buttonRadius).toBe(borderRadius.medium);
            expect(buttonRadius).toBeGreaterThanOrEqual(12);
            expect(buttonRadius).toBeLessThanOrEqual(22);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have rounded corners that match design system values', () => {
      const expectedRadius = borderRadius.medium;
      
      fc.assert(
        fc.property(
          fc.constantFrom('primary', 'secondary', 'ghost'),
          (variant) => {
            const { getByRole } = render(
              <Button variant={variant as any}>Test Button</Button>
            );
            
            const button = getByRole('button');
            expect(button.props.style.borderRadius).toBe(expectedRadius);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
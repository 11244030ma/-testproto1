/**
 * Property-Based Tests for Text Component
 * 
 * Feature: premium-food-app, Property 5: All text uses approved typography tokens
 * Validates: Requirements 2.1, 2.2, 2.5
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import * as fc from 'fast-check';
import { Text } from './Text';
import { typography } from '../designSystem/tokens';

// Helper to extract style from component
const getStyle = (component: any) => {
  const style = component.props.style;
  return Array.isArray(style) ? style[0] : style;
};

describe('Text Component Property-Based Tests', () => {
  describe('Property 5: All text uses approved typography tokens', () => {
    it('should use approved font families for all variants', () => {
      const approvedFonts = [
        typography.fontFamily.heading,
        typography.fontFamily.body,
        typography.fontFamily.fallback,
      ];

      fc.assert(
        fc.property(
          fc.constantFrom('heading1', 'heading2', 'heading3', 'subheading', 'body', 'caption'),
          (variant) => {
            const { getByTestId } = render(
              <Text variant={variant as any} testID="text">Test</Text>
            );
            
            const style = getStyle(getByTestId('text'));
            expect(approvedFonts).toContain(style.fontFamily);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use heading font family for heading variants', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('heading1', 'heading2', 'heading3'),
          (variant) => {
            const { getByTestId } = render(
              <Text variant={variant as any} testID="text">Test</Text>
            );
            
            const style = getStyle(getByTestId('text'));
            expect(style.fontFamily).toBe(typography.fontFamily.heading);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use body font family for body variants', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('subheading', 'body', 'caption'),
          (variant) => {
            const { getByTestId } = render(
              <Text variant={variant as any} testID="text">Test</Text>
            );
            
            const style = getStyle(getByTestId('text'));
            expect(style.fontFamily).toBe(typography.fontFamily.body);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use font sizes from typography tokens', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('heading1', 'heading2', 'heading3', 'subheading', 'body', 'caption'),
          (variant) => {
            const { getByTestId } = render(
              <Text variant={variant as any} testID="text">Test</Text>
            );
            
            const style = getStyle(getByTestId('text'));
            expect(style.fontSize).toBe(typography.fontSize[variant as keyof typeof typography.fontSize]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use font weights from typography tokens', () => {
      const validWeights = Object.keys(typography.fontWeight) as Array<keyof typeof typography.fontWeight>;
      
      fc.assert(
        fc.property(
          fc.constantFrom(...validWeights),
          (weight) => {
            const { getByTestId } = render(
              <Text weight={weight} testID="text">Test</Text>
            );
            
            const style = getStyle(getByTestId('text'));
            expect(style.fontWeight).toBe(typography.fontWeight[weight]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have font sizes in ascending order', () => {
      const sizeOrder = [
        typography.fontSize.caption,
        typography.fontSize.body,
        typography.fontSize.subheading,
        typography.fontSize.heading3,
        typography.fontSize.heading2,
        typography.fontSize.heading1,
      ];

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: sizeOrder.length - 2 }),
          (index) => {
            expect(sizeOrder[index]).toBeLessThan(sizeOrder[index + 1]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have consistent font weight values as CSS strings', () => {
      const validCSSWeights = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.values(typography.fontWeight)),
          (weight) => {
            expect(validCSSWeights).toContain(weight);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain consistent line height ratios', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('heading1', 'heading2', 'heading3', 'subheading', 'body', 'caption'),
          (variant) => {
            const { getByTestId } = render(
              <Text variant={variant as any} testID="text">Test</Text>
            );
            
            const style = getStyle(getByTestId('text'));
            const fontSize = typography.fontSize[variant as keyof typeof typography.fontSize];
            const lineHeightRatio = style.lineHeight / fontSize;
            
            // Line height should be reasonable (between 1.0 and 2.0)
            expect(lineHeightRatio).toBeGreaterThanOrEqual(1.0);
            expect(lineHeightRatio).toBeLessThanOrEqual(2.0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use approved typography token structure', () => {
      const requiredTokens = ['fontFamily', 'fontSize', 'lineHeight', 'fontWeight'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...requiredTokens),
          (tokenCategory) => {
            expect(typography).toHaveProperty(tokenCategory);
            expect(typeof typography[tokenCategory as keyof typeof typography]).toBe('object');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
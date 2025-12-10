/**
 * Property-Based Tests for Text Line Spacing
 * 
 * Feature: premium-food-app, Property 6: Body text has generous line spacing
 * Validates: Requirements 2.3
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

describe('Text Line Spacing Property-Based Tests', () => {
  describe('Property 6: Body text has generous line spacing', () => {
    it('should have body text with minimum 1.5 line height ratio', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('body', 'caption'), // Body text variants
          (variant) => {
            const { getByTestId } = render(
              <Text variant={variant as any} testID="text">
                Body text with multiple lines that should have generous line spacing
                for better readability and reduced eye strain.
              </Text>
            );
            
            const style = getStyle(getByTestId('text'));
            const fontSize = typography.fontSize[variant as keyof typeof typography.fontSize];
            const lineHeightRatio = style.lineHeight / fontSize;
            
            // Body text should have at least 1.5 line height ratio
            expect(lineHeightRatio).toBeGreaterThanOrEqual(1.5);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use normal line height token for body text', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('body', 'caption'),
          (variant) => {
            const { getByTestId } = render(
              <Text variant={variant as any} testID="text">Test content</Text>
            );
            
            const style = getStyle(getByTestId('text'));
            const fontSize = typography.fontSize[variant as keyof typeof typography.fontSize];
            const expectedLineHeight = fontSize * typography.lineHeight.normal;
            
            expect(style.lineHeight).toBe(expectedLineHeight);
            expect(typography.lineHeight.normal).toBeGreaterThanOrEqual(1.5);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have line height values in ascending order', () => {
      const lineHeights = [
        typography.lineHeight.tight,
        typography.lineHeight.normal,
        typography.lineHeight.relaxed,
      ];

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: lineHeights.length - 2 }),
          (index) => {
            expect(lineHeights[index]).toBeLessThan(lineHeights[index + 1]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have different line heights for headings vs body text', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('heading1', 'heading2', 'heading3'),
          fc.constantFrom('body', 'caption'),
          (headingVariant, bodyVariant) => {
            const { getByTestId: getHeading } = render(
              <Text variant={headingVariant as any} testID="heading">Heading</Text>
            );
            const { getByTestId: getBody } = render(
              <Text variant={bodyVariant as any} testID="body">Body</Text>
            );
            
            const headingStyle = getStyle(getHeading('heading'));
            const bodyStyle = getStyle(getBody('body'));
            
            const headingFontSize = typography.fontSize[headingVariant as keyof typeof typography.fontSize];
            const bodyFontSize = typography.fontSize[bodyVariant as keyof typeof typography.fontSize];
            
            const headingRatio = headingStyle.lineHeight / headingFontSize;
            const bodyRatio = bodyStyle.lineHeight / bodyFontSize;
            
            // Body text should have more generous line spacing than headings
            expect(bodyRatio).toBeGreaterThan(headingRatio);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain consistent line height calculation across variants', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('heading1', 'heading2', 'heading3', 'subheading', 'body', 'caption'),
          (variant) => {
            const { getByTestId } = render(
              <Text variant={variant as any} testID="text">Test</Text>
            );
            
            const style = getStyle(getByTestId('text'));
            const fontSize = typography.fontSize[variant as keyof typeof typography.fontSize];
            
            // Line height should be calculated as fontSize * lineHeightMultiplier
            const isBodyText = variant === 'body' || variant === 'caption';
            const expectedMultiplier = isBodyText 
              ? typography.lineHeight.normal 
              : typography.lineHeight.tight;
            const expectedLineHeight = fontSize * expectedMultiplier;
            
            expect(style.lineHeight).toBe(expectedLineHeight);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have reasonable line height bounds for all text', () => {
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
            
            // Line height should be reasonable (not too tight, not too loose)
            expect(lineHeightRatio).toBeGreaterThanOrEqual(1.0);
            expect(lineHeightRatio).toBeLessThanOrEqual(2.0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
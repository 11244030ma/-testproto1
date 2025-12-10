/**
 * Property-Based Tests for Card Shadows
 * 
 * Feature: premium-food-app, Property 3: Elevated components have subtle shadows
 * Validates: Requirements 1.3
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import * as fc from 'fast-check';
import { Card } from './Card';
import { shadows } from '../designSystem/tokens';

// Helper to extract style from component
const getStyle = (component: any) => {
  const style = component.props.style;
  return Array.isArray(style) ? style[0] : style;
};

describe('Card Shadow Property-Based Tests', () => {
  describe('Property 3: Elevated components have subtle shadows', () => {
    it('should have shadow opacity between 0.05 and 0.12 for all elevation levels', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('low', 'medium', 'high'),
          (elevation) => {
            const { getByTestId } = render(
              <Card elevation={elevation as any} testID="card">
                <Text>Content</Text>
              </Card>
            );
            
            const style = getStyle(getByTestId('card'));
            
            // Shadow opacity should be subtle (between 0.05 and 0.12)
            expect(style.shadowOpacity).toBeGreaterThanOrEqual(0.05);
            expect(style.shadowOpacity).toBeLessThanOrEqual(0.12);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use design system shadow configurations', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('low', 'medium', 'high'),
          (elevation) => {
            const { getByTestId } = render(
              <Card elevation={elevation as any} testID="card">
                <Text>Content</Text>
              </Card>
            );
            
            const style = getStyle(getByTestId('card'));
            const expectedShadow = shadows[elevation as keyof typeof shadows];
            
            // Should match design system shadow configuration exactly
            expect(style.shadowColor).toBe(expectedShadow.shadowColor);
            expect(style.shadowOffset).toEqual(expectedShadow.shadowOffset);
            expect(style.shadowOpacity).toBe(expectedShadow.shadowOpacity);
            expect(style.shadowRadius).toBe(expectedShadow.shadowRadius);
            expect(style.elevation).toBe(expectedShadow.elevation);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have black shadow color for all elevation levels', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('low', 'medium', 'high'),
          (elevation) => {
            const { getByTestId } = render(
              <Card elevation={elevation as any} testID="card">
                <Text>Content</Text>
              </Card>
            );
            
            const style = getStyle(getByTestId('card'));
            
            // All shadows should use black color
            expect(style.shadowColor).toBe('#000');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have progressive shadow intensity across elevation levels', () => {
      const elevations = ['low', 'medium', 'high'] as const;
      
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: elevations.length - 2 }),
          (index) => {
            const lowerElevation = elevations[index];
            const higherElevation = elevations[index + 1];
            
            const { getByTestId: getLower } = render(
              <Card elevation={lowerElevation} testID="lower">
                <Text>Content</Text>
              </Card>
            );
            const { getByTestId: getHigher } = render(
              <Card elevation={higherElevation} testID="higher">
                <Text>Content</Text>
              </Card>
            );
            
            const lowerStyle = getStyle(getLower('lower'));
            const higherStyle = getStyle(getHigher('higher'));
            
            // Higher elevation should have more intense shadows
            expect(higherStyle.shadowOpacity).toBeGreaterThan(lowerStyle.shadowOpacity);
            expect(higherStyle.shadowRadius).toBeGreaterThan(lowerStyle.shadowRadius);
            expect(higherStyle.elevation).toBeGreaterThan(lowerStyle.elevation);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain shadow consistency regardless of other props', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('low', 'medium', 'high'),
          fc.constantFrom('xs', 'sm', 'md', 'lg', 'xl'),
          fc.boolean(),
          (elevation, padding, hasPress) => {
            const onPress = hasPress ? () => {} : undefined;
            
            const { getByTestId } = render(
              <Card 
                elevation={elevation as any} 
                padding={padding as any}
                onPress={onPress}
                testID="card"
              >
                <Text>Content</Text>
              </Card>
            );
            
            const element = hasPress ? getByTestId('card').parent : getByTestId('card');
            const style = getStyle(element);
            const expectedShadow = shadows[elevation as keyof typeof shadows];
            
            // Shadow should be consistent regardless of other props
            expect(style.shadowOpacity).toBe(expectedShadow.shadowOpacity);
            expect(style.shadowRadius).toBe(expectedShadow.shadowRadius);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have reasonable shadow offset values', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('low', 'medium', 'high'),
          (elevation) => {
            const { getByTestId } = render(
              <Card elevation={elevation as any} testID="card">
                <Text>Content</Text>
              </Card>
            );
            
            const style = getStyle(getByTestId('card'));
            
            // Shadow offset should be reasonable (not too extreme)
            expect(style.shadowOffset.width).toBeGreaterThanOrEqual(-10);
            expect(style.shadowOffset.width).toBeLessThanOrEqual(10);
            expect(style.shadowOffset.height).toBeGreaterThanOrEqual(0);
            expect(style.shadowOffset.height).toBeLessThanOrEqual(20);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have shadow radius that correlates with elevation', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('low', 'medium', 'high'),
          (elevation) => {
            const { getByTestId } = render(
              <Card elevation={elevation as any} testID="card">
                <Text>Content</Text>
              </Card>
            );
            
            const style = getStyle(getByTestId('card'));
            
            // Shadow radius should be positive and reasonable
            expect(style.shadowRadius).toBeGreaterThan(0);
            expect(style.shadowRadius).toBeLessThanOrEqual(20);
            
            // Should match expected values for each elevation
            const expectedRadius = {
              low: 4,
              medium: 8,
              high: 16,
            };
            expect(style.shadowRadius).toBe(expectedRadius[elevation as keyof typeof expectedRadius]);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
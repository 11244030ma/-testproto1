/**
 * Text Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from './Text';
import { typography, colors } from '../designSystem/tokens';

// Helper to extract style from component
const getStyle = (component: any) => {
  const style = component.props.style;
  return Array.isArray(style) ? style[0] : style;
};

describe('Text Component', () => {
  it('should render children', () => {
    const { getByText } = render(
      <Text>Hello World</Text>
    );
    
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('should apply default body variant', () => {
    const { getByTestId } = render(
      <Text testID="text">Content</Text>
    );
    
    const style = getStyle(getByTestId('text'));
    expect(style).toMatchObject({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily.body,
      color: colors.text.primary,
    });
  });

  it('should apply heading variants with correct font family', () => {
    const { getByTestId } = render(
      <Text variant="heading1" testID="text">Heading</Text>
    );
    
    const style = getStyle(getByTestId('text'));
    expect(style).toMatchObject({
      fontSize: typography.fontSize.heading1,
      fontFamily: typography.fontFamily.heading,
    });
  });

  it('should apply body variants with correct font family', () => {
    const { getByTestId } = render(
      <Text variant="body" testID="text">Body text</Text>
    );
    
    const style = getStyle(getByTestId('text'));
    expect(style).toMatchObject({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily.body,
    });
  });

  it('should apply font weights', () => {
    const { getByTestId } = render(
      <Text weight="bold" testID="text">Bold text</Text>
    );
    
    const style = getStyle(getByTestId('text'));
    expect(style).toMatchObject({
      fontWeight: typography.fontWeight.bold,
    });
  });

  it('should apply custom colors', () => {
    const { getByTestId } = render(
      <Text color={colors.text.secondary} testID="text">Secondary text</Text>
    );
    
    const style = getStyle(getByTestId('text'));
    expect(style).toMatchObject({
      color: colors.text.secondary,
    });
  });

  it('should apply text alignment', () => {
    const { getByTestId } = render(
      <Text align="center" testID="text">Centered text</Text>
    );
    
    const style = getStyle(getByTestId('text'));
    expect(style).toMatchObject({
      textAlign: 'center',
    });
  });

  it('should apply generous line height for body text', () => {
    const { getByTestId } = render(
      <Text variant="body" testID="text">Body text with line height</Text>
    );
    
    const style = getStyle(getByTestId('text'));
    const expectedLineHeight = typography.fontSize.body * typography.lineHeight.normal;
    expect(style.lineHeight).toBe(expectedLineHeight);
    expect(style.lineHeight).toBeGreaterThanOrEqual(typography.fontSize.body * 1.5);
  });

  it('should apply tight line height for headings', () => {
    const { getByTestId } = render(
      <Text variant="heading1" testID="text">Heading text</Text>
    );
    
    const style = getStyle(getByTestId('text'));
    const expectedLineHeight = typography.fontSize.heading1 * typography.lineHeight.tight;
    expect(style.lineHeight).toBe(expectedLineHeight);
  });

  it('should merge custom style prop', () => {
    const { getByTestId } = render(
      <Text style={{ opacity: 0.8 }} testID="text">Styled text</Text>
    );
    
    const component = getByTestId('text');
    const styles = component.props.style;
    expect(styles[1]).toMatchObject({ opacity: 0.8 });
  });

  it('should pass through React Native Text props', () => {
    const { getByTestId } = render(
      <Text numberOfLines={2} ellipsizeMode="tail" testID="text">
        Long text that should be truncated
      </Text>
    );
    
    const component = getByTestId('text');
    expect(component.props.numberOfLines).toBe(2);
    expect(component.props.ellipsizeMode).toBe('tail');
  });

  it('should apply all typography variants correctly', () => {
    const variants: Array<keyof typeof typography.fontSize> = [
      'heading1', 'heading2', 'heading3', 'subheading', 'body', 'caption'
    ];
    
    variants.forEach(variant => {
      const { getByTestId } = render(
        <Text variant={variant} testID={`text-${variant}`}>
          {variant} text
        </Text>
      );
      
      const style = getStyle(getByTestId(`text-${variant}`));
      expect(style.fontSize).toBe(typography.fontSize[variant]);
    });
  });
});
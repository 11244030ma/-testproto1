/**
 * Card Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from './Card';
import { colors, borderRadius, shadows, spacing } from '../designSystem/tokens';

// Helper to extract style from component
const getStyle = (component: any) => {
  const style = component.props.style;
  return Array.isArray(style) ? style[0] : style;
};

describe('Card Component', () => {
  it('should render children', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('should apply default styling', () => {
    const { getByTestId } = render(
      <Card testID="card">
        <Text>Content</Text>
      </Card>
    );
    
    const style = getStyle(getByTestId('card'));
    expect(style).toMatchObject({
      backgroundColor: colors.background.surface,
      borderRadius: borderRadius.medium,
      padding: spacing.lg,
    });
  });

  it('should apply elevation shadows', () => {
    const { getByTestId: getLow } = render(
      <Card elevation="low" testID="low">Content</Card>
    );
    const { getByTestId: getMedium } = render(
      <Card elevation="medium" testID="medium">Content</Card>
    );
    const { getByTestId: getHigh } = render(
      <Card elevation="high" testID="high">Content</Card>
    );
    
    expect(getStyle(getLow('low'))).toMatchObject(shadows.low);
    expect(getStyle(getMedium('medium'))).toMatchObject(shadows.medium);
    expect(getStyle(getHigh('high'))).toMatchObject(shadows.high);
  });

  it('should apply custom padding', () => {
    const { getByTestId: getTokenPadding } = render(
      <Card padding="xl" testID="token">Content</Card>
    );
    const { getByTestId: getNumericPadding } = render(
      <Card padding={20} testID="numeric">Content</Card>
    );
    
    expect(getStyle(getTokenPadding('token')).padding).toBe(spacing.xl);
    expect(getStyle(getNumericPadding('numeric')).padding).toBe(20);
  });

  it('should handle press interactions when onPress is provided', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Card onPress={onPress}>
        <Text>Pressable Card</Text>
      </Card>
    );
    
    const card = getByRole('button');
    fireEvent.press(card);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not be pressable when onPress is not provided', () => {
    const { queryByRole } = render(
      <Card>
        <Text>Static Card</Text>
      </Card>
    );
    
    expect(queryByRole('button')).toBeNull();
  });

  it('should apply border radius from design tokens', () => {
    const { getByTestId } = render(
      <Card testID="card">Content</Card>
    );
    
    const style = getStyle(getByTestId('card'));
    expect(style.borderRadius).toBe(borderRadius.medium);
    expect(style.borderRadius).toBeGreaterThanOrEqual(12);
    expect(style.borderRadius).toBeLessThanOrEqual(22);
  });

  it('should merge custom style prop', () => {
    const { getByTestId } = render(
      <Card style={{ opacity: 0.9 }} testID="card">
        Content
      </Card>
    );
    
    const component = getByTestId('card');
    const styles = Array.isArray(component.props.style) ? component.props.style : [component.props.style];
    const customStyle = styles.find((s: any) => s && s.opacity);
    expect(customStyle).toMatchObject({ opacity: 0.9 });
  });

  it('should have proper accessibility properties when pressable', () => {
    const { getByRole } = render(
      <Card 
        onPress={() => {}}
        accessibilityLabel="Custom card"
        accessibilityHint="Tap to interact"
      >
        Content
      </Card>
    );
    
    const card = getByRole('button');
    expect(card.props.accessibilityRole).toBe('button');
    expect(card.props.accessibilityLabel).toBe('Custom card');
    expect(card.props.accessibilityHint).toBe('Tap to interact');
  });

  it('should use surface background color', () => {
    const { getByTestId } = render(
      <Card testID="card">Content</Card>
    );
    
    const style = getStyle(getByTestId('card'));
    expect(style.backgroundColor).toBe(colors.background.surface);
  });

  it('should apply all elevation levels correctly', () => {
    const elevations: Array<keyof typeof shadows> = ['low', 'medium', 'high'];
    
    elevations.forEach(elevation => {
      const { getByTestId } = render(
        <Card elevation={elevation} testID={`card-${elevation}`}>
          Content
        </Card>
      );
      
      const style = getStyle(getByTestId(`card-${elevation}`));
      expect(style).toMatchObject(shadows[elevation]);
    });
  });
});
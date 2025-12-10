/**
 * Button Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';
import { colors, borderRadius } from '../designSystem/tokens';

describe('Button Component', () => {
  it('should render children', () => {
    const { getByText } = render(
      <Button>Click me</Button>
    );
    
    expect(getByText('Click me')).toBeTruthy();
  });

  it('should handle press events', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button onPress={onPress}>Press me</Button>
    );
    
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should apply primary variant styling', () => {
    const { getByRole } = render(
      <Button variant="primary" testID="button">Primary</Button>
    );
    
    const button = getByRole('button');
    expect(button.props.style).toMatchObject({
      backgroundColor: colors.accent.primary,
    });
  });

  it('should apply secondary variant styling', () => {
    const { getByRole } = render(
      <Button variant="secondary" testID="button">Secondary</Button>
    );
    
    const button = getByRole('button');
    expect(button.props.style).toMatchObject({
      backgroundColor: colors.background.surface,
      borderWidth: 1,
      borderColor: colors.border.medium,
    });
  });

  it('should apply ghost variant styling', () => {
    const { getByRole } = render(
      <Button variant="ghost" testID="button">Ghost</Button>
    );
    
    const button = getByRole('button');
    expect(button.props.style).toMatchObject({
      backgroundColor: 'transparent',
    });
  });

  it('should apply correct sizes', () => {
    const { getByTestId: getSmall } = render(
      <Button size="small" testID="small">Small</Button>
    );
    const { getByTestId: getMedium } = render(
      <Button size="medium" testID="medium">Medium</Button>
    );
    const { getByTestId: getLarge } = render(
      <Button size="large" testID="large">Large</Button>
    );
    
    expect(getSmall('small').props.style.height).toBe(40);
    expect(getMedium('medium').props.style.height).toBe(48);
    expect(getLarge('large').props.style.height).toBe(56);
  });

  it('should have minimum touch target size (44x44)', () => {
    const { getByRole } = render(
      <Button size="small">Small button</Button>
    );
    
    const button = getByRole('button');
    expect(button.props.style.minWidth).toBe(44);
    expect(button.props.style.minHeight).toBe(44);
  });

  it('should apply border radius from design tokens', () => {
    const { getByRole } = render(
      <Button>Button</Button>
    );
    
    const button = getByRole('button');
    expect(button.props.style.borderRadius).toBe(borderRadius.medium);
  });

  it('should be disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button disabled onPress={onPress}>Disabled</Button>
    );
    
    const button = getByRole('button');
    expect(button.props.accessibilityState.disabled).toBe(true);
    
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should apply disabled styling', () => {
    const { getByRole } = render(
      <Button variant="primary" disabled>Disabled</Button>
    );
    
    const button = getByRole('button');
    expect(button.props.style.backgroundColor).toBe(colors.border.medium);
  });

  it('should have proper accessibility properties', () => {
    const { getByRole } = render(
      <Button 
        accessibilityLabel="Custom label"
        accessibilityHint="Custom hint"
      >
        Button
      </Button>
    );
    
    const button = getByRole('button');
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityLabel).toBe('Custom label');
    expect(button.props.accessibilityHint).toBe('Custom hint');
  });

  it('should merge custom style prop', () => {
    const { getByRole } = render(
      <Button style={{ opacity: 0.8 }}>Styled</Button>
    );
    
    const button = getByRole('button');
    const styles = Array.isArray(button.props.style) ? button.props.style : [button.props.style];
    const customStyle = styles.find((s: any) => s && s.opacity);
    expect(customStyle).toMatchObject({ opacity: 0.8 });
  });

  it('should render with different variants', () => {
    const { getByText: getPrimary } = render(
      <Button variant="primary">Primary</Button>
    );
    const { getByText: getSecondary } = render(
      <Button variant="secondary">Secondary</Button>
    );
    
    // Just verify the text renders correctly
    expect(getPrimary('Primary')).toBeTruthy();
    expect(getSecondary('Secondary')).toBeTruthy();
  });

  it('should render with different sizes', () => {
    const { getByText: getMedium } = render(
      <Button size="medium">Medium</Button>
    );
    const { getByText: getLarge } = render(
      <Button size="large">Large</Button>
    );
    
    // Just verify the text renders correctly
    expect(getMedium('Medium')).toBeTruthy();
    expect(getLarge('Large')).toBeTruthy();
  });
});
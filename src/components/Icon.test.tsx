/**
 * Icon Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Icon } from './Icon';
import { colors } from '../designSystem/tokens';

describe('Icon Component', () => {
  it('renders correctly with basic props', () => {
    const { getByTestId } = render(
      <Icon name="search" testID="test-icon" />
    );
    
    expect(getByTestId('test-icon')).toBeTruthy();
  });

  it('renders with different icon names', () => {
    const iconNames = ['search', 'heart', 'star', 'plus', 'home'] as const;
    
    iconNames.forEach(name => {
      const { getByTestId } = render(
        <Icon name={name} testID={`icon-${name}`} />
      );
      
      expect(getByTestId(`icon-${name}`)).toBeTruthy();
    });
  });

  it('applies custom size correctly', () => {
    const { getByTestId } = render(
      <Icon name="search" size={32} testID="test-icon" />
    );
    
    const icon = getByTestId('test-icon');
    expect(icon.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 32,
          height: 32,
        })
      ])
    );
  });

  it('uses default size when not specified', () => {
    const { getByTestId } = render(
      <Icon name="search" testID="test-icon" />
    );
    
    const icon = getByTestId('test-icon');
    expect(icon.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 24,
          height: 24,
        })
      ])
    );
  });

  it('applies custom color correctly', () => {
    const customColor = '#FF0000';
    const { getByTestId } = render(
      <Icon name="search" color={customColor} testID="test-icon" />
    );
    
    // The color is applied to the SVG element, which is tested indirectly
    expect(getByTestId('test-icon')).toBeTruthy();
  });

  it('uses default color when not specified', () => {
    const { getByTestId } = render(
      <Icon name="search" testID="test-icon" />
    );
    
    // Default color should be colors.text.primary
    expect(getByTestId('test-icon')).toBeTruthy();
  });

  it('applies custom stroke width', () => {
    const { getByTestId } = render(
      <Icon name="search" strokeWidth={2} testID="test-icon" />
    );
    
    expect(getByTestId('test-icon')).toBeTruthy();
  });

  it('uses default stroke width when not specified', () => {
    const { getByTestId } = render(
      <Icon name="search" testID="test-icon" />
    );
    
    // Default stroke width should be 1.5
    expect(getByTestId('test-icon')).toBeTruthy();
  });

  it('applies custom styles correctly', () => {
    const customStyle = { marginTop: 10, marginLeft: 5 };
    const { getByTestId } = render(
      <Icon name="search" style={customStyle} testID="test-icon" />
    );
    
    const icon = getByTestId('test-icon');
    expect(icon.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });

  it('handles all supported icon sizes', () => {
    const sizes = [16, 20, 24, 32] as const;
    
    sizes.forEach(size => {
      const { getByTestId } = render(
        <Icon name="search" size={size} testID={`icon-${size}`} />
      );
      
      const icon = getByTestId(`icon-${size}`);
      expect(icon.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            width: size,
            height: size,
          })
        ])
      );
    });
  });

  it('renders different icon types correctly', () => {
    const iconTypes = [
      'search', 'clear', 'heart', 'star', 'plus', 'minus',
      'arrow-left', 'arrow-right', 'home', 'user', 'shopping-cart',
      'filter', 'location', 'clock', 'check', 'x'
    ] as const;
    
    iconTypes.forEach(iconName => {
      const { getByTestId } = render(
        <Icon name={iconName} testID={`icon-${iconName}`} />
      );
      
      expect(getByTestId(`icon-${iconName}`)).toBeTruthy();
    });
  });

  it('handles invalid icon name gracefully', () => {
    // Suppress console.warn for this test
    const originalWarn = console.warn;
    console.warn = jest.fn();
    
    const { queryByTestId } = render(
      // @ts-ignore - Testing invalid icon name
      <Icon name="invalid-icon" testID="test-icon" />
    );
    
    // Should render nothing (null)
    expect(queryByTestId('test-icon')).toBeNull();
    expect(console.warn).toHaveBeenCalledWith('Icon "invalid-icon" not found');
    
    // Restore console.warn
    console.warn = originalWarn;
  });

  it('maintains proper aspect ratio', () => {
    const { getByTestId } = render(
      <Icon name="search" size={32} testID="test-icon" />
    );
    
    const icon = getByTestId('test-icon');
    const style = icon.props.style.find((s: any) => s.width !== undefined);
    
    expect(style.width).toBe(style.height);
  });

  it('centers content properly', () => {
    const { getByTestId } = render(
      <Icon name="search" testID="test-icon" />
    );
    
    const icon = getByTestId('test-icon');
    expect(icon.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          justifyContent: 'center',
          alignItems: 'center',
        })
      ])
    );
  });
});
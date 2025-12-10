/**
 * Theme Provider Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { tokens } from './tokens';

describe('ThemeProvider', () => {
  it('should provide theme tokens to children', () => {
    const TestComponent = () => {
      const theme = useTheme();
      return <Text>{theme.colors.background.primary}</Text>;
    };

    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByText('#FFFDF8')).toBeTruthy();
  });

  it('should provide all token categories', () => {
    const TestComponent = () => {
      const theme = useTheme();
      return (
        <>
          <Text testID="colors">{JSON.stringify(theme.colors)}</Text>
          <Text testID="spacing">{JSON.stringify(theme.spacing)}</Text>
          <Text testID="borderRadius">{JSON.stringify(theme.borderRadius)}</Text>
          <Text testID="typography">{JSON.stringify(theme.typography)}</Text>
          <Text testID="shadows">{JSON.stringify(theme.shadows)}</Text>
          <Text testID="animations">{JSON.stringify(theme.animations)}</Text>
        </>
      );
    };

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('colors')).toBeTruthy();
    expect(getByTestId('spacing')).toBeTruthy();
    expect(getByTestId('borderRadius')).toBeTruthy();
    expect(getByTestId('typography')).toBeTruthy();
    expect(getByTestId('shadows')).toBeTruthy();
    expect(getByTestId('animations')).toBeTruthy();
  });

  it('should throw error when useTheme is used outside ThemeProvider', () => {
    const TestComponent = () => {
      useTheme();
      return <Text>Test</Text>;
    };

    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = originalError;
  });

  it('should provide the same tokens as imported tokens', () => {
    const TestComponent = () => {
      const theme = useTheme();
      return <Text testID="theme">{JSON.stringify(theme)}</Text>;
    };

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeText = getByTestId('theme').props.children;
    const themeObject = JSON.parse(themeText);
    
    expect(themeObject.colors).toEqual(tokens.colors);
    expect(themeObject.spacing).toEqual(tokens.spacing);
    expect(themeObject.borderRadius).toEqual(tokens.borderRadius);
  });
});

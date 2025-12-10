/**
 * ErrorBanner Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorBanner } from './ErrorBanner';
import { ThemeProvider } from '../designSystem/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ErrorBanner', () => {
  it('renders error message correctly', () => {
    const { getByText } = renderWithTheme(
      <ErrorBanner message="Test error message" />
    );

    expect(getByText('Test error message')).toBeTruthy();
  });

  it('calls onDismiss when dismiss button is pressed', () => {
    const mockDismiss = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <ErrorBanner message="Test error" onDismiss={mockDismiss} />
    );

    fireEvent.press(getByLabelText('Dismiss error'));
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders action button when provided', () => {
    const mockAction = jest.fn();
    const { getByText } = renderWithTheme(
      <ErrorBanner 
        message="Test error" 
        action={{ label: 'Fix', onPress: mockAction }} 
      />
    );

    expect(getByText('Fix')).toBeTruthy();
  });

  it('calls action onPress when action button is pressed', () => {
    const mockAction = jest.fn();
    const { getByText } = renderWithTheme(
      <ErrorBanner 
        message="Test error" 
        action={{ label: 'Fix', onPress: mockAction }} 
      />
    );

    fireEvent.press(getByText('Fix'));
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('does not render dismiss button when onDismiss is not provided', () => {
    const { queryByLabelText } = renderWithTheme(
      <ErrorBanner message="Test error" />
    );

    expect(queryByLabelText('Dismiss error')).toBeNull();
  });
});
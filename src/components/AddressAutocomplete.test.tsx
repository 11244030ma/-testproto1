/**
 * AddressAutocomplete Tests
 * 
 * Tests for address autocomplete functionality
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AddressAutocomplete } from './AddressAutocomplete';
import { ThemeProvider } from '../designSystem/ThemeProvider';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('AddressAutocomplete', () => {
  const mockOnAddressSelect = jest.fn();
  const mockOnTextChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render input field with placeholder', () => {
    const { getByPlaceholderText } = render(
      <TestWrapper>
        <AddressAutocomplete
          value=""
          onAddressSelect={mockOnAddressSelect}
          onTextChange={mockOnTextChange}
          placeholder="Enter your address"
        />
      </TestWrapper>
    );

    expect(getByPlaceholderText('Enter your address')).toBeTruthy();
  });

  it('should call onTextChange when text is entered', () => {
    const { getByPlaceholderText } = render(
      <TestWrapper>
        <AddressAutocomplete
          value=""
          onAddressSelect={mockOnAddressSelect}
          onTextChange={mockOnTextChange}
          placeholder="Enter your address"
        />
      </TestWrapper>
    );

    const input = getByPlaceholderText('Enter your address');
    fireEvent.changeText(input, '123 Main Street');

    expect(mockOnTextChange).toHaveBeenCalledWith('123 Main Street');
  });

  it('should show loading state when searching', async () => {
    const { getByPlaceholderText, rerender } = render(
      <TestWrapper>
        <AddressAutocomplete
          value=""
          onAddressSelect={mockOnAddressSelect}
          onTextChange={mockOnTextChange}
          placeholder="Enter your address"
        />
      </TestWrapper>
    );

    const input = getByPlaceholderText('Enter your address');
    fireEvent.changeText(input, '123 Main Street');

    // Re-render with updated value to trigger search
    rerender(
      <TestWrapper>
        <AddressAutocomplete
          value="123 Main Street"
          onAddressSelect={mockOnAddressSelect}
          onTextChange={mockOnTextChange}
          placeholder="Enter your address"
        />
      </TestWrapper>
    );

    // Should show loading placeholder
    await waitFor(() => {
      expect(getByPlaceholderText('Searching...')).toBeTruthy();
    }, { timeout: 1000 });
  });

  it('should display error message when provided', () => {
    const { getByText } = render(
      <TestWrapper>
        <AddressAutocomplete
          value=""
          onAddressSelect={mockOnAddressSelect}
          onTextChange={mockOnTextChange}
          error="Address is required"
        />
      </TestWrapper>
    );

    expect(getByText('Address is required')).toBeTruthy();
  });

  it('should render with label when provided', () => {
    const { getByText } = render(
      <TestWrapper>
        <AddressAutocomplete
          value=""
          onAddressSelect={mockOnAddressSelect}
          onTextChange={mockOnTextChange}
          label="Street Address"
        />
      </TestWrapper>
    );

    expect(getByText('Street Address')).toBeTruthy();
  });
});
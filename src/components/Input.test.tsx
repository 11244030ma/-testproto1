/**
 * Input Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders correctly with basic props', () => {
    const { getByDisplayValue } = render(
      <Input value="test value" placeholder="Enter text" />
    );
    
    expect(getByDisplayValue('test value')).toBeTruthy();
  });

  it('renders label when provided', () => {
    const { getByText } = render(
      <Input label="Email Address" value="" />
    );
    
    expect(getByText('Email Address')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <Input value="" onChangeText={mockOnChangeText} />
    );
    
    fireEvent.changeText(getByDisplayValue(''), 'new text');
    expect(mockOnChangeText).toHaveBeenCalledWith('new text');
  });

  it('shows clear button when value is present and showClearButton is true', () => {
    const { getByTestId } = render(
      <Input 
        value="some text" 
        showClearButton={true}
        testID="test-input"
      />
    );
    
    expect(getByTestId('test-input-clear-button')).toBeTruthy();
  });

  it('hides clear button when value is empty', () => {
    const { queryByTestId } = render(
      <Input 
        value="" 
        showClearButton={true}
        testID="test-input"
      />
    );
    
    expect(queryByTestId('test-input-clear-button')).toBeNull();
  });

  it('clears text when clear button is pressed', () => {
    const mockOnChangeText = jest.fn();
    const { getByTestId } = render(
      <Input 
        value="some text" 
        onChangeText={mockOnChangeText}
        showClearButton={true}
        testID="test-input"
      />
    );
    
    fireEvent.press(getByTestId('test-input-clear-button'));
    expect(mockOnChangeText).toHaveBeenCalledWith('');
  });

  it('calls onFocus when input receives focus', () => {
    const mockOnFocus = jest.fn();
    const { getByDisplayValue } = render(
      <Input value="" onFocus={mockOnFocus} />
    );
    
    fireEvent(getByDisplayValue(''), 'focus');
    expect(mockOnFocus).toHaveBeenCalled();
  });

  it('calls onBlur when input loses focus', () => {
    const mockOnBlur = jest.fn();
    const { getByDisplayValue } = render(
      <Input value="" onBlur={mockOnBlur} />
    );
    
    fireEvent(getByDisplayValue(''), 'blur');
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided', () => {
    const { getByText } = render(
      <Input value="" error="This field is required" />
    );
    
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const { getByDisplayValue } = render(
      <Input value="" disabled={true} />
    );
    
    const input = getByDisplayValue('');
    expect(input.props.editable).toBe(false);
  });

  it('does not show clear button when disabled', () => {
    const { queryByTestId } = render(
      <Input 
        value="some text" 
        disabled={true}
        showClearButton={true}
        testID="test-input"
      />
    );
    
    expect(queryByTestId('test-input-clear-button')).toBeNull();
  });

  it('applies custom styles correctly', () => {
    const customStyle = { marginTop: 20 };
    const customInputStyle = { fontSize: 18 };
    
    const { getByDisplayValue } = render(
      <Input 
        value="" 
        style={customStyle}
        inputStyle={customInputStyle}
      />
    );
    
    // Note: Testing styles in React Native Testing Library is limited
    // This test mainly ensures the component doesn't crash with custom styles
    expect(getByDisplayValue('')).toBeTruthy();
  });

  it('forwards additional TextInput props', () => {
    const { getByDisplayValue } = render(
      <Input 
        value="" 
        autoCapitalize="words"
        keyboardType="email-address"
      />
    );
    
    const input = getByDisplayValue('');
    expect(input.props.autoCapitalize).toBe('words');
    expect(input.props.keyboardType).toBe('email-address');
  });
});
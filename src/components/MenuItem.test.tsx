/**
 * MenuItem Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MenuItem } from './MenuItem';
import { MenuItem as MenuItemType } from '../types';

// Mock menu item data
const mockMenuItem: MenuItemType = {
  id: '1',
  restaurantId: 'rest1',
  name: 'Margherita Pizza',
  description: 'Classic pizza with fresh tomatoes, mozzarella, and basil',
  price: 14.99,
  imageUrl: 'https://example.com/pizza.jpg',
  category: 'Pizza',
  dietaryInfo: {
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['dairy', 'gluten'],
  },
  nutritionalInfo: {
    calories: 280,
    protein: 12,
    carbs: 35,
    fat: 10,
  },
  isAvailable: true,
};

const mockUnavailableMenuItem: MenuItemType = {
  ...mockMenuItem,
  id: '2',
  name: 'Unavailable Item',
  isAvailable: false,
};

const mockVeganMenuItem: MenuItemType = {
  ...mockMenuItem,
  id: '3',
  name: 'Vegan Salad',
  dietaryInfo: {
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
  },
};

const mockLongDescriptionMenuItem: MenuItemType = {
  ...mockMenuItem,
  id: '4',
  name: 'Item with Long Description',
  description: 'This is a very long description that should be truncated when displayed in the menu item component because it exceeds the maximum length allowed for descriptions in the UI',
};

describe('MenuItem Component', () => {
  it('renders correctly with menu item data', () => {
    const { getByText } = render(
      <MenuItem menuItem={mockMenuItem} />
    );
    
    expect(getByText('Margherita Pizza')).toBeTruthy();
    expect(getByText('Classic pizza with fresh tomatoes, mozzarella, and basil')).toBeTruthy();
    expect(getByText('$14.99')).toBeTruthy();
    expect(getByText('Add')).toBeTruthy();
    expect(getByText('V')).toBeTruthy(); // Vegetarian badge
  });

  it('calls onAddToCart when add button is pressed', () => {
    const mockOnAddToCart = jest.fn();
    const { getByText } = render(
      <MenuItem 
        menuItem={mockMenuItem} 
        onAddToCart={mockOnAddToCart}
      />
    );
    
    fireEvent.press(getByText('Add'));
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockMenuItem);
  });

  it('calls onPress when item is pressed (if onPress provided)', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <MenuItem 
        menuItem={mockMenuItem} 
        onPress={mockOnPress}
        testID="menu-item"
      />
    );
    
    fireEvent.press(getByTestId('menu-item'));
    expect(mockOnPress).toHaveBeenCalledWith(mockMenuItem);
  });

  it('disables add button for unavailable items', () => {
    const { getByTestId } = render(
      <MenuItem 
        menuItem={mockUnavailableMenuItem}
        testID="menu-item"
      />
    );
    
    const addButton = getByTestId('menu-item-add-button');
    expect(addButton.props.accessibilityState?.disabled).toBe(true);
  });

  it('displays dietary badges correctly', () => {
    const { getByText } = render(
      <MenuItem menuItem={mockVeganMenuItem} />
    );
    
    expect(getByText('V')).toBeTruthy();   // Vegetarian
    expect(getByText('VG')).toBeTruthy();  // Vegan
    expect(getByText('GF')).toBeTruthy();  // Gluten Free
  });

  it('formats price correctly', () => {
    const expensiveItem: MenuItemType = {
      ...mockMenuItem,
      price: 25.5,
    };
    
    const { getByText } = render(
      <MenuItem menuItem={expensiveItem} />
    );
    
    expect(getByText('$25.50')).toBeTruthy();
  });

  it('truncates long descriptions', () => {
    const { getByText } = render(
      <MenuItem menuItem={mockLongDescriptionMenuItem} />
    );
    
    // Should find truncated text with ellipsis
    const descriptionElement = getByText(/This is a very long description.*\.\.\./);
    expect(descriptionElement).toBeTruthy();
  });

  it('handles items with no dietary restrictions', () => {
    const noDietaryItem: MenuItemType = {
      ...mockMenuItem,
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        allergens: [],
      },
    };
    
    const { queryByText } = render(
      <MenuItem menuItem={noDietaryItem} />
    );
    
    // Should not display any dietary badges
    expect(queryByText('V')).toBeNull();
    expect(queryByText('VG')).toBeNull();
    expect(queryByText('GF')).toBeNull();
  });

  it('applies custom styles correctly', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <MenuItem 
        menuItem={mockMenuItem} 
        style={customStyle}
        testID="menu-item"
      />
    );
    
    expect(getByTestId('menu-item')).toBeTruthy();
  });

  it('has proper accessibility properties when pressable', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <MenuItem 
        menuItem={mockMenuItem}
        onPress={mockOnPress}
        testID="menu-item"
      />
    );
    
    const item = getByTestId('menu-item');
    expect(item.props.accessibilityRole).toBe('button');
    expect(item.props.accessibilityLabel).toBe('Margherita Pizza menu item');
    expect(item.props.accessibilityHint).toBe('Tap to view item details');
  });

  it('handles press in and press out events when pressable', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <MenuItem 
        menuItem={mockMenuItem}
        onPress={mockOnPress}
        testID="menu-item"
      />
    );
    
    const item = getByTestId('menu-item');
    
    fireEvent(item, 'pressIn');
    expect(item).toBeTruthy();
    
    fireEvent(item, 'pressOut');
    expect(item).toBeTruthy();
  });

  it('renders without onPress handler (non-pressable)', () => {
    const { getByText } = render(
      <MenuItem menuItem={mockMenuItem} />
    );
    
    expect(getByText('Margherita Pizza')).toBeTruthy();
  });

  it('handles short descriptions without truncation', () => {
    const shortDescriptionItem: MenuItemType = {
      ...mockMenuItem,
      description: 'Short description',
    };
    
    const { getByText } = render(
      <MenuItem menuItem={shortDescriptionItem} />
    );
    
    expect(getByText('Short description')).toBeTruthy();
  });

  it('displays add button with correct test ID', () => {
    const { getByTestId } = render(
      <MenuItem 
        menuItem={mockMenuItem}
        testID="menu-item"
      />
    );
    
    expect(getByTestId('menu-item-add-button')).toBeTruthy();
  });

  it('handles items with zero price', () => {
    const freeItem: MenuItemType = {
      ...mockMenuItem,
      price: 0,
    };
    
    const { getByText } = render(
      <MenuItem menuItem={freeItem} />
    );
    
    expect(getByText('$0.00')).toBeTruthy();
  });
});
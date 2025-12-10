/**
 * RestaurantCard Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RestaurantCard } from './RestaurantCard';
import { Restaurant } from '../types';

// Mock restaurant data
const mockRestaurant: Restaurant = {
  id: '1',
  name: 'Test Restaurant',
  description: 'A great test restaurant',
  cuisineType: ['Italian', 'Pizza'],
  rating: 4.5,
  reviewCount: 123,
  deliveryTime: '25-35 min',
  deliveryFee: 2.99,
  minimumOrder: 15,
  imageUrl: 'https://example.com/image.jpg',
  heroImageUrl: 'https://example.com/hero.jpg',
  isOpen: true,
  location: {
    address: '123 Test St',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
  },
};

const mockClosedRestaurant: Restaurant = {
  ...mockRestaurant,
  id: '2',
  name: 'Closed Restaurant',
  isOpen: false,
};

const mockFreeDeliveryRestaurant: Restaurant = {
  ...mockRestaurant,
  id: '3',
  name: 'Free Delivery Restaurant',
  deliveryFee: 0,
};

describe('RestaurantCard Component', () => {
  it('renders correctly with restaurant data', () => {
    const { getByText } = render(
      <RestaurantCard restaurant={mockRestaurant} />
    );
    
    expect(getByText('Test Restaurant')).toBeTruthy();
    expect(getByText('Italian, Pizza')).toBeTruthy();
    expect(getByText('4.5')).toBeTruthy();
    expect(getByText('(123)')).toBeTruthy();
    expect(getByText('25-35 min')).toBeTruthy();
    expect(getByText('$2.99 delivery')).toBeTruthy();
    expect(getByText('Open')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <RestaurantCard 
        restaurant={mockRestaurant} 
        onPress={mockOnPress}
        testID="restaurant-card"
      />
    );
    
    fireEvent.press(getByTestId('restaurant-card'));
    expect(mockOnPress).toHaveBeenCalledWith(mockRestaurant);
  });

  it('displays closed status for closed restaurants', () => {
    const { getByText } = render(
      <RestaurantCard restaurant={mockClosedRestaurant} />
    );
    
    expect(getByText('Closed')).toBeTruthy();
  });

  it('displays free delivery when delivery fee is 0', () => {
    const { getByText } = render(
      <RestaurantCard restaurant={mockFreeDeliveryRestaurant} />
    );
    
    expect(getByText('Free delivery')).toBeTruthy();
  });

  it('truncates cuisine types to maximum of 2', () => {
    const restaurantWithManyCuisines: Restaurant = {
      ...mockRestaurant,
      cuisineType: ['Italian', 'Pizza', 'Pasta', 'Mediterranean', 'European'],
    };
    
    const { getByText } = render(
      <RestaurantCard restaurant={restaurantWithManyCuisines} />
    );
    
    expect(getByText('Italian, Pizza')).toBeTruthy();
  });

  it('displays rating with one decimal place', () => {
    const restaurantWithWholeRating: Restaurant = {
      ...mockRestaurant,
      rating: 5,
    };
    
    const { getByText } = render(
      <RestaurantCard restaurant={restaurantWithWholeRating} />
    );
    
    expect(getByText('5.0')).toBeTruthy();
  });

  it('handles restaurants with single cuisine type', () => {
    const singleCuisineRestaurant: Restaurant = {
      ...mockRestaurant,
      cuisineType: ['Japanese'],
    };
    
    const { getByText } = render(
      <RestaurantCard restaurant={singleCuisineRestaurant} />
    );
    
    expect(getByText('Japanese')).toBeTruthy();
  });

  it('applies custom styles correctly', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <RestaurantCard 
        restaurant={mockRestaurant} 
        style={customStyle}
        testID="restaurant-card"
      />
    );
    
    // Note: Testing styles in React Native Testing Library is limited
    // This test mainly ensures the component doesn't crash with custom styles
    expect(getByTestId('restaurant-card')).toBeTruthy();
  });

  it('has proper accessibility properties', () => {
    const { getByTestId } = render(
      <RestaurantCard 
        restaurant={mockRestaurant}
        testID="restaurant-card"
      />
    );
    
    const card = getByTestId('restaurant-card');
    expect(card.props.accessibilityRole).toBe('button');
    expect(card.props.accessibilityLabel).toBe('Test Restaurant restaurant');
    expect(card.props.accessibilityHint).toBe('Tap to view restaurant details');
  });

  it('handles press in and press out events', () => {
    const { getByTestId } = render(
      <RestaurantCard 
        restaurant={mockRestaurant}
        testID="restaurant-card"
      />
    );
    
    const card = getByTestId('restaurant-card');
    
    // Test press in
    fireEvent(card, 'pressIn');
    expect(card).toBeTruthy();
    
    // Test press out
    fireEvent(card, 'pressOut');
    expect(card).toBeTruthy();
  });

  it('renders without onPress handler', () => {
    const { getByText } = render(
      <RestaurantCard restaurant={mockRestaurant} />
    );
    
    expect(getByText('Test Restaurant')).toBeTruthy();
  });

  it('handles empty cuisine types array', () => {
    const noCuisineRestaurant: Restaurant = {
      ...mockRestaurant,
      cuisineType: [],
    };
    
    const { getByText } = render(
      <RestaurantCard restaurant={noCuisineRestaurant} />
    );
    
    // Should render empty string for cuisine types
    expect(getByText('Test Restaurant')).toBeTruthy();
  });

  it('formats delivery fee correctly for different amounts', () => {
    const expensiveDeliveryRestaurant: Restaurant = {
      ...mockRestaurant,
      deliveryFee: 5.50,
    };
    
    const { getByText } = render(
      <RestaurantCard restaurant={expensiveDeliveryRestaurant} />
    );
    
    expect(getByText('$5.50 delivery')).toBeTruthy();
  });
});
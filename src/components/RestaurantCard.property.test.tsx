/**
 * RestaurantCard Component Property-Based Tests
 * Feature: premium-food-app, Property 17: Restaurant cards display required information
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import fc from 'fast-check';
import { RestaurantCard } from './RestaurantCard';
import { Restaurant } from '../types';

// Generator for restaurant data
const restaurantArbitrary: fc.Arbitrary<Restaurant> = fc.record({
  id: fc.string({ minLength: 1 }),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  description: fc.string({ minLength: 1, maxLength: 200 }),
  cuisineType: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
  rating: fc.float({ min: 1.0, max: 5.0, noNaN: true }),
  reviewCount: fc.integer({ min: 0, max: 10000 }),
  deliveryTime: fc.string({ minLength: 1 }),
  deliveryFee: fc.float({ min: 0, max: 10, noNaN: true }),
  minimumOrder: fc.float({ min: 0, max: 50, noNaN: true }),
  imageUrl: fc.webUrl(),
  heroImageUrl: fc.webUrl(),
  isOpen: fc.boolean(),
  location: fc.record({
    address: fc.string({ minLength: 1 }),
    coordinates: fc.record({
      latitude: fc.float({ min: -90, max: 90, noNaN: true }),
      longitude: fc.float({ min: -180, max: 180, noNaN: true }),
    }),
  }),
});

describe('RestaurantCard Property Tests', () => {
  // Feature: premium-food-app, Property 17: Restaurant cards display required information
  it('Property 17: Restaurant cards display required information', () => {
    fc.assert(
      fc.property(restaurantArbitrary, (restaurant) => {
        const { getByText, queryByText } = render(
          <RestaurantCard restaurant={restaurant} testID="restaurant-card" />
        );

        // Property: Restaurant name should always be displayed
        expect(getByText(restaurant.name)).toBeTruthy();

        // Property: Cuisine type should be displayed (at least first type)
        if (restaurant.cuisineType.length > 0) {
          const displayedCuisine = restaurant.cuisineType.slice(0, 2).join(', ');
          expect(getByText(displayedCuisine)).toBeTruthy();
        }

        // Property: Rating should be displayed with one decimal place
        const formattedRating = restaurant.rating.toFixed(1);
        expect(getByText(formattedRating)).toBeTruthy();

        // Property: Review count should be displayed in parentheses
        const reviewCountText = `(${restaurant.reviewCount})`;
        expect(getByText(reviewCountText)).toBeTruthy();

        // Property: Delivery time should be displayed
        expect(getByText(restaurant.deliveryTime)).toBeTruthy();

        // Property: Delivery fee should be displayed correctly
        const expectedDeliveryText = restaurant.deliveryFee === 0 
          ? 'Free delivery' 
          : `$${restaurant.deliveryFee.toFixed(2)} delivery`;
        expect(getByText(expectedDeliveryText)).toBeTruthy();

        // Property: Open/Closed status should be displayed
        const expectedStatus = restaurant.isOpen ? 'Open' : 'Closed';
        expect(getByText(expectedStatus)).toBeTruthy();

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 17: Restaurant cards display proper visual hierarchy', () => {
    fc.assert(
      fc.property(restaurantArbitrary, (restaurant) => {
        const { getByText } = render(
          <RestaurantCard restaurant={restaurant} testID="restaurant-card" />
        );

        // Property: All essential information should be present and accessible
        // This validates that the visual hierarchy includes all required elements

        // Name (most prominent)
        expect(getByText(restaurant.name)).toBeTruthy();

        // Rating (important for decision making)
        expect(getByText(restaurant.rating.toFixed(1))).toBeTruthy();

        // Delivery time (important for planning)
        expect(getByText(restaurant.deliveryTime)).toBeTruthy();

        // Status (important for availability)
        const status = restaurant.isOpen ? 'Open' : 'Closed';
        expect(getByText(status)).toBeTruthy();

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 17: Restaurant cards handle cuisine type display correctly', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 10 }),
        (cuisineTypes) => {
          const restaurant: Restaurant = {
            id: '1',
            name: 'Test Restaurant',
            description: 'Test description',
            cuisineType: cuisineTypes,
            rating: 4.5,
            reviewCount: 100,
            deliveryTime: '30 min',
            deliveryFee: 2.99,
            minimumOrder: 15,
            imageUrl: 'https://example.com/image.jpg',
            heroImageUrl: 'https://example.com/hero.jpg',
            isOpen: true,
            location: {
              address: '123 Test St',
              coordinates: { latitude: 40.7128, longitude: -74.0060 },
            },
          };

          const { getByText, queryByText } = render(
            <RestaurantCard restaurant={restaurant} testID="restaurant-card" />
          );

          // Property: Cuisine types should be displayed correctly
          if (cuisineTypes.length === 0) {
            // Should handle empty array gracefully
            expect(getByText('Test Restaurant')).toBeTruthy();
          } else if (cuisineTypes.length === 1) {
            // Should display single cuisine type
            expect(getByText(cuisineTypes[0])).toBeTruthy();
          } else {
            // Should display first two cuisine types joined by comma
            const expectedText = cuisineTypes.slice(0, 2).join(', ');
            expect(getByText(expectedText)).toBeTruthy();
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 17: Restaurant cards format delivery fee correctly', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 20, noNaN: true }),
        (deliveryFee) => {
          const restaurant: Restaurant = {
            id: '1',
            name: 'Test Restaurant',
            description: 'Test description',
            cuisineType: ['Italian'],
            rating: 4.5,
            reviewCount: 100,
            deliveryTime: '30 min',
            deliveryFee: deliveryFee,
            minimumOrder: 15,
            imageUrl: 'https://example.com/image.jpg',
            heroImageUrl: 'https://example.com/hero.jpg',
            isOpen: true,
            location: {
              address: '123 Test St',
              coordinates: { latitude: 40.7128, longitude: -74.0060 },
            },
          };

          const { getByText } = render(
            <RestaurantCard restaurant={restaurant} testID="restaurant-card" />
          );

          // Property: Delivery fee should be formatted correctly
          const expectedText = deliveryFee === 0 
            ? 'Free delivery' 
            : `$${deliveryFee.toFixed(2)} delivery`;
          
          expect(getByText(expectedText)).toBeTruthy();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 17: Restaurant cards display rating with consistent formatting', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 1.0, max: 5.0, noNaN: true }),
        fc.integer({ min: 0, max: 10000 }),
        (rating, reviewCount) => {
          const restaurant: Restaurant = {
            id: '1',
            name: 'Test Restaurant',
            description: 'Test description',
            cuisineType: ['Italian'],
            rating: rating,
            reviewCount: reviewCount,
            deliveryTime: '30 min',
            deliveryFee: 2.99,
            minimumOrder: 15,
            imageUrl: 'https://example.com/image.jpg',
            heroImageUrl: 'https://example.com/hero.jpg',
            isOpen: true,
            location: {
              address: '123 Test St',
              coordinates: { latitude: 40.7128, longitude: -74.0060 },
            },
          };

          const { getByText } = render(
            <RestaurantCard restaurant={restaurant} testID="restaurant-card" />
          );

          // Property: Rating should always be displayed with one decimal place
          const formattedRating = rating.toFixed(1);
          expect(getByText(formattedRating)).toBeTruthy();

          // Property: Review count should be displayed in parentheses
          const reviewCountText = `(${reviewCount})`;
          expect(getByText(reviewCountText)).toBeTruthy();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 17: Restaurant cards display status correctly', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (isOpen) => {
          const restaurant: Restaurant = {
            id: '1',
            name: 'Test Restaurant',
            description: 'Test description',
            cuisineType: ['Italian'],
            rating: 4.5,
            reviewCount: 100,
            deliveryTime: '30 min',
            deliveryFee: 2.99,
            minimumOrder: 15,
            imageUrl: 'https://example.com/image.jpg',
            heroImageUrl: 'https://example.com/hero.jpg',
            isOpen: isOpen,
            location: {
              address: '123 Test St',
              coordinates: { latitude: 40.7128, longitude: -74.0060 },
            },
          };

          const { getByText } = render(
            <RestaurantCard restaurant={restaurant} testID="restaurant-card" />
          );

          // Property: Status should be displayed correctly based on isOpen flag
          const expectedStatus = isOpen ? 'Open' : 'Closed';
          expect(getByText(expectedStatus)).toBeTruthy();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
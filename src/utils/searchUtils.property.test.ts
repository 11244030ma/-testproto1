/**
 * Property-Based Tests for Search Utils
 * 
 * Feature: premium-food-app, Property 21: Search filters results correctly
 * Validates: Requirements 8.2
 */

import fc from 'fast-check';
import { filterRestaurants, matchesSearchQuery } from './searchUtils';
import { Restaurant, SearchFilters } from '../types';

// Generators for property-based testing
const coordinatesArb = fc.record({
  latitude: fc.float({ min: -90, max: 90, noNaN: true }),
  longitude: fc.float({ min: -180, max: 180, noNaN: true })
});

const locationArb = fc.record({
  address: fc.string({ minLength: 5, maxLength: 100 }),
  coordinates: coordinatesArb
});

const cuisineTypeArb = fc.constantFrom(
  'Italian', 'Chinese', 'Mexican', 'Indian', 'Thai', 'Japanese', 
  'Mediterranean', 'American', 'French', 'Greek', 'Korean', 'Vietnamese'
);

const restaurantArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 3, maxLength: 50 }),
  description: fc.string({ minLength: 10, maxLength: 200 }),
  cuisineType: fc.array(cuisineTypeArb, { minLength: 1, maxLength: 3 }),
  rating: fc.float({ min: 1.0, max: 5.0, noNaN: true }),
  reviewCount: fc.integer({ min: 0, max: 1000 }),
  deliveryTime: fc.oneof(
    fc.constant('15-25 min'),
    fc.constant('20-30 min'),
    fc.constant('25-35 min'),
    fc.constant('30-45 min'),
    fc.constant('35-50 min')
  ),
  deliveryFee: fc.float({ min: 0, max: 10, noNaN: true }),
  minimumOrder: fc.float({ min: 5, max: 50, noNaN: true }),
  imageUrl: fc.webUrl(),
  heroImageUrl: fc.webUrl(),
  isOpen: fc.boolean(),
  location: locationArb
});

const searchFiltersArb = fc.record({
  cuisineTypes: fc.array(cuisineTypeArb, { maxLength: 5 }),
  dietaryRestrictions: fc.array(
    fc.constantFrom('Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'),
    { maxLength: 3 }
  ),
  priceRange: fc.option(fc.record({
    min: fc.float({ min: 0, max: 5, noNaN: true }),
    max: fc.float({ min: 5, max: 15, noNaN: true })
  }), { nil: undefined }),
  deliveryTime: fc.option(fc.record({
    max: fc.integer({ min: 15, max: 60 })
  }), { nil: undefined }),
  rating: fc.option(fc.record({
    min: fc.float({ min: 1, max: 5, noNaN: true })
  }), { nil: undefined })
});

describe('Search Property Tests', () => {
  // Property 21: Search filters results correctly
  it('should only return restaurants matching the search query (case-insensitive)', () => {
    fc.assert(fc.property(
      fc.array(restaurantArb, { minLength: 1, maxLength: 20 }),
      fc.string({ maxLength: 20 }),
      searchFiltersArb,
      (restaurants: Restaurant[], query: string, filters: SearchFilters) => {
        const results = filterRestaurants(restaurants, query, filters);
        
        // All results should match the search query
        return results.every(restaurant => matchesSearchQuery(restaurant, query));
      }
    ), { numRuns: 100 });
  });
  // Property 23: Applied filters update results
  // Feature: premium-food-app, Property 23: Applied filters update results
  // Validates: Requirements 8.4
  it('should update results immediately when filters are applied', () => {
    fc.assert(fc.property(
      fc.array(restaurantArb, { minLength: 10, maxLength: 30 }),
      fc.array(cuisineTypeArb, { minLength: 1, maxLength: 3 }),
      (restaurants: Restaurant[], selectedCuisines: string[]) => {
        const emptyFilters: SearchFilters = {
          cuisineTypes: [],
          dietaryRestrictions: []
        };
        
        const filtersWithCuisine: SearchFilters = {
          cuisineTypes: selectedCuisines,
          dietaryRestrictions: []
        };
        
        // Get results without filters
        const unfiltered = filterRestaurants(restaurants, '', emptyFilters);
        
        // Get results with cuisine filters
        const filtered = filterRestaurants(restaurants, '', filtersWithCuisine);
        
        // Filtered results should be subset of unfiltered
        const isSubset = filtered.every(restaurant => unfiltered.includes(restaurant));
        
        // All filtered results should match at least one selected cuisine
        const matchesCuisine = filtered.every(restaurant =>
          restaurant.cuisineType.some(cuisine => selectedCuisines.includes(cuisine))
        );
        
        return isSubset && matchesCuisine;
      }
    ), { numRuns: 100 });
  });

  it('should handle multiple filter types simultaneously', () => {
    fc.assert(fc.property(
      fc.array(restaurantArb, { minLength: 10, maxLength: 25 }),
      fc.array(cuisineTypeArb, { minLength: 1, maxLength: 2 }),
      fc.float({ min: 1, max: 5, noNaN: true }),
      fc.integer({ min: 20, max: 50 }),
      (restaurants: Restaurant[], cuisines: string[], minRating: number, maxDeliveryTime: number) => {
        const multiFilters: SearchFilters = {
          cuisineTypes: cuisines,
          dietaryRestrictions: [],
          rating: { min: minRating },
          deliveryTime: { max: maxDeliveryTime }
        };
        
        const results = filterRestaurants(restaurants, '', multiFilters);
        
        // All results should match ALL applied filters
        return results.every(restaurant => {
          // Check cuisine filter
          const matchesCuisine = restaurant.cuisineType.some(cuisine => 
            cuisines.includes(cuisine)
          );
          
          // Check rating filter
          const matchesRating = restaurant.rating >= minRating;
          
          // Check delivery time filter
          const timeMatch = restaurant.deliveryTime.match(/(\d+)-(\d+)/);
          const matchesDeliveryTime = timeMatch ? 
            parseInt(timeMatch[2]) <= maxDeliveryTime : true;
          
          return matchesCuisine && matchesRating && matchesDeliveryTime;
        });
      }
    ), { numRuns: 100 });
  });
});
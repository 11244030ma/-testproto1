/**
 * Search Utils Tests
 */

import { 
  normalizeSearchText, 
  matchesSearchQuery, 
  matchesFilters, 
  filterRestaurants,
  parseDeliveryTime,
  sortByRelevance 
} from './searchUtils';
import { Restaurant, SearchFilters } from '../types';

// Mock restaurant data
const mockRestaurant: Restaurant = {
  id: '1',
  name: 'Italian Bistro',
  description: 'Authentic Italian cuisine with fresh ingredients',
  cuisineType: ['Italian', 'Mediterranean'],
  rating: 4.5,
  reviewCount: 120,
  deliveryTime: '25-35 min',
  deliveryFee: 3.99,
  minimumOrder: 15,
  imageUrl: 'https://example.com/image.jpg',
  heroImageUrl: 'https://example.com/hero.jpg',
  isOpen: true,
  location: {
    address: '123 Main St',
    coordinates: { latitude: 40.7128, longitude: -74.0060 }
  }
};

describe('normalizeSearchText', () => {
  it('should convert to lowercase and trim whitespace', () => {
    expect(normalizeSearchText('  PIZZA  ')).toBe('pizza');
    expect(normalizeSearchText('Italian Food')).toBe('italian food');
  });
});

describe('matchesSearchQuery', () => {
  it('should return true for empty query', () => {
    expect(matchesSearchQuery(mockRestaurant, '')).toBe(true);
    expect(matchesSearchQuery(mockRestaurant, '   ')).toBe(true);
  });

  it('should match restaurant name case-insensitively', () => {
    expect(matchesSearchQuery(mockRestaurant, 'italian')).toBe(true);
    expect(matchesSearchQuery(mockRestaurant, 'BISTRO')).toBe(true);
    expect(matchesSearchQuery(mockRestaurant, 'Italian Bistro')).toBe(true);
  });

  it('should match description case-insensitively', () => {
    expect(matchesSearchQuery(mockRestaurant, 'authentic')).toBe(true);
    expect(matchesSearchQuery(mockRestaurant, 'FRESH')).toBe(true);
    expect(matchesSearchQuery(mockRestaurant, 'ingredients')).toBe(true);
  });

  it('should match cuisine types case-insensitively', () => {
    expect(matchesSearchQuery(mockRestaurant, 'italian')).toBe(true);
    expect(matchesSearchQuery(mockRestaurant, 'MEDITERRANEAN')).toBe(true);
  });

  it('should return false for non-matching queries', () => {
    expect(matchesSearchQuery(mockRestaurant, 'chinese')).toBe(false);
    expect(matchesSearchQuery(mockRestaurant, 'sushi')).toBe(false);
  });
});

describe('parseDeliveryTime', () => {
  it('should parse range format correctly', () => {
    expect(parseDeliveryTime('25-35 min')).toBe(35);
    expect(parseDeliveryTime('15-20 minutes')).toBe(20);
  });

  it('should parse single number format', () => {
    expect(parseDeliveryTime('30 min')).toBe(30);
    expect(parseDeliveryTime('45 minutes')).toBe(45);
  });

  it('should return null for invalid format', () => {
    expect(parseDeliveryTime('ASAP')).toBe(null);
    expect(parseDeliveryTime('Soon')).toBe(null);
  });
});
describe('matchesFilters', () => {
  const emptyFilters: SearchFilters = {
    cuisineTypes: [],
    dietaryRestrictions: []
  };

  it('should return true for empty filters', () => {
    expect(matchesFilters(mockRestaurant, emptyFilters)).toBe(true);
  });

  it('should filter by cuisine types', () => {
    const cuisineFilter: SearchFilters = {
      ...emptyFilters,
      cuisineTypes: ['Italian']
    };
    expect(matchesFilters(mockRestaurant, cuisineFilter)).toBe(true);

    const nonMatchingFilter: SearchFilters = {
      ...emptyFilters,
      cuisineTypes: ['Chinese']
    };
    expect(matchesFilters(mockRestaurant, nonMatchingFilter)).toBe(false);
  });

  it('should filter by price range', () => {
    const priceFilter: SearchFilters = {
      ...emptyFilters,
      priceRange: { min: 2, max: 5 }
    };
    expect(matchesFilters(mockRestaurant, priceFilter)).toBe(true);

    const expensiveFilter: SearchFilters = {
      ...emptyFilters,
      priceRange: { min: 10, max: 20 }
    };
    expect(matchesFilters(mockRestaurant, expensiveFilter)).toBe(false);
  });

  it('should filter by delivery time', () => {
    const timeFilter: SearchFilters = {
      ...emptyFilters,
      deliveryTime: { max: 40 }
    };
    expect(matchesFilters(mockRestaurant, timeFilter)).toBe(true);

    const fastFilter: SearchFilters = {
      ...emptyFilters,
      deliveryTime: { max: 20 }
    };
    expect(matchesFilters(mockRestaurant, fastFilter)).toBe(false);
  });

  it('should filter by rating', () => {
    const ratingFilter: SearchFilters = {
      ...emptyFilters,
      rating: { min: 4.0 }
    };
    expect(matchesFilters(mockRestaurant, ratingFilter)).toBe(true);

    const highRatingFilter: SearchFilters = {
      ...emptyFilters,
      rating: { min: 4.8 }
    };
    expect(matchesFilters(mockRestaurant, highRatingFilter)).toBe(false);
  });
});

describe('filterRestaurants', () => {
  const restaurants = [mockRestaurant];
  const emptyFilters: SearchFilters = {
    cuisineTypes: [],
    dietaryRestrictions: []
  };

  it('should return all restaurants for empty query and filters', () => {
    const results = filterRestaurants(restaurants, '', emptyFilters);
    expect(results).toHaveLength(1);
    expect(results[0]).toBe(mockRestaurant);
  });

  it('should filter by query', () => {
    const results = filterRestaurants(restaurants, 'italian', emptyFilters);
    expect(results).toHaveLength(1);

    const noResults = filterRestaurants(restaurants, 'chinese', emptyFilters);
    expect(noResults).toHaveLength(0);
  });
});

describe('sortByRelevance', () => {
  const restaurant1: Restaurant = { ...mockRestaurant, id: '1', name: 'Pizza Palace', rating: 4.2 };
  const restaurant2: Restaurant = { ...mockRestaurant, id: '2', name: 'Italian Pizza', rating: 4.8 };
  const restaurant3: Restaurant = { ...mockRestaurant, id: '3', name: 'Best Pizza Ever', rating: 4.0 };
  const restaurants = [restaurant1, restaurant2, restaurant3];

  it('should sort by rating when no query', () => {
    const sorted = sortByRelevance(restaurants, '');
    expect(sorted[0].rating).toBe(4.8);
    expect(sorted[1].rating).toBe(4.2);
    expect(sorted[2].rating).toBe(4.0);
  });

  it('should prioritize exact name matches', () => {
    const exactMatch: Restaurant = { ...mockRestaurant, id: '4', name: 'Pizza', rating: 3.5 };
    const testRestaurants = [...restaurants, exactMatch];
    
    const sorted = sortByRelevance(testRestaurants, 'pizza');
    expect(sorted[0].name).toBe('Pizza');
  });

  it('should prioritize name starts with query', () => {
    const sorted = sortByRelevance(restaurants, 'pizza');
    expect(sorted[0].name).toBe('Pizza Palace');
  });
});
describe('Advanced Filter Utils', () => {
  const { 
    toggleCuisineFilter, 
    toggleDietaryFilter, 
    applyMultipleFilters,
    getFilterSummary,
    hasActiveFilters,
    resetAllFilters,
    mergeFilters
  } = require('./searchUtils');

  describe('toggleCuisineFilter', () => {
    it('should add cuisine if not present', () => {
      const result = toggleCuisineFilter(['Italian'], 'Chinese');
      expect(result).toEqual(['Italian', 'Chinese']);
    });

    it('should remove cuisine if present', () => {
      const result = toggleCuisineFilter(['Italian', 'Chinese'], 'Italian');
      expect(result).toEqual(['Chinese']);
    });
  });

  describe('toggleDietaryFilter', () => {
    it('should add dietary restriction if not present', () => {
      const result = toggleDietaryFilter(['Vegetarian'], 'Vegan');
      expect(result).toEqual(['Vegetarian', 'Vegan']);
    });

    it('should remove dietary restriction if present', () => {
      const result = toggleDietaryFilter(['Vegetarian', 'Vegan'], 'Vegetarian');
      expect(result).toEqual(['Vegan']);
    });
  });

  describe('applyMultipleFilters', () => {
    const restaurants = [mockRestaurant];

    it('should apply multiple filters at once', () => {
      const results = applyMultipleFilters(restaurants, {
        query: 'italian',
        cuisineTypes: ['Italian'],
        rating: { min: 4.0 }
      });
      expect(results).toHaveLength(1);
    });

    it('should handle empty filters', () => {
      const results = applyMultipleFilters(restaurants, {});
      expect(results).toHaveLength(1);
    });
  });

  describe('getFilterSummary', () => {
    it('should return correct summary for active filters', () => {
      const filters: SearchFilters = {
        cuisineTypes: ['Italian', 'Chinese'],
        dietaryRestrictions: ['Vegetarian'],
        priceRange: { min: 5, max: 15 },
        rating: { min: 4.0 }
      };
      
      const summary = getFilterSummary(filters);
      expect(summary.activeCount).toBe(4);
      expect(summary.summary).toContain('2 cuisines');
      expect(summary.summary).toContain('1 dietary restriction');
      expect(summary.summary).toContain('$5-$15');
      expect(summary.summary).toContain('≥4★');
    });

    it('should return empty summary for no filters', () => {
      const filters: SearchFilters = {
        cuisineTypes: [],
        dietaryRestrictions: []
      };
      
      const summary = getFilterSummary(filters);
      expect(summary.activeCount).toBe(0);
      expect(summary.summary).toHaveLength(0);
    });
  });

  describe('hasActiveFilters', () => {
    it('should return true when filters are active', () => {
      const filters: SearchFilters = {
        cuisineTypes: ['Italian'],
        dietaryRestrictions: []
      };
      expect(hasActiveFilters(filters)).toBe(true);
    });

    it('should return false when no filters are active', () => {
      const filters: SearchFilters = {
        cuisineTypes: [],
        dietaryRestrictions: []
      };
      expect(hasActiveFilters(filters)).toBe(false);
    });
  });

  describe('resetAllFilters', () => {
    it('should return empty filter state', () => {
      const result = resetAllFilters();
      expect(result.cuisineTypes).toHaveLength(0);
      expect(result.dietaryRestrictions).toHaveLength(0);
    });
  });

  describe('mergeFilters', () => {
    it('should merge filter updates correctly', () => {
      const current: SearchFilters = {
        cuisineTypes: ['Italian'],
        dietaryRestrictions: []
      };
      
      const updates = {
        cuisineTypes: ['Chinese'],
        rating: { min: 4.0 }
      };
      
      const result = mergeFilters(current, updates);
      expect(result.cuisineTypes).toEqual(['Chinese']);
      expect(result.rating).toEqual({ min: 4.0 });
    });
  });
});
describe('Empty State Utils', () => {
  const { 
    getEmptyStateContent,
    getSearchSuggestions,
    getEmptyStateAction
  } = require('./searchUtils');

  describe('getEmptyStateContent', () => {
    const availableCuisines = ['Italian', 'Chinese', 'Mexican', 'Thai'];

    it('should return query-specific content when only query is present', () => {
      const emptyFilters: SearchFilters = {
        cuisineTypes: [],
        dietaryRestrictions: []
      };
      
      const content = getEmptyStateContent('pizza', emptyFilters, availableCuisines);
      
      expect(content.title).toBe('No results for your search');
      expect(content.message).toContain('pizza');
      expect(content.iconName).toBe('search');
      expect(content.suggestions).toContain('Check your spelling');
    });

    it('should return filter-specific content when only filters are present', () => {
      const filters: SearchFilters = {
        cuisineTypes: ['Italian'],
        dietaryRestrictions: []
      };
      
      const content = getEmptyStateContent('', filters, availableCuisines);
      
      expect(content.title).toBe('No restaurants match your filters');
      expect(content.iconName).toBe('filter');
      expect(content.suggestions).toContain('Try removing some filters');
    });

    it('should return combined content when both query and filters are present', () => {
      const filters: SearchFilters = {
        cuisineTypes: ['Italian'],
        dietaryRestrictions: []
      };
      
      const content = getEmptyStateContent('pizza', filters, availableCuisines);
      
      expect(content.title).toBe('No matches found');
      expect(content.message).toContain('pizza');
      expect(content.suggestions).toContain('Try removing some filters');
    });
  });

  describe('getSearchSuggestions', () => {
    const availableCuisines = ['Italian', 'Chinese', 'Mexican', 'American', 'Thai', 'Japanese'];

    it('should return popular cuisines when no query', () => {
      const suggestions = getSearchSuggestions(availableCuisines);
      
      expect(suggestions).toContain('Italian');
      expect(suggestions).toContain('Chinese');
      expect(suggestions).toContain('Mexican');
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });

    it('should include matching cuisines for query', () => {
      const suggestions = getSearchSuggestions(availableCuisines, 'ital');
      
      expect(suggestions).toContain('Italian');
    });

    it('should limit suggestions to 5 items', () => {
      const suggestions = getSearchSuggestions(availableCuisines, 'a');
      
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getEmptyStateAction', () => {
    it('should return clear search action for query only', () => {
      const emptyFilters: SearchFilters = {
        cuisineTypes: [],
        dietaryRestrictions: []
      };
      
      const action = getEmptyStateAction('pizza', emptyFilters);
      
      expect(action.label).toBe('Clear search');
      expect(action.action).toBe('clearSearch');
    });

    it('should return clear filters action for filters only', () => {
      const filters: SearchFilters = {
        cuisineTypes: ['Italian'],
        dietaryRestrictions: []
      };
      
      const action = getEmptyStateAction('', filters);
      
      expect(action.label).toBe('Clear filters');
      expect(action.action).toBe('clearFilters');
    });

    it('should prioritize clear filters for both query and filters', () => {
      const filters: SearchFilters = {
        cuisineTypes: ['Italian'],
        dietaryRestrictions: []
      };
      
      const action = getEmptyStateAction('pizza', filters);
      
      expect(action.label).toBe('Clear filters');
      expect(action.action).toBe('clearFilters');
    });
  });
});
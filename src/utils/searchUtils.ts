/**
 * Search Utilities
 * 
 * Advanced search and filtering functions for restaurants
 */

import { Restaurant, SearchFilters } from '../types';

/**
 * Normalize text for case-insensitive search
 */
export const normalizeSearchText = (text: string): string => {
  return text.trim().toLowerCase();
};

/**
 * Check if a restaurant matches the search query
 */
export const matchesSearchQuery = (restaurant: Restaurant, query: string): boolean => {
  if (!query.trim()) return true;
  
  const normalizedQuery = normalizeSearchText(query);
  
  // Search in restaurant name
  if (restaurant.name.toLowerCase().includes(normalizedQuery)) {
    return true;
  }
  
  // Search in description
  if (restaurant.description.toLowerCase().includes(normalizedQuery)) {
    return true;
  }
  
  // Search in cuisine types
  return restaurant.cuisineType.some(cuisine => 
    cuisine.toLowerCase().includes(normalizedQuery)
  );
};

/**
 * Check if a restaurant matches the applied filters
 */
export const matchesFilters = (restaurant: Restaurant, filters: SearchFilters): boolean => {
  // Cuisine filter
  if (filters.cuisineTypes.length > 0) {
    const matchesCuisine = restaurant.cuisineType.some(cuisine => 
      filters.cuisineTypes.includes(cuisine)
    );
    if (!matchesCuisine) return false;
  }
  
  // Price range filter (using delivery fee as proxy for restaurant price range)
  if (filters.priceRange) {
    if (restaurant.deliveryFee < filters.priceRange.min || 
        restaurant.deliveryFee > filters.priceRange.max) {
      return false;
    }
  }
  
  // Delivery time filter
  if (filters.deliveryTime) {
    const timeMatch = restaurant.deliveryTime.match(/(\d+)-(\d+)/);
    if (timeMatch) {
      const maxTime = parseInt(timeMatch[2]);
      if (maxTime > filters.deliveryTime.max) {
        return false;
      }
    }
  }
  
  // Rating filter
  if (filters.rating && restaurant.rating < filters.rating.min) {
    return false;
  }
  
  return true;
};
/**
 * Filter restaurants based on search query and filters
 */
export const filterRestaurants = (
  restaurants: Restaurant[], 
  query: string, 
  filters: SearchFilters
): Restaurant[] => {
  return restaurants.filter(restaurant => {
    return matchesSearchQuery(restaurant, query) && matchesFilters(restaurant, filters);
  });
};

/**
 * Parse delivery time string to get maximum minutes
 */
export const parseDeliveryTime = (deliveryTime: string): number | null => {
  const timeMatch = deliveryTime.match(/(\d+)-(\d+)/);
  if (timeMatch) {
    return parseInt(timeMatch[2]);
  }
  
  // Try single number format
  const singleMatch = deliveryTime.match(/(\d+)/);
  if (singleMatch) {
    return parseInt(singleMatch[1]);
  }
  
  return null;
};

/**
 * Sort restaurants by relevance to search query
 */
export const sortByRelevance = (restaurants: Restaurant[], query: string): Restaurant[] => {
  if (!query.trim()) {
    // No query, sort by rating and review count
    return [...restaurants].sort((a, b) => {
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      return b.reviewCount - a.reviewCount;
    });
  }
  
  const normalizedQuery = normalizeSearchText(query);
  
  return [...restaurants].sort((a, b) => {
    // Exact name match gets highest priority
    const aNameExact = a.name.toLowerCase() === normalizedQuery;
    const bNameExact = b.name.toLowerCase() === normalizedQuery;
    if (aNameExact && !bNameExact) return -1;
    if (!aNameExact && bNameExact) return 1;
    
    // Name starts with query gets second priority
    const aNameStarts = a.name.toLowerCase().startsWith(normalizedQuery);
    const bNameStarts = b.name.toLowerCase().startsWith(normalizedQuery);
    if (aNameStarts && !bNameStarts) return -1;
    if (!aNameStarts && bNameStarts) return 1;
    
    // Cuisine type match gets third priority
    const aCuisineMatch = a.cuisineType.some(c => c.toLowerCase().includes(normalizedQuery));
    const bCuisineMatch = b.cuisineType.some(c => c.toLowerCase().includes(normalizedQuery));
    if (aCuisineMatch && !bCuisineMatch) return -1;
    if (!aCuisineMatch && bCuisineMatch) return 1;
    
    // Finally sort by rating and review count
    if (a.rating !== b.rating) {
      return b.rating - a.rating;
    }
    return b.reviewCount - a.reviewCount;
  });
};

/**
 * Advanced filter utilities for multi-filter support
 */

/**
 * Toggle a cuisine filter (add if not present, remove if present)
 */
export const toggleCuisineFilter = (
  currentFilters: string[], 
  cuisine: string
): string[] => {
  if (currentFilters.includes(cuisine)) {
    return currentFilters.filter(c => c !== cuisine);
  } else {
    return [...currentFilters, cuisine];
  }
};

/**
 * Toggle a dietary restriction filter
 */
export const toggleDietaryFilter = (
  currentFilters: string[], 
  restriction: string
): string[] => {
  if (currentFilters.includes(restriction)) {
    return currentFilters.filter(r => r !== restriction);
  } else {
    return [...currentFilters, restriction];
  }
};

/**
 * Apply multiple filters at once
 */
export const applyMultipleFilters = (
  restaurants: Restaurant[],
  filters: {
    query?: string;
    cuisineTypes?: string[];
    dietaryRestrictions?: string[];
    priceRange?: { min: number; max: number };
    deliveryTime?: { max: number };
    rating?: { min: number };
  }
): Restaurant[] => {
  const searchFilters: SearchFilters = {
    cuisineTypes: filters.cuisineTypes || [],
    dietaryRestrictions: filters.dietaryRestrictions || [],
    priceRange: filters.priceRange,
    deliveryTime: filters.deliveryTime,
    rating: filters.rating
  };
  
  return filterRestaurants(restaurants, filters.query || '', searchFilters);
};

/**
 * Get filter summary for display
 */
export const getFilterSummary = (filters: SearchFilters): {
  activeCount: number;
  summary: string[];
} => {
  const summary: string[] = [];
  let activeCount = 0;
  
  if (filters.cuisineTypes.length > 0) {
    summary.push(`${filters.cuisineTypes.length} cuisine${filters.cuisineTypes.length > 1 ? 's' : ''}`);
    activeCount++;
  }
  
  if (filters.dietaryRestrictions.length > 0) {
    summary.push(`${filters.dietaryRestrictions.length} dietary restriction${filters.dietaryRestrictions.length > 1 ? 's' : ''}`);
    activeCount++;
  }
  
  if (filters.priceRange) {
    summary.push(`$${filters.priceRange.min}-$${filters.priceRange.max}`);
    activeCount++;
  }
  
  if (filters.deliveryTime) {
    summary.push(`≤${filters.deliveryTime.max} min`);
    activeCount++;
  }
  
  if (filters.rating) {
    summary.push(`≥${filters.rating.min}★`);
    activeCount++;
  }
  
  return { activeCount, summary };
};

/**
 * Check if any filters are active
 */
export const hasActiveFilters = (filters: SearchFilters): boolean => {
  return filters.cuisineTypes.length > 0 ||
         filters.dietaryRestrictions.length > 0 ||
         filters.priceRange !== undefined ||
         filters.deliveryTime !== undefined ||
         filters.rating !== undefined;
};

/**
 * Reset all filters to empty state
 */
export const resetAllFilters = (): SearchFilters => ({
  cuisineTypes: [],
  dietaryRestrictions: []
});

/**
 * Merge filter updates with existing filters
 */
export const mergeFilters = (
  currentFilters: SearchFilters, 
  updates: Partial<SearchFilters>
): SearchFilters => ({
  ...currentFilters,
  ...updates
});
/**
 * Empty state utilities for search results
 */

/**
 * Generate empty state content based on search context
 */
export const getEmptyStateContent = (
  query: string,
  filters: SearchFilters,
  availableCuisines: string[]
): {
  title: string;
  message: string;
  suggestions: string[];
  iconName: 'search' | 'filter';
} => {
  const hasQuery = query.trim().length > 0;
  const hasFilters = hasActiveFilters(filters);
  
  if (hasQuery && hasFilters) {
    return {
      title: 'No matches found',
      message: `We couldn't find any restaurants matching "${query}" with your current filters.`,
      suggestions: [
        'Try removing some filters',
        'Check your spelling',
        'Try a broader search term'
      ],
      iconName: 'search'
    };
  }
  
  if (hasQuery) {
    return {
      title: 'No results for your search',
      message: `We couldn't find any restaurants matching "${query}".`,
      suggestions: [
        'Check your spelling',
        'Try a different search term',
        'Browse our featured restaurants instead'
      ],
      iconName: 'search'
    };
  }
  
  if (hasFilters) {
    const { summary } = getFilterSummary(filters);
    return {
      title: 'No restaurants match your filters',
      message: `We couldn't find any restaurants with ${summary.join(', ')}.`,
      suggestions: [
        'Try removing some filters',
        'Expand your delivery area',
        'Browse all restaurants'
      ],
      iconName: 'filter'
    };
  }
  
  // Default empty state (shouldn't normally happen)
  return {
    title: 'No restaurants available',
    message: 'We\'re working to bring you more dining options.',
    suggestions: [
      'Check back later',
      'Try a different location'
    ],
    iconName: 'search'
  };
};

/**
 * Generate search suggestions based on available data
 */
export const getSearchSuggestions = (
  availableCuisines: string[],
  query?: string
): string[] => {
  const suggestions: string[] = [];
  
  // Add popular cuisine suggestions
  const popularCuisines = ['Italian', 'Chinese', 'Mexican', 'American', 'Thai'];
  const availablePopular = popularCuisines.filter(cuisine => 
    availableCuisines.includes(cuisine)
  );
  
  suggestions.push(...availablePopular.slice(0, 3));
  
  // Add query-based suggestions if query exists
  if (query && query.length > 2) {
    const matchingCuisines = availableCuisines.filter(cuisine =>
      cuisine.toLowerCase().includes(query.toLowerCase()) &&
      !suggestions.includes(cuisine)
    );
    suggestions.push(...matchingCuisines.slice(0, 2));
  }
  
  return suggestions.slice(0, 5);
};

/**
 * Get empty state action based on context
 */
export const getEmptyStateAction = (
  query: string,
  filters: SearchFilters
): {
  label: string;
  action: 'clearSearch' | 'clearFilters' | 'browseAll';
} => {
  const hasQuery = query.trim().length > 0;
  const hasFilters = hasActiveFilters(filters);
  
  if (hasQuery && hasFilters) {
    return {
      label: 'Clear filters',
      action: 'clearFilters'
    };
  }
  
  if (hasQuery) {
    return {
      label: 'Clear search',
      action: 'clearSearch'
    };
  }
  
  if (hasFilters) {
    return {
      label: 'Clear filters',
      action: 'clearFilters'
    };
  }
  
  return {
    label: 'Browse all restaurants',
    action: 'browseAll'
  };
};
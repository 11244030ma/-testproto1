/**
 * Search Hook
 * 
 * Provides search and filter functionality for restaurants
 */

import { useCallback, useEffect } from 'react';
import { useRestaurantStore } from '../stores/restaurantStore';
import { SearchFilters, Restaurant } from '../types';

export const useSearch = () => {
  const {
    searchQuery,
    searchFilters,
    searchResults,
    isSearching,
    restaurants,
    setSearchQuery,
    setSearchFilters,
    searchRestaurants,
    clearSearch,
    getCuisineTypes,
  } = useRestaurantStore();

  // Memoized search function
  const handleSearch = useCallback(async (query: string, filters?: Partial<SearchFilters>) => {
    await searchRestaurants(query, filters);
  }, [searchRestaurants]);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.length > 0) {
      const timeoutId = setTimeout(() => {
        handleSearch(searchQuery, searchFilters);
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    } else {
      // Clear results when query is empty
      clearSearch();
    }
  }, [searchQuery, searchFilters, handleSearch, clearSearch]);

  // Filter management
  const addCuisineFilter = useCallback((cuisine: string) => {
    const currentCuisines = searchFilters.cuisineTypes;
    if (!currentCuisines.includes(cuisine)) {
      setSearchFilters({
        cuisineTypes: [...currentCuisines, cuisine],
      });
    }
  }, [searchFilters.cuisineTypes, setSearchFilters]);

  const removeCuisineFilter = useCallback((cuisine: string) => {
    const currentCuisines = searchFilters.cuisineTypes;
    setSearchFilters({
      cuisineTypes: currentCuisines.filter(c => c !== cuisine),
    });
  }, [searchFilters.cuisineTypes, setSearchFilters]);

  const toggleCuisineFilter = useCallback((cuisine: string) => {
    const { toggleCuisineFilter: toggle } = require('../utils/searchUtils');
    const newCuisines = toggle(searchFilters.cuisineTypes, cuisine);
    setSearchFilters({
      cuisineTypes: newCuisines,
    });
  }, [searchFilters.cuisineTypes, setSearchFilters]);

  const addDietaryFilter = useCallback((restriction: string) => {
    const currentRestrictions = searchFilters.dietaryRestrictions;
    if (!currentRestrictions.includes(restriction)) {
      setSearchFilters({
        dietaryRestrictions: [...currentRestrictions, restriction],
      });
    }
  }, [searchFilters.dietaryRestrictions, setSearchFilters]);

  const removeDietaryFilter = useCallback((restriction: string) => {
    const currentRestrictions = searchFilters.dietaryRestrictions;
    setSearchFilters({
      dietaryRestrictions: currentRestrictions.filter(r => r !== restriction),
    });
  }, [searchFilters.dietaryRestrictions, setSearchFilters]);

  const toggleDietaryFilter = useCallback((restriction: string) => {
    const { toggleDietaryFilter: toggle } = require('../utils/searchUtils');
    const newRestrictions = toggle(searchFilters.dietaryRestrictions, restriction);
    setSearchFilters({
      dietaryRestrictions: newRestrictions,
    });
  }, [searchFilters.dietaryRestrictions, setSearchFilters]);

  const setPriceRange = useCallback((min: number, max: number) => {
    setSearchFilters({
      priceRange: { min, max },
    });
  }, [setSearchFilters]);

  const setMaxDeliveryTime = useCallback((maxTime: number) => {
    setSearchFilters({
      deliveryTime: { max: maxTime },
    });
  }, [setSearchFilters]);

  const setMinRating = useCallback((minRating: number) => {
    setSearchFilters({
      rating: { min: minRating },
    });
  }, [setSearchFilters]);

  // Clear specific filter types
  const clearCuisineFilters = useCallback(() => {
    setSearchFilters({ cuisineTypes: [] });
  }, [setSearchFilters]);

  const clearDietaryFilters = useCallback(() => {
    setSearchFilters({ dietaryRestrictions: [] });
  }, [setSearchFilters]);

  const clearPriceRange = useCallback(() => {
    setSearchFilters({ priceRange: undefined });
  }, [setSearchFilters]);

  const clearAllFilters = useCallback(() => {
    setSearchFilters({
      cuisineTypes: [],
      dietaryRestrictions: [],
      priceRange: undefined,
      deliveryTime: undefined,
      rating: undefined,
    });
  }, [setSearchFilters]);

  // Computed values using utility functions
  const { 
    hasActiveFilters: checkActiveFilters, 
    getFilterSummary,
    getEmptyStateContent,
    getEmptyStateAction,
    getSearchSuggestions
  } = require('../utils/searchUtils');
  const hasActiveFilters = checkActiveFilters(searchFilters);
  const filterSummary = getFilterSummary(searchFilters);

  const hasQuery = searchQuery.length > 0;
  const hasResults = searchResults.length > 0;
  const showResults = hasQuery || hasActiveFilters;
  const showEmptyState = showResults && !hasResults && !isSearching;

  // Get results based on current state
  const results: Restaurant[] = showResults ? searchResults : restaurants;

  // Available filter options
  const availableCuisines = getCuisineTypes();
  
  // Empty state content
  const emptyStateContent = showEmptyState ? 
    getEmptyStateContent(searchQuery, searchFilters, availableCuisines) : null;
  const emptyStateAction = showEmptyState ?
    getEmptyStateAction(searchQuery, searchFilters) : null;
  const searchSuggestions = getSearchSuggestions(availableCuisines, searchQuery);
  const availableDietaryOptions = [
    'Vegetarian',
    'Vegan', 
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Keto',
    'Low-Carb',
  ];

  return {
    // State
    query: searchQuery,
    filters: searchFilters,
    results,
    isSearching,
    hasActiveFilters,
    hasQuery,
    hasResults,
    showResults,
    showEmptyState,
    filterSummary,
    emptyStateContent,
    emptyStateAction,
    searchSuggestions,

    // Available options
    availableCuisines,
    availableDietaryOptions,

    // Actions
    setQuery: setSearchQuery,
    search: handleSearch,
    clearSearch,

    // Filter actions
    addCuisineFilter,
    removeCuisineFilter,
    toggleCuisineFilter,
    addDietaryFilter,
    removeDietaryFilter,
    toggleDietaryFilter,
    setPriceRange,
    setMaxDeliveryTime,
    setMinRating,

    // Clear actions
    clearCuisineFilters,
    clearDietaryFilters,
    clearPriceRange,
    clearAllFilters,
  };
};
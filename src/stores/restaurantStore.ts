/**
 * Restaurant Store
 * 
 * Manages restaurant browsing data, search results, and featured content
 */

import { create } from 'zustand';
import { Restaurant, MenuItem, SearchFilters } from '../types';

interface RestaurantStore {
  // State
  restaurants: Restaurant[];
  featuredRestaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  currentMenu: MenuItem[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
  
  // Search state
  searchQuery: string;
  searchFilters: SearchFilters;
  searchResults: Restaurant[];
  isSearching: boolean;
  
  // Actions
  setRestaurants: (restaurants: Restaurant[]) => void;
  setFeaturedRestaurants: (restaurants: Restaurant[]) => void;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  setCurrentMenu: (menu: MenuItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  setSearchResults: (results: Restaurant[]) => void;
  setSearching: (searching: boolean) => void;
  clearSearch: () => void;
  
  // Data fetching actions (would integrate with API)
  fetchRestaurants: () => Promise<void>;
  fetchFeaturedRestaurants: () => Promise<void>;
  fetchRestaurantDetails: (restaurantId: string) => Promise<void>;
  fetchMenu: (restaurantId: string) => Promise<void>;
  searchRestaurants: (query: string, filters?: Partial<SearchFilters>) => Promise<void>;
  
  // Computed values
  getRestaurantById: (id: string) => Restaurant | undefined;
  getMenuByCategory: () => { [category: string]: MenuItem[] };
  getFilteredRestaurants: () => Restaurant[];
  getCuisineTypes: () => string[];
}

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  // Initial state
  restaurants: [],
  featuredRestaurants: [],
  currentRestaurant: null,
  currentMenu: [],
  isLoading: false,
  hasError: false,
  errorMessage: null,
  
  // Search state
  searchQuery: '',
  searchFilters: {
    cuisineTypes: [],
    dietaryRestrictions: [],
  },
  searchResults: [],
  isSearching: false,

  // Actions
  setRestaurants: (restaurants: Restaurant[]) => {
    set({ restaurants, hasError: false, errorMessage: null });
  },

  setFeaturedRestaurants: (restaurants: Restaurant[]) => {
    set({ featuredRestaurants: restaurants });
  },

  setCurrentRestaurant: (restaurant: Restaurant | null) => {
    set({ currentRestaurant: restaurant });
  },

  setCurrentMenu: (menu: MenuItem[]) => {
    set({ currentMenu: menu });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ 
      hasError: error !== null, 
      errorMessage: error,
      isLoading: false 
    });
  },

  // Search actions
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSearchFilters: (filters: Partial<SearchFilters>) => {
    const state = get();
    set({
      searchFilters: {
        ...state.searchFilters,
        ...filters,
      },
    });
  },

  setSearchResults: (results: Restaurant[]) => {
    set({ searchResults: results });
  },

  setSearching: (searching: boolean) => {
    set({ isSearching: searching });
  },

  clearSearch: () => {
    set({
      searchQuery: '',
      searchFilters: {
        cuisineTypes: [],
        dietaryRestrictions: [],
      },
      searchResults: [],
      isSearching: false,
    });
  },

  // Data fetching actions (mock implementations)
  fetchRestaurants: async () => {
    const state = get();
    state.setLoading(true);
    
    try {
      // Mock API call - would be replaced with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, use mock data
      const { generateMockRestaurants } = await import('../utils/mockData');
      const restaurants = generateMockRestaurants(20);
      
      state.setRestaurants(restaurants);
    } catch (error) {
      state.setError('Failed to fetch restaurants');
    } finally {
      state.setLoading(false);
    }
  },

  fetchFeaturedRestaurants: async () => {
    const state = get();
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { generateMockRestaurants } = await import('../utils/mockData');
      const featured = generateMockRestaurants(5);
      
      state.setFeaturedRestaurants(featured);
    } catch (error) {
      state.setError('Failed to fetch featured restaurants');
    }
  },

  fetchRestaurantDetails: async (restaurantId: string) => {
    const state = get();
    state.setLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find restaurant in current data or generate mock
      let restaurant = state.getRestaurantById(restaurantId);
      
      if (!restaurant) {
        const { generateMockRestaurants } = await import('../utils/mockData');
        const mockRestaurants = generateMockRestaurants(1);
        restaurant = { ...mockRestaurants[0], id: restaurantId };
      }
      
      state.setCurrentRestaurant(restaurant);
    } catch (error) {
      state.setError('Failed to fetch restaurant details');
    } finally {
      state.setLoading(false);
    }
  },

  fetchMenu: async (restaurantId: string) => {
    const state = get();
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const { generateMockMenuItems } = await import('../utils/mockData');
      const menu = generateMockMenuItems(restaurantId, 15);
      
      state.setCurrentMenu(menu);
    } catch (error) {
      state.setError('Failed to fetch menu');
    }
  },

  searchRestaurants: async (query: string, filters?: Partial<SearchFilters>) => {
    const state = get();
    state.setSearching(true);
    state.setSearchQuery(query);
    
    if (filters) {
      state.setSearchFilters(filters);
    }
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Get all restaurants (from state or generate mock data)
      const allRestaurants = state.restaurants.length > 0 
        ? state.restaurants 
        : (await import('../utils/mockData')).generateMockRestaurants(20);
      
      // Enhanced search implementation using utility functions
      const currentFilters = { ...state.searchFilters, ...filters };
      const { filterRestaurants, sortByRelevance } = await import('../utils/searchUtils');
      
      // Filter restaurants based on query and filters
      const filteredResults = filterRestaurants(allRestaurants, query, currentFilters);
      
      // Sort results by relevance
      const results = sortByRelevance(filteredResults, query);
      
      state.setSearchResults(results);
    } catch (error) {
      state.setError('Search failed');
    } finally {
      state.setSearching(false);
    }
  },

  // Computed values
  getRestaurantById: (id: string) => {
    const state = get();
    return state.restaurants.find(restaurant => restaurant.id === id);
  },

  getMenuByCategory: () => {
    const state = get();
    const categorized: { [category: string]: MenuItem[] } = {};
    
    state.currentMenu.forEach(item => {
      if (!categorized[item.category]) {
        categorized[item.category] = [];
      }
      categorized[item.category].push(item);
    });
    
    return categorized;
  },

  getFilteredRestaurants: () => {
    const state = get();
    
    if (state.searchQuery || state.searchFilters.cuisineTypes.length > 0) {
      return state.searchResults;
    }
    
    return state.restaurants;
  },

  getCuisineTypes: () => {
    const state = get();
    const cuisines = new Set<string>();
    
    state.restaurants.forEach(restaurant => {
      restaurant.cuisineType.forEach(cuisine => cuisines.add(cuisine));
    });
    
    return Array.from(cuisines).sort();
  },
}));
/**
 * Restaurants Hook
 * 
 * Provides data fetching and management for restaurants
 */

import { useCallback, useEffect } from 'react';
import { useRestaurantStore } from '../stores/restaurantStore';
import { Restaurant, MenuItem } from '../types';

export const useRestaurants = () => {
  const {
    restaurants,
    featuredRestaurants,
    currentRestaurant,
    currentMenu,
    isLoading,
    hasError,
    errorMessage,
    fetchRestaurants,
    fetchFeaturedRestaurants,
    fetchRestaurantDetails,
    fetchMenu,
    setCurrentRestaurant,
    getRestaurantById,
    getMenuByCategory,
  } = useRestaurantStore();

  // Auto-fetch restaurants on mount
  useEffect(() => {
    if (restaurants.length === 0 && !isLoading) {
      fetchRestaurants();
    }
  }, [restaurants.length, isLoading, fetchRestaurants]);

  // Auto-fetch featured restaurants on mount
  useEffect(() => {
    if (featuredRestaurants.length === 0) {
      fetchFeaturedRestaurants();
    }
  }, [featuredRestaurants.length, fetchFeaturedRestaurants]);

  // Memoized actions
  const loadRestaurant = useCallback(async (restaurantId: string) => {
    // Check if restaurant is already loaded
    const existing = getRestaurantById(restaurantId);
    if (existing && existing.id === currentRestaurant?.id) {
      return existing;
    }

    await fetchRestaurantDetails(restaurantId);
    return getRestaurantById(restaurantId);
  }, [getRestaurantById, currentRestaurant?.id, fetchRestaurantDetails]);

  const loadMenu = useCallback(async (restaurantId: string) => {
    // Only fetch if we don't have menu for this restaurant
    if (currentRestaurant?.id !== restaurantId || currentMenu.length === 0) {
      await fetchMenu(restaurantId);
    }
  }, [currentRestaurant?.id, currentMenu.length, fetchMenu]);

  const loadRestaurantWithMenu = useCallback(async (restaurantId: string) => {
    const restaurant = await loadRestaurant(restaurantId);
    await loadMenu(restaurantId);
    return restaurant;
  }, [loadRestaurant, loadMenu]);

  const refreshRestaurants = useCallback(async () => {
    await fetchRestaurants();
  }, [fetchRestaurants]);

  const refreshFeatured = useCallback(async () => {
    await fetchFeaturedRestaurants();
  }, [fetchFeaturedRestaurants]);

  // Clear current restaurant
  const clearCurrentRestaurant = useCallback(() => {
    setCurrentRestaurant(null);
  }, [setCurrentRestaurant]);

  // Get restaurants by cuisine
  const getRestaurantsByCuisine = useCallback((cuisine: string): Restaurant[] => {
    return restaurants.filter(restaurant =>
      restaurant.cuisineType.includes(cuisine)
    );
  }, [restaurants]);

  // Get open restaurants
  const getOpenRestaurants = useCallback((): Restaurant[] => {
    return restaurants.filter(restaurant => restaurant.isOpen);
  }, [restaurants]);

  // Get restaurants by rating
  const getTopRatedRestaurants = useCallback((minRating: number = 4.0): Restaurant[] => {
    return restaurants
      .filter(restaurant => restaurant.rating >= minRating)
      .sort((a, b) => b.rating - a.rating);
  }, [restaurants]);

  // Get menu items by category
  const menuByCategory = getMenuByCategory();
  const menuCategories = Object.keys(menuByCategory);

  // Get available menu items
  const availableMenuItems = currentMenu.filter(item => item.isAvailable);

  // Get menu items by dietary restrictions
  const getMenuItemsByDietary = useCallback((restriction: 'vegetarian' | 'vegan' | 'glutenFree') => {
    return currentMenu.filter(item => {
      switch (restriction) {
        case 'vegetarian':
          return item.dietaryInfo.isVegetarian;
        case 'vegan':
          return item.dietaryInfo.isVegan;
        case 'glutenFree':
          return item.dietaryInfo.isGlutenFree;
        default:
          return false;
      }
    });
  }, [currentMenu]);

  // Statistics
  const stats = {
    totalRestaurants: restaurants.length,
    openRestaurants: getOpenRestaurants().length,
    featuredCount: featuredRestaurants.length,
    menuItemsCount: currentMenu.length,
    availableItemsCount: availableMenuItems.length,
    categoriesCount: menuCategories.length,
  };

  return {
    // State
    restaurants,
    featuredRestaurants,
    currentRestaurant,
    currentMenu,
    menuByCategory,
    menuCategories,
    availableMenuItems,
    isLoading,
    hasError,
    errorMessage,
    stats,

    // Actions
    loadRestaurant,
    loadMenu,
    loadRestaurantWithMenu,
    refreshRestaurants,
    refreshFeatured,
    clearCurrentRestaurant,

    // Queries
    getRestaurantById,
    getRestaurantsByCuisine,
    getOpenRestaurants,
    getTopRatedRestaurants,
    getMenuItemsByDietary,
  };
};
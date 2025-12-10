/**
 * Navigation Utilities
 * 
 * Provides type-safe navigation helpers and utilities for the app
 */

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator';

export type AppNavigationProp = NavigationProp<RootStackParamList>;

/**
 * Type-safe navigation hook
 * Provides strongly typed navigation methods
 */
export const useAppNavigation = () => {
  return useNavigation<AppNavigationProp>();
};

/**
 * Navigation helper functions
 */
export const navigationHelpers = {
  /**
   * Navigate to restaurant detail screen
   */
  goToRestaurantDetail: (navigation: AppNavigationProp, restaurantId: string) => {
    navigation.navigate('RestaurantDetail', { restaurantId });
  },

  /**
   * Navigate to cart screen
   */
  goToCart: (navigation: AppNavigationProp) => {
    navigation.navigate('Cart');
  },

  /**
   * Navigate to checkout screen
   */
  goToCheckout: (navigation: AppNavigationProp) => {
    navigation.navigate('Checkout');
  },

  /**
   * Navigate to order confirmation screen
   */
  goToOrderConfirmation: (navigation: AppNavigationProp, orderId: string) => {
    navigation.navigate('OrderConfirmation', { orderId });
  },

  /**
   * Navigate back to home screen (reset stack)
   */
  goToHome: (navigation: AppNavigationProp) => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  },

  /**
   * Go back to previous screen
   */
  goBack: (navigation: AppNavigationProp) => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  },
};

/**
 * Screen names constants for consistent referencing
 */
export const SCREEN_NAMES = {
  HOME: 'Home' as const,
  RESTAURANT_DETAIL: 'RestaurantDetail' as const,
  CART: 'Cart' as const,
  CHECKOUT: 'Checkout' as const,
  ORDER_CONFIRMATION: 'OrderConfirmation' as const,
} as const;
/**
 * Cart Hook
 * 
 * Provides convenient interface for cart operations
 */

import { useCallback } from 'react';
import { useCartStore } from '../stores/cartStore';
import { CartItem, Restaurant, MenuItem } from '../types';

export const useCart = () => {
  const {
    items,
    restaurant,
    subtotal,
    deliveryFee,
    tax,
    total,
    errors,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getItemById,
    canAddItem,
    checkForErrors,
    dismissError,
    clearErrors,
    updateItemPrice,
    hasErrors,
  } = useCartStore();

  // Memoized actions to prevent unnecessary re-renders
  const handleAddItem = useCallback((menuItem: MenuItem, restaurant: Restaurant, quantity: number = 1) => {
    const cartItem: CartItem = {
      menuItem,
      quantity,
    };
    addItem(cartItem, restaurant);
  }, [addItem]);

  const handleRemoveItem = useCallback((itemId: string) => {
    removeItem(itemId);
  }, [removeItem]);

  const handleUpdateQuantity = useCallback((itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  }, [updateQuantity]);

  const handleClearCart = useCallback(() => {
    clearCart();
  }, [clearCart]);

  // Convenience methods
  const incrementItem = useCallback((itemId: string) => {
    const item = getItemById(itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + 1);
    }
  }, [getItemById, updateQuantity]);

  const decrementItem = useCallback((itemId: string) => {
    const item = getItemById(itemId);
    if (item) {
      const newQuantity = item.quantity - 1;
      if (newQuantity <= 0) {
        removeItem(itemId);
      } else {
        updateQuantity(itemId, newQuantity);
      }
    }
  }, [getItemById, updateQuantity, removeItem]);

  const isItemInCart = useCallback((itemId: string) => {
    return getItemById(itemId) !== undefined;
  }, [getItemById]);

  const getItemQuantity = useCallback((itemId: string) => {
    const item = getItemById(itemId);
    return item ? item.quantity : 0;
  }, [getItemById]);

  const isEmpty = items.length === 0;
  const itemCount = getItemCount();

  // Check if minimum order is met
  const isMinimumOrderMet = restaurant ? subtotal >= restaurant.minimumOrder : true;
  const remainingForMinimum = restaurant && !isMinimumOrderMet 
    ? restaurant.minimumOrder - subtotal 
    : 0;

  return {
    // State
    items,
    restaurant,
    subtotal,
    deliveryFee,
    tax,
    total,
    isEmpty,
    itemCount,
    isMinimumOrderMet,
    remainingForMinimum,
    errors,
    hasErrors: hasErrors(),

    // Actions
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    incrementItem,
    decrementItem,

    // Error handling
    checkForErrors,
    dismissError,
    clearErrors,
    updateItemPrice,

    // Queries
    getItemById,
    isItemInCart,
    getItemQuantity,
    canAddItem,
  };
};
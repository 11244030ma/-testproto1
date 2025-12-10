/**
 * Cart Store
 * 
 * Manages cart state including items, restaurant, and pricing calculations
 */

import { create } from 'zustand';
import { CartItem, Restaurant, CartState } from '../types';

interface CartError {
  type: 'unavailable_item' | 'price_change' | 'restaurant_closed';
  itemId?: string;
  message: string;
  originalPrice?: number;
  newPrice?: number;
}

interface CartStore extends CartState {
  // Error state
  errors: CartError[];
  
  // Actions
  addItem: (item: CartItem, restaurant: Restaurant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setRestaurant: (restaurant: Restaurant) => void;
  
  // Error handling
  checkForErrors: () => void;
  dismissError: (index: number) => void;
  clearErrors: () => void;
  updateItemPrice: (itemId: string, newPrice: number) => void;
  
  // Computed values
  getItemCount: () => number;
  getItemById: (itemId: string) => CartItem | undefined;
  canAddItem: (restaurant: Restaurant) => boolean;
  hasErrors: () => boolean;
}

const TAX_RATE = 0.08; // 8% tax rate
const BASE_DELIVERY_FEE = 2.99;

/**
 * Calculate cart totals based on items
 */
const calculateTotals = (items: CartItem[], restaurant?: Restaurant) => {
  const subtotal = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const deliveryFee = restaurant ? Math.max(BASE_DELIVERY_FEE, restaurant.deliveryFee) : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + deliveryFee + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

export const useCartStore = create<CartStore>((set, get) => ({
  // Initial state
  items: [],
  restaurant: undefined,
  subtotal: 0,
  deliveryFee: 0,
  tax: 0,
  total: 0,
  errors: [],

  // Actions
  addItem: (newItem: CartItem, restaurant: Restaurant) => {
    const state = get();
    
    // Check if we can add items from this restaurant
    if (!state.canAddItem(restaurant)) {
      throw new Error('Cannot add items from different restaurants');
    }

    const existingItemIndex = state.items.findIndex(
      item => item.menuItem.id === newItem.menuItem.id
    );

    let updatedItems: CartItem[];
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updatedItems = state.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item
      );
    } else {
      // Add new item
      updatedItems = [...state.items, newItem];
    }

    const totals = calculateTotals(updatedItems, restaurant);

    set({
      items: updatedItems,
      restaurant,
      ...totals,
    });
  },

  removeItem: (itemId: string) => {
    const state = get();
    const updatedItems = state.items.filter(item => item.menuItem.id !== itemId);
    
    // If cart is empty, clear restaurant
    const restaurant = updatedItems.length > 0 ? state.restaurant : undefined;
    const totals = calculateTotals(updatedItems, restaurant);

    set({
      items: updatedItems,
      restaurant,
      ...totals,
    });
  },

  updateQuantity: (itemId: string, quantity: number) => {
    const state = get();
    
    if (quantity <= 0) {
      state.removeItem(itemId);
      return;
    }

    const updatedItems = state.items.map(item =>
      item.menuItem.id === itemId
        ? { ...item, quantity }
        : item
    );

    const totals = calculateTotals(updatedItems, state.restaurant);

    set({
      items: updatedItems,
      ...totals,
    });
  },

  clearCart: () => {
    set({
      items: [],
      restaurant: undefined,
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      total: 0,
      errors: [],
    });
  },

  // Error handling
  checkForErrors: () => {
    const state = get();
    const existingErrors = state.errors.filter(error => error.type === 'price_change');
    const newErrors: CartError[] = [...existingErrors];

    // Check for unavailable items
    state.items.forEach(item => {
      if (!item.menuItem.isAvailable) {
        // Only add if not already present
        const existingError = newErrors.find(
          error => error.type === 'unavailable_item' && error.itemId === item.menuItem.id
        );
        if (!existingError) {
          newErrors.push({
            type: 'unavailable_item',
            itemId: item.menuItem.id,
            message: `${item.menuItem.name} is no longer available`,
          });
        }
      }
    });

    // Check if restaurant is closed
    if (state.restaurant && !state.restaurant.isOpen) {
      const existingError = newErrors.find(error => error.type === 'restaurant_closed');
      if (!existingError) {
        newErrors.push({
          type: 'restaurant_closed',
          message: `${state.restaurant.name} is currently closed`,
        });
      }
    }

    set({ errors: newErrors });
  },

  dismissError: (index: number) => {
    const state = get();
    const updatedErrors = state.errors.filter((_, i) => i !== index);
    set({ errors: updatedErrors });
  },

  clearErrors: () => {
    set({ errors: [] });
  },

  updateItemPrice: (itemId: string, newPrice: number) => {
    const state = get();
    const item = state.items.find(item => item.menuItem.id === itemId);
    
    if (item && item.menuItem.price !== newPrice) {
      // Add price change error
      const errors = [...state.errors];
      const existingErrorIndex = errors.findIndex(
        error => error.type === 'price_change' && error.itemId === itemId
      );

      const priceChangeError: CartError = {
        type: 'price_change',
        itemId,
        message: `${item.menuItem.name} price changed from $${item.menuItem.price.toFixed(2)} to $${newPrice.toFixed(2)}`,
        originalPrice: item.menuItem.price,
        newPrice,
      };

      if (existingErrorIndex >= 0) {
        errors[existingErrorIndex] = priceChangeError;
      } else {
        errors.push(priceChangeError);
      }

      set({ errors });
    }
  },

  setRestaurant: (restaurant: Restaurant) => {
    set({ restaurant });
  },

  // Computed values
  getItemCount: () => {
    const state = get();
    return state.items.reduce((count, item) => count + item.quantity, 0);
  },

  getItemById: (itemId: string) => {
    const state = get();
    return state.items.find(item => item.menuItem.id === itemId);
  },

  canAddItem: (restaurant: Restaurant) => {
    const state = get();
    // Can add if cart is empty or restaurant matches
    return state.items.length === 0 || state.restaurant?.id === restaurant.id;
  },

  hasErrors: () => {
    const state = get();
    return state.errors.length > 0;
  },
}));
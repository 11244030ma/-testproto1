/**
 * User Store
 * 
 * Manages user state including profile, preferences, and saved data
 */

import { create } from 'zustand';
import { User, Address, PaymentMethod, Order } from '../types';

interface UserStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  
  // Address management
  addAddress: (address: Address) => void;
  updateAddress: (addressId: string, updates: Partial<Address>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  
  // Payment method management
  addPaymentMethod: (paymentMethod: PaymentMethod) => void;
  updatePaymentMethod: (paymentMethodId: string, updates: Partial<PaymentMethod>) => void;
  removePaymentMethod: (paymentMethodId: string) => void;
  setDefaultPaymentMethod: (paymentMethodId: string) => void;
  
  // Preferences
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  addFavoriteCuisine: (cuisine: string) => void;
  removeFavoriteCuisine: (cuisine: string) => void;
  addDietaryRestriction: (restriction: string) => void;
  removeDietaryRestriction: (restriction: string) => void;
  
  // Order history
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  
  // Computed values
  getDefaultAddress: () => Address | undefined;
  getDefaultPaymentMethod: () => PaymentMethod | undefined;
  getRecentOrders: (limit?: number) => Order[];
}

export const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  setUser: (user: User) => {
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  updateUser: (updates: Partial<User>) => {
    const state = get();
    if (!state.user) return;

    set({
      user: { ...state.user, ...updates },
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  // Address management
  addAddress: (address: Address) => {
    const state = get();
    if (!state.user) return;

    const updatedAddresses = [...state.user.savedAddresses, address];
    
    set({
      user: {
        ...state.user,
        savedAddresses: updatedAddresses,
      },
    });
  },

  updateAddress: (addressId: string, updates: Partial<Address>) => {
    const state = get();
    if (!state.user) return;

    const updatedAddresses = state.user.savedAddresses.map(address =>
      address.id === addressId ? { ...address, ...updates } : address
    );

    set({
      user: {
        ...state.user,
        savedAddresses: updatedAddresses,
      },
    });
  },

  removeAddress: (addressId: string) => {
    const state = get();
    if (!state.user) return;

    const updatedAddresses = state.user.savedAddresses.filter(
      address => address.id !== addressId
    );

    set({
      user: {
        ...state.user,
        savedAddresses: updatedAddresses,
      },
    });
  },

  setDefaultAddress: (addressId: string) => {
    const state = get();
    if (!state.user) return;

    // This would typically be handled by updating a user preference
    // For now, we'll assume the first address is the default
    const updatedAddresses = state.user.savedAddresses.map(address => ({
      ...address,
      // Add isDefault property if needed in the future
    }));

    set({
      user: {
        ...state.user,
        savedAddresses: updatedAddresses,
      },
    });
  },

  // Payment method management
  addPaymentMethod: (paymentMethod: PaymentMethod) => {
    const state = get();
    if (!state.user) return;

    // If this is the first payment method, make it default
    const isFirstMethod = state.user.savedPaymentMethods.length === 0;
    const methodToAdd = isFirstMethod 
      ? { ...paymentMethod, isDefault: true }
      : paymentMethod;

    const updatedMethods = [...state.user.savedPaymentMethods, methodToAdd];

    set({
      user: {
        ...state.user,
        savedPaymentMethods: updatedMethods,
      },
    });
  },

  updatePaymentMethod: (paymentMethodId: string, updates: Partial<PaymentMethod>) => {
    const state = get();
    if (!state.user) return;

    const updatedMethods = state.user.savedPaymentMethods.map(method =>
      method.id === paymentMethodId ? { ...method, ...updates } : method
    );

    set({
      user: {
        ...state.user,
        savedPaymentMethods: updatedMethods,
      },
    });
  },

  removePaymentMethod: (paymentMethodId: string) => {
    const state = get();
    if (!state.user) return;

    const updatedMethods = state.user.savedPaymentMethods.filter(
      method => method.id !== paymentMethodId
    );

    set({
      user: {
        ...state.user,
        savedPaymentMethods: updatedMethods,
      },
    });
  },

  setDefaultPaymentMethod: (paymentMethodId: string) => {
    const state = get();
    if (!state.user) return;

    const updatedMethods = state.user.savedPaymentMethods.map(method => ({
      ...method,
      isDefault: method.id === paymentMethodId,
    }));

    set({
      user: {
        ...state.user,
        savedPaymentMethods: updatedMethods,
      },
    });
  },

  // Preferences
  updatePreferences: (preferences: Partial<User['preferences']>) => {
    const state = get();
    if (!state.user) return;

    set({
      user: {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          ...preferences,
        },
      },
    });
  },

  addFavoriteCuisine: (cuisine: string) => {
    const state = get();
    if (!state.user) return;

    const currentCuisines = state.user.preferences.favoriteCuisines;
    if (currentCuisines.includes(cuisine)) return;

    set({
      user: {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          favoriteCuisines: [...currentCuisines, cuisine],
        },
      },
    });
  },

  removeFavoriteCuisine: (cuisine: string) => {
    const state = get();
    if (!state.user) return;

    const updatedCuisines = state.user.preferences.favoriteCuisines.filter(
      c => c !== cuisine
    );

    set({
      user: {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          favoriteCuisines: updatedCuisines,
        },
      },
    });
  },

  addDietaryRestriction: (restriction: string) => {
    const state = get();
    if (!state.user) return;

    const currentRestrictions = state.user.preferences.dietaryRestrictions;
    if (currentRestrictions.includes(restriction)) return;

    set({
      user: {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          dietaryRestrictions: [...currentRestrictions, restriction],
        },
      },
    });
  },

  removeDietaryRestriction: (restriction: string) => {
    const state = get();
    if (!state.user) return;

    const updatedRestrictions = state.user.preferences.dietaryRestrictions.filter(
      r => r !== restriction
    );

    set({
      user: {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          dietaryRestrictions: updatedRestrictions,
        },
      },
    });
  },

  // Order history
  addOrder: (order: Order) => {
    const state = get();
    if (!state.user) return;

    const updatedOrders = [order, ...state.user.orderHistory];

    set({
      user: {
        ...state.user,
        orderHistory: updatedOrders,
      },
    });
  },

  updateOrder: (orderId: string, updates: Partial<Order>) => {
    const state = get();
    if (!state.user) return;

    const updatedOrders = state.user.orderHistory.map(order =>
      order.id === orderId ? { ...order, ...updates } : order
    );

    set({
      user: {
        ...state.user,
        orderHistory: updatedOrders,
      },
    });
  },

  // Computed values
  getDefaultAddress: () => {
    const state = get();
    if (!state.user || state.user.savedAddresses.length === 0) return undefined;
    
    // Return first address as default (could be enhanced with isDefault property)
    return state.user.savedAddresses[0];
  },

  getDefaultPaymentMethod: () => {
    const state = get();
    if (!state.user) return undefined;
    
    return state.user.savedPaymentMethods.find(method => method.isDefault);
  },

  getRecentOrders: (limit = 10) => {
    const state = get();
    if (!state.user) return [];
    
    return state.user.orderHistory
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
}));
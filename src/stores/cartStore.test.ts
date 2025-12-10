/**
 * Cart Store Tests
 */

import { useCartStore } from './cartStore';
import { CartItem, Restaurant, MenuItem } from '../types';

// Mock data
const mockRestaurant: Restaurant = {
  id: 'restaurant-1',
  name: 'Test Restaurant',
  description: 'A test restaurant',
  cuisineType: ['Italian'],
  rating: 4.5,
  reviewCount: 100,
  deliveryTime: '30-45 min',
  deliveryFee: 3.99,
  minimumOrder: 15,
  imageUrl: 'test-image.jpg',
  heroImageUrl: 'test-hero.jpg',
  isOpen: true,
  location: {
    address: '123 Test St',
    coordinates: { latitude: 0, longitude: 0 },
  },
};

const mockMenuItem: MenuItem = {
  id: 'item-1',
  restaurantId: 'restaurant-1',
  name: 'Test Pizza',
  description: 'Delicious test pizza',
  price: 12.99,
  imageUrl: 'pizza.jpg',
  category: 'Main',
  dietaryInfo: {
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    allergens: [],
  },
  isAvailable: true,
};

const mockCartItem: CartItem = {
  menuItem: mockMenuItem,
  quantity: 1,
};

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCartStore.getState().clearCart();
  });

  describe('addItem', () => {
    it('should add item to empty cart', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockCartItem, mockRestaurant);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockCartItem);
      expect(state.restaurant).toEqual(mockRestaurant);
      expect(state.subtotal).toBe(12.99);
    });

    it('should increase quantity for existing item', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockCartItem, mockRestaurant);
      store.addItem(mockCartItem, mockRestaurant);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
      expect(state.subtotal).toBe(25.98);
    });

    it('should throw error when adding item from different restaurant', () => {
      const store = useCartStore.getState();
      const differentRestaurant = { ...mockRestaurant, id: 'restaurant-2' };
      
      store.addItem(mockCartItem, mockRestaurant);
      
      expect(() => {
        store.addItem(mockCartItem, differentRestaurant);
      }).toThrow('Cannot add items from different restaurants');
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockCartItem, mockRestaurant);
      store.removeItem(mockMenuItem.id);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.restaurant).toBeUndefined();
      expect(state.subtotal).toBe(0);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockCartItem, mockRestaurant);
      store.updateQuantity(mockMenuItem.id, 3);
      
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(3);
      expect(state.subtotal).toBe(38.97);
    });

    it('should remove item when quantity is 0', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockCartItem, mockRestaurant);
      store.updateQuantity(mockMenuItem.id, 0);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items and reset state', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockCartItem, mockRestaurant);
      store.clearCart();
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.restaurant).toBeUndefined();
      expect(state.subtotal).toBe(0);
      expect(state.total).toBe(0);
    });
  });

  describe('computed values', () => {
    it('should calculate item count correctly', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockCartItem, mockRestaurant);
      store.addItem({ ...mockCartItem, quantity: 2 }, mockRestaurant);
      
      expect(store.getItemCount()).toBe(3);
    });

    it('should find item by id', () => {
      const store = useCartStore.getState();
      
      store.addItem(mockCartItem, mockRestaurant);
      
      const foundItem = store.getItemById(mockMenuItem.id);
      expect(foundItem).toEqual(mockCartItem);
    });

    it('should check if item can be added', () => {
      const store = useCartStore.getState();
      const differentRestaurant = { ...mockRestaurant, id: 'restaurant-2' };
      
      // Empty cart - can add from any restaurant
      expect(store.canAddItem(mockRestaurant)).toBe(true);
      expect(store.canAddItem(differentRestaurant)).toBe(true);
      
      // Add item from first restaurant
      store.addItem(mockCartItem, mockRestaurant);
      
      // Can add from same restaurant, not from different
      expect(store.canAddItem(mockRestaurant)).toBe(true);
      expect(store.canAddItem(differentRestaurant)).toBe(false);
    });
  });

  describe('pricing calculations', () => {
    it('should calculate totals correctly', () => {
      const store = useCartStore.getState();
      
      store.addItem({ ...mockCartItem, quantity: 2 }, mockRestaurant);
      
      const state = useCartStore.getState();
      expect(state.subtotal).toBe(25.98); // 12.99 * 2
      expect(state.deliveryFee).toBe(3.99); // restaurant delivery fee
      expect(state.tax).toBe(2.08); // 8% of subtotal, rounded
      expect(state.total).toBe(32.05); // subtotal + delivery + tax
    });
  });
});
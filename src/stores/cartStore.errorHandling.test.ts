/**
 * Cart Store Error Handling Tests
 */

import { useCartStore } from './cartStore';
import { Restaurant, MenuItem, CartItem } from '../types';

// Mock data
const mockRestaurant: Restaurant = {
  id: 'restaurant-1',
  name: 'Test Restaurant',
  description: 'A test restaurant',
  cuisineType: ['Italian'],
  rating: 4.5,
  reviewCount: 100,
  deliveryTime: '25-35 min',
  deliveryFee: 2.99,
  minimumOrder: 15,
  imageUrl: 'https://example.com/image.jpg',
  heroImageUrl: 'https://example.com/hero.jpg',
  isOpen: true,
  location: {
    address: '123 Test St',
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
  },
};

const mockMenuItem: MenuItem = {
  id: 'item-1',
  restaurantId: 'restaurant-1',
  name: 'Test Pizza',
  description: 'Delicious test pizza',
  price: 12.99,
  imageUrl: 'https://example.com/pizza.jpg',
  category: 'Main Course',
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

describe('Cart Store Error Handling', () => {
  beforeEach(() => {
    // Clear cart before each test
    useCartStore.getState().clearCart();
  });

  describe('checkForErrors', () => {
    it('should detect unavailable items', () => {
      const store = useCartStore.getState();
      
      // Add item to cart
      store.addItem(mockCartItem, mockRestaurant);
      
      // Make item unavailable
      const unavailableItem = {
        ...mockCartItem,
        menuItem: { ...mockMenuItem, isAvailable: false },
      };
      
      // Manually update the cart with unavailable item (simulating external update)
      useCartStore.setState({
        items: [unavailableItem],
      });
      
      // Check for errors
      store.checkForErrors();
      
      const { errors } = useCartStore.getState();
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('unavailable_item');
      expect(errors[0].itemId).toBe(mockMenuItem.id);
      expect(errors[0].message).toContain('no longer available');
    });

    it('should detect closed restaurant', () => {
      const store = useCartStore.getState();
      
      // Add item to cart
      store.addItem(mockCartItem, mockRestaurant);
      
      // Close restaurant
      const closedRestaurant = { ...mockRestaurant, isOpen: false };
      useCartStore.setState({
        restaurant: closedRestaurant,
      });
      
      // Check for errors
      store.checkForErrors();
      
      const { errors } = useCartStore.getState();
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('restaurant_closed');
      expect(errors[0].message).toContain('currently closed');
    });

    it('should detect multiple errors', () => {
      const store = useCartStore.getState();
      
      // Add item to cart
      store.addItem(mockCartItem, mockRestaurant);
      
      // Make item unavailable and close restaurant
      const unavailableItem = {
        ...mockCartItem,
        menuItem: { ...mockMenuItem, isAvailable: false },
      };
      const closedRestaurant = { ...mockRestaurant, isOpen: false };
      
      useCartStore.setState({
        items: [unavailableItem],
        restaurant: closedRestaurant,
      });
      
      // Check for errors
      store.checkForErrors();
      
      const { errors } = useCartStore.getState();
      expect(errors).toHaveLength(2);
      expect(errors.some(e => e.type === 'unavailable_item')).toBe(true);
      expect(errors.some(e => e.type === 'restaurant_closed')).toBe(true);
    });
  });

  describe('updateItemPrice', () => {
    it('should create price change error when price differs', () => {
      const store = useCartStore.getState();
      
      // Add item to cart
      store.addItem(mockCartItem, mockRestaurant);
      
      // Update item price
      const newPrice = 15.99;
      store.updateItemPrice(mockMenuItem.id, newPrice);
      
      const { errors } = useCartStore.getState();
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('price_change');
      expect(errors[0].itemId).toBe(mockMenuItem.id);
      expect(errors[0].originalPrice).toBe(mockMenuItem.price);
      expect(errors[0].newPrice).toBe(newPrice);
      expect(errors[0].message).toContain('price changed');
    });

    it('should not create error when price is the same', () => {
      const store = useCartStore.getState();
      
      // Add item to cart
      store.addItem(mockCartItem, mockRestaurant);
      
      // Update with same price
      store.updateItemPrice(mockMenuItem.id, mockMenuItem.price);
      
      const { errors } = useCartStore.getState();
      expect(errors).toHaveLength(0);
    });

    it('should update existing price change error', () => {
      const store = useCartStore.getState();
      
      // Add item to cart
      store.addItem(mockCartItem, mockRestaurant);
      
      // Update price twice
      store.updateItemPrice(mockMenuItem.id, 15.99);
      store.updateItemPrice(mockMenuItem.id, 17.99);
      
      const { errors } = useCartStore.getState();
      expect(errors).toHaveLength(1);
      expect(errors[0].newPrice).toBe(17.99);
    });
  });

  describe('dismissError', () => {
    it('should remove error at specified index', () => {
      const store = useCartStore.getState();
      
      // Add item to cart
      store.addItem(mockCartItem, mockRestaurant);
      
      // Create price change error
      store.updateItemPrice(mockMenuItem.id, 15.99);
      
      // Make item unavailable and check for errors
      const unavailableItem = {
        ...mockCartItem,
        menuItem: { ...mockMenuItem, isAvailable: false },
      };
      useCartStore.setState({
        items: [unavailableItem],
        errors: useCartStore.getState().errors, // Preserve existing errors
      });
      store.checkForErrors();
      
      // Should have 2 errors now (price change + unavailable)
      expect(useCartStore.getState().errors).toHaveLength(2);
      
      // Dismiss first error
      store.dismissError(0);
      
      const { errors } = useCartStore.getState();
      expect(errors).toHaveLength(1);
    });
  });

  describe('clearErrors', () => {
    it('should remove all errors', () => {
      const store = useCartStore.getState();
      
      // Add item and create errors
      store.addItem(mockCartItem, mockRestaurant);
      store.updateItemPrice(mockMenuItem.id, 15.99);
      store.checkForErrors();
      
      // Clear all errors
      store.clearErrors();
      
      const { errors } = useCartStore.getState();
      expect(errors).toHaveLength(0);
    });
  });

  describe('hasErrors', () => {
    it('should return true when errors exist', () => {
      const store = useCartStore.getState();
      
      // Add item and create error
      store.addItem(mockCartItem, mockRestaurant);
      store.updateItemPrice(mockMenuItem.id, 15.99);
      
      expect(store.hasErrors()).toBe(true);
    });

    it('should return false when no errors exist', () => {
      const store = useCartStore.getState();
      
      expect(store.hasErrors()).toBe(false);
    });
  });
});
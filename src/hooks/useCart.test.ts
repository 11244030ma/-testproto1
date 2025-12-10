/**
 * useCart Hook Tests
 */

import { renderHook, act } from '@testing-library/react-native';
import { useCart } from './useCart';
import { useCartStore } from '../stores/cartStore';
import { MenuItem, Restaurant } from '../types';

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

describe('useCart Hook', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCartStore.getState().clearCart();
  });

  it('should provide cart state and actions', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.total).toBe(0);
    expect(typeof result.current.addItem).toBe('function');
    expect(typeof result.current.removeItem).toBe('function');
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockMenuItem, mockRestaurant, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.isEmpty).toBe(false);
    expect(result.current.itemCount).toBe(2);
    expect(result.current.restaurant).toEqual(mockRestaurant);
  });

  it('should increment item quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockMenuItem, mockRestaurant, 1);
    });

    act(() => {
      result.current.incrementItem(mockMenuItem.id);
    });

    expect(result.current.getItemQuantity(mockMenuItem.id)).toBe(2);
  });

  it('should decrement item quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockMenuItem, mockRestaurant, 2);
    });

    act(() => {
      result.current.decrementItem(mockMenuItem.id);
    });

    expect(result.current.getItemQuantity(mockMenuItem.id)).toBe(1);
  });

  it('should remove item when decrementing to 0', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockMenuItem, mockRestaurant, 1);
    });

    act(() => {
      result.current.decrementItem(mockMenuItem.id);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.isEmpty).toBe(true);
  });

  it('should check if item is in cart', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.isItemInCart(mockMenuItem.id)).toBe(false);

    act(() => {
      result.current.addItem(mockMenuItem, mockRestaurant);
    });

    expect(result.current.isItemInCart(mockMenuItem.id)).toBe(true);
  });

  it('should calculate minimum order status', () => {
    const { result } = renderHook(() => useCart());

    // Empty cart - minimum order is met (no restaurant)
    expect(result.current.isMinimumOrderMet).toBe(true);
    expect(result.current.remainingForMinimum).toBe(0);

    // Add item below minimum order
    act(() => {
      result.current.addItem(mockMenuItem, mockRestaurant, 1); // $12.99, minimum is $15
    });

    expect(result.current.isMinimumOrderMet).toBe(false);
    expect(result.current.remainingForMinimum).toBe(2.01); // $15 - $12.99

    // Add more to meet minimum
    act(() => {
      result.current.addItem(mockMenuItem, mockRestaurant, 1); // Total $25.98
    });

    expect(result.current.isMinimumOrderMet).toBe(true);
    expect(result.current.remainingForMinimum).toBe(0);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockMenuItem, mockRestaurant);
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.restaurant).toBeUndefined();
  });
});
/**
 * Property-Based Tests for CartScreen Component
 * 
 * Feature: premium-food-app, Property 25: Cart displays complete information
 * Validates: Requirements 10.2
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import * as fc from 'fast-check';
import { CartScreen } from './CartScreen';
import { useCart } from '../hooks/useCart';
import { Restaurant, MenuItem, CartItem } from '../types';

// Mock the useCart hook
jest.mock('../hooks/useCart');
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Generators for test data
const restaurantGenerator = fc.record({
  id: fc.uuid(),
  name: fc.constantFrom('Pizza Palace', 'Burger Barn', 'Sushi Spot', 'Taco Town', 'Pasta Place'),
  description: fc.constantFrom('Delicious food delivered fast', 'Fresh ingredients daily', 'Authentic flavors'),
  cuisineType: fc.constantFrom(['Italian'], ['Mexican'], ['Japanese'], ['American'], ['Chinese']),
  rating: fc.float({ min: Math.fround(3), max: Math.fround(5) }),
  reviewCount: fc.integer({ min: 10, max: 1000 }),
  deliveryTime: fc.constantFrom('15-25 min', '20-30 min', '25-35 min', '30-45 min'),
  deliveryFee: fc.float({ min: Math.fround(0), max: Math.fround(10) }),
  minimumOrder: fc.float({ min: Math.fround(15), max: Math.fround(50) }),
  imageUrl: fc.webUrl(),
  heroImageUrl: fc.webUrl(),
  isOpen: fc.boolean(),
  location: fc.record({
    address: fc.constantFrom('123 Main St', '456 Oak Ave', '789 Pine Rd'),
    coordinates: fc.record({
      latitude: fc.float({ min: Math.fround(40), max: Math.fround(41) }),
      longitude: fc.float({ min: Math.fround(-74), max: Math.fround(-73) }),
    }),
  }),
}) as fc.Arbitrary<Restaurant>;

const menuItemGenerator = fc.record({
  id: fc.uuid(),
  restaurantId: fc.uuid(),
  name: fc.constantFrom('Margherita Pizza', 'Cheeseburger', 'California Roll', 'Chicken Tacos', 'Pasta Alfredo'),
  description: fc.constantFrom('Fresh mozzarella and basil', 'Juicy beef patty with cheese', 'Fresh avocado and crab'),
  price: fc.integer({ min: 8, max: 25 }).map(n => Math.fround(n + 0.99)), // Prices like 8.99, 12.99, etc.
  imageUrl: fc.webUrl(),
  category: fc.constantFrom('Main Course', 'Appetizer', 'Dessert', 'Beverage'),
  dietaryInfo: fc.record({
    isVegetarian: fc.boolean(),
    isVegan: fc.boolean(),
    isGlutenFree: fc.boolean(),
    allergens: fc.constantFrom([], ['nuts'], ['dairy'], ['gluten']),
  }),
  nutritionalInfo: fc.option(fc.record({
    calories: fc.integer({ min: 200, max: 800 }),
    protein: fc.float({ min: Math.fround(5), max: Math.fround(30) }),
    carbs: fc.float({ min: Math.fround(10), max: Math.fround(60) }),
    fat: fc.float({ min: Math.fround(5), max: Math.fround(25) }),
  })),
  isAvailable: fc.boolean(),
}) as fc.Arbitrary<MenuItem>;

const cartItemGenerator = fc.record({
  menuItem: menuItemGenerator,
  quantity: fc.integer({ min: 1, max: 10 }),
  specialInstructions: fc.option(fc.string()),
  selectedOptions: fc.option(fc.array(fc.record({
    optionId: fc.string({ minLength: 1 }),
    choiceId: fc.string({ minLength: 1 }),
  }))),
}) as fc.Arbitrary<CartItem>;

describe('CartScreen Property-Based Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Property 25: Cart displays complete information', () => {
    it('should display all required cart elements when cart has items', () => {
      fc.assert(
        fc.property(
          fc.array(cartItemGenerator, { minLength: 1, maxLength: 3 }),
          restaurantGenerator,
          (items, restaurant) => {
            const subtotal = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
            const deliveryFee = restaurant.deliveryFee;
            const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax, rounded to 2 decimals
            const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
            const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
            
            // Mock cart state with items
            mockUseCart.mockReturnValue({
              items,
              restaurant,
              subtotal,
              deliveryFee,
              tax,
              total,
              isEmpty: false,
              itemCount,
              isMinimumOrderMet: subtotal >= restaurant.minimumOrder,
              remainingForMinimum: Math.max(0, restaurant.minimumOrder - subtotal),
              errors: [],
              hasErrors: false,
              incrementItem: jest.fn(),
              decrementItem: jest.fn(),
              removeItem: jest.fn(),
              clearCart: jest.fn(),
              addItem: jest.fn(),
              updateQuantity: jest.fn(),
              checkForErrors: jest.fn(),
              dismissError: jest.fn(),
              clearErrors: jest.fn(),
              updateItemPrice: jest.fn(),
              getItemById: jest.fn(),
              isItemInCart: jest.fn(),
              getItemQuantity: jest.fn(),
              canAddItem: jest.fn(),
            });

            const { getByText, queryByText } = render(<CartScreen />);

            // Should display header with "Your Cart"
            expect(getByText('Your Cart')).toBeTruthy();

            // Should display item count in header
            const itemCountText = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
            expect(getByText(itemCountText)).toBeTruthy();

            // Should display restaurant information
            expect(queryByText(restaurant.name)).toBeTruthy();
            expect(getByText(`${restaurant.deliveryTime} • $${restaurant.deliveryFee.toFixed(2)} delivery`)).toBeTruthy();

            // Should display order summary section
            expect(getByText('Order Summary')).toBeTruthy();

            // Should display pricing breakdown labels
            expect(getByText('Subtotal')).toBeTruthy();
            expect(getByText('Delivery Fee')).toBeTruthy();
            expect(getByText('Tax')).toBeTruthy();
            expect(getByText('Total')).toBeTruthy();

            // Should display checkout button with total
            expect(queryByText(new RegExp(`Proceed to Checkout.*${total.toFixed(2)}`))).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display minimum order warning when minimum not met', () => {
      fc.assert(
        fc.property(
          fc.array(cartItemGenerator, { minLength: 1, maxLength: 3 }),
          restaurantGenerator,
          (items, restaurant) => {
            // Ensure subtotal is below minimum order
            const subtotal = restaurant.minimumOrder - 5; // $5 below minimum
            const deliveryFee = restaurant.deliveryFee;
            const tax = subtotal * 0.08; // 8% tax
            const total = subtotal + deliveryFee + tax;
            const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
            const remainingForMinimum = restaurant.minimumOrder - subtotal;
            
            mockUseCart.mockReturnValue({
              items,
              restaurant,
              subtotal,
              deliveryFee,
              tax,
              total,
              isEmpty: false,
              itemCount,
              isMinimumOrderMet: false,
              remainingForMinimum,
              errors: [],
              hasErrors: false,
              incrementItem: jest.fn(),
              decrementItem: jest.fn(),
              removeItem: jest.fn(),
              clearCart: jest.fn(),
              addItem: jest.fn(),
              updateQuantity: jest.fn(),
              checkForErrors: jest.fn(),
              dismissError: jest.fn(),
              clearErrors: jest.fn(),
              updateItemPrice: jest.fn(),
              getItemById: jest.fn(),
              isItemInCart: jest.fn(),
              getItemQuantity: jest.fn(),
              canAddItem: jest.fn(),
            });

            const { getByText } = render(<CartScreen />);

            // Should display minimum order warning
            const warningText = `Add $${remainingForMinimum.toFixed(2)} more to meet the $${restaurant.minimumOrder.toFixed(2)} minimum`;
            expect(getByText(warningText)).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display empty state when cart is empty', () => {
      fc.assert(
        fc.property(
          fc.constant(null), // No specific data needed for empty state
          () => {
            mockUseCart.mockReturnValue({
              items: [],
              restaurant: undefined,
              subtotal: 0,
              deliveryFee: 0,
              tax: 0,
              total: 0,
              isEmpty: true,
              itemCount: 0,
              isMinimumOrderMet: true,
              remainingForMinimum: 0,
              errors: [],
              hasErrors: false,
              incrementItem: jest.fn(),
              decrementItem: jest.fn(),
              removeItem: jest.fn(),
              clearCart: jest.fn(),
              addItem: jest.fn(),
              updateQuantity: jest.fn(),
              checkForErrors: jest.fn(),
              dismissError: jest.fn(),
              clearErrors: jest.fn(),
              updateItemPrice: jest.fn(),
              getItemById: jest.fn(),
              isItemInCart: jest.fn(),
              getItemQuantity: jest.fn(),
              canAddItem: jest.fn(),
            });

            const { getByText } = render(<CartScreen />);

            // Should display empty state elements
            expect(getByText('Your Cart')).toBeTruthy();
            expect(getByText('Your cart is empty')).toBeTruthy();
            expect(getByText('Add some delicious items from our restaurants to get started')).toBeTruthy();
            expect(getByText('Browse Restaurants')).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display quantity controls for each cart item', () => {
      fc.assert(
        fc.property(
          fc.array(cartItemGenerator, { minLength: 1, maxLength: 3 }),
          restaurantGenerator,
          (items, restaurant) => {
            const subtotal = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
            const deliveryFee = restaurant.deliveryFee;
            const tax = subtotal * 0.08;
            const total = subtotal + deliveryFee + tax;
            const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
            
            mockUseCart.mockReturnValue({
              items,
              restaurant,
              subtotal,
              deliveryFee,
              tax,
              total,
              isEmpty: false,
              itemCount,
              isMinimumOrderMet: subtotal >= restaurant.minimumOrder,
              remainingForMinimum: Math.max(0, restaurant.minimumOrder - subtotal),
              errors: [],
              hasErrors: false,
              incrementItem: jest.fn(),
              decrementItem: jest.fn(),
              removeItem: jest.fn(),
              clearCart: jest.fn(),
              addItem: jest.fn(),
              updateQuantity: jest.fn(),
              checkForErrors: jest.fn(),
              dismissError: jest.fn(),
              clearErrors: jest.fn(),
              updateItemPrice: jest.fn(),
              getItemById: jest.fn(),
              isItemInCart: jest.fn(),
              getItemQuantity: jest.fn(),
              canAddItem: jest.fn(),
            });

            const { getAllByLabelText } = render(<CartScreen />);

            // Should have quantity controls for each item
            const decreaseButtons = getAllByLabelText('Decrease quantity');
            const increaseButtons = getAllByLabelText('Increase quantity');
            const removeButtons = getAllByLabelText('Remove item');

            expect(decreaseButtons).toHaveLength(items.length);
            expect(increaseButtons).toHaveLength(items.length);
            expect(removeButtons).toHaveLength(items.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display complete pricing breakdown with correct calculations', () => {
      fc.assert(
        fc.property(
          fc.array(cartItemGenerator, { minLength: 1, maxLength: 3 }),
          restaurantGenerator,
          (items, restaurant) => {
            const subtotal = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
            const deliveryFee = restaurant.deliveryFee;
            const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax rate, rounded
            const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
            const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
            
            mockUseCart.mockReturnValue({
              items,
              restaurant,
              subtotal,
              deliveryFee,
              tax,
              total,
              isEmpty: false,
              itemCount,
              isMinimumOrderMet: subtotal >= restaurant.minimumOrder,
              remainingForMinimum: Math.max(0, restaurant.minimumOrder - subtotal),
              errors: [],
              hasErrors: false,
              incrementItem: jest.fn(),
              decrementItem: jest.fn(),
              removeItem: jest.fn(),
              clearCart: jest.fn(),
              addItem: jest.fn(),
              updateQuantity: jest.fn(),
              checkForErrors: jest.fn(),
              dismissError: jest.fn(),
              clearErrors: jest.fn(),
              updateItemPrice: jest.fn(),
              getItemById: jest.fn(),
              isItemInCart: jest.fn(),
              getItemQuantity: jest.fn(),
              canAddItem: jest.fn(),
            });

            const { getByText, queryByText } = render(<CartScreen />);

            // Verify all pricing components are displayed
            expect(getByText('Subtotal')).toBeTruthy();
            expect(getByText('Delivery Fee')).toBeTruthy();
            expect(getByText('Tax')).toBeTruthy();
            expect(getByText('Total')).toBeTruthy();

            // Verify checkout button contains total price
            expect(queryByText(new RegExp(`Proceed to Checkout.*${total.toFixed(2)}`))).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
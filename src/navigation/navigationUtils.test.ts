/**
 * Navigation Utilities Tests
 */

import { navigationHelpers, SCREEN_NAMES } from './navigationUtils';

// Mock navigation object
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(),
  reset: jest.fn(),
};

describe('Navigation Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('navigationHelpers', () => {
    it('should navigate to restaurant detail with correct parameters', () => {
      const restaurantId = 'restaurant-123';
      navigationHelpers.goToRestaurantDetail(mockNavigation as any, restaurantId);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('RestaurantDetail', { restaurantId });
    });

    it('should navigate to cart screen', () => {
      navigationHelpers.goToCart(mockNavigation as any);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Cart');
    });

    it('should navigate to checkout screen', () => {
      navigationHelpers.goToCheckout(mockNavigation as any);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Checkout');
    });

    it('should navigate to order confirmation with correct parameters', () => {
      const orderId = 'order-456';
      navigationHelpers.goToOrderConfirmation(mockNavigation as any, orderId);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('OrderConfirmation', { orderId });
    });

    it('should reset navigation to home screen', () => {
      navigationHelpers.goToHome(mockNavigation as any);
      
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    });

    it('should go back when navigation can go back', () => {
      mockNavigation.canGoBack.mockReturnValue(true);
      navigationHelpers.goBack(mockNavigation as any);
      
      expect(mockNavigation.canGoBack).toHaveBeenCalled();
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });

    it('should not go back when navigation cannot go back', () => {
      mockNavigation.canGoBack.mockReturnValue(false);
      navigationHelpers.goBack(mockNavigation as any);
      
      expect(mockNavigation.canGoBack).toHaveBeenCalled();
      expect(mockNavigation.goBack).not.toHaveBeenCalled();
    });
  });

  describe('SCREEN_NAMES', () => {
    it('should have all required screen names defined', () => {
      expect(SCREEN_NAMES.HOME).toBe('Home');
      expect(SCREEN_NAMES.RESTAURANT_DETAIL).toBe('RestaurantDetail');
      expect(SCREEN_NAMES.CART).toBe('Cart');
      expect(SCREEN_NAMES.CHECKOUT).toBe('Checkout');
      expect(SCREEN_NAMES.ORDER_CONFIRMATION).toBe('OrderConfirmation');
    });

    it('should have consistent screen names with navigation routes', () => {
      // Verify that screen names match the routes defined in AppNavigator
      const expectedRoutes = [
        'Home',
        'RestaurantDetail', 
        'Cart',
        'Checkout',
        'OrderConfirmation'
      ];
      
      const screenNameValues = Object.values(SCREEN_NAMES);
      expectedRoutes.forEach(route => {
        expect(screenNameValues).toContain(route);
      });
    });
  });
});
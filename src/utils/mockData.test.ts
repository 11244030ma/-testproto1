/**
 * Tests for Mock Data Generators
 */

import {
  generateMockRestaurant,
  generateMockMenuItem,
  generateMockAddress,
  generateMockPaymentMethod,
  generateMockUser,
  generateMockCartItem,
  generateMockOrder,
  generateMockRestaurants,
  generateMockMenuItems,
  generateMockRestaurantWithMenu,
  sampleRestaurants,
  sampleUser,
} from './mockData';

describe('Mock Data Generators', () => {
  describe('generateMockRestaurant', () => {
    it('should generate a valid restaurant object', () => {
      const restaurant = generateMockRestaurant();
      
      expect(restaurant).toHaveProperty('id');
      expect(restaurant).toHaveProperty('name');
      expect(restaurant).toHaveProperty('description');
      expect(restaurant).toHaveProperty('cuisineType');
      expect(restaurant).toHaveProperty('rating');
      expect(restaurant).toHaveProperty('reviewCount');
      expect(restaurant).toHaveProperty('deliveryTime');
      expect(restaurant).toHaveProperty('deliveryFee');
      expect(restaurant).toHaveProperty('minimumOrder');
      expect(restaurant).toHaveProperty('imageUrl');
      expect(restaurant).toHaveProperty('heroImageUrl');
      expect(restaurant).toHaveProperty('isOpen');
      expect(restaurant).toHaveProperty('location');
      
      expect(typeof restaurant.id).toBe('string');
      expect(typeof restaurant.name).toBe('string');
      expect(Array.isArray(restaurant.cuisineType)).toBe(true);
      expect(typeof restaurant.rating).toBe('number');
      expect(restaurant.rating).toBeGreaterThanOrEqual(3.5);
      expect(restaurant.rating).toBeLessThanOrEqual(5.0);
      expect(typeof restaurant.isOpen).toBe('boolean');
    });

    it('should accept overrides', () => {
      const overrides = {
        name: 'Test Restaurant',
        rating: 4.5,
        isOpen: false,
      };
      
      const restaurant = generateMockRestaurant(overrides);
      
      expect(restaurant.name).toBe('Test Restaurant');
      expect(restaurant.rating).toBe(4.5);
      expect(restaurant.isOpen).toBe(false);
    });
  });

  describe('generateMockMenuItem', () => {
    it('should generate a valid menu item object', () => {
      const restaurantId = 'test-restaurant-id';
      const menuItem = generateMockMenuItem(restaurantId);
      
      expect(menuItem).toHaveProperty('id');
      expect(menuItem).toHaveProperty('restaurantId');
      expect(menuItem).toHaveProperty('name');
      expect(menuItem).toHaveProperty('description');
      expect(menuItem).toHaveProperty('price');
      expect(menuItem).toHaveProperty('imageUrl');
      expect(menuItem).toHaveProperty('category');
      expect(menuItem).toHaveProperty('dietaryInfo');
      expect(menuItem).toHaveProperty('isAvailable');
      
      expect(menuItem.restaurantId).toBe(restaurantId);
      expect(typeof menuItem.price).toBe('number');
      expect(menuItem.price).toBeGreaterThan(0);
      expect(typeof menuItem.isAvailable).toBe('boolean');
      
      // Check dietary info structure
      expect(menuItem.dietaryInfo).toHaveProperty('isVegetarian');
      expect(menuItem.dietaryInfo).toHaveProperty('isVegan');
      expect(menuItem.dietaryInfo).toHaveProperty('isGlutenFree');
      expect(menuItem.dietaryInfo).toHaveProperty('allergens');
      expect(Array.isArray(menuItem.dietaryInfo.allergens)).toBe(true);
    });
  });

  describe('generateMockAddress', () => {
    it('should generate a valid address object', () => {
      const address = generateMockAddress();
      
      expect(address).toHaveProperty('id');
      expect(address).toHaveProperty('label');
      expect(address).toHaveProperty('street');
      expect(address).toHaveProperty('city');
      expect(address).toHaveProperty('state');
      expect(address).toHaveProperty('zipCode');
      expect(address).toHaveProperty('country');
      expect(address).toHaveProperty('coordinates');
      
      expect(typeof address.id).toBe('string');
      expect(typeof address.street).toBe('string');
      expect(address.country).toBe('United States');
      expect(address.coordinates).toHaveProperty('latitude');
      expect(address.coordinates).toHaveProperty('longitude');
    });
  });

  describe('generateMockPaymentMethod', () => {
    it('should generate a valid payment method object', () => {
      const paymentMethod = generateMockPaymentMethod();
      
      expect(paymentMethod).toHaveProperty('id');
      expect(paymentMethod).toHaveProperty('type');
      expect(paymentMethod).toHaveProperty('isDefault');
      
      expect(typeof paymentMethod.id).toBe('string');
      expect(['card', 'paypal', 'apple_pay', 'google_pay']).toContain(paymentMethod.type);
      expect(typeof paymentMethod.isDefault).toBe('boolean');
      
      // If it's a card, should have last4 and brand
      if (paymentMethod.type === 'card') {
        expect(paymentMethod).toHaveProperty('last4');
        expect(paymentMethod).toHaveProperty('brand');
        expect(typeof paymentMethod.last4).toBe('string');
        expect(paymentMethod.last4).toHaveLength(4);
      }
    });
  });

  describe('generateMockUser', () => {
    it('should generate a valid user object', () => {
      const user = generateMockUser();
      
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('phone');
      expect(user).toHaveProperty('savedAddresses');
      expect(user).toHaveProperty('savedPaymentMethods');
      expect(user).toHaveProperty('orderHistory');
      expect(user).toHaveProperty('preferences');
      
      expect(typeof user.id).toBe('string');
      expect(typeof user.name).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(user.email).toContain('@');
      expect(Array.isArray(user.savedAddresses)).toBe(true);
      expect(Array.isArray(user.savedPaymentMethods)).toBe(true);
      expect(Array.isArray(user.orderHistory)).toBe(true);
      expect(user.preferences).toHaveProperty('dietaryRestrictions');
      expect(user.preferences).toHaveProperty('favoriteCuisines');
    });
  });

  describe('generateMockCartItem', () => {
    it('should generate a valid cart item object', () => {
      const menuItem = generateMockMenuItem('test-restaurant');
      const cartItem = generateMockCartItem(menuItem);
      
      expect(cartItem).toHaveProperty('menuItem');
      expect(cartItem).toHaveProperty('quantity');
      expect(cartItem).toHaveProperty('selectedOptions');
      
      expect(cartItem.menuItem).toBe(menuItem);
      expect(typeof cartItem.quantity).toBe('number');
      expect(cartItem.quantity).toBeGreaterThan(0);
      expect(Array.isArray(cartItem.selectedOptions)).toBe(true);
    });
  });

  describe('generateMockOrder', () => {
    it('should generate a valid order object with correct calculations', () => {
      const user = generateMockUser();
      const restaurant = generateMockRestaurant();
      const menuItem1 = generateMockMenuItem(restaurant.id, { price: 20.00 });
      const menuItem2 = generateMockMenuItem(restaurant.id, { price: 15.00 });
      const cartItems = [
        generateMockCartItem(menuItem1, { quantity: 2 }),
        generateMockCartItem(menuItem2, { quantity: 1 }),
      ];
      
      const order = generateMockOrder(user, restaurant, cartItems);
      
      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('userId');
      expect(order).toHaveProperty('restaurant');
      expect(order).toHaveProperty('items');
      expect(order).toHaveProperty('subtotal');
      expect(order).toHaveProperty('deliveryFee');
      expect(order).toHaveProperty('tax');
      expect(order).toHaveProperty('total');
      expect(order).toHaveProperty('deliveryAddress');
      expect(order).toHaveProperty('paymentMethod');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('estimatedDeliveryTime');
      expect(order).toHaveProperty('createdAt');
      expect(order).toHaveProperty('updatedAt');
      
      expect(order.userId).toBe(user.id);
      expect(order.restaurant).toBe(restaurant);
      expect(order.items).toBe(cartItems);
      
      // Check calculations
      const expectedSubtotal = 20.00 * 2 + 15.00 * 1; // 55.00
      expect(order.subtotal).toBe(expectedSubtotal);
      expect(order.deliveryFee).toBe(restaurant.deliveryFee);
      expect(order.tax).toBeCloseTo(expectedSubtotal * 0.0875, 2);
      expect(order.total).toBeCloseTo(expectedSubtotal + restaurant.deliveryFee + (expectedSubtotal * 0.0875), 2);
    });
  });

  describe('Batch generators', () => {
    it('should generate multiple restaurants', () => {
      const restaurants = generateMockRestaurants(5);
      
      expect(Array.isArray(restaurants)).toBe(true);
      expect(restaurants).toHaveLength(5);
      
      restaurants.forEach(restaurant => {
        expect(restaurant).toHaveProperty('id');
        expect(restaurant).toHaveProperty('name');
      });
    });

    it('should generate multiple menu items for a restaurant', () => {
      const restaurantId = 'test-restaurant';
      const menuItems = generateMockMenuItems(restaurantId, 8);
      
      expect(Array.isArray(menuItems)).toBe(true);
      expect(menuItems).toHaveLength(8);
      
      menuItems.forEach(item => {
        expect(item.restaurantId).toBe(restaurantId);
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
      });
    });

    it('should generate restaurant with menu items', () => {
      const { restaurant, menuItems } = generateMockRestaurantWithMenu(10);
      
      expect(restaurant).toHaveProperty('id');
      expect(restaurant).toHaveProperty('name');
      expect(Array.isArray(menuItems)).toBe(true);
      expect(menuItems).toHaveLength(10);
      
      menuItems.forEach(item => {
        expect(item.restaurantId).toBe(restaurant.id);
      });
    });
  });

  describe('Sample data', () => {
    it('should provide sample restaurants', () => {
      expect(Array.isArray(sampleRestaurants)).toBe(true);
      expect(sampleRestaurants.length).toBeGreaterThan(0);
      
      sampleRestaurants.forEach(restaurant => {
        expect(restaurant).toHaveProperty('id');
        expect(restaurant).toHaveProperty('name');
      });
    });

    it('should provide sample user', () => {
      expect(sampleUser).toHaveProperty('id');
      expect(sampleUser).toHaveProperty('name');
      expect(sampleUser).toHaveProperty('email');
      expect(sampleUser.name).toBe('Alex Johnson');
    });
  });
});
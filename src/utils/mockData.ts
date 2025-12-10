/**
 * Mock Data Generators for Premium Food App
 * Used for development and testing purposes
 */

import { Restaurant, MenuItem, CartItem, User, Address, PaymentMethod, Order } from '../types';

// Sample data arrays for generating realistic mock data
const restaurantNames = [
  'The Garden Bistro',
  'Sage & Thyme',
  'Harvest Moon',
  'Olive Branch',
  'Golden Spoon',
  'Fresh & Co',
  'The Green Table',
  'Artisan Kitchen',
  'Farm to Fork',
  'Coastal Catch',
  'Mountain View Grill',
  'Urban Eats',
];

const cuisineTypes = [
  'Mediterranean',
  'Italian',
  'Asian Fusion',
  'American',
  'Mexican',
  'French',
  'Japanese',
  'Indian',
  'Thai',
  'Greek',
  'Vietnamese',
  'Korean',
];

const menuItemNames = {
  appetizers: [
    'Truffle Arancini',
    'Burrata & Prosciutto',
    'Crispy Brussels Sprouts',
    'Tuna Tartare',
    'Roasted Beet Salad',
  ],
  mains: [
    'Grilled Salmon',
    'Braised Short Ribs',
    'Wild Mushroom Risotto',
    'Herb-Crusted Chicken',
    'Seared Duck Breast',
    'Lobster Ravioli',
    'Wagyu Beef Burger',
    'Quinoa Buddha Bowl',
  ],
  desserts: [
    'Chocolate Lava Cake',
    'Tiramisu',
    'Crème Brûlée',
    'Seasonal Fruit Tart',
    'Gelato Selection',
  ],
};

const addresses = [
  { street: '123 Main St', city: 'San Francisco', state: 'CA', zipCode: '94102' },
  { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zipCode: '90210' },
  { street: '789 Pine Rd', city: 'New York', state: 'NY', zipCode: '10001' },
  { street: '321 Elm St', city: 'Chicago', state: 'IL', zipCode: '60601' },
  { street: '654 Maple Dr', city: 'Austin', state: 'TX', zipCode: '73301' },
];

const allergens = ['Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy'];

// Utility functions
const randomInt = (min: number, max: number): number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min: number, max: number, decimals: number = 2): number => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const randomChoice = <T>(array: T[]): T => 
  array[Math.floor(Math.random() * array.length)];

const randomChoices = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

const generateId = (): string => 
  Math.random().toString(36).substr(2, 9);

// Mock data generators
export const generateMockRestaurant = (overrides: Partial<Restaurant> = {}): Restaurant => {
  const name = randomChoice(restaurantNames);
  const cuisine = randomChoices(cuisineTypes, randomInt(1, 3));
  
  return {
    id: generateId(),
    name,
    description: `Experience authentic ${cuisine[0]} cuisine with a modern twist. Fresh ingredients, expertly prepared dishes, and warm hospitality await you.`,
    cuisineType: cuisine,
    rating: randomFloat(3.5, 5.0, 1),
    reviewCount: randomInt(50, 2000),
    deliveryTime: `${randomInt(20, 45)}-${randomInt(35, 60)} min`,
    deliveryFee: randomFloat(0, 5.99),
    minimumOrder: randomFloat(15, 35),
    imageUrl: `https://picsum.photos/400/300?random=${randomInt(1, 1000)}`,
    heroImageUrl: `https://picsum.photos/800/400?random=${randomInt(1, 1000)}`,
    isOpen: Math.random() > 0.2, // 80% chance of being open
    location: {
      address: randomChoice(addresses).street + ', ' + randomChoice(addresses).city,
      coordinates: {
        latitude: randomFloat(37.7, 37.8, 6),
        longitude: randomFloat(-122.5, -122.4, 6),
      },
    },
    ...overrides,
  };
};

export const generateMockMenuItem = (restaurantId: string, overrides: Partial<MenuItem> = {}): MenuItem => {
  const categories = Object.keys(menuItemNames) as Array<keyof typeof menuItemNames>;
  const category = randomChoice(categories);
  const name = randomChoice(menuItemNames[category]);
  
  return {
    id: generateId(),
    restaurantId,
    name,
    description: `Carefully crafted ${name.toLowerCase()} made with the finest seasonal ingredients and traditional techniques.`,
    price: randomFloat(12, 45),
    imageUrl: `https://picsum.photos/300/200?random=${randomInt(1, 1000)}`,
    category: category.charAt(0).toUpperCase() + category.slice(1),
    dietaryInfo: {
      isVegetarian: Math.random() > 0.7,
      isVegan: Math.random() > 0.8,
      isGlutenFree: Math.random() > 0.75,
      allergens: Math.random() > 0.5 ? randomChoices(allergens, randomInt(0, 3)) : [],
    },
    nutritionalInfo: Math.random() > 0.3 ? {
      calories: randomInt(200, 800),
      protein: randomInt(10, 50),
      carbs: randomInt(15, 60),
      fat: randomInt(5, 35),
    } : undefined,
    isAvailable: Math.random() > 0.1, // 90% chance of being available
    ...overrides,
  };
};

export const generateMockAddress = (overrides: Partial<Address> = {}): Address => {
  const addressData = randomChoice(addresses);
  
  return {
    id: generateId(),
    label: randomChoice(['Home', 'Work', 'Other']),
    street: addressData.street,
    city: addressData.city,
    state: addressData.state,
    zipCode: addressData.zipCode,
    country: 'United States',
    coordinates: {
      latitude: randomFloat(37.7, 37.8, 6),
      longitude: randomFloat(-122.5, -122.4, 6),
    },
    deliveryInstructions: Math.random() > 0.6 ? 'Please ring doorbell' : undefined,
    ...overrides,
  };
};

export const generateMockPaymentMethod = (overrides: Partial<PaymentMethod> = {}): PaymentMethod => {
  const types: PaymentMethod['type'][] = ['card', 'paypal', 'apple_pay', 'google_pay'];
  const type = randomChoice(types);
  
  return {
    id: generateId(),
    type,
    last4: type === 'card' ? randomInt(1000, 9999).toString() : undefined,
    brand: type === 'card' ? randomChoice(['Visa', 'Mastercard', 'Amex']) : undefined,
    isDefault: Math.random() > 0.7,
    ...overrides,
  };
};

export const generateMockUser = (overrides: Partial<User> = {}): User => {
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  
  const firstName = randomChoice(firstNames);
  const lastName = randomChoice(lastNames);
  
  return {
    id: generateId(),
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    phone: `+1${randomInt(200, 999)}${randomInt(200, 999)}${randomInt(1000, 9999)}`,
    savedAddresses: Array.from({ length: randomInt(1, 3) }, () => generateMockAddress()),
    savedPaymentMethods: Array.from({ length: randomInt(1, 2) }, () => generateMockPaymentMethod()),
    orderHistory: [], // Will be populated separately if needed
    preferences: {
      dietaryRestrictions: randomChoices(['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'], randomInt(0, 2)),
      favoriteCuisines: randomChoices(cuisineTypes, randomInt(2, 4)),
    },
    ...overrides,
  };
};

export const generateMockCartItem = (menuItem: MenuItem, overrides: Partial<CartItem> = {}): CartItem => {
  return {
    menuItem,
    quantity: randomInt(1, 3),
    specialInstructions: Math.random() > 0.7 ? 'Extra sauce on the side' : undefined,
    selectedOptions: [], // Simplified for now
    ...overrides,
  };
};

export const generateMockOrder = (
  user: User,
  restaurant: Restaurant,
  items: CartItem[],
  overrides: Partial<Order> = {}
): Order => {
  const subtotal = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const deliveryFee = restaurant.deliveryFee;
  const tax = subtotal * 0.0875; // 8.75% tax rate
  const total = subtotal + deliveryFee + tax;
  
  const statuses: Order['status'][] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
  
  return {
    id: generateId(),
    userId: user.id,
    restaurant,
    items,
    subtotal: parseFloat(subtotal.toFixed(2)),
    deliveryFee: parseFloat(deliveryFee.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    deliveryAddress: user.savedAddresses[0] || generateMockAddress(),
    paymentMethod: user.savedPaymentMethods[0] || generateMockPaymentMethod(),
    status: randomChoice(statuses),
    estimatedDeliveryTime: `${randomInt(25, 60)} minutes`,
    createdAt: new Date(Date.now() - randomInt(0, 7 * 24 * 60 * 60 * 1000)), // Within last week
    updatedAt: new Date(),
    ...overrides,
  };
};

// Batch generators for creating multiple items
export const generateMockRestaurants = (count: number): Restaurant[] => 
  Array.from({ length: count }, () => generateMockRestaurant());

export const generateMockMenuItems = (restaurantId: string, count: number): MenuItem[] => 
  Array.from({ length: count }, () => generateMockMenuItem(restaurantId));

export const generateMockRestaurantWithMenu = (menuItemCount: number = 12): { restaurant: Restaurant; menuItems: MenuItem[] } => {
  const restaurant = generateMockRestaurant();
  const menuItems = generateMockMenuItems(restaurant.id, menuItemCount);
  
  return { restaurant, menuItems };
};

// Predefined sample data for consistent development experience
export const sampleRestaurants: Restaurant[] = [
  generateMockRestaurant({
    name: 'The Garden Bistro',
    cuisineType: ['Mediterranean', 'Healthy'],
    rating: 4.8,
    deliveryTime: '25-35 min',
    isOpen: true,
  }),
  generateMockRestaurant({
    name: 'Sage & Thyme',
    cuisineType: ['Italian', 'European'],
    rating: 4.6,
    deliveryTime: '30-40 min',
    isOpen: true,
  }),
  generateMockRestaurant({
    name: 'Harvest Moon',
    cuisineType: ['American', 'Farm-to-Table'],
    rating: 4.7,
    deliveryTime: '35-45 min',
    isOpen: false,
  }),
];

export const sampleUser: User = generateMockUser({
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  preferences: {
    dietaryRestrictions: ['Vegetarian'],
    favoriteCuisines: ['Mediterranean', 'Italian', 'Asian Fusion'],
  },
  savedPaymentMethods: [
    {
      id: 'pm-1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true,
    },
    {
      id: 'pm-2',
      type: 'card',
      last4: '8888',
      brand: 'Mastercard',
      isDefault: false,
    },
  ],
});
/**
 * Data Types for Premium Food App
 */

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisineType: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string; // e.g., "25-35 min"
  deliveryFee: number;
  minimumOrder: number;
  imageUrl: string;
  heroImageUrl: string;
  isOpen: boolean;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  dietaryInfo: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    allergens: string[];
  };
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  isAvailable: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  selectedOptions?: {
    optionId: string;
    choiceId: string;
  }[];
}

export interface Address {
  id: string;
  label: string; // e.g., "Home", "Work"
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  deliveryInstructions?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  restaurant: Restaurant;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  estimatedDeliveryTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  savedAddresses: Address[];
  savedPaymentMethods: PaymentMethod[];
  orderHistory: Order[];
  preferences: {
    dietaryRestrictions: string[];
    favoriteCuisines: string[];
  };
}

// Form validation types
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface CheckoutFormData {
  deliveryAddress: Omit<Address, 'id'>;
  paymentMethod: PaymentMethod;
  contactInfo: {
    email: string;
    phone: string;
  };
  specialInstructions?: string;
}

export interface UserRegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AddressFormData {
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  deliveryInstructions?: string;
}

// Search and filter types
export interface SearchFilters {
  cuisineTypes: string[];
  dietaryRestrictions: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  deliveryTime?: {
    max: number; // in minutes
  };
  rating?: {
    min: number;
  };
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Restaurant[];
  isLoading: boolean;
  hasError: boolean;
}

// Cart state types
export interface CartState {
  items: CartItem[];
  restaurant?: Restaurant;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  RestaurantDetail: { restaurantId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  Profile: undefined;
  Search: { initialQuery?: string };
};

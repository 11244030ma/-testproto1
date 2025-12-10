/**
 * OrderConfirmationScreen Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OrderConfirmationScreen } from './OrderConfirmationScreen';
import { ThemeProvider } from '../designSystem/ThemeProvider';
import { useCartStore } from '../stores/cartStore';
import { useUserStore } from '../stores/userStore';
import { sampleUser } from '../utils/mockData';

// Mock the stores
jest.mock('../stores/cartStore');
jest.mock('../stores/userStore');

const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>;
const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>;

const Stack = createStackNavigator();

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="OrderConfirmation" component={() => <>{children}</>} />
      </Stack.Navigator>
    </NavigationContainer>
  </ThemeProvider>
);

describe('OrderConfirmationScreen', () => {
  beforeEach(() => {
    // Mock cart store
    mockUseCartStore.mockReturnValue({
      items: [
        {
          menuItem: {
            id: '1',
            restaurantId: 'rest-1',
            name: 'Test Item',
            description: 'Test description',
            price: 12.99,
            imageUrl: 'test-image.jpg',
            category: 'Main',
            dietaryInfo: {
              isVegetarian: false,
              isVegan: false,
              isGlutenFree: false,
              allergens: [],
            },
            isAvailable: true,
          },
          quantity: 2,
        },
      ],
      restaurant: {
        id: 'rest-1',
        name: 'Test Restaurant',
        description: 'Test description',
        cuisineType: ['Italian'],
        rating: 4.5,
        reviewCount: 100,
        deliveryTime: '25-35 min',
        deliveryFee: 2.99,
        minimumOrder: 15,
        imageUrl: 'test-image.jpg',
        heroImageUrl: 'test-hero.jpg',
        isOpen: true,
        location: {
          address: '123 Test St, Test City',
          coordinates: { latitude: 37.7749, longitude: -122.4194 },
        },
      },
      subtotal: 25.98,
      deliveryFee: 2.99,
      tax: 2.08,
      total: 31.05,
      clearCart: jest.fn(),
    } as any);

    // Mock user store
    mockUseUserStore.mockReturnValue({
      user: sampleUser,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render order confirmation with success message', () => {
    const { getByText } = render(
      <TestWrapper>
        <OrderConfirmationScreen />
      </TestWrapper>
    );

    expect(getByText('Order Confirmed!')).toBeTruthy();
    expect(getByText('Thank you for your order. We\'ll prepare it with care.')).toBeTruthy();
  });

  it('should display order status timeline', () => {
    const { getByText } = render(
      <TestWrapper>
        <OrderConfirmationScreen />
      </TestWrapper>
    );

    expect(getByText('Order Status')).toBeTruthy();
    expect(getByText('Order Confirmed')).toBeTruthy();
    expect(getByText('Preparing')).toBeTruthy();
    expect(getByText('On the Way')).toBeTruthy();
    expect(getByText('Delivered')).toBeTruthy();
  });

  it('should show estimated delivery time', () => {
    const { getByText } = render(
      <TestWrapper>
        <OrderConfirmationScreen />
      </TestWrapper>
    );

    expect(getByText('Estimated Delivery')).toBeTruthy();
    expect(getByText('25-35 min')).toBeTruthy();
  });

  it('should display restaurant information', () => {
    const { getByText } = render(
      <TestWrapper>
        <OrderConfirmationScreen />
      </TestWrapper>
    );

    expect(getByText('Restaurant Details')).toBeTruthy();
    expect(getByText('Test Restaurant')).toBeTruthy();
    expect(getByText('123 Test St, Test City')).toBeTruthy();
  });

  it('should show order summary with items and totals', () => {
    const { getByText } = render(
      <TestWrapper>
        <OrderConfirmationScreen />
      </TestWrapper>
    );

    expect(getByText('Order Summary')).toBeTruthy();
    expect(getByText('Test Item')).toBeTruthy();
    expect(getByText('Qty: 2')).toBeTruthy();
    expect(getByText('$25.98')).toBeTruthy(); // Subtotal
    expect(getByText('$31.05')).toBeTruthy(); // Total
  });

  it('should display delivery address when user has saved addresses', () => {
    const { getByText } = render(
      <TestWrapper>
        <OrderConfirmationScreen />
      </TestWrapper>
    );

    expect(getByText('Delivery Address')).toBeTruthy();
  });

  it('should show help section with options', () => {
    const { getByText } = render(
      <TestWrapper>
        <OrderConfirmationScreen />
      </TestWrapper>
    );

    expect(getByText('Need Help?')).toBeTruthy();
    expect(getByText('View Receipt')).toBeTruthy();
    expect(getByText('Contact Support')).toBeTruthy();
  });

  it('should have track order and back to home buttons', () => {
    const { getByText } = render(
      <TestWrapper>
        <OrderConfirmationScreen />
      </TestWrapper>
    );

    expect(getByText('Track Order')).toBeTruthy();
    expect(getByText('Back to Home')).toBeTruthy();
  });
});
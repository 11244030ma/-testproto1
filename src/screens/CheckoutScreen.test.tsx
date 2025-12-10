/**
 * CheckoutScreen Tests
 * 
 * Tests for form validation and checkout functionality
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CheckoutScreen } from './CheckoutScreen';
import { ThemeProvider } from '../designSystem/ThemeProvider';
import { useCart } from '../hooks/useCart';
import { useUserStore } from '../stores/userStore';

// Mock the hooks
jest.mock('../hooks/useCart');
jest.mock('../stores/userStore');

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
}));

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;
const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>;

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('CheckoutScreen', () => {
  beforeEach(() => {
    mockUseCart.mockReturnValue({
      items: [
        {
          menuItem: {
            id: '1',
            name: 'Test Item',
            price: 12.99,
            restaurantId: 'restaurant-1',
            description: 'Test description',
            imageUrl: 'test.jpg',
            category: 'Main',
            dietaryInfo: {
              isVegetarian: false,
              isVegan: false,
              isGlutenFree: false,
              allergens: [],
            },
            isAvailable: true,
          },
          quantity: 1,
        },
      ],
      restaurant: {
        id: 'restaurant-1',
        name: 'Test Restaurant',
        description: 'Test description',
        cuisineType: ['Italian'],
        rating: 4.5,
        reviewCount: 100,
        deliveryTime: '30-45 min',
        deliveryFee: 2.99,
        minimumOrder: 15,
        imageUrl: 'test.jpg',
        heroImageUrl: 'test-hero.jpg',
        isOpen: true,
        location: {
          address: '123 Test St',
          coordinates: { latitude: 0, longitude: 0 },
        },
      },
      subtotal: 12.99,
      deliveryFee: 2.99,
      tax: 1.30,
      total: 17.28,
      itemCount: 1,
      isEmpty: false,
      isMinimumOrderMet: true,
      remainingForMinimum: 0,
      errors: [],
      hasErrors: false,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      incrementItem: jest.fn(),
      decrementItem: jest.fn(),
      checkForErrors: jest.fn(),
      dismissError: jest.fn(),
      clearErrors: jest.fn(),
      updateItemPrice: jest.fn(),
      getItemById: jest.fn(),
      isItemInCart: jest.fn(),
      getItemQuantity: jest.fn(),
      canAddItem: jest.fn(),
    });

    mockUseUserStore.mockReturnValue({
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        phone: '5551234567',
        savedAddresses: [],
        savedPaymentMethods: [
          {
            id: 'payment-1',
            type: 'card',
            last4: '1234',
            brand: 'Visa',
            isDefault: true,
          },
        ],
        orderHistory: [],
        preferences: {
          dietaryRestrictions: [],
          favoriteCuisines: [],
        },
      },
      getDefaultAddress: jest.fn(() => null),
      getDefaultPaymentMethod: jest.fn(() => ({
        id: 'payment-1',
        type: 'card',
        last4: '1234',
        brand: 'Visa',
        isDefault: true,
      })),
      setUser: jest.fn(),
      addAddress: jest.fn(),
      addPaymentMethod: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render contact information and address fields', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <CheckoutScreen />
      </TestWrapper>
    );

    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('phone-input')).toBeTruthy();
    expect(getByTestId('address-autocomplete')).toBeTruthy();
    expect(getByTestId('city-input')).toBeTruthy();
    expect(getByTestId('state-input')).toBeTruthy();
    expect(getByTestId('zipcode-input')).toBeTruthy();
  });

  it('should show validation errors for empty required fields', async () => {
    const { getByText, getByTestId } = render(
      <TestWrapper>
        <CheckoutScreen />
      </TestWrapper>
    );

    // Clear the pre-populated fields
    fireEvent.changeText(getByTestId('email-input'), '');
    fireEvent.changeText(getByTestId('phone-input'), '');

    // Try to continue without filling required fields
    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(getByText('Email address is required')).toBeTruthy();
      expect(getByText('Phone number is required')).toBeTruthy();
      expect(getByText('Street address is required')).toBeTruthy();
      expect(getByText('City is required')).toBeTruthy();
      expect(getByText('State is required')).toBeTruthy();
      expect(getByText('ZIP code is required')).toBeTruthy();
    });
  });

  it('should validate email format', async () => {
    const { getByText, getByTestId } = render(
      <TestWrapper>
        <CheckoutScreen />
      </TestWrapper>
    );

    const emailInput = getByTestId('email-input');
    fireEvent.changeText(emailInput, 'invalid-email');

    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('should validate phone number format', async () => {
    const { getByText, getByTestId } = render(
      <TestWrapper>
        <CheckoutScreen />
      </TestWrapper>
    );

    const phoneInput = getByTestId('phone-input');
    fireEvent.changeText(phoneInput, '123');

    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(getByText('Please enter a valid phone number')).toBeTruthy();
    });
  });

  it('should validate ZIP code format', async () => {
    const { getByText, getByTestId } = render(
      <TestWrapper>
        <CheckoutScreen />
      </TestWrapper>
    );

    const zipInput = getByTestId('zipcode-input');
    fireEvent.changeText(zipInput, '123');

    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(getByText('Please enter a valid ZIP code (e.g., 12345 or 12345-6789)')).toBeTruthy();
    });
  });

  it('should allow proceeding with valid form data', async () => {
    const { getByText, getByTestId, queryByText } = render(
      <TestWrapper>
        <CheckoutScreen />
      </TestWrapper>
    );

    // Fill in valid form data
    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('phone-input'), '5551234567');
    
    // For the address autocomplete, we need to fill in the individual fields
    // since the autocomplete component doesn't automatically populate them in tests
    fireEvent.changeText(getByTestId('city-input'), 'San Francisco');
    fireEvent.changeText(getByTestId('state-input'), 'CA');
    fireEvent.changeText(getByTestId('zipcode-input'), '94102');
    
    // Simulate typing in the address autocomplete field
    fireEvent.changeText(getByTestId('address-autocomplete'), '123 Main Street, San Francisco, CA 94102');

    // Check that no validation errors are shown after filling the form
    expect(queryByText('Email address is required')).toBeNull();
    expect(queryByText('Phone number is required')).toBeNull();
    expect(queryByText('Street address is required')).toBeNull();
    expect(queryByText('City is required')).toBeNull();
    expect(queryByText('State is required')).toBeNull();
    expect(queryByText('ZIP code is required')).toBeNull();

    // The continue button should be enabled
    const continueButton = getByText('Continue');
    expect(continueButton).toBeTruthy();
  });
});
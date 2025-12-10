/**
 * CheckoutScreen Component
 * 
 * Handles the checkout process with progress indicator, form sections,
 * order summary, and confirmation
 */

import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Box, Text, Button, Input, Icon, AddressAutocomplete, AddPaymentMethodModal } from '../components';
import { useCart } from '../hooks/useCart';
import { useUserStore } from '../stores/userStore';
import { colors, spacing, borderRadius } from '../designSystem/tokens';
import { 
  RootStackParamList, 
  Address, 
  PaymentMethod, 
  CheckoutFormData,
  FormErrors 
} from '../types';
import { 
  isValidEmail, 
  isValidPhone, 
  isValidAddress, 
  isValidZipCode,
  isNotEmpty,
  formatPhoneNumber 
} from '../utils/validationUtils';

type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

interface ProgressStepProps {
  step: number;
  currentStep: number;
  title: string;
  isCompleted: boolean;
}

const ProgressStep: React.FC<ProgressStepProps> = ({ 
  step, 
  currentStep, 
  title, 
  isCompleted 
}) => {
  const isActive = step === currentStep;
  const isPast = step < currentStep;
  
  return (
    <Box flexDirection="row" alignItems="center" flex={1}>
      <Box
        width={32}
        height={32}
        borderRadius="medium"
        backgroundColor={
          isCompleted || isPast 
            ? colors.accent.primary 
            : isActive 
            ? colors.accent.primary 
            : colors.border.light
        }
        justifyContent="center"
        alignItems="center"
      >
        {isCompleted || isPast ? (
          <Icon name="check" size={16} color={colors.background.surface} />
        ) : (
          <Text 
            variant="caption" 
            weight="medium" 
            color={isActive ? colors.background.surface : colors.text.tertiary}
          >
            {step}
          </Text>
        )}
      </Box>
      <Text 
        variant="caption" 
        weight="medium" 
        color={isActive ? colors.text.primary : colors.text.secondary}
        style={{ marginLeft: spacing.sm, flex: 1 }}
      >
        {title}
      </Text>
    </Box>
  );
};

interface AddressSectionProps {
  address: Partial<Address>;
  contactInfo: CheckoutFormData['contactInfo'];
  addressInputText: string;
  onAddressChange: (field: keyof Address, value: string) => void;
  onContactInfoChange: (field: keyof CheckoutFormData['contactInfo'], value: string) => void;
  onAddressInputTextChange: (text: string) => void;
  onAddressSelect: (address: Partial<Address>) => void;
  errors: FormErrors;
}

const AddressSection: React.FC<AddressSectionProps> = ({ 
  address, 
  contactInfo,
  addressInputText,
  onAddressChange, 
  onContactInfoChange,
  onAddressInputTextChange,
  onAddressSelect,
  errors 
}) => {
  return (
    <Box>
      <Text variant="subheading" weight="semibold" style={{ marginBottom: spacing.lg }}>
        Contact Information
      </Text>
      
      <Input
        label="Email Address"
        placeholder="your.email@example.com"
        value={contactInfo.email}
        onChangeText={(text) => onContactInfoChange('email', text)}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        style={{ marginBottom: spacing.lg }}
        testID="email-input"
      />
      
      <Input
        label="Phone Number"
        placeholder="(555) 123-4567"
        value={contactInfo.phone}
        onChangeText={(text) => onContactInfoChange('phone', text)}
        error={errors.phone}
        keyboardType="phone-pad"
        autoComplete="tel"
        style={{ marginBottom: spacing.xl }}
        testID="phone-input"
      />
      
      <Text variant="subheading" weight="semibold" style={{ marginBottom: spacing.lg }}>
        Delivery Address
      </Text>
      
      <Box style={{ marginBottom: spacing.lg }}>
        <AddressAutocomplete
          label="Street Address"
          placeholder="Start typing your address..."
          value={addressInputText}
          onTextChange={onAddressInputTextChange}
          onAddressSelect={onAddressSelect}
          error={errors.street}
          testID="address-autocomplete"
        />
      </Box>
      
      <Box flexDirection="row" gap="md" style={{ marginBottom: spacing.lg }}>
        <Box flex={2}>
          <Input
            label="City"
            placeholder="San Francisco"
            value={address.city || ''}
            onChangeText={(text) => onAddressChange('city', text)}
            error={errors.city}
            testID="city-input"
          />
        </Box>
        <Box flex={1}>
          <Input
            label="State"
            placeholder="CA"
            value={address.state || ''}
            onChangeText={(text) => onAddressChange('state', text)}
            error={errors.state}
            maxLength={2}
            autoCapitalize="characters"
            testID="state-input"
          />
        </Box>
      </Box>
      
      <Input
        label="ZIP Code"
        placeholder="94102"
        value={address.zipCode || ''}
        onChangeText={(text) => onAddressChange('zipCode', text)}
        error={errors.zipCode}
        keyboardType="numeric"
        maxLength={10}
        style={{ marginBottom: spacing.lg }}
        testID="zipcode-input"
      />
      
      <Input
        label="Delivery Instructions (Optional)"
        placeholder="Leave at door, ring bell, etc."
        value={address.deliveryInstructions || ''}
        onChangeText={(text) => onAddressChange('deliveryInstructions', text)}
        multiline
        numberOfLines={3}
        testID="instructions-input"
      />
    </Box>
  );
};

interface PaymentSectionProps {
  selectedPaymentMethod: PaymentMethod | null;
  onPaymentMethodSelect: (method: PaymentMethod) => void;
  onAddPaymentMethod: () => void;
  savedPaymentMethods: PaymentMethod[];
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ 
  selectedPaymentMethod, 
  onPaymentMethodSelect, 
  onAddPaymentMethod,
  savedPaymentMethods 
}) => {
  return (
    <Box>
      <Text variant="subheading" weight="semibold" style={{ marginBottom: spacing.lg }}>
        Payment Method
      </Text>
      
      {savedPaymentMethods.length > 0 ? (
        <Box>
          {savedPaymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => onPaymentMethodSelect(method)}
              style={{
                backgroundColor: colors.background.surface,
                borderRadius: borderRadius.medium,
                padding: spacing.lg,
                marginBottom: spacing.md,
                borderWidth: 2,
                borderColor: selectedPaymentMethod?.id === method.id 
                  ? colors.accent.primary 
                  : colors.border.light,
              }}
            >
              <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                <Box flexDirection="row" alignItems="center">
                  <Icon 
                    name={method.type === 'card' ? 'credit-card' : 'smartphone'} 
                    size={20} 
                    color={colors.text.secondary} 
                  />
                  <Box marginLeft="md">
                    <Text variant="body" weight="medium">
                      {method.brand ? `${method.brand} ` : ''}
                      {method.type === 'card' ? `•••• ${method.last4}` : method.type}
                    </Text>
                    {method.isDefault && (
                      <Text variant="caption" color={colors.accent.primary}>
                        Default
                      </Text>
                    )}
                  </Box>
                </Box>
                {selectedPaymentMethod?.id === method.id && (
                  <Icon name="check-circle" size={20} color={colors.accent.primary} />
                )}
              </Box>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            onPress={onAddPaymentMethod}
            style={{
              backgroundColor: colors.background.surface,
              borderRadius: borderRadius.medium,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.medium,
              borderStyle: 'dashed',
            }}
          >
            <Box flexDirection="row" alignItems="center" justifyContent="center">
              <Icon name="plus" size={20} color={colors.accent.primary} />
              <Text 
                variant="body" 
                weight="medium" 
                color={colors.accent.primary}
                style={{ marginLeft: spacing.sm }}
              >
                Add New Payment Method
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      ) : (
        <Box
          backgroundColor={colors.background.surface}
          borderRadius="medium"
          padding="xl"
          alignItems="center"
        >
          <Icon name="credit-card" size={32} color={colors.text.tertiary} />
          <Text 
            variant="body" 
            color={colors.text.secondary} 
            align="center"
            style={{ marginTop: spacing.md, marginBottom: spacing.lg }}
          >
            No payment methods saved. Add one to continue.
          </Text>
          <Button variant="secondary" size="medium" onPress={onAddPaymentMethod}>
            Add Payment Method
          </Button>
        </Box>
      )}
    </Box>
  );
};

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  itemCount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  subtotal, 
  deliveryFee, 
  tax, 
  total, 
  itemCount 
}) => {
  return (
    <Box
      backgroundColor={colors.background.surface}
      borderRadius="medium"
      padding="lg"
      shadow="low"
    >
      <Text variant="subheading" weight="semibold" style={{ marginBottom: spacing.md }}>
        Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
      </Text>
      
      <Box flexDirection="row" justifyContent="space-between" marginBottom="sm">
        <Text variant="body" color={colors.text.secondary}>Subtotal</Text>
        <Text variant="body" weight="medium">${subtotal.toFixed(2)}</Text>
      </Box>
      
      <Box flexDirection="row" justifyContent="space-between" marginBottom="sm">
        <Text variant="body" color={colors.text.secondary}>Delivery Fee</Text>
        <Text variant="body" weight="medium">${deliveryFee.toFixed(2)}</Text>
      </Box>
      
      <Box flexDirection="row" justifyContent="space-between" marginBottom="md">
        <Text variant="body" color={colors.text.secondary}>Tax</Text>
        <Text variant="body" weight="medium">${tax.toFixed(2)}</Text>
      </Box>
      
      <Box
        height={1}
        backgroundColor={colors.border.light}
        marginBottom="md"
      />
      
      <Box flexDirection="row" justifyContent="space-between">
        <Text variant="subheading" weight="semibold">Total</Text>
        <Text variant="subheading" weight="bold">${total.toFixed(2)}</Text>
      </Box>
    </Box>
  );
};

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const { 
    items, 
    restaurant, 
    subtotal, 
    deliveryFee, 
    tax, 
    total, 
    itemCount,
    isEmpty 
  } = useCart();
  const { 
    user, 
    getDefaultAddress, 
    getDefaultPaymentMethod,
    addPaymentMethod 
  } = useUserStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutFormData>({
    deliveryAddress: {
      label: 'Home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      coordinates: { latitude: 0, longitude: 0 },
      deliveryInstructions: '',
    },
    paymentMethod: getDefaultPaymentMethod() || {
      id: '',
      type: 'card',
      isDefault: false,
    },
    contactInfo: {
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressInputText, setAddressInputText] = useState('');
  const [isAddPaymentModalVisible, setIsAddPaymentModalVisible] = useState(false);

  // Initialize form with user's default data
  useEffect(() => {
    const defaultAddress = getDefaultAddress();
    const defaultPayment = getDefaultPaymentMethod();
    
    if (defaultAddress) {
      setFormData(prev => ({
        ...prev,
        deliveryAddress: {
          ...defaultAddress,
          label: defaultAddress.label || 'Home',
        },
      }));
      
      // Set the address input text to the full address string
      const fullAddress = `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.zipCode}`;
      setAddressInputText(fullAddress);
    }
    
    if (defaultPayment) {
      setFormData(prev => ({
        ...prev,
        paymentMethod: defaultPayment,
      }));
    }
    
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          email: user.email || '',
          phone: user.phone || '',
        },
      }));
    }
  }, [getDefaultAddress, getDefaultPaymentMethod, user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (isEmpty) {
      navigation.navigate('Home');
    }
  }, [isEmpty, navigation]);

  const handleAddressChange = (field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        [field]: value,
      },
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
    
    // Real-time validation for address fields
    if (value.length > 0) {
      validateField(field, value);
    }
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const handleAddPaymentMethod = () => {
    setIsAddPaymentModalVisible(true);
  };

  const handlePaymentMethodAdded = (newPaymentMethod: PaymentMethod) => {
    // Add to user's saved payment methods
    addPaymentMethod(newPaymentMethod);
    
    // Select the new payment method
    setFormData(prev => ({
      ...prev,
      paymentMethod: newPaymentMethod,
    }));
  };

  const handleContactInfoChange = (field: keyof CheckoutFormData['contactInfo'], value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
    
    // Real-time validation for better UX
    if (value.length > 0) {
      validateField(field, value);
    }
  };

  const handleAddressInputTextChange = (text: string) => {
    setAddressInputText(text);
    
    // Clear address-related errors when user starts typing
    if (errors.street) {
      setErrors(prev => ({
        ...prev,
        street: undefined,
      }));
    }
  };

  const handleAddressSelect = (selectedAddress: Partial<Address>) => {
    setFormData(prev => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        ...selectedAddress,
      },
    }));
    
    // Clear all address-related errors
    setErrors(prev => ({
      ...prev,
      street: undefined,
      city: undefined,
      state: undefined,
      zipCode: undefined,
    }));
  };

  const validateField = (field: string, value: string) => {
    let error: string | undefined;
    
    switch (field) {
      case 'email':
        if (!isValidEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!isValidPhone(value)) {
          error = 'Please enter a valid phone number';
        }
        break;
      case 'zipCode':
        if (!isValidZipCode(value)) {
          error = 'Please enter a valid ZIP code';
        }
        break;
      case 'state':
        if (value.length > 0 && value.length !== 2) {
          error = 'Please enter a valid 2-letter state code';
        }
        break;
    }
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    
    if (step === 1) {
      // Validate contact information
      if (!isNotEmpty(formData.contactInfo.email)) {
        newErrors.email = 'Email address is required';
      } else if (!isValidEmail(formData.contactInfo.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!isNotEmpty(formData.contactInfo.phone)) {
        newErrors.phone = 'Phone number is required';
      } else if (!isValidPhone(formData.contactInfo.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      
      // Validate address fields - check both the structured address and the input text
      const hasStreetAddress = isNotEmpty(formData.deliveryAddress.street) || isNotEmpty(addressInputText);
      if (!hasStreetAddress) {
        newErrors.street = 'Street address is required';
      } else if (formData.deliveryAddress.street.length > 0 && formData.deliveryAddress.street.length < 5) {
        newErrors.street = 'Please enter a complete street address';
      } else if (addressInputText.length > 0 && addressInputText.length < 5) {
        newErrors.street = 'Please enter a complete street address';
      }
      
      if (!isNotEmpty(formData.deliveryAddress.city)) {
        newErrors.city = 'City is required';
      } else if (formData.deliveryAddress.city.length < 2) {
        newErrors.city = 'Please enter a valid city name';
      }
      
      if (!isNotEmpty(formData.deliveryAddress.state)) {
        newErrors.state = 'State is required';
      } else if (formData.deliveryAddress.state.length !== 2) {
        newErrors.state = 'Please enter a valid 2-letter state code';
      }
      
      if (!isNotEmpty(formData.deliveryAddress.zipCode)) {
        newErrors.zipCode = 'ZIP code is required';
      } else if (!isValidZipCode(formData.deliveryAddress.zipCode)) {
        newErrors.zipCode = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
      }
      
      // Validate complete address using utility function
      if (Object.keys(newErrors).length === 0 && !isValidAddress(formData.deliveryAddress)) {
        Alert.alert(
          'Invalid Address',
          'Please check that all address fields are filled out correctly.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } else if (step === 2) {
      // Validate payment method selection
      if (!formData.paymentMethod.id) {
        Alert.alert(
          'Payment Required', 
          'Please select a payment method to continue.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    // Validate all steps before placing order
    if (!validateStep(1) || !validateStep(2)) {
      Alert.alert(
        'Incomplete Information',
        'Please review and complete all required fields before placing your order.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate order placement with validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to order confirmation
      navigation.navigate('OrderConfirmation', { orderId: 'order-123' });
    } catch (error) {
      Alert.alert(
        'Order Failed',
        'There was an issue placing your order. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: 'Address', isCompleted: currentStep > 1 },
    { title: 'Payment', isCompleted: currentStep > 2 },
    { title: 'Review', isCompleted: false },
  ];

  if (isEmpty) {
    return null; // Will redirect in useEffect
  }

  return (
    <Box flex={1} backgroundColor={colors.background.primary}>
      {/* Header */}
      <Box
        backgroundColor={colors.background.surface}
        paddingHorizontal="lg"
        paddingVertical="xl"
        shadow="low"
      >
        <Box flexDirection="row" alignItems="center" marginBottom="lg">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: spacing.lg }}
          >
            <Icon name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text variant="heading2" weight="semibold">
            Checkout
          </Text>
        </Box>
        
        {/* Progress Indicator */}
        <Box flexDirection="row" alignItems="center" gap="md">
          {steps.map((step, index) => (
            <ProgressStep
              key={index}
              step={index + 1}
              currentStep={currentStep}
              title={step.title}
              isCompleted={step.isCompleted}
            />
          ))}
        </Box>
      </Box>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Content */}
        {currentStep === 1 && (
          <AddressSection
            address={formData.deliveryAddress}
            contactInfo={formData.contactInfo}
            addressInputText={addressInputText}
            onAddressChange={handleAddressChange}
            onContactInfoChange={handleContactInfoChange}
            onAddressInputTextChange={handleAddressInputTextChange}
            onAddressSelect={handleAddressSelect}
            errors={errors}
          />
        )}
        
        {currentStep === 2 && (
          <PaymentSection
            selectedPaymentMethod={formData.paymentMethod}
            onPaymentMethodSelect={handlePaymentMethodSelect}
            onAddPaymentMethod={handleAddPaymentMethod}
            savedPaymentMethods={user?.savedPaymentMethods || []}
          />
        )}
        
        {currentStep === 3 && (
          <Box>
            <Text variant="subheading" weight="semibold" style={{ marginBottom: spacing.lg }}>
              Review Your Order
            </Text>
            
            {/* Contact Information Summary */}
            <Box
              backgroundColor={colors.background.surface}
              borderRadius="medium"
              padding="lg"
              marginBottom="lg"
              shadow="low"
            >
              <Text variant="body" weight="medium" style={{ marginBottom: spacing.sm }}>
                Contact Information
              </Text>
              <Text variant="body" color={colors.text.secondary}>
                {formData.contactInfo.email}
              </Text>
              <Text variant="body" color={colors.text.secondary}>
                {formatPhoneNumber(formData.contactInfo.phone)}
              </Text>
            </Box>
            
            {/* Address Summary */}
            <Box
              backgroundColor={colors.background.surface}
              borderRadius="medium"
              padding="lg"
              marginBottom="lg"
              shadow="low"
            >
              <Text variant="body" weight="medium" style={{ marginBottom: spacing.sm }}>
                Delivery Address
              </Text>
              <Text variant="body" color={colors.text.secondary}>
                {formData.deliveryAddress.street}
              </Text>
              <Text variant="body" color={colors.text.secondary}>
                {formData.deliveryAddress.city}, {formData.deliveryAddress.state} {formData.deliveryAddress.zipCode}
              </Text>
              {formData.deliveryAddress.deliveryInstructions && (
                <Text variant="caption" color={colors.text.tertiary} style={{ marginTop: spacing.sm }}>
                  Instructions: {formData.deliveryAddress.deliveryInstructions}
                </Text>
              )}
            </Box>
            
            {/* Payment Summary */}
            <Box
              backgroundColor={colors.background.surface}
              borderRadius="medium"
              padding="lg"
              marginBottom="lg"
              shadow="low"
            >
              <Text variant="body" weight="medium" style={{ marginBottom: spacing.sm }}>
                Payment Method
              </Text>
              <Box flexDirection="row" alignItems="center">
                <Icon 
                  name={formData.paymentMethod.type === 'card' ? 'credit-card' : 'smartphone'} 
                  size={20} 
                  color={colors.text.secondary} 
                />
                <Text variant="body" color={colors.text.secondary} style={{ marginLeft: spacing.sm }}>
                  {formData.paymentMethod.brand ? `${formData.paymentMethod.brand} ` : ''}
                  {formData.paymentMethod.type === 'card' 
                    ? `•••• ${formData.paymentMethod.last4}` 
                    : formData.paymentMethod.type
                  }
                </Text>
              </Box>
            </Box>
            
            {/* Order Summary */}
            <OrderSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              tax={tax}
              total={total}
              itemCount={itemCount}
            />
          </Box>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <Box
        backgroundColor={colors.background.surface}
        paddingHorizontal="lg"
        paddingVertical="xl"
        shadow="medium"
      >
        <Box flexDirection="row" gap="md">
          {currentStep > 1 && (
            <Button
              variant="secondary"
              size="large"
              onPress={handlePreviousStep}
              style={{ flex: 1 }}
            >
              Back
            </Button>
          )}
          
          <Button
            variant="primary"
            size="large"
            onPress={currentStep === 3 ? handlePlaceOrder : handleNextStep}
            disabled={isSubmitting}
            style={{ flex: currentStep === 1 ? 1 : 2 }}
          >
            {isSubmitting 
              ? 'Placing Order...' 
              : currentStep === 3 
              ? `Place Order • $${total.toFixed(2)}` 
              : 'Continue'
            }
          </Button>
        </Box>
      </Box>

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        visible={isAddPaymentModalVisible}
        onClose={() => setIsAddPaymentModalVisible(false)}
        onAddPaymentMethod={handlePaymentMethodAdded}
      />
    </Box>
  );
};
/**
 * AddPaymentMethodModal Component
 * 
 * Modal for adding new payment methods with form validation
 */

import React, { useState } from 'react';
import { Modal, TouchableOpacity, Alert } from 'react-native';
import { Box, Text, Button, Input, Icon } from './';
import { colors, spacing, borderRadius } from '../designSystem/tokens';
import { PaymentMethod } from '../types';
import { 
  isValidCardNumber, 
  isValidExpiryDate, 
  isValidCVV, 
  isNotEmpty,
  formatCardNumber,
  formatExpiryDate 
} from '../utils/validationUtils';

interface AddPaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onAddPaymentMethod: (paymentMethod: PaymentMethod) => void;
}

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  isDefault: boolean;
}

interface PaymentFormErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

const generateId = (): string => 
  Math.random().toString(36).substr(2, 9);

const getCardBrand = (cardNumber: string): string => {
  const number = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(number)) return 'Visa';
  if (/^5[1-5]/.test(number)) return 'Mastercard';
  if (/^3[47]/.test(number)) return 'Amex';
  if (/^6/.test(number)) return 'Discover';
  
  return 'Card';
};

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  visible,
  onClose,
  onAddPaymentMethod,
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    isDefault: false,
  });
  
  const [errors, setErrors] = useState<PaymentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof PaymentFormData, value: string | boolean) => {
    let processedValue = value;
    
    // Format card number and expiry date as user types
    if (field === 'cardNumber' && typeof value === 'string') {
      processedValue = formatCardNumber(value);
    } else if (field === 'expiryDate' && typeof value === 'string') {
      processedValue = formatExpiryDate(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue,
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof PaymentFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: PaymentFormErrors = {};
    
    if (!isNotEmpty(formData.cardholderName)) {
      newErrors.cardholderName = 'Cardholder name is required';
    } else if (formData.cardholderName.length < 2) {
      newErrors.cardholderName = 'Please enter a valid name';
    }
    
    if (!isNotEmpty(formData.cardNumber)) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!isValidCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!isNotEmpty(formData.expiryDate)) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!isValidExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!isNotEmpty(formData.cvv)) {
      newErrors.cvv = 'CVV is required';
    } else if (!isValidCVV(formData.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPaymentMethod: PaymentMethod = {
        id: generateId(),
        type: 'card',
        last4: formData.cardNumber.slice(-4),
        brand: getCardBrand(formData.cardNumber),
        isDefault: formData.isDefault,
      };
      
      onAddPaymentMethod(newPaymentMethod);
      handleClose();
      
      Alert.alert(
        'Payment Method Added',
        'Your payment method has been successfully added.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to add payment method. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      isDefault: false,
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <Box flex={1} backgroundColor={colors.background.primary}>
        {/* Header */}
        <Box
          backgroundColor={colors.background.surface}
          paddingHorizontal="lg"
          paddingVertical="xl"
          shadow="low"
        >
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <TouchableOpacity onPress={handleClose}>
              <Text variant="body" color={colors.accent.primary}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text variant="heading3" weight="semibold">
              Add Payment Method
            </Text>
            <Box width={60} /> {/* Spacer for centering */}
          </Box>
        </Box>

        {/* Form */}
        <Box flex={1} padding="lg">
          <Input
            label="Cardholder Name"
            placeholder="John Doe"
            value={formData.cardholderName}
            onChangeText={(text) => handleInputChange('cardholderName', text)}
            error={errors.cardholderName}
            autoCapitalize="words"
            style={{ marginBottom: spacing.lg }}
            testID="cardholder-name-input"
          />
          
          <Input
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChangeText={(text) => handleInputChange('cardNumber', text)}
            error={errors.cardNumber}
            keyboardType="numeric"
            maxLength={19} // Includes spaces
            style={{ marginBottom: spacing.lg }}
            testID="card-number-input"
          />
          
          <Box flexDirection="row" gap="md" style={{ marginBottom: spacing.lg }}>
            <Box flex={1}>
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChangeText={(text) => handleInputChange('expiryDate', text)}
                error={errors.expiryDate}
                keyboardType="numeric"
                maxLength={5}
                testID="expiry-date-input"
              />
            </Box>
            <Box flex={1}>
              <Input
                label="CVV"
                placeholder="123"
                value={formData.cvv}
                onChangeText={(text) => handleInputChange('cvv', text)}
                error={errors.cvv}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                testID="cvv-input"
              />
            </Box>
          </Box>
          
          {/* Make Default Toggle */}
          <TouchableOpacity
            onPress={() => handleInputChange('isDefault', !formData.isDefault)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: spacing.md,
              marginBottom: spacing.xl,
            }}
          >
            <Box
              width={24}
              height={24}
              borderRadius="small"
              backgroundColor={formData.isDefault ? colors.accent.primary : 'transparent'}
              justifyContent="center"
              alignItems="center"
              marginRight="md"
              style={{
                borderWidth: 2,
                borderColor: formData.isDefault ? colors.accent.primary : colors.border.medium,
              }}
            >
              {formData.isDefault && (
                <Icon name="check" size={16} color={colors.background.surface} />
              )}
            </Box>
            <Text variant="body" color={colors.text.primary}>
              Make this my default payment method
            </Text>
          </TouchableOpacity>
          
          {/* Security Notice */}
          <Box
            backgroundColor={colors.background.surface}
            borderRadius="medium"
            padding="lg"
            marginBottom="xl"
          >
            <Box flexDirection="row" alignItems="center" marginBottom="sm">
              <Icon name="check-circle" size={20} color={colors.accent.primary} />
              <Text 
                variant="body" 
                weight="medium" 
                color={colors.text.primary}
                style={{ marginLeft: spacing.sm }}
              >
                Secure Payment
              </Text>
            </Box>
            <Text variant="caption" color={colors.text.secondary}>
              Your payment information is encrypted and secure. We never store your full card number.
            </Text>
          </Box>
        </Box>

        {/* Bottom Actions */}
        <Box
          backgroundColor={colors.background.surface}
          paddingHorizontal="lg"
          paddingVertical="xl"
          shadow="medium"
        >
          <Button
            variant="primary"
            size="large"
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Payment Method...' : 'Add Payment Method'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
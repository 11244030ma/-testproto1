/**
 * OrderConfirmationScreen Component
 * 
 * Displays order confirmation with calm, reassuring aesthetic
 * Shows order details, estimated delivery time, and next actions
 */

import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Box, Text, Button, Icon, Card } from '../components';
import { useCart } from '../hooks/useCart';
import { useUserStore } from '../stores/userStore';
import { colors, spacing } from '../designSystem/tokens';
import { RootStackParamList } from '../types';
import { formatPrice } from '../utils/validationUtils';

type OrderConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'OrderConfirmation'>;
type OrderConfirmationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OrderConfirmation'>;

interface OrderSummaryItemProps {
  name: string;
  quantity: number;
  price: number;
}

const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({ name, quantity, price }) => (
  <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="sm">
    <Box flex={1}>
      <Text variant="body" weight="medium" numberOfLines={1}>
        {name}
      </Text>
      <Text variant="caption" color={colors.text.secondary}>
        Qty: {quantity}
      </Text>
    </Box>
    <Text variant="body" weight="medium">
      {formatPrice(price * quantity)}
    </Text>
  </Box>
);

interface StatusTimelineProps {
  currentStatus: 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  estimatedTime: string;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, estimatedTime }) => {
  const statuses = [
    { key: 'confirmed', label: 'Order Confirmed', icon: 'check-circle' },
    { key: 'preparing', label: 'Preparing', icon: 'clock' },
    { key: 'out_for_delivery', label: 'On the Way', icon: 'location' },
    { key: 'delivered', label: 'Delivered', icon: 'check' },
  ] as const;

  const currentIndex = statuses.findIndex(status => status.key === currentStatus);

  return (
    <Box>
      <Text 
        variant="subheading" 
        weight="semibold" 
        style={{ marginBottom: spacing.lg }}
      >
        Order Status
      </Text>
      
      <Box flexDirection="row" alignItems="center" marginBottom="lg">
        {statuses.map((status, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isUpcoming = index > currentIndex;
          
          return (
            <Box key={status.key} flex={1} alignItems="center">
              {/* Status Icon */}
              <Box
                width={40}
                height={40}
                borderRadius="large"
                backgroundColor={
                  isCompleted || isActive 
                    ? colors.accent.primary 
                    : colors.background.surface
                }
                justifyContent="center"
                alignItems="center"
                marginBottom="sm"
                style={{
                  borderWidth: isUpcoming ? 2 : 0,
                  borderColor: colors.border.light,
                }}
              >
                <Icon 
                  name={status.icon} 
                  size={20} 
                  color={
                    isCompleted || isActive 
                      ? colors.background.surface 
                      : colors.text.tertiary
                  } 
                />
              </Box>
              
              {/* Status Label */}
              <Text 
                variant="caption" 
                weight={isActive ? "semibold" : "regular"}
                color={
                  isActive 
                    ? colors.text.primary 
                    : isCompleted 
                    ? colors.accent.primary 
                    : colors.text.secondary
                }
                align="center"
              >
                {status.label}
              </Text>
              
              {/* Connector Line */}
              {index < statuses.length - 1 && (
                <Box
                  height={2}
                  backgroundColor={
                    index < currentIndex 
                      ? colors.accent.primary 
                      : colors.border.light
                  }
                  style={{ 
                    position: 'absolute',
                    top: 20,
                    left: '60%',
                    right: '-60%',
                    zIndex: -1 
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
      
      {/* Estimated Time */}
      <Box
        backgroundColor={colors.background.surface}
        borderRadius="medium"
        padding="lg"
        alignItems="center"
      >
        <Icon name="clock" size={24} color={colors.accent.primary} />
        <Text 
          variant="body" 
          weight="medium" 
          color={colors.text.primary}
          style={{ marginTop: spacing.sm }}
        >
          Estimated Delivery
        </Text>
        <Text 
          variant="heading3" 
          weight="bold" 
          color={colors.accent.primary}
          style={{ marginTop: spacing.xs }}
        >
          {estimatedTime}
        </Text>
      </Box>
    </Box>
  );
};

export const OrderConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<OrderConfirmationScreenNavigationProp>();
  const route = useRoute<OrderConfirmationScreenRouteProp>();
  const { orderId } = route.params;
  
  const { 
    items, 
    restaurant, 
    subtotal, 
    deliveryFee, 
    tax, 
    total,
    clearCart 
  } = useCart();
  const { user } = useUserStore();

  // Clear cart when order is confirmed
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleTrackOrder = () => {
    // Navigate to order tracking (to be implemented)
    console.log('Track order:', orderId);
  };

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const handleViewReceipt = () => {
    // Navigate to receipt view (to be implemented)
    console.log('View receipt for order:', orderId);
  };

  return (
    <Box flex={1} backgroundColor={colors.background.primary}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <Box alignItems="center" marginBottom="xl">
          <Box
            width={80}
            height={80}
            borderRadius="large"
            backgroundColor={colors.accent.primary}
            justifyContent="center"
            alignItems="center"
            marginBottom="lg"
          >
            <Icon name="check" size={32} color={colors.background.surface} />
          </Box>
          
          <Text 
            variant="heading2" 
            weight="bold" 
            align="center" 
            style={{ marginBottom: spacing.sm }}
          >
            Order Confirmed!
          </Text>
          
          <Text variant="body" color={colors.text.secondary} align="center">
            Thank you for your order. We'll prepare it with care.
          </Text>
          
          <Box
            backgroundColor={colors.background.surface}
            borderRadius="medium"
            paddingHorizontal="lg"
            paddingVertical="md"
            marginTop="lg"
          >
            <Text variant="caption" color={colors.text.secondary} align="center">
              Order ID
            </Text>
            <Text variant="body" weight="semibold" align="center">
              #{orderId}
            </Text>
          </Box>
        </Box>

        {/* Status Timeline */}
        <Box marginBottom="xl">
          <Card>
            <StatusTimeline 
              currentStatus="confirmed" 
              estimatedTime="25-35 min" 
            />
          </Card>
        </Box>

        {/* Restaurant Info */}
        {restaurant && (
          <Box marginBottom="xl">
            <Card>
              <Text 
                variant="subheading" 
                weight="semibold" 
                style={{ marginBottom: spacing.lg }}
              >
                Restaurant Details
              </Text>
            
            <Box flexDirection="row" alignItems="center" marginBottom="md">
              <Box
                width={50}
                height={50}
                borderRadius="medium"
                backgroundColor={colors.background.secondary}
                marginRight="md"
              />
              <Box flex={1}>
                <Text variant="body" weight="semibold">
                  {restaurant.name}
                </Text>
                <Text variant="caption" color={colors.text.secondary}>
                  {restaurant.location.address}
                </Text>
              </Box>
            </Box>
            
            <Box flexDirection="row" gap="md">
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.background.secondary,
                  borderRadius: 12,
                  padding: spacing.md,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="smartphone" size={16} color={colors.text.secondary} />
                <Text 
                  variant="caption" 
                  weight="medium" 
                  color={colors.text.secondary}
                  style={{ marginLeft: spacing.xs }}
                >
                  Call
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.background.secondary,
                  borderRadius: 12,
                  padding: spacing.md,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="location" size={16} color={colors.text.secondary} />
                <Text 
                  variant="caption" 
                  weight="medium" 
                  color={colors.text.secondary}
                  style={{ marginLeft: spacing.xs }}
                >
                  Directions
                </Text>
              </TouchableOpacity>
            </Box>
            </Card>
          </Box>
        )}

        {/* Order Summary */}
        <Box marginBottom="xl">
          <Card>
            <Text 
              variant="subheading" 
              weight="semibold" 
              style={{ marginBottom: spacing.lg }}
            >
              Order Summary
            </Text>
          
          {items.map((item, index) => (
            <OrderSummaryItem
              key={index}
              name={item.menuItem.name}
              quantity={item.quantity}
              price={item.menuItem.price}
            />
          ))}
          
          <Box
            height={1}
            backgroundColor={colors.border.light}
            marginVertical="md"
          />
          
          <Box flexDirection="row" justifyContent="space-between" marginBottom="sm">
            <Text variant="body" color={colors.text.secondary}>Subtotal</Text>
            <Text variant="body" weight="medium">{formatPrice(subtotal)}</Text>
          </Box>
          
          <Box flexDirection="row" justifyContent="space-between" marginBottom="sm">
            <Text variant="body" color={colors.text.secondary}>Delivery Fee</Text>
            <Text variant="body" weight="medium">{formatPrice(deliveryFee)}</Text>
          </Box>
          
          <Box flexDirection="row" justifyContent="space-between" marginBottom="md">
            <Text variant="body" color={colors.text.secondary}>Tax</Text>
            <Text variant="body" weight="medium">{formatPrice(tax)}</Text>
          </Box>
          
          <Box
            height={1}
            backgroundColor={colors.border.light}
            marginBottom="md"
          />
          
          <Box flexDirection="row" justifyContent="space-between">
            <Text variant="subheading" weight="semibold">Total</Text>
            <Text variant="subheading" weight="bold">{formatPrice(total)}</Text>
          </Box>
          </Card>
        </Box>

        {/* Delivery Address */}
        {user && user.savedAddresses.length > 0 && (
          <Box marginBottom="xl">
            <Card>
              <Text 
                variant="subheading" 
                weight="semibold" 
                style={{ marginBottom: spacing.lg }}
              >
                Delivery Address
              </Text>
            
            <Box flexDirection="row" alignItems="flex-start">
              <Icon name="location" size={20} color={colors.text.secondary} />
              <Box flex={1} marginLeft="md">
                <Text variant="body" weight="medium">
                  {user.savedAddresses[0].street}
                </Text>
                <Text variant="body" color={colors.text.secondary}>
                  {user.savedAddresses[0].city}, {user.savedAddresses[0].state} {user.savedAddresses[0].zipCode}
                </Text>
                {user.savedAddresses[0].deliveryInstructions && (
                  <Text variant="caption" color={colors.text.tertiary} style={{ marginTop: spacing.xs }}>
                    Instructions: {user.savedAddresses[0].deliveryInstructions}
                  </Text>
                )}
              </Box>
            </Box>
            </Card>
          </Box>
        )}

        {/* Help Section */}
        <Card>
          <Text 
            variant="subheading" 
            weight="semibold" 
            style={{ marginBottom: spacing.lg }}
          >
            Need Help?
          </Text>
          
          <TouchableOpacity
            onPress={handleViewReceipt}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: spacing.md,
            }}
          >
            <Icon name="credit-card" size={20} color={colors.text.secondary} />
            <Text 
              variant="body" 
              color={colors.text.primary}
              style={{ marginLeft: spacing.md, flex: 1 }}
            >
              View Receipt
            </Text>
            <Icon name="arrow-right" size={16} color={colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: spacing.md,
            }}
          >
            <Icon name="smartphone" size={20} color={colors.text.secondary} />
            <Text 
              variant="body" 
              color={colors.text.primary}
              style={{ marginLeft: spacing.md, flex: 1 }}
            >
              Contact Support
            </Text>
            <Icon name="arrow-right" size={16} color={colors.text.tertiary} />
          </TouchableOpacity>
        </Card>
      </ScrollView>

      {/* Bottom Actions */}
      <Box
        backgroundColor={colors.background.surface}
        paddingHorizontal="lg"
        paddingVertical="xl"
        shadow="medium"
      >
        <Box flexDirection="row" gap="md">
          <Button
            variant="secondary"
            size="large"
            onPress={handleTrackOrder}
            style={{ flex: 1 }}
          >
            Track Order
          </Button>
          
          <Button
            variant="primary"
            size="large"
            onPress={handleBackToHome}
            style={{ flex: 1 }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
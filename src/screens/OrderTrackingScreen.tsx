import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { Box, Text, Card, Icon, Button } from '../components';
import { colors, spacing, borderRadius, typography } from '../designSystem/tokens';
import { Order } from '../types';

const { width: screenWidth } = Dimensions.get('window');

interface OrderTrackingScreenProps {
  navigation: any; // TODO: Type this properly
  route: {
    params: {
      orderId: string;
    };
  };
}

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  time?: string;
  isCompleted: boolean;
  isActive: boolean;
}

// Mock order data - in real app this would come from API
const mockOrder: Order = {
  id: 'order-123',
  userId: 'user-1',
  restaurant: {
    id: 'rest-1',
    name: 'Bella Vista Italian',
    description: 'Authentic Italian cuisine',
    cuisineType: ['Italian'],
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    minimumOrder: 15,
    imageUrl: 'https://example.com/restaurant.jpg',
    heroImageUrl: 'https://example.com/hero.jpg',
    isOpen: true,
    location: {
      address: '123 Main St, San Francisco, CA',
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    },
  },
  items: [],
  subtotal: 28.50,
  deliveryFee: 2.99,
  tax: 2.85,
  total: 34.34,
  deliveryAddress: {
    id: 'addr-1',
    label: 'Home',
    street: '456 Oak Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    country: 'US',
    coordinates: {
      latitude: 37.7849,
      longitude: -122.4094,
    },
  },
  paymentMethod: {
    id: 'pm-1',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    isDefault: true,
  },
  status: 'preparing',
  estimatedDeliveryTime: '7:45 PM',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({
  navigation,
  route,
}) => {
  const { orderId } = route.params;
  const [order] = useState<Order>(mockOrder); // In real app, fetch by orderId
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getTrackingSteps = useCallback((status: OrderStatus): TrackingStep[] => {
    const steps: TrackingStep[] = [
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been received',
        time: '6:30 PM',
        isCompleted: true,
        isActive: false,
      },
      {
        status: 'preparing',
        title: 'Preparing Your Food',
        description: 'The restaurant is preparing your order',
        time: status === 'preparing' ? undefined : '6:45 PM',
        isCompleted: status !== 'confirmed',
        isActive: status === 'preparing',
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Your order is on the way',
        time: status === 'out_for_delivery' ? undefined : undefined,
        isCompleted: ['out_for_delivery', 'delivered'].includes(status),
        isActive: status === 'out_for_delivery',
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Enjoy your meal!',
        time: status === 'delivered' ? '7:45 PM' : undefined,
        isCompleted: status === 'delivered',
        isActive: false,
      },
    ];

    return steps;
  }, []);

  const trackingSteps = getTrackingSteps(order.status);

  const handleCallRestaurant = useCallback(() => {
    // In real app, this would be the restaurant's phone number
    const phoneNumber = '+1-555-0123';
    Linking.openURL(`tel:${phoneNumber}`);
  }, []);

  const handleCallDriver = useCallback(() => {
    // In real app, this would be the driver's phone number
    const phoneNumber = '+1-555-0456';
    Linking.openURL(`tel:${phoneNumber}`);
  }, []);

  const renderTrackingStep = (step: TrackingStep, index: number) => {
    const isLast = index === trackingSteps.length - 1;

    return (
      <Box key={step.status} flexDirection="row" alignItems="flex-start">
        {/* Timeline Indicator */}
        <Box alignItems="center" marginRight="lg">
          <Box
            width={24}
            height={24}
            borderRadius={12}
            backgroundColor={
              step.isCompleted || step.isActive ? 'accent.primary' : 'border.light'
            }
            justifyContent="center"
            alignItems="center"
          >
            {step.isCompleted && !step.isActive ? (
              <Icon name="check" size={14} color={colors.background.surface} />
            ) : step.isActive ? (
              <Box
                width={8}
                height={8}
                borderRadius={4}
                backgroundColor="background.surface"
              />
            ) : null}
          </Box>
          
          {!isLast && (
            <Box
              width={2}
              height={40}
              backgroundColor={
                step.isCompleted ? 'accent.primary' : 'border.light'
              }
              marginTop="xs"
            />
          )}
        </Box>

        {/* Step Content */}
        <Box flex={1} paddingBottom={isLast ? undefined : 'lg'}>
          <Box flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text
              variant="subheading"
              color={step.isActive ? colors.accent.primary : colors.text.primary}
              weight={step.isActive ? 'semibold' : 'medium'}
            >
              {step.title}
            </Text>
            
            {step.time && (
              <Text variant="caption" color="text.secondary">
                {step.time}
              </Text>
            )}
          </Box>
          
          <Text variant="body" color={colors.text.secondary} style={{ marginTop: 4 }}>
            {step.description}
          </Text>
          
          {step.isActive && (
            <Text variant="caption" color={colors.accent.primary} style={{ marginTop: 4 }}>
              Estimated completion: {order.estimatedDeliveryTime}
            </Text>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Box
        paddingHorizontal="lg"
        paddingTop="xl"
        paddingBottom="lg"
        backgroundColor="background.primary"
        style={styles.header}
      >
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          
          <Text variant="heading3" color="text.primary">
            Track Order
          </Text>
          
          <View style={{ width: 24 }} />
        </Box>
      </Box>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Info */}
        <Box paddingHorizontal="lg" marginBottom="xl">
          <Card style={styles.orderCard}>
            <Box padding="lg">
              <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="md">
                <Text variant="heading3" color="text.primary">
                  Order #{order.id.slice(-6).toUpperCase()}
                </Text>
                <Text variant="body" color="text.secondary">
                  ${order.total.toFixed(2)}
                </Text>
              </Box>
              
              <Text variant="body" color={colors.text.primary} style={{ marginBottom: 4 }}>
                {order.restaurant.name}
              </Text>
              
              <Text variant="caption" color="text.secondary">
                Delivering to {order.deliveryAddress.street}
              </Text>
            </Box>
          </Card>
        </Box>

        {/* Map Preview */}
        <Box paddingHorizontal="lg" marginBottom="xl">
          <Card style={styles.mapCard}>
            <Box
              height={200}
              backgroundColor="border.light"
              borderRadius="medium"
              justifyContent="center"
              alignItems="center"
            >
              <Icon name="map" size={48} color={colors.text.tertiary} />
              <Text variant="body" color={colors.text.secondary} style={{ marginTop: 8 }}>
                Map preview coming soon
              </Text>
            </Box>
          </Card>
        </Box>

        {/* Tracking Timeline */}
        <Box paddingHorizontal="lg" marginBottom="xl">
          <Text variant="heading3" color={colors.text.primary} style={{ marginBottom: 16 }}>
            Order Status
          </Text>
          
          <Card style={styles.timelineCard}>
            <Box padding="lg">
              {trackingSteps.map((step, index) => renderTrackingStep(step, index))}
            </Box>
          </Card>
        </Box>

        {/* Contact Options */}
        <Box paddingHorizontal="lg" marginBottom="xl">
          <Text variant="heading3" color={colors.text.primary} style={{ marginBottom: 16 }}>
            Need Help?
          </Text>
          
          <Box flexDirection="row" gap={spacing.md}>
            <Box flex={1}>
              <Button
                variant="secondary"
                onPress={handleCallRestaurant}
                style={styles.contactButton}
              >
                <Icon name="phone" size={16} color={colors.text.primary} />
                <Text variant="body" color={colors.text.primary} style={{ marginLeft: 4 }}>
                  Call Restaurant
                </Text>
              </Button>
            </Box>
            
            {order.status === 'out_for_delivery' && (
              <Box flex={1}>
                <Button
                  variant="secondary"
                  onPress={handleCallDriver}
                  style={styles.contactButton}
                >
                  <Icon name="truck" size={16} color={colors.text.primary} />
                  <Text variant="body" color={colors.text.primary} style={{ marginLeft: 4 }}>
                    Call Driver
                  </Text>
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  content: {
    flex: 1,
  },
  backButton: {
    padding: spacing.sm,
  },
  orderCard: {
    borderRadius: borderRadius.medium,
  },
  mapCard: {
    borderRadius: borderRadius.medium,
    padding: spacing.lg,
  },
  timelineCard: {
    borderRadius: borderRadius.medium,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
});
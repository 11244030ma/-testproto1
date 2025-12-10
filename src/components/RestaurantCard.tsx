/**
 * RestaurantCard Component
 * 
 * Card component for displaying restaurant information with image, details, and press interaction
 */

import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ViewStyle,
  ImageStyle,
  Animated,
  GestureResponderEvent,
} from 'react-native';
import { Text } from './Text';
import { Card } from './Card';
import { Icon } from './Icon';
import { colors, borderRadius, spacing, shadows, typography } from '../designSystem/tokens';
import { Restaurant } from '../types';

export interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress?: (restaurant: Restaurant) => void;
  style?: ViewStyle;
  testID?: string;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onPress,
  style,
  testID,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(restaurant);
  };

  const getImageStyle = (): ImageStyle => ({
    width: '100%',
    height: 160,
    borderRadius: borderRadius.large, // 22px as specified
    marginBottom: spacing.md,
  });

  const getOverlayStyle = (): ViewStyle => ({
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.low,
  });

  const getInfoContainerStyle = (): ViewStyle => ({
    flex: 1,
  });

  const getHeaderRowStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  });

  const getMetaRowStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  });

  const getRatingContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  });

  const getDeliveryInfoStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
  });

  const formatCuisineTypes = (cuisineTypes: string[]): string => {
    return cuisineTypes.slice(0, 2).join(', ');
  };

  const formatDeliveryFee = (fee: number): string => {
    return fee === 0 ? 'Free delivery' : `$${fee.toFixed(2)} delivery`;
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={`${restaurant.name} restaurant`}
        accessibilityHint="Tap to view restaurant details"
      >
        <Card elevation="light" style={{ padding: 0, overflow: 'hidden' }}>
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: restaurant.imageUrl }}
              style={getImageStyle()}
              resizeMode="cover"
            />
            
            {/* Status overlay */}
            <View style={getOverlayStyle()}>
              <Icon 
                name="clock" 
                size={16} 
                color={restaurant.isOpen ? colors.accent.primary : colors.error.primary}
              />
              <Text
                variant="caption"
                weight="medium"
                color={restaurant.isOpen ? colors.text.primary : colors.error.primary}
                style={{ marginLeft: spacing.xs }}
              >
                {restaurant.isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>

          <View style={{ padding: spacing.lg }}>
            <View style={getInfoContainerStyle()}>
              {/* Header row with name and delivery fee */}
              <View style={getHeaderRowStyle()}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Text
                    variant="subheading"
                    weight="semibold"
                    color={colors.text.primary}
                    numberOfLines={1}
                  >
                    {restaurant.name}
                  </Text>
                </View>
                <Text
                  variant="caption"
                  weight="medium"
                  color={colors.text.secondary}
                >
                  {formatDeliveryFee(restaurant.deliveryFee)}
                </Text>
              </View>

              {/* Cuisine types */}
              <Text
                variant="body"
                color={colors.text.secondary}
                numberOfLines={1}
                style={{ marginBottom: spacing.xs }}
              >
                {formatCuisineTypes(restaurant.cuisineType)}
              </Text>

              {/* Meta information row */}
              <View style={getMetaRowStyle()}>
                {/* Rating */}
                <View style={getRatingContainerStyle()}>
                  <Icon name="star" size={16} color={colors.accent.primary} />
                  <Text
                    variant="caption"
                    weight="medium"
                    color={colors.text.primary}
                    style={{ marginLeft: spacing.xs }}
                  >
                    {restaurant.rating.toFixed(1)}
                  </Text>
                  <Text
                    variant="caption"
                    color={colors.text.tertiary}
                    style={{ marginLeft: spacing.xs }}
                  >
                    ({restaurant.reviewCount})
                  </Text>
                </View>

                {/* Delivery info */}
                <View style={getDeliveryInfoStyle()}>
                  <Icon name="clock" size={16} color={colors.text.secondary} />
                  <Text
                    variant="caption"
                    color={colors.text.secondary}
                    style={{ marginLeft: spacing.xs }}
                  >
                    {restaurant.deliveryTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
};
/**
 * MenuItem Component
 * 
 * Horizontal layout component for displaying menu item with image, details, and add button
 */

import React, { useRef, useState } from 'react';
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
import { Button } from './Button';
import { Icon } from './Icon';
import { colors, borderRadius, spacing, typography } from '../designSystem/tokens';
import { MenuItem as MenuItemType } from '../types';

export interface MenuItemProps {
  menuItem: MenuItemType;
  onAddToCart?: (menuItem: MenuItemType) => void;
  onPress?: (menuItem: MenuItemType) => void;
  style?: ViewStyle;
  testID?: string;
  onAddToCartSuccess?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  menuItem,
  onAddToCart,
  onPress,
  style,
  testID,
  onAddToCartSuccess,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const addButtonScaleAnim = useRef(new Animated.Value(1)).current;
  const addButtonOpacityAnim = useRef(new Animated.Value(1)).current;
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handlePressIn = () => {
    if (onPress) {
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(menuItem);
  };

  const handleAddToCart = () => {
    if (isAddingToCart || !menuItem.isAvailable) return;
    
    setIsAddingToCart(true);
    
    // Micro-interaction animation: scale down then up with opacity change
    Animated.sequence([
      Animated.parallel([
        Animated.timing(addButtonScaleAnim, {
          toValue: 0.85,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(addButtonOpacityAnim, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(addButtonScaleAnim, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(addButtonOpacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(addButtonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAddingToCart(false);
      onAddToCartSuccess?.();
    });
    
    // Call the add to cart function
    onAddToCart?.(menuItem);
  };

  const getContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.md,
    opacity: menuItem.isAvailable ? 1 : 0.6,
  });

  const getImageStyle = (): ImageStyle => ({
    width: 80,
    height: 80,
    borderRadius: borderRadius.medium,
    marginRight: spacing.lg,
  });

  const getContentStyle = (): ViewStyle => ({
    flex: 1,
    justifyContent: 'space-between',
  });

  const getHeaderStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  });

  const getTitleContainerStyle = (): ViewStyle => ({
    flex: 1,
    marginRight: spacing.sm,
  });

  const getPriceStyle = (): ViewStyle => ({
    alignItems: 'flex-end',
  });

  const getDescriptionStyle = (): ViewStyle => ({
    marginBottom: spacing.sm,
  });

  const getFooterStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  });

  const getDietaryBadgesStyle = (): ViewStyle => ({
    flexDirection: 'row',
    flex: 1,
  });

  const getBadgeStyle = (): ViewStyle => ({
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.small,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
  });

  const getAddButtonStyle = (): ViewStyle => ({
    minWidth: 80,
  });

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const truncateDescription = (description: string, maxLength: number = 80): string => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
  };

  const getDietaryBadges = () => {
    const badges = [];
    
    if (menuItem.dietaryInfo.isVegetarian) {
      badges.push('V');
    }
    if (menuItem.dietaryInfo.isVegan) {
      badges.push('VG');
    }
    if (menuItem.dietaryInfo.isGlutenFree) {
      badges.push('GF');
    }
    
    return badges;
  };

  const renderContent = () => (
    <View style={getContainerStyle()}>
      <Image
        source={{ uri: menuItem.imageUrl }}
        style={getImageStyle()}
        resizeMode="cover"
      />
      
      <View style={getContentStyle()}>
        {/* Header with name and price */}
        <View style={getHeaderStyle()}>
          <View style={getTitleContainerStyle()}>
            <Text
              variant="subheading"
              weight="semibold"
              color={colors.text.primary}
              numberOfLines={1}
            >
              {menuItem.name}
            </Text>
          </View>
          
          <View style={getPriceStyle()}>
            <Text
              variant="subheading"
              weight="bold"
              color={colors.text.primary}
            >
              {formatPrice(menuItem.price)}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={getDescriptionStyle()}>
          <Text
            variant="body"
            color={colors.text.secondary}
            numberOfLines={2}
          >
            {truncateDescription(menuItem.description)}
          </Text>
        </View>

        {/* Footer with dietary badges and add button */}
        <View style={getFooterStyle()}>
          <View style={getDietaryBadgesStyle()}>
            {getDietaryBadges().map((badge, index) => (
              <View key={index} style={getBadgeStyle()}>
                <Text
                  variant="caption"
                  weight="medium"
                  color={colors.background.surface}
                >
                  {badge}
                </Text>
              </View>
            ))}
          </View>
          
          <Animated.View
            style={{
              transform: [{ scale: addButtonScaleAnim }],
              opacity: addButtonOpacityAnim,
            }}
          >
            <Button
              variant="primary"
              size="small"
              onPress={handleAddToCart}
              disabled={!menuItem.isAvailable || isAddingToCart}
              style={getAddButtonStyle()}
              testID={`${testID}-add-button`}
            >
              {isAddingToCart ? 'Adding...' : 'Add'}
            </Button>
          </Animated.View>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          testID={testID}
          accessibilityRole="button"
          accessibilityLabel={`${menuItem.name} menu item`}
          accessibilityHint="Tap to view item details"
        >
          {renderContent()}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={style} testID={testID}>
      {renderContent()}
    </View>
  );
};
/**
 * CartScreen Component
 * 
 * Displays cart items with quantity controls, pricing breakdown, and checkout button
 */

import React, { useEffect } from 'react';
import { ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Box, Text, Button, Icon, ErrorBanner } from '../components';
import { useCart } from '../hooks/useCart';
import { colors, spacing, borderRadius } from '../designSystem/tokens';
import { CartItem, RootStackParamList } from '../types';

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;

interface CartItemRowProps {
  item: CartItem;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ 
  item, 
  onIncrement, 
  onDecrement, 
  onRemove 
}) => {
  const isUnavailable = !item.menuItem.isAvailable;

  const handleRemove = () => {
    Alert.alert(
      'Remove Item',
      `Remove ${item.menuItem.name} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => onRemove(item.menuItem.id) },
      ]
    );
  };

  return (
    <Box
      backgroundColor={colors.background.surface}
      borderRadius="medium"
      padding="lg"
      marginBottom="md"
      shadow="low"
      flexDirection="row"
      alignItems="center"
    >
      {/* Item Image */}
      <Image
        source={{ uri: item.menuItem.imageUrl }}
        style={{
          width: 60,
          height: 60,
          borderRadius: borderRadius.small,
          backgroundColor: colors.background.secondary,
        }}
        resizeMode="cover"
      />

      {/* Item Details */}
      <Box flex={1} marginLeft="lg">
        <Box flexDirection="row" alignItems="center" gap="sm">
          <Text 
            variant="subheading" 
            weight="medium" 
            numberOfLines={1}
            style={{ 
              flex: 1,
              opacity: isUnavailable ? 0.6 : 1,
              textDecorationLine: isUnavailable ? 'line-through' : 'none',
            }}
          >
            {item.menuItem.name}
          </Text>
          {isUnavailable && (
            <Text variant="caption" color={colors.error.primary} weight="medium">
              Unavailable
            </Text>
          )}
        </Box>
        <Text 
          variant="body" 
          color={colors.text.secondary} 
          numberOfLines={2} 
          style={{ 
            marginTop: 2,
            opacity: isUnavailable ? 0.6 : 1,
          }}
        >
          {item.menuItem.description}
        </Text>
        <Text 
          variant="subheading" 
          weight="semibold" 
          style={{ 
            marginTop: 4,
            opacity: isUnavailable ? 0.6 : 1,
          }}
        >
          ${item.menuItem.price.toFixed(2)}
        </Text>
      </Box>

      {/* Quantity Controls */}
      <Box flexDirection="row" alignItems="center" gap="sm">
        <TouchableOpacity
          onPress={() => onDecrement(item.menuItem.id)}
          disabled={isUnavailable}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: isUnavailable ? colors.border.light : colors.background.secondary,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: isUnavailable ? 0.5 : 1,
          }}
          accessibilityLabel="Decrease quantity"
          accessibilityRole="button"
        >
          <Icon 
            name="minus" 
            size={16} 
            color={isUnavailable ? colors.text.tertiary : colors.text.primary} 
          />
        </TouchableOpacity>

        <Text 
          variant="body" 
          weight="medium" 
          style={{ 
            minWidth: 24, 
            textAlign: 'center',
            opacity: isUnavailable ? 0.6 : 1,
          }}
        >
          {item.quantity}
        </Text>

        <TouchableOpacity
          onPress={() => onIncrement(item.menuItem.id)}
          disabled={isUnavailable}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: isUnavailable ? colors.border.light : colors.accent.primary,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: isUnavailable ? 0.5 : 1,
          }}
          accessibilityLabel="Increase quantity"
          accessibilityRole="button"
        >
          <Icon 
            name="plus" 
            size={16} 
            color={isUnavailable ? colors.text.tertiary : colors.background.surface} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRemove}
          style={{
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: spacing.sm,
          }}
          accessibilityLabel="Remove item"
          accessibilityRole="button"
        >
          <Icon name="x" size={16} color={colors.error.primary} />
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

interface PricingRowProps {
  label: string;
  value: string;
  isTotal?: boolean;
}

const PricingRow: React.FC<PricingRowProps> = ({ label, value, isTotal = false }) => (
  <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="sm">
    <Text 
      variant={isTotal ? "subheading" : "body"} 
      weight={isTotal ? "semibold" : "regular"}
      color={isTotal ? colors.text.primary : colors.text.secondary}
    >
      {label}
    </Text>
    <Text 
      variant={isTotal ? "subheading" : "body"} 
      weight={isTotal ? "bold" : "medium"}
      color={colors.text.primary}
    >
      {value}
    </Text>
  </Box>
);

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const {
    items,
    restaurant,
    subtotal,
    deliveryFee,
    tax,
    total,
    isEmpty,
    itemCount,
    isMinimumOrderMet,
    remainingForMinimum,
    errors,
    hasErrors,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    checkForErrors,
    dismissError,
    updateItemPrice,
  } = useCart();

  // Check for errors when screen loads or items change
  useEffect(() => {
    if (!isEmpty) {
      checkForErrors();
    }
  }, [checkForErrors, isEmpty]);

  const handleCheckout = () => {
    if (!isMinimumOrderMet) {
      Alert.alert(
        'Minimum Order Not Met',
        `Add $${remainingForMinimum.toFixed(2)} more to meet the minimum order requirement.`,
        [{ text: 'OK' }]
      );
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  if (isEmpty) {
    return (
      <Box flex={1} backgroundColor={colors.background.primary}>
        {/* Header */}
        <Box
          backgroundColor={colors.background.surface}
          paddingHorizontal="lg"
          paddingVertical="xl"
          shadow="low"
        >
          <Text variant="heading2" weight="semibold" align="center">
            Your Cart
          </Text>
        </Box>

        {/* Empty State */}
        <Box flex={1} justifyContent="center" alignItems="center" padding="xl">
          <Icon name="shopping-cart" size={32} color={colors.text.tertiary} />
          <Text variant="heading3" weight="medium" style={{ marginTop: spacing.xl }}>
            Your cart is empty
          </Text>
          <Text 
            variant="body" 
            color={colors.text.secondary} 
            align="center" 
            style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}
          >
            Add some delicious items from our restaurants to get started
          </Text>
          <Button
            variant="primary"
            size="large"
            onPress={() => navigation.navigate('Home')}
          >
            Browse Restaurants
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor={colors.background.primary}>
      {/* Header */}
      <Box
        backgroundColor={colors.background.surface}
        paddingHorizontal="lg"
        paddingVertical="xl"
        shadow="low"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text variant="heading2" weight="semibold">
          Your Cart
        </Text>
        <Box flexDirection="row" alignItems="center" gap="sm">
          <Text variant="body" color={colors.text.secondary}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
          <TouchableOpacity
            onPress={handleClearCart}
            accessibilityLabel="Clear cart"
            accessibilityRole="button"
          >
            <Icon name="x" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </Box>
      </Box>

      {/* Restaurant Info */}
      {restaurant && (
        <Box
          backgroundColor={colors.background.surface}
          marginHorizontal="lg"
          marginTop="lg"
          padding="lg"
          borderRadius="medium"
          shadow="low"
          flexDirection="row"
          alignItems="center"
        >
          <Image
            source={{ uri: restaurant.imageUrl }}
            style={{
              width: 40,
              height: 40,
              borderRadius: borderRadius.small,
              backgroundColor: colors.background.secondary,
            }}
            resizeMode="cover"
          />
          <Box marginLeft="md">
            <Text variant="subheading" weight="medium">
              {restaurant.name}
            </Text>
            <Text variant="caption" color={colors.text.secondary}>
              {restaurant.deliveryTime} • ${restaurant.deliveryFee.toFixed(2)} delivery
            </Text>
          </Box>
        </Box>
      )}

      {/* Error Banners */}
      {errors.map((error, index) => (
        <Box key={index} marginHorizontal="lg" marginTop="md">
          <ErrorBanner
            message={error.message}
            onDismiss={() => dismissError(index)}
            action={
              error.type === 'price_change' && error.itemId && error.newPrice
                ? {
                    label: 'Update',
                    onPress: () => {
                      updateItemPrice(error.itemId!, error.newPrice!);
                      dismissError(index);
                    },
                  }
                : error.type === 'unavailable_item' && error.itemId
                ? {
                    label: 'Remove',
                    onPress: () => {
                      removeItem(error.itemId!);
                      dismissError(index);
                    },
                  }
                : undefined
            }
          />
        </Box>
      ))}

      {/* Minimum Order Warning */}
      {!isMinimumOrderMet && restaurant && (
        <Box
          backgroundColor={colors.error.background}
          marginHorizontal="lg"
          marginTop="md"
          padding="md"
          borderRadius="small"
        >
          <Text variant="body" weight="medium" color={colors.background.surface}>
            Add ${remainingForMinimum.toFixed(2)} more to meet the ${restaurant.minimumOrder.toFixed(2)} minimum
          </Text>
        </Box>
      )}

      {/* Cart Items */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.menuItem.id}
          renderItem={({ item }) => (
            <CartItemRow
              item={item}
              onIncrement={incrementItem}
              onDecrement={decrementItem}
              onRemove={removeItem}
            />
          )}
          scrollEnabled={false}
        />

        {/* Pricing Breakdown */}
        <Box
          backgroundColor={colors.background.surface}
          borderRadius="medium"
          padding="lg"
          marginTop="lg"
          shadow="low"
        >
          <Text variant="subheading" weight="semibold" style={{ marginBottom: spacing.md }}>
            Order Summary
          </Text>
          
          <PricingRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <PricingRow label="Delivery Fee" value={`$${deliveryFee.toFixed(2)}`} />
          <PricingRow label="Tax" value={`$${tax.toFixed(2)}`} />
          
          <Box
            height={1}
            backgroundColor={colors.border.light}
            marginVertical="md"
          />
          
          <PricingRow label="Total" value={`$${total.toFixed(2)}`} isTotal />
        </Box>
      </ScrollView>

      {/* Checkout Button */}
      <Box
        backgroundColor={colors.background.surface}
        paddingHorizontal="lg"
        paddingVertical="xl"
        shadow="medium"
      >
        <Button
          variant="primary"
          size="large"
          onPress={handleCheckout}
          disabled={!isMinimumOrderMet}
        >
          Proceed to Checkout • ${total.toFixed(2)}
        </Button>
      </Box>
    </Box>
  );
};
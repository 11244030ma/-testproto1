/**
 * MenuItemDetail Modal Component
 * 
 * Displays full menu item details including ingredients, allergens, and nutritional information
 * in a scannable format with clear sections
 */

import React from 'react';
import {
  View,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Box, Text, Button, Icon } from './';
import { MenuItem } from '../types';
import { colors, spacing, borderRadius, shadows } from '../designSystem/tokens';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MenuItemDetailProps {
  menuItem: MenuItem;
  isVisible: boolean;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
}

export const MenuItemDetail: React.FC<MenuItemDetailProps> = ({
  menuItem,
  isVisible,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  const addButtonScaleAnim = React.useRef(new Animated.Value(1)).current;
  const addButtonOpacityAnim = React.useRef(new Animated.Value(1)).current;

  const handleAddToCart = () => {
    if (isAddingToCart) return;
    
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
      onAddToCart(quantity);
      onClose();
    });
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 99));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const renderDietaryBadge = (label: string, isActive: boolean) => {
    if (!isActive) return null;
    
    return (
      <View style={styles.dietaryBadge}>
        <Text variant="caption" weight="medium" color="accent.primary">
          {label}
        </Text>
      </View>
    );
  };

  const renderNutritionalInfo = () => {
    if (!menuItem.nutritionalInfo) return null;

    const { calories, protein, carbs, fat } = menuItem.nutritionalInfo;

    return (
      <Box marginTop="lg">
        <Text variant="subheading" weight="semibold" color="text.primary" style={styles.sectionTitle}>
          Nutritional Information
        </Text>
        
        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <Text variant="heading3" weight="bold" color="text.primary">
              {calories}
            </Text>
            <Text variant="caption" color="text.secondary">
              Calories
            </Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text variant="heading3" weight="bold" color="text.primary">
              {protein}g
            </Text>
            <Text variant="caption" color="text.secondary">
              Protein
            </Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text variant="heading3" weight="bold" color="text.primary">
              {carbs}g
            </Text>
            <Text variant="caption" color="text.secondary">
              Carbs
            </Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text variant="heading3" weight="bold" color="text.primary">
              {fat}g
            </Text>
            <Text variant="caption" color="text.secondary">
              Fat
            </Text>
          </View>
        </View>
      </Box>
    );
  };

  const renderAllergens = () => {
    if (!menuItem.dietaryInfo.allergens || menuItem.dietaryInfo.allergens.length === 0) {
      return null;
    }

    return (
      <Box marginTop="lg">
        <Text variant="subheading" weight="semibold" color="text.primary" style={styles.sectionTitle}>
          Allergen Information
        </Text>
        
        <Text variant="body" color="text.secondary" style={styles.allergenWarning}>
          Contains: {menuItem.dietaryInfo.allergens.join(', ')}
        </Text>
        
        <Text variant="caption" color="text.secondary" align="center" style={styles.allergenDisclaimer}>
          Please inform your server of any allergies or dietary restrictions before ordering.
        </Text>
      </Box>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="x" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Item Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: menuItem.imageUrl }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          </View>

          {/* Item Details */}
          <Box paddingHorizontal="lg" paddingTop="lg">
            {/* Name and Price */}
            <View style={styles.titleRow}>
              <Text variant="heading2" weight="bold" color="text.primary" style={styles.itemName}>
                {menuItem.name}
              </Text>
              <Text variant="heading2" weight="bold" color="accent.primary">
                ${menuItem.price.toFixed(2)}
              </Text>
            </View>

            {/* Description */}
            <Text variant="body" color="text.secondary" style={styles.description}>
              {menuItem.description}
            </Text>

            {/* Dietary Information */}
            <View style={styles.dietaryInfo}>
              {renderDietaryBadge('Vegetarian', menuItem.dietaryInfo.isVegetarian)}
              {renderDietaryBadge('Vegan', menuItem.dietaryInfo.isVegan)}
              {renderDietaryBadge('Gluten-Free', menuItem.dietaryInfo.isGlutenFree)}
            </View>

            {/* Nutritional Information */}
            {renderNutritionalInfo()}

            {/* Allergen Information */}
            {renderAllergens()}

            {/* Availability Status */}
            {!menuItem.isAvailable && (
              <Box
                marginTop="lg"
                padding="md"
                backgroundColor="background.secondary"
                borderRadius="medium"
              >
                <Text variant="body" weight="medium" color="text.secondary" align="center">
                  Currently Unavailable
                </Text>
              </Box>
            )}
          </Box>
        </ScrollView>

        {/* Bottom Action Bar */}
        {menuItem.isAvailable && (
          <View style={styles.actionBar}>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                onPress={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Icon 
                  name="minus" 
                  size={20} 
                  color={quantity <= 1 ? colors.text.tertiary : colors.text.primary} 
                />
              </TouchableOpacity>
              
              <Text variant="subheading" weight="semibold" color="text.primary" align="center" style={styles.quantityText}>
                {quantity}
              </Text>
              
              <TouchableOpacity
                style={[styles.quantityButton, quantity >= 99 && styles.quantityButtonDisabled]}
                onPress={incrementQuantity}
                disabled={quantity >= 99}
              >
                <Icon 
                  name="plus" 
                  size={20} 
                  color={quantity >= 99 ? colors.text.tertiary : colors.text.primary} 
                />
              </TouchableOpacity>
            </View>

            <Animated.View
              style={{
                transform: [{ scale: addButtonScaleAnim }],
                opacity: addButtonOpacityAnim,
              }}
            >
              <Button
                variant="primary"
                onPress={handleAddToCart}
                disabled={isAddingToCart}
                style={styles.addButton}
              >
                {isAddingToCart 
                  ? 'Adding...' 
                  : `Add $${(menuItem.price * quantity).toFixed(2)} to Cart`
                }
              </Button>
            </Animated.View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  imageContainer: {
    width: '100%',
    height: screenHeight * 0.3,
    backgroundColor: colors.background.secondary,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  itemName: {
    flex: 1,
    marginRight: spacing.md,
  },
  description: {
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  dietaryInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  dietaryBadge: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.small,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.medium,
    padding: spacing.lg,
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  allergenWarning: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
    padding: spacing.md,
    borderRadius: borderRadius.small,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  allergenDisclaimer: {
    fontStyle: 'italic',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    ...shadows.medium,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  quantityButtonDisabled: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.light,
  },
  quantityText: {
    marginHorizontal: spacing.lg,
    minWidth: 30,
  },
  addButton: {
    flex: 1,
  },
});
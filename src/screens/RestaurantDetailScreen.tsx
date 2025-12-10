/**
 * RestaurantDetailScreen Component
 * 
 * Displays detailed restaurant information with parallax hero image,
 * sticky header, restaurant info, menu categories, and scrollable menu items
 */

import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Box,
  Text,
  Button,
  Icon,
  MenuItem,
  MenuItemDetail,
  Card,
  AddToCartConfirmation,
} from '../components';
import { useRestaurants, useCart } from '../hooks';
import { colors, spacing, shadows } from '../designSystem/tokens';
import { RootStackParamList, MenuItem as MenuItemType } from '../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const HERO_HEIGHT = screenHeight * 0.35;
const HEADER_HEIGHT = 100;

type RestaurantDetailScreenRouteProp = RouteProp<RootStackParamList, 'RestaurantDetail'>;
type RestaurantDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RestaurantDetail'>;

export const RestaurantDetailScreen: React.FC = () => {
  const route = useRoute<RestaurantDetailScreenRouteProp>();
  const navigation = useNavigation<RestaurantDetailScreenNavigationProp>();
  const { restaurantId } = route.params;
  
  const {
    currentRestaurant,
    currentMenu,
    menuByCategory,
    isLoading,
    loadRestaurant,
    loadMenu,
  } = useRestaurants();
  
  const { addItem, items } = useCart();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFloatingCart, setShowFloatingCart] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [showAddToCartConfirmation, setShowAddToCartConfirmation] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<string>('');
  
  // Load restaurant data
  useEffect(() => {
    loadRestaurant(restaurantId);
    loadMenu(restaurantId);
  }, [restaurantId, loadRestaurant, loadMenu]);
  
  // Set initial category when menu loads
  useEffect(() => {
    if (currentMenu.length > 0 && !selectedCategory) {
      const categories = Object.keys(menuByCategory);
      if (categories.length > 0) {
        setSelectedCategory(categories[0]);
      }
    }
  }, [currentMenu, selectedCategory, menuByCategory]);
  
  // Show/hide floating cart based on cart items
  useEffect(() => {
    setShowFloatingCart(items.length > 0);
  }, [items]);
  
  const handleAddToCart = useCallback((menuItem: MenuItemType) => {
    if (currentRestaurant) {
      addItem(menuItem, currentRestaurant, 1);
      setLastAddedItem(menuItem.name);
      setShowAddToCartConfirmation(true);
    }
  }, [currentRestaurant, addItem]);

  const handleAddToCartSuccess = useCallback(() => {
    // This is called after the button animation completes
    // The confirmation is already shown in handleAddToCart
  }, []);

  const handleHideConfirmation = useCallback(() => {
    setShowAddToCartConfirmation(false);
    setLastAddedItem('');
  }, []);
  
  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  
  const handleCartPress = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  const handleMenuItemPress = useCallback((menuItem: MenuItemType) => {
    setSelectedMenuItem(menuItem);
    setShowItemDetail(true);
  }, []);

  const handleCloseItemDetail = useCallback(() => {
    setShowItemDetail(false);
    setSelectedMenuItem(null);
  }, []);

  const handleAddToCartFromDetail = useCallback((quantity: number) => {
    if (selectedMenuItem && currentRestaurant) {
      addItem(selectedMenuItem, currentRestaurant, quantity);
      setLastAddedItem(selectedMenuItem.name);
      setShowAddToCartConfirmation(true);
    }
  }, [selectedMenuItem, currentRestaurant, addItem]);
  
  // Animated header opacity based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT - HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  // Parallax effect for hero image
  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT],
    outputRange: [0, -HERO_HEIGHT * 0.3],
    extrapolate: 'clamp',
  });
  
  const categories = Object.keys(menuByCategory);
  
  if (isLoading || !currentRestaurant) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="body">Loading restaurant details...</Text>
      </View>
    );
  }
  
  const renderCategoryTab = (category: string, index: number) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryTab,
        selectedCategory === category && styles.selectedCategoryTab,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        variant="subheading"
        weight={selectedCategory === category ? 'semibold' : 'regular'}
        color={selectedCategory === category ? 'accent.primary' : 'text.secondary'}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
  
  const renderMenuItem = (item: MenuItemType) => (
    <MenuItem
      key={item.id}
      menuItem={item}
      onAddToCart={() => handleAddToCart(item)}
      onPress={() => handleMenuItemPress(item)}
      onAddToCartSuccess={handleAddToCartSuccess}
      style={styles.menuItem}
    />
  );
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Parallax Hero Image */}
      <Animated.View
        style={[
          styles.heroContainer,
          { transform: [{ translateY: heroTranslateY }] },
        ]}
      >
        <Image
          source={{ uri: currentRestaurant.heroImageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />
      </Animated.View>
      
      {/* Sticky Header */}
      <Animated.View
        style={[
          styles.stickyHeader,
          { opacity: headerOpacity },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text
          variant="heading3"
          weight="semibold"
          color="text.primary"
          numberOfLines={1}
          style={styles.headerTitle}
        >
          {currentRestaurant.name}
        </Text>
      </Animated.View>
      
      {/* Back Button (Always Visible) */}
      <TouchableOpacity
        style={styles.floatingBackButton}
        onPress={handleBackPress}
      >
        <Icon name="arrow-left" size={24} color={colors.background.primary} />
      </TouchableOpacity>
      
      {/* Main Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Restaurant Info Section */}
        <Box
          backgroundColor="background.primary"
          paddingHorizontal="lg"
          paddingVertical="xl"
          style={styles.restaurantInfo}
        >
          <Text variant="heading1" weight="bold" color="text.primary" style={styles.restaurantName}>
            {currentRestaurant.name}
          </Text>
          
          <Text variant="body" color="text.secondary" style={styles.restaurantDescription}>
            {currentRestaurant.description}
          </Text>
          
          <View style={styles.restaurantMeta}>
            <View style={styles.metaItem}>
              <Icon name="star" size={16} color={colors.accent.primary} />
              <Text variant="body" weight="medium" color="text.primary" style={styles.metaText}>
                {currentRestaurant.rating}
              </Text>
              <Text variant="body" color="text.secondary">
                ({currentRestaurant.reviewCount} reviews)
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Icon name="clock" size={16} color={colors.text.secondary} />
              <Text variant="body" color="text.secondary" style={styles.metaText}>
                {currentRestaurant.deliveryTime}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Icon name="shopping-cart" size={16} color={colors.text.secondary} />
              <Text variant="body" color="text.secondary" style={styles.metaText}>
                ${currentRestaurant.deliveryFee.toFixed(2)} delivery
              </Text>
            </View>
          </View>
          
          <View style={styles.cuisineTypes}>
            {currentRestaurant.cuisineType.map((cuisine, index) => (
              <View key={cuisine} style={styles.cuisineTag}>
                <Text variant="caption" color="text.secondary">
                  {cuisine}
                </Text>
              </View>
            ))}
          </View>
        </Box>
        
        {/* Menu Categories (Sticky Tabs) */}
        {categories.length > 0 && (
          <Box
            backgroundColor="background.primary"
            paddingVertical="md"
            style={styles.categoriesContainer}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContent}
            >
              {categories.map(renderCategoryTab)}
            </ScrollView>
          </Box>
        )}
        
        {/* Menu Items */}
        <Box
          backgroundColor="background.primary"
          paddingHorizontal="lg"
          paddingBottom="xxxl"
        >
          {selectedCategory && menuByCategory[selectedCategory] && (
            <View>
              <Text
                variant="heading3"
                weight="semibold"
                color="text.primary"
                style={styles.categoryTitle}
              >
                {selectedCategory}
              </Text>
              
              {menuByCategory[selectedCategory].map(renderMenuItem)}
            </View>
          )}
        </Box>
      </Animated.ScrollView>
      
      {/* Floating Cart Button */}
      {showFloatingCart && (
        <TouchableOpacity
          style={styles.floatingCartButton}
          onPress={handleCartPress}
          activeOpacity={0.8}
        >
          <View style={styles.cartButtonContent}>
            <View style={styles.cartBadge}>
              <Text variant="caption" weight="bold" color="background.primary">
                {items.length}
              </Text>
            </View>
            <Text variant="subheading" weight="semibold" color="background.primary">
              View Cart
            </Text>
            <Icon name="shopping-cart" size={20} color={colors.background.primary} />
          </View>
        </TouchableOpacity>
      )}

      {/* Menu Item Detail Modal */}
      {selectedMenuItem && (
        <MenuItemDetail
          menuItem={selectedMenuItem}
          isVisible={showItemDetail}
          onClose={handleCloseItemDetail}
          onAddToCart={handleAddToCartFromDetail}
        />
      )}

      {/* Add to Cart Confirmation */}
      <AddToCartConfirmation
        visible={showAddToCartConfirmation}
        itemName={lastAddedItem}
        onHide={handleHideConfirmation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_HEIGHT,
    zIndex: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: colors.background.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    zIndex: 3,
    ...shadows.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.low,
  },
  headerTitle: {
    flex: 1,
    marginLeft: spacing.md,
  },
  floatingBackButton: {
    position: 'absolute',
    top: spacing.xl + 10,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: HERO_HEIGHT - 40,
  },
  restaurantInfo: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 40,
  },
  restaurantName: {
    marginBottom: spacing.md,
  },
  restaurantDescription: {
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  restaurantMeta: {
    marginBottom: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metaText: {
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  cuisineTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cuisineTag: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  categoriesContent: {
    paddingHorizontal: spacing.lg,
  },
  categoryTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.md,
  },
  selectedCategoryTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent.primary,
  },
  categoryTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  menuItem: {
    marginBottom: spacing.lg,
  },
  floatingCartButton: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.accent.primary,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    ...shadows.medium,
  },
  cartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
});
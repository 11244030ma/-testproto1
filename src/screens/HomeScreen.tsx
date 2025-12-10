import React, { useCallback, useEffect, useState } from 'react';
import { 
  View, 
  ScrollView, 
  FlatList, 
  RefreshControl,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { 
  Box, 
  Text, 
  SearchBar, 
  FilterPill, 
  RestaurantCard,
  EmptyState,
  HomeScreenSkeleton,
  RestaurantMapView,
  FloatingSearchBar,
  ViewToggle,
  ViewMode,
} from '../components';
import { useRestaurants, useSearch } from '../hooks';
import { colors, spacing } from '../designSystem/tokens';
import { Restaurant } from '../types';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - spacing.lg * 3) / 2; // 2 columns with spacing

interface HomeScreenProps {
  navigation: any; // TODO: Type this properly
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { 
    restaurants, 
    featuredRestaurants, 
    isLoading, 
    refreshRestaurants,
    refreshFeatured,
  } = useRestaurants();
  
  const {
    query,
    results,
    availableCuisines,
    filters,
    addCuisineFilter,
    removeCuisineFilter,
    setQuery,
    showEmptyState,
    emptyStateContent,
    emptyStateAction,
    clearSearch,
    clearAllFilters,
  } = useSearch();

  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshRestaurants(),
        refreshFeatured(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshRestaurants, refreshFeatured]);

  // Handle filter pill selection
  const handleCuisineFilter = useCallback((cuisine: string) => {
    if (filters.cuisineTypes.includes(cuisine)) {
      removeCuisineFilter(cuisine);
    } else {
      addCuisineFilter(cuisine);
    }
  }, [filters.cuisineTypes, addCuisineFilter, removeCuisineFilter]);

  // Handle restaurant selection
  const handleRestaurantPress = useCallback((restaurant: Restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id });
  }, [navigation]);

  // Handle spin wheel press
  const handleSpinPress = useCallback(() => {
    navigation.navigate('SpinWheel');
  }, [navigation]);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // Render featured restaurant item
  const renderFeaturedItem = useCallback(({ item }: { item: Restaurant }) => (
    <Box marginRight="md" width={280}>
      <RestaurantCard 
        restaurant={item}
        onPress={() => handleRestaurantPress(item)}
      />
    </Box>
  ), [handleRestaurantPress]);

  // Render restaurant grid item
  const renderRestaurantItem = useCallback(({ item, index }: { item: Restaurant; index: number }) => (
    <Box 
      width={CARD_WIDTH}
      marginRight={index % 2 === 0 ? 'md' : undefined}
      marginBottom="md"
    >
      <RestaurantCard 
        restaurant={item}
        onPress={() => handleRestaurantPress(item)}
      />
    </Box>
  ), [handleRestaurantPress]);

  // Render filter pill item
  const renderFilterPill = useCallback(({ item }: { item: string }) => (
    <Box marginRight="sm">
      <FilterPill
        label={item}
        selected={filters.cuisineTypes.includes(item)}
        onPress={() => handleCuisineFilter(item)}
      />
    </Box>
  ), [filters.cuisineTypes, handleCuisineFilter]);

  // Get display restaurants (search results or all restaurants)
  const displayRestaurants = query.length > 0 ? results : restaurants;

  // Show skeleton loading state
  if (isLoading && restaurants.length === 0) {
    return <HomeScreenSkeleton testID="home-screen-skeleton" />;
  }

  return (
    <View style={styles.container}>
      {viewMode === 'map' ? (
        <>
          {/* Map View */}
          <RestaurantMapView
            restaurants={displayRestaurants}
            onRestaurantPress={handleRestaurantPress}
          />
          
          {/* Floating Search Bar */}
          <FloatingSearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search restaurants, cuisines..."
            onSpinPress={handleSpinPress}
            testID="floating-search-bar"
          />
          
          {/* View Toggle */}
          <ViewToggle
            currentView={viewMode}
            onViewChange={handleViewModeChange}
            testID="view-toggle"
          />
        </>
      ) : (
        <>
          {/* List View */}
          {/* Sticky Header */}
          <Box 
            backgroundColor="background.primary"
            paddingHorizontal="lg"
            paddingTop="xl"
            paddingBottom="md"
            style={styles.header}
          >
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Search restaurants, cuisines..."
            />
          </Box>

          {/* Main Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.accent.primary}
                colors={[colors.accent.primary]}
              />
            }
          >
            {/* Featured Section */}
            {featuredRestaurants.length > 0 && query.length === 0 && (
              <Box marginBottom="xl" testID="featured-section">
                <Box paddingHorizontal="lg" marginBottom="lg">
                  <Text variant="heading3" color="text.primary">
                    Featured
                  </Text>
                </Box>
                
                <FlatList
                  data={featuredRestaurants}
                  renderItem={renderFeaturedItem}
                  keyExtractor={(item) => `featured-${item.id}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredList}
                />
              </Box>
            )}

            {/* Category Filters */}
            {availableCuisines.length > 0 && (
              <Box marginBottom="xl" testID="cuisines-section">
                <Box paddingHorizontal="lg" marginBottom="lg">
                  <Text variant="heading3" color="text.primary">
                    Cuisines
                  </Text>
                </Box>
                
                <FlatList
                  data={availableCuisines}
                  renderItem={renderFilterPill}
                  keyExtractor={(item) => `cuisine-${item}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterList}
                />
              </Box>
            )}

            {/* Restaurants Grid */}
            <Box paddingHorizontal="lg" marginBottom="xl" testID="restaurants-section">
              <Box marginBottom="lg">
                <Text variant="heading3" color="text.primary">
                  {query.length > 0 ? 'Search Results' : 'All Restaurants'}
                </Text>
                {displayRestaurants.length > 0 && (
                  <Text variant="body" color="text.secondary" style={{ marginTop: 4 }}>
                    {displayRestaurants.length} restaurant{displayRestaurants.length !== 1 ? 's' : ''}
                  </Text>
                )}
              </Box>

              {displayRestaurants.length > 0 ? (
                <FlatList
                  data={displayRestaurants}
                  renderItem={renderRestaurantItem}
                  keyExtractor={(item) => `restaurant-${item.id}`}
                  numColumns={2}
                  scrollEnabled={false}
                  columnWrapperStyle={styles.row}
                />
              ) : showEmptyState && emptyStateContent ? (
                <EmptyState
                  title={emptyStateContent.title}
                  message={emptyStateContent.message}
                  suggestions={emptyStateContent.suggestions}
                  iconName={emptyStateContent.iconName}
                  actionLabel={emptyStateAction?.label}
                  onAction={() => {
                    if (emptyStateAction?.action === 'clearSearch') {
                      clearSearch();
                    } else if (emptyStateAction?.action === 'clearFilters') {
                      clearAllFilters();
                    }
                  }}
                  testID="search-empty-state"
                />
              ) : displayRestaurants.length === 0 ? (
                <EmptyState
                  title="No restaurants available"
                  message="Pull down to refresh and load restaurants"
                  iconName="search"
                  testID="no-restaurants-empty-state"
                />
              ) : null}
            </Box>
          </ScrollView>
          
          {/* View Toggle */}
          <ViewToggle
            currentView={viewMode}
            onViewChange={handleViewModeChange}
            testID="view-toggle"
          />
        </>
      )}
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
  featuredList: {
    paddingHorizontal: spacing.lg,
  },
  filterList: {
    paddingHorizontal: spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
  },
});
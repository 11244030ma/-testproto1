/**
 * HomeScreenSkeleton Component
 * 
 * Loading placeholder for the entire HomeScreen with matching layout
 */

import React from 'react';
import { View, ScrollView, FlatList, Dimensions } from 'react-native';
import { Box } from './Box';
import { Skeleton } from './Skeleton';
import { RestaurantCardSkeleton } from './RestaurantCardSkeleton';
import { SearchBarSkeleton } from './SearchBarSkeleton';
import { FilterPillSkeleton } from './FilterPillSkeleton';
import { colors, spacing } from '../designSystem/tokens';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - spacing.lg * 3) / 2; // 2 columns with spacing

interface HomeScreenSkeletonProps {
  testID?: string;
}

export const HomeScreenSkeleton: React.FC<HomeScreenSkeletonProps> = ({
  testID,
}) => {
  // Generate skeleton data
  const featuredSkeletons = Array.from({ length: 3 }, (_, i) => ({ id: `featured-${i}` }));
  const filterSkeletons = Array.from({ length: 5 }, (_, i) => ({ id: `filter-${i}` }));
  const restaurantSkeletons = Array.from({ length: 6 }, (_, i) => ({ id: `restaurant-${i}` }));

  const renderFeaturedSkeleton = ({ item, index }: { item: { id: string }; index: number }) => (
    <Box 
      marginRight="md" 
      width={280}
      key={item.id}
    >
      <RestaurantCardSkeleton testID={`featured-skeleton-${index}`} />
    </Box>
  );

  const renderFilterSkeleton = ({ item, index }: { item: { id: string }; index: number }) => (
    <Box 
      marginRight="sm"
      key={item.id}
    >
      <FilterPillSkeleton testID={`filter-skeleton-${index}`} />
    </Box>
  );

  const renderRestaurantSkeleton = ({ item, index }: { item: { id: string }; index: number }) => (
    <Box 
      width={CARD_WIDTH}
      marginRight={index % 2 === 0 ? 'md' : undefined}
      marginBottom="md"
      key={item.id}
    >
      <RestaurantCardSkeleton testID={`restaurant-skeleton-${index}`} />
    </Box>
  );

  return (
    <View 
      style={{
        flex: 1,
        backgroundColor: colors.background.primary,
      }}
      testID={testID}
    >
      {/* Sticky Header Skeleton */}
      <Box 
        backgroundColor="background.primary"
        paddingHorizontal="lg"
        paddingTop="xl"
        paddingBottom="md"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
        }}
      >
        <SearchBarSkeleton testID="search-skeleton" />
      </Box>

      {/* Main Content Skeleton */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Section Skeleton */}
        <Box marginBottom="xl" testID="featured-skeleton-section">
          <Box paddingHorizontal="lg" marginBottom="lg">
            <Skeleton
              width={100}
              height={24}
              borderRadius="small"
            />
          </Box>
          
          <FlatList
            data={featuredSkeletons}
            renderItem={renderFeaturedSkeleton}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
            }}
          />
        </Box>

        {/* Category Filters Skeleton */}
        <Box marginBottom="xl" testID="cuisines-skeleton-section">
          <Box paddingHorizontal="lg" marginBottom="lg">
            <Skeleton
              width={80}
              height={24}
              borderRadius="small"
            />
          </Box>
          
          <FlatList
            data={filterSkeletons}
            renderItem={renderFilterSkeleton}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
            }}
          />
        </Box>

        {/* Restaurants Grid Skeleton */}
        <Box paddingHorizontal="lg" marginBottom="xl" testID="restaurants-skeleton-section">
          <Box marginBottom="lg">
            <Skeleton
              width={140}
              height={24}
              borderRadius="small"
              style={{ marginBottom: 4 }}
            />
            <Skeleton
              width={100}
              height={16}
              borderRadius="small"
            />
          </Box>

          <FlatList
            data={restaurantSkeletons}
            renderItem={renderRestaurantSkeleton}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{
              justifyContent: 'space-between',
            }}
          />
        </Box>
      </ScrollView>
    </View>
  );
};
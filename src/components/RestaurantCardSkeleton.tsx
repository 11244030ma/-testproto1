/**
 * RestaurantCardSkeleton Component
 * 
 * Loading placeholder for RestaurantCard with matching layout
 */

import React from 'react';
import { View } from 'react-native';
import { Box } from './Box';
import { Skeleton } from './Skeleton';
import { colors, spacing, shadows } from '../designSystem/tokens';

interface RestaurantCardSkeletonProps {
  testID?: string;
}

export const RestaurantCardSkeleton: React.FC<RestaurantCardSkeletonProps> = ({
  testID,
}) => {
  return (
    <Box
      backgroundColor="background.surface"
      borderRadius="large"
      style={{
        ...shadows.low,
        overflow: 'hidden',
      }}
      testID={testID}
    >
      {/* Image skeleton */}
      <Skeleton
        width="100%"
        height={140}
        borderRadius="large"
        style={{
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      />
      
      {/* Content skeleton */}
      <Box padding="md">
        {/* Restaurant name */}
        <Skeleton
          width="80%"
          height={18}
          borderRadius="small"
          style={{ marginBottom: spacing.xs }}
        />
        
        {/* Cuisine type */}
        <Skeleton
          width="60%"
          height={14}
          borderRadius="small"
          style={{ marginBottom: spacing.sm }}
        />
        
        {/* Rating and delivery info row */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Rating */}
          <Skeleton
            width={60}
            height={14}
            borderRadius="small"
          />
          
          {/* Delivery time */}
          <Skeleton
            width={70}
            height={14}
            borderRadius="small"
          />
        </View>
      </Box>
    </Box>
  );
};
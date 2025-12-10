/**
 * SearchBarSkeleton Component
 * 
 * Loading placeholder for SearchBar
 */

import React from 'react';
import { Box } from './Box';
import { Skeleton } from './Skeleton';

interface SearchBarSkeletonProps {
  testID?: string;
}

export const SearchBarSkeleton: React.FC<SearchBarSkeletonProps> = ({
  testID,
}) => {
  return (
    <Box
      backgroundColor="background.secondary"
      borderRadius="large"
      paddingHorizontal="lg"
      paddingVertical="md"
      testID={testID}
    >
      <Skeleton
        width="100%"
        height={20}
        borderRadius="medium"
      />
    </Box>
  );
};
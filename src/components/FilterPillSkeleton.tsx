/**
 * FilterPillSkeleton Component
 * 
 * Loading placeholder for FilterPill
 */

import React from 'react';
import { Box } from './Box';
import { Skeleton } from './Skeleton';

interface FilterPillSkeletonProps {
  testID?: string;
}

export const FilterPillSkeleton: React.FC<FilterPillSkeletonProps> = ({
  testID,
}) => {
  return (
    <Box
      borderRadius="large"
      paddingHorizontal="lg"
      paddingVertical="sm"
      testID={testID}
    >
      <Skeleton
        width={80}
        height={16}
        borderRadius="small"
      />
    </Box>
  );
};
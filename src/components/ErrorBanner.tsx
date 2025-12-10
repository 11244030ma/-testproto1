/**
 * ErrorBanner Component
 * 
 * Displays error messages with gentle styling using soft red color
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Text, Icon } from './';
import { colors, spacing, borderRadius } from '../designSystem/tokens';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onDismiss,
  action,
}) => {
  return (
    <Box
      backgroundColor={colors.error.background}
      borderRadius="small"
      padding="md"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box flex={1} flexDirection="row" alignItems="center">
        <Icon 
          name="x" 
          size={16} 
          color={colors.background.surface} 
          style={{ marginRight: spacing.sm }}
        />
        <Text 
          variant="body" 
          color={colors.background.surface} 
          weight="medium"
          style={{ flex: 1 }}
        >
          {message}
        </Text>
      </Box>

      <Box flexDirection="row" alignItems="center" gap="sm">
        {action && (
          <TouchableOpacity
            onPress={action.onPress}
            style={{
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.small,
              backgroundColor: colors.background.surface,
            }}
            accessibilityLabel={action.label}
            accessibilityRole="button"
          >
            <Text 
              variant="caption" 
              color={colors.error.text} 
              weight="semibold"
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        )}

        {onDismiss && (
          <TouchableOpacity
            onPress={onDismiss}
            style={{
              padding: spacing.xs,
            }}
            accessibilityLabel="Dismiss error"
            accessibilityRole="button"
          >
            <Icon name="x" size={16} color={colors.background.surface} />
          </TouchableOpacity>
        )}
      </Box>
    </Box>
  );
};
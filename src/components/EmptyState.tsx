/**
 * EmptyState Component
 * 
 * Gentle messaging component for empty states with suggestions
 */

import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { Icon } from './Icon';
import { colors, spacing } from '../designSystem/tokens';

export interface EmptyStateProps {
  title: string;
  message: string;
  suggestions?: string[];
  actionLabel?: string;
  onAction?: () => void;
  iconName?: 'search' | 'heart' | 'shopping-cart' | 'filter';
  style?: ViewStyle;
  testID?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  suggestions = [],
  actionLabel,
  onAction,
  iconName = 'search',
  style,
  testID,
}) => {
  const getContainerStyle = (): ViewStyle => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
  });

  const getIconContainerStyle = (): ViewStyle => ({
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.secondary, // warm beige
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  });

  const getTitleStyle = (): TextStyle => ({
    textAlign: 'center',
    marginBottom: spacing.md,
  });

  const getMessageStyle = (): TextStyle => ({
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 280,
  });

  const getSuggestionsContainerStyle = (): ViewStyle => ({
    marginBottom: spacing.xl,
  });

  const getSuggestionItemStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  });

  const getSuggestionTextStyle = (): ViewStyle => ({
    marginLeft: spacing.sm,
  });

  return (
    <View style={[getContainerStyle(), style]} testID={testID}>
      {/* Icon */}
      <View style={getIconContainerStyle()}>
        <Icon 
          name={iconName} 
          size={32} 
          color={colors.text.tertiary}
        />
      </View>

      {/* Title */}
      <Text
        variant="heading3"
        weight="semibold"
        color={colors.text.primary}
        style={getTitleStyle()}
      >
        {title}
      </Text>

      {/* Message */}
      <Text
        variant="body"
        color={colors.text.secondary}
        style={getMessageStyle()}
      >
        {message}
      </Text>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <View style={getSuggestionsContainerStyle()}>
          {suggestions.map((suggestion, index) => (
            <View key={index} style={getSuggestionItemStyle()}>
              <Icon 
                name="check" 
                size={16} 
                color={colors.accent.primary}
              />
              <Text
                variant="body"
                color={colors.text.secondary}
                style={getSuggestionTextStyle()}
              >
                {suggestion}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="medium"
          onPress={onAction}
          testID={`${testID}-action-button`}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};
/**
 * FilterPill Component
 * 
 * Pill-shaped filter button with default and selected states
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  Animated,
  GestureResponderEvent,
} from 'react-native';
import { Text } from './Text';
import { colors, borderRadius, spacing, animations } from '../designSystem/tokens';

export interface FilterPillProps {
  label: string;
  selected?: boolean;
  onPress?: (label: string) => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const FilterPill: React.FC<FilterPillProps> = ({
  label,
  selected = false,
  onPress,
  disabled = false,
  style,
  testID,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const backgroundColorAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(backgroundColorAnim, {
      toValue: selected ? 1 : 0,
      duration: animations.timing.fast, // 200ms
      useNativeDriver: false,
    }).start();
  }, [selected, backgroundColorAnim]);

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(label);
  };

  const getBackgroundColor = () => {
    return backgroundColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', colors.accent.primary], // transparent to sage green
    });
  };

  const getBorderColor = () => {
    return backgroundColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border.medium, colors.accent.primary],
    });
  };

  const getContainerStyle = (): ViewStyle => ({
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.large, // 22px for pill shape
    borderWidth: 1,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.6 : 1,
  });

  const getTextColor = (): string => {
    if (disabled) {
      return colors.text.tertiary;
    }
    return selected ? colors.background.surface : colors.text.primary; // white when selected, dark when not
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={[
          getContainerStyle(),
          {
            backgroundColor: getBackgroundColor() as any,
            borderColor: getBorderColor() as any,
          },
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={`${label} filter`}
        accessibilityHint={selected ? 'Tap to deselect filter' : 'Tap to select filter'}
        accessibilityState={{ selected, disabled }}
      >
        <Text
          variant="body"
          weight="medium"
          color={getTextColor()}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
/**
 * SearchBar Component
 * 
 * Rounded pill-shaped search input with search icon and clear button
 */

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Animated,
  TextInputProps,
} from 'react-native';
import { Icon } from './Icon';
import { colors, borderRadius, spacing, typography, animations } from '../designSystem/tokens';

export interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  placeholder?: string;
  style?: ViewStyle;
  testID?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChangeText,
  onFocus,
  onBlur,
  onClear,
  placeholder = 'Search restaurants, cuisines...',
  style,
  testID,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: animations.timing.fast,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundColorAnim, {
        toValue: 1,
        duration: animations.timing.fast,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: animations.timing.fast,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundColorAnim, {
        toValue: 0,
        duration: animations.timing.fast,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  const getBackgroundColor = () => {
    return backgroundColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.background.secondary, colors.background.surface], // warm beige to white
    });
  };

  const getContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.large, // 22px for pill shape
    minHeight: 48, // Minimum touch target
  });

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    lineHeight: typography.fontSize.body * typography.lineHeight.normal,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
    padding: 0, // Remove default padding
  });

  const getIconContainerStyle = (): ViewStyle => ({
    justifyContent: 'center',
    alignItems: 'center',
  });

  const getClearButtonStyle = (): ViewStyle => ({
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border.medium,
    justifyContent: 'center',
    alignItems: 'center',
  });

  const shouldShowClearButton = value.length > 0;

  return (
    <Animated.View
      style={[
        getContainerStyle(),
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
      testID={testID}
    >
      {/* Search Icon */}
      <View style={getIconContainerStyle()}>
        <Icon 
          name="search" 
          size={20} 
          color={isFocused ? colors.accent.primary : colors.text.secondary}
        />
      </View>

      {/* Text Input */}
      <TextInput
        style={getInputStyle()}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
        testID={`${testID}-input`}
        {...textInputProps}
      />

      {/* Clear Button */}
      {shouldShowClearButton && (
        <TouchableOpacity
          style={getClearButtonStyle()}
          onPress={handleClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          testID={`${testID}-clear-button`}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Icon 
            name="x" 
            size={16} 
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};
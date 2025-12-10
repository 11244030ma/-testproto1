/**
 * Input Component
 * 
 * Enhanced input fields following design system specifications:
 * - Rounded corners (16px as specified)
 * - Soft inner shadow effect
 * - Placeholder text in warm gray
 * - Smooth focus transitions with gentle animations
 */

import React, { useState, useRef } from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Animated,
  TextInputProps,
} from 'react-native';
import { Icon } from './Icon';
import { colors, borderRadius, spacing, typography, animations, shadows, components } from '../designSystem/tokens';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  showClearButton?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value = '',
  onChangeText,
  onFocus,
  onBlur,
  error,
  disabled = false,
  showClearButton = true,
  style,
  inputStyle,
  testID,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
    
    Animated.parallel([
      Animated.timing(borderColorAnim, {
        toValue: 1,
        duration: animations.timing.fast,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: animations.timing.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
    
    Animated.parallel([
      Animated.timing(borderColorAnim, {
        toValue: 0,
        duration: animations.timing.fast,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: animations.timing.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleClear = () => {
    onChangeText?.('');
  };

  const getBorderColor = () => {
    if (error) {
      return colors.state.error;
    }
    
    return borderColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border.input, colors.border.inputFocus], // Sage green focus
    });
  };

  const getContainerStyle = (): ViewStyle => ({
    borderRadius: borderRadius.input, // 16px as specified
    borderWidth: 1,
    backgroundColor: disabled ? colors.interactive.disabled : colors.background.surface,
    paddingHorizontal: spacing.inputPadding.horizontal,
    paddingVertical: spacing.inputPadding.vertical,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: components.input.minHeight, // Minimum touch target
    height: components.input.height, // Standard input height
    // Soft inner shadow effect (simulated with border and background)
    ...shadows.input.inner,
  });

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    lineHeight: typography.fontSize.body * typography.lineHeight.normal,
    color: disabled ? colors.text.tertiary : colors.text.primary,
    padding: 0, // Remove default padding
  });

  const getClearButtonStyle = (): ViewStyle => ({
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  });

  const shouldShowClearButton = showClearButton && value.length > 0 && !disabled;

  return (
    <View style={style}>
      {label && (
        <View style={{ marginBottom: spacing.sm }}>
          <Animated.Text
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.body,
              fontWeight: typography.fontWeight.medium,
              color: error ? colors.error.primary : colors.text.secondary,
            }}
          >
            {label}
          </Animated.Text>
        </View>
      )}
      
      <Animated.View
        style={[
          getContainerStyle(),
          {
            borderColor: getBorderColor(),
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TextInput
          style={[getInputStyle(), inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.text.placeholder} // Warm gray as specified
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          testID={testID}
          {...textInputProps}
        />
        
        {shouldShowClearButton && (
          <TouchableOpacity
            style={getClearButtonStyle()}
            onPress={handleClear}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            testID={`${testID}-clear-button`}
          >
            <Icon
              name="x"
              size={14}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {error && (
        <View style={{ marginTop: spacing.sm }}>
          <Animated.Text
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.caption,
              color: colors.error.primary,
            }}
          >
            {error}
          </Animated.Text>
        </View>
      )}
    </View>
  );
};
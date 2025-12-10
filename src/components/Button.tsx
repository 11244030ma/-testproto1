/**
 * Button Component
 * 
 * Complete button system following the premium design specifications:
 * - Primary: sage green pill-shaped with soft shadow
 * - Secondary: outline button with light gray border  
 * - Icon: circular, minimal design
 * - Ghost: transparent background
 */

import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  ViewStyle, 
  Animated, 
  GestureResponderEvent,
} from 'react-native';
import { Text } from './Text';
import { Icon, IconName, IconSize } from './Icon';
import { colors, borderRadius, spacing, shadows, animations, components, typography } from '../designSystem/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  
  // Icon button specific props
  icon?: IconName;
  iconSize?: number;
  
  // Loading state
  loading?: boolean;
}

// Use design system component specifications
const BUTTON_HEIGHTS = components.button.height;
const BUTTON_MIN_WIDTHS = components.button.minWidth;

const BUTTON_PADDING = {
  small: spacing.buttonPadding.horizontal - 4,
  medium: spacing.buttonPadding.horizontal,
  large: spacing.buttonPadding.horizontal + 4,
} as const;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onPress,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
  icon,
  iconSize,
  loading = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    
    // Use design system animation specifications
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: animations.interactions.buttonPress.scale,
        duration: animations.interactions.buttonPress.duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: animations.interactions.fade.duration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: animations.interactions.buttonPress.duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: animations.interactions.fade.duration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getButtonStyle = (): ViewStyle => {
    // Icon button has different dimensions
    if (variant === 'icon') {
      const iconButtonSize = BUTTON_HEIGHTS[size];
      return {
        width: iconButtonSize,
        height: iconButtonSize,
        borderRadius: borderRadius.button.icon, // Circular
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: disabled 
          ? colors.interactive.disabled 
          : colors.background.surface,
        ...shadows.button.secondary,
      };
    }

    const baseStyle: ViewStyle = {
      height: BUTTON_HEIGHTS[size],
      paddingHorizontal: BUTTON_PADDING[size],
      borderRadius: borderRadius.button.pill, // Pill-shaped as specified
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: BUTTON_MIN_WIDTHS[size],
      minHeight: 44, // Minimum touch target
      flexDirection: 'row', // For icon + text combinations
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled 
            ? colors.interactive.disabled 
            : colors.interactive.primary, // Sage green
          ...shadows.button.primary, // Soft shadow as specified
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled 
            ? colors.interactive.disabled 
            : colors.interactive.secondary, // Transparent
          borderWidth: 1,
          borderColor: disabled 
            ? colors.interactive.disabled 
            : colors.interactive.secondaryBorder, // Light gray border
          ...shadows.button.secondary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): string => {
    if (disabled) {
      return colors.interactive.disabledText;
    }

    switch (variant) {
      case 'primary':
        return colors.text.inverse; // White text on sage green
      case 'secondary':
      case 'ghost':
      case 'icon':
        return colors.text.primary;
      default:
        return colors.text.primary;
    }
  };

  const getIconColor = (): string => {
    if (disabled) {
      return colors.interactive.disabledText;
    }

    switch (variant) {
      case 'primary':
        return colors.text.inverse;
      case 'secondary':
      case 'ghost':
      case 'icon':
        return colors.text.primary;
      default:
        return colors.text.primary;
    }
  };

  const getTextWeight = (): 'bold' | 'medium' | 'regular' | 'semibold' => {
    return size === 'large' ? 'semibold' : 'medium';
  };

  const renderContent = () => {
    // Icon-only button
    if (variant === 'icon' && icon) {
      return (
        <Icon
          name={icon}
          size={(iconSize || (size === 'small' ? 16 : size === 'large' ? 24 : 20)) as IconSize}
          color={getIconColor()}
        />
      );
    }

    // Button with icon and text
    if (icon && children) {
      return (
        <>
          <Icon
            name={icon}
            size={(iconSize || 16) as IconSize}
            color={getIconColor()}
            style={{ marginRight: spacing.sm }}
          />
          <Text
            variant="body"
            weight={getTextWeight()}
            color={getTextColor()}
          >
            {children}
          </Text>
        </>
      );
    }

    // Text-only button
    if (children) {
      return (
        <Text
          variant="body"
          weight={getTextWeight()}
          color={getTextColor()}
        >
          {children}
        </Text>
      );
    }

    return null;
  };

  return (
    <Animated.View 
      style={{ 
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <TouchableOpacity
        style={[getButtonStyle(), style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1} // We handle opacity with animations
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: disabled || loading }}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};
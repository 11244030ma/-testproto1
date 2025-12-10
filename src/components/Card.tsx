/**
 * Card Component
 * 
 * Enhanced card containers following design system specifications:
 * - Rounded corners (18-22px radius as specified)
 * - Lightweight shadow with soft background
 * - White background with 4-8% tint options
 * - Gentle hover animations
 */

import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  View, 
  ViewStyle, 
  Animated, 
  GestureResponderEvent 
} from 'react-native';
import { colors, borderRadius, shadows, spacing, animations, components } from '../designSystem/tokens';

type CardElevation = 'light' | 'medium' | 'heavy';
type CardSize = 'small' | 'medium' | 'large';
type CardBackground = 'surface' | 'tinted' | 'card';

export interface CardProps {
  children: React.ReactNode;
  elevation?: CardElevation;
  size?: CardSize;
  background?: CardBackground;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  padding?: keyof typeof spacing | number;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  
  // Animation options
  hoverAnimation?: boolean;
}

const getSpacingValue = (value: keyof typeof spacing | number | undefined, size: CardSize): number => {
  if (typeof value === 'number') return value;
  if (value && typeof spacing[value] === 'number') return spacing[value] as number;
  
  // Default padding based on card size
  const cardPadding = spacing.cardPadding[size];
  return typeof cardPadding === 'number' ? cardPadding : 16; // fallback to 16
};

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'light',
  size = 'medium',
  background = 'surface',
  onPress,
  style,
  padding,
  testID,
  accessibilityLabel,
  accessibilityHint,
  hoverAnimation = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress && hoverAnimation) {
      Animated.timing(scaleAnim, {
        toValue: animations.interactions.cardHover.scale,
        duration: animations.interactions.cardHover.duration,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress && hoverAnimation) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: animations.interactions.cardHover.duration,
        useNativeDriver: true,
      }).start();
    }
  };

  const getBackgroundColor = (): string => {
    switch (background) {
      case 'surface':
        return colors.background.surface;
      case 'tinted':
        return colors.background.surfaceTinted; // 4% tint
      case 'card':
        return colors.background.card; // 8% tint
      default:
        return colors.background.surface;
    }
  };

  const getBorderRadius = (): number => {
    return borderRadius.card[size]; // 18-22px range as specified
  };

  const getShadow = () => {
    return shadows.card[elevation]; // Lightweight shadows
  };

  const cardStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: getBorderRadius(),
    padding: getSpacingValue(padding, size),
    minHeight: components.card.minHeight,
    ...getShadow(),
  };

  const CardContent = (
    <View style={[cardStyle, style]} testID={testID}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1} // We handle opacity through scale animation
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        >
          {CardContent}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return CardContent;
};
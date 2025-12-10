/**
 * Skeleton Component
 * 
 * A loading placeholder component with subtle pulse animation
 * that matches the design system aesthetic
 */

import React, { useEffect, useRef } from 'react';
import { View, ViewStyle, DimensionValue, Animated } from 'react-native';
import { colors, borderRadius } from '../designSystem/tokens';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: keyof typeof borderRadius | number;
  style?: ViewStyle;
  testID?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius: radius = 'small',
  style,
  testID,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Subtle pulse animation - gentle and calm
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    
    animation.start();
    
    return () => animation.stop();
  }, [opacity]);

  const getBorderRadius = () => {
    if (typeof radius === 'number') {
      return radius;
    }
    return borderRadius[radius];
  };

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: colors.border.light,
          borderRadius: getBorderRadius(),
        },
        style,
      ]}
      testID={testID}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: colors.background.surface,
            borderRadius: getBorderRadius(),
            opacity,
          },
        ]}
      />
    </View>
  );
};
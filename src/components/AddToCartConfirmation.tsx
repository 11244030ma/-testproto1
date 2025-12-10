/**
 * AddToCartConfirmation Component
 * 
 * Shows a visual confirmation when items are added to cart
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { colors, spacing, borderRadius, shadows } from '../designSystem/tokens';

const { width: screenWidth } = Dimensions.get('window');

interface AddToCartConfirmationProps {
  visible: boolean;
  itemName: string;
  onHide: () => void;
}

export const AddToCartConfirmation: React.FC<AddToCartConfirmationProps> = ({
  visible,
  itemName,
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after 2 seconds
      const timer = setTimeout(() => {
        hideConfirmation();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      hideConfirmation();
    }
  }, [visible]);

  const hideConfirmation = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="check" size={16} color={colors.background.primary} />
        </View>
        
        <View style={styles.textContainer}>
          <Text
            variant="body"
            weight="medium"
            color="background.primary"
            numberOfLines={1}
          >
            Added to cart
          </Text>
          <Text
            variant="caption"
            color="background.primary"
            numberOfLines={1}
            style={styles.itemName}
          >
            {itemName}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 1000,
  },
  content: {
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.medium,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  itemName: {
    opacity: 0.9,
    marginTop: 2,
  },
});
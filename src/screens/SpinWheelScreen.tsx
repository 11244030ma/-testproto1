import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Box, Text, Button, Card, Icon } from '../components';
import { useRestaurants } from '../hooks';
import { colors, spacing, borderRadius, typography } from '../designSystem/tokens';
import { Restaurant } from '../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(screenWidth, screenHeight) * 0.7;
const CENTER_SIZE = 80;

interface SpinWheelScreenProps {
  navigation: any; // TODO: Type this properly
}

export const SpinWheelScreen: React.FC<SpinWheelScreenProps> = ({ navigation }) => {
  const { restaurants } = useRestaurants();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  // Get up to 8 restaurants for the wheel
  const wheelRestaurants = restaurants.slice(0, 8);
  const segmentAngle = 360 / wheelRestaurants.length;

  const handleSpin = useCallback(() => {
    if (isSpinning || wheelRestaurants.length === 0) return;

    setIsSpinning(true);
    setSelectedRestaurant(null);

    // Generate random rotation (3-5 full rotations + random angle)
    const randomRotation = 1080 + Math.random() * 720; // 3-5 rotations
    const finalAngle = randomRotation % 360;
    
    // Determine which restaurant is selected based on final angle
    const selectedIndex = Math.floor((360 - finalAngle) / segmentAngle) % wheelRestaurants.length;
    const selected = wheelRestaurants[selectedIndex];

    Animated.timing(spinValue, {
      toValue: randomRotation,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
      setSelectedRestaurant(selected);
    });
  }, [isSpinning, wheelRestaurants, segmentAngle, spinValue]);

  const handleGoToRestaurant = useCallback(() => {
    if (selectedRestaurant) {
      navigation.navigate('RestaurantDetail', { restaurantId: selectedRestaurant.id });
    }
  }, [selectedRestaurant, navigation]);

  const handleSpinAgain = useCallback(() => {
    spinValue.setValue(0);
    setSelectedRestaurant(null);
    handleSpin();
  }, [spinValue, handleSpin]);

  const renderWheelSegment = (restaurant: Restaurant, index: number) => {
    const rotation = index * segmentAngle;
    const segmentStyle = {
      position: 'absolute' as const,
      width: WHEEL_SIZE / 2,
      height: WHEEL_SIZE / 2,
      transformOrigin: '100% 100%',
      transform: [{ rotate: `${rotation}deg` }],
    };

    const colors = [
      '#AFC8A6', // sage green
      '#919E8B', // olive gray
      '#F7F5F0', // warm beige
      '#E8E6E1', // light border
      '#D4D2CD', // medium border
      '#FFFDF8', // soft cream
      '#AFC8A6', // sage green (repeat)
      '#919E8B', // olive gray (repeat)
    ];

    return (
      <View key={restaurant.id} style={segmentStyle}>
        <View
          style={[
            styles.segment,
            {
              backgroundColor: colors[index % colors.length],
              transform: [{ rotate: `${segmentAngle / 2}deg` }],
            },
          ]}
        >
          <Text
            variant="caption"
            color="text.primary"
            style={styles.segmentText}
            numberOfLines={2}
          >
            {restaurant.name}
          </Text>
        </View>
      </View>
    );
  };

  if (wheelRestaurants.length === 0) {
    return (
      <View style={styles.container}>
        <Box flex={1} justifyContent="center" alignItems="center" padding="xl">
          <Text variant="heading2" color={colors.text.primary} align="center" style={{ marginBottom: 16 }}>
            No Restaurants Available
          </Text>
          <Text variant="body" color={colors.text.secondary} align="center" style={{ marginBottom: 24 }}>
            Please check back later when restaurants are available.
          </Text>
          <Button
            variant="primary"
            onPress={() => navigation.goBack()}
          >
            Go Back
          </Button>
        </Box>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Box
        paddingHorizontal="lg"
        paddingTop="xl"
        paddingBottom="lg"
        backgroundColor="background.primary"
      >
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          
          <Text variant="heading3" color="text.primary">
            Spin the Wheel
          </Text>
          
          <View style={{ width: 24 }} />
        </Box>
        
        <Text variant="body" color={colors.text.secondary} align="center" style={{ marginTop: 8 }}>
          Let fate decide your next meal!
        </Text>
      </Box>

      {/* Wheel Container */}
      <Box flex={1} justifyContent="center" alignItems="center" padding="xl">
        <View style={styles.wheelContainer}>
          {/* Wheel */}
          <Animated.View
            style={[
              styles.wheel,
              {
                transform: [
                  {
                    rotate: spinValue.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            {wheelRestaurants.map((restaurant, index) =>
              renderWheelSegment(restaurant, index)
            )}
          </Animated.View>

          {/* Center Circle */}
          <View style={styles.centerCircle}>
            <Icon name="star" size={32} color={colors.accent.primary} />
          </View>

          {/* Pointer */}
          <View style={styles.pointer}>
            <View style={styles.pointerTriangle} />
          </View>
        </View>

        {/* Spin Button */}
        <Box marginTop="xl" width="100%" maxWidth={200}>
          <Button
            variant="primary"
            onPress={handleSpin}
            disabled={isSpinning}
            style={styles.spinButton}
          >
            {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
          </Button>
        </Box>
      </Box>

      {/* Result Modal */}
      {selectedRestaurant && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing.xl,
          }}
        >
          <Card style={styles.resultCard}>
            <Box alignItems="center" padding="xl">
              <Icon
                name="star"
                size={48}
                color={colors.accent.primary}
                style={{ marginBottom: spacing.lg }}
              />
              
              <Text variant="heading2" color={colors.text.primary} align="center" style={{ marginBottom: 8 }}>
                Winner!
              </Text>
              
              <Text variant="heading3" color={colors.text.primary} align="center" style={{ marginBottom: 8 }}>
                {selectedRestaurant.name}
              </Text>
              
              <Text variant="body" color={colors.text.secondary} align="center" style={{ marginBottom: 24 }}>
                {selectedRestaurant.cuisineType.join(', ')} • {selectedRestaurant.deliveryTime}
              </Text>
              
              <Box flexDirection="row" width="100%" gap={spacing.md}>
                <Box flex={1}>
                  <Button
                    variant="secondary"
                    onPress={handleSpinAgain}
                  >
                    Spin Again
                  </Button>
                </Box>
                
                <Box flex={1}>
                  <Button
                    variant="primary"
                    onPress={handleGoToRestaurant}
                  >
                    View Menu
                  </Button>
                </Box>
              </Box>
            </Box>
          </Card>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  backButton: {
    padding: spacing.sm,
  },
  wheelContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  segment: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: colors.background.surface,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  segmentText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    transform: [{ rotate: '-90deg' }],
    width: 60,
  },
  centerCircle: {
    position: 'absolute',
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    backgroundColor: colors.background.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  pointer: {
    position: 'absolute',
    top: -10,
    zIndex: 5,
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.accent.primary,
  },
  spinButton: {
    minHeight: 56,
  },
  resultCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: borderRadius.large,
  },
});
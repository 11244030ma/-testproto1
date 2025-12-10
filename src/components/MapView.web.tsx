import React, { useCallback } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { Box, Text } from './';
import { Restaurant } from '../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface RestaurantMapViewProps {
  restaurants: Restaurant[];
  onRestaurantPress: (restaurant: Restaurant) => void;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const defaultRegion = {
  latitude: 37.7749, // San Francisco
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const RestaurantMapView: React.FC<RestaurantMapViewProps> = ({
  restaurants,
  onRestaurantPress,
  initialRegion = defaultRegion,
}) => {
  const handleRestaurantPress = useCallback((restaurant: Restaurant) => {
    onRestaurantPress(restaurant);
  }, [onRestaurantPress]);

  // Web fallback - show a styled list view that looks like a map
  return (
    <Box style={styles.mapContainer}>
      {/* Map placeholder with gradient background */}
      <Box style={styles.mapBackground}>
        <Text variant="h3" color="text.secondary" style={styles.mapTitle}>
          Restaurant Locations
        </Text>
        <Text variant="body" color="text.secondary" style={styles.mapSubtitle}>
          {initialRegion.latitude.toFixed(4)}, {initialRegion.longitude.toFixed(4)}
        </Text>
      </Box>
      
      {/* Restaurant markers as cards */}
      <Box style={styles.markersContainer}>
        {restaurants.map((restaurant, index) => (
          <Box
            key={restaurant.id}
            backgroundColor="background.surface"
            padding="md"
            borderRadius="medium"
            style={[
              styles.restaurantMarker,
              { 
                top: `${20 + (index * 15) % 60}%`,
                left: `${15 + (index * 25) % 70}%`,
              }
            ]}
            onTouchEnd={() => handleRestaurantPress(restaurant)}
          >
            <Text variant="caption" color="text.primary" style={styles.markerText}>
              {restaurant.name.length > 15 
                ? `${restaurant.name.substring(0, 15)}...` 
                : restaurant.name
              }
            </Text>
            <Text variant="caption" color="text.secondary" style={styles.markerRating}>
              ⭐ {restaurant.rating}
            </Text>
            <Box
              backgroundColor="accent.primary"
              style={styles.markerPin}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
    overflow: 'hidden',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F7F5F0', // warm beige
    background: 'linear-gradient(135deg, #F7F5F0 0%, #AFC8A6 100%)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 8,
  },
  mapSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  markersContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  restaurantMarker: {
    position: 'absolute',
    minWidth: 120,
    maxWidth: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    cursor: 'pointer',
  },
  markerText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  markerRating: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 4,
  },
  markerPin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 2,
  },
});
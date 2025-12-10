import React, { useCallback, useRef } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Box, Text } from './';
import { Restaurant } from '../types';
import { colors, spacing, borderRadius } from '../designSystem/tokens';

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
  const mapRef = useRef<MapView>(null);

  const handleMarkerPress = useCallback((restaurant: Restaurant) => {
    onRestaurantPress(restaurant);
  }, [onRestaurantPress]);

  const customMapStyle = [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [
        {
          color: '#F7F5F0', // warm beige
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#AFC8A6', // sage green
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#FFFDF8', // soft cream
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
  ];

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
      customMapStyle={customMapStyle}
      showsUserLocation={true}
      showsMyLocationButton={false}
      showsCompass={false}
      showsScale={false}
      showsBuildings={false}
      showsTraffic={false}
      showsIndoors={false}
      rotateEnabled={false}
      pitchEnabled={false}
    >
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          coordinate={{
            latitude: restaurant.location.coordinates.latitude,
            longitude: restaurant.location.coordinates.longitude,
          }}
          onPress={() => handleMarkerPress(restaurant)}
        >
          <Box
            backgroundColor="background.surface"
            padding="sm"
            borderRadius="medium"
            style={styles.markerContainer}
          >
            <Text variant="caption" color="text.primary" style={styles.markerText}>
              {restaurant.name.length > 12 
                ? `${restaurant.name.substring(0, 12)}...` 
                : restaurant.name
              }
            </Text>
            <Box
              backgroundColor="accent.primary"
              padding="xs"
              borderRadius="small"
              style={styles.markerPin}
            />
          </Box>
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: screenWidth,
    height: screenHeight,
  },
  markerContainer: {
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  markerPin: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
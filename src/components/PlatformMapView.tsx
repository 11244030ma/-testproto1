import React from 'react';
import { Platform } from 'react-native';
import { Restaurant } from '../types';

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

// Platform-specific MapView component
export const RestaurantMapView: React.FC<RestaurantMapViewProps> = (props) => {
  if (Platform.OS === 'web') {
    // Use web-compatible version
    const { RestaurantMapView: WebMapView } = require('./MapView.web');
    return <WebMapView {...props} />;
  } else {
    // Use native version
    const { RestaurantMapView: NativeMapView } = require('./MapView');
    return <NativeMapView {...props} />;
  }
};
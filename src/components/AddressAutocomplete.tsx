/**
 * AddressAutocomplete Component
 * 
 * Provides address search and autocomplete functionality with delivery zone validation
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  FlatList, 
  Keyboard,
  Alert 
} from 'react-native';
import { Box, Text, Input, Icon } from './';
import { colors, spacing, borderRadius } from '../designSystem/tokens';
import { Address } from '../types';

export interface AddressSuggestion {
  id: string;
  description: string;
  mainText: string;
  secondaryText: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface AddressAutocompleteProps {
  value: string;
  onAddressSelect: (address: Partial<Address>) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  testID?: string;
}

// Mock delivery zones - in a real app, this would come from an API
const DELIVERY_ZONES = [
  { 
    name: 'Downtown', 
    bounds: { 
      north: 37.7849, 
      south: 37.7749, 
      east: -122.4094, 
      west: -122.4194 
    } 
  },
  { 
    name: 'Mission District', 
    bounds: { 
      north: 37.7699, 
      south: 37.7499, 
      east: -122.4094, 
      west: -122.4294 
    } 
  },
  { 
    name: 'SOMA', 
    bounds: { 
      north: 37.7849, 
      south: 37.7649, 
      east: -122.3994, 
      west: -122.4194 
    } 
  },
];

// Mock geocoding service - in a real app, this would use Google Places API or similar
const mockGeocode = async (address: string): Promise<{ latitude: number; longitude: number } | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock coordinates for common addresses
  const mockCoordinates: { [key: string]: { latitude: number; longitude: number } } = {
    'san francisco': { latitude: 37.7749, longitude: -122.4194 },
    'mission': { latitude: 37.7599, longitude: -122.4148 },
    'soma': { latitude: 37.7749, longitude: -122.4094 },
    'downtown': { latitude: 37.7899, longitude: -122.4094 },
  };
  
  const normalizedAddress = address.toLowerCase();
  for (const [key, coords] of Object.entries(mockCoordinates)) {
    if (normalizedAddress.includes(key)) {
      return coords;
    }
  }
  
  // Default to SF coordinates if no match
  return { latitude: 37.7749, longitude: -122.4194 };
};

// Mock address search service - in a real app, this would use Google Places API
const searchAddresses = async (query: string): Promise<AddressSuggestion[]> => {
  if (query.length < 3) return [];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock suggestions based on query
  const mockSuggestions: AddressSuggestion[] = [
    {
      id: '1',
      description: '123 Main Street, San Francisco, CA 94102',
      mainText: '123 Main Street',
      secondaryText: 'San Francisco, CA 94102',
      coordinates: { latitude: 37.7749, longitude: -122.4194 },
    },
    {
      id: '2',
      description: '456 Mission Street, San Francisco, CA 94105',
      mainText: '456 Mission Street',
      secondaryText: 'San Francisco, CA 94105',
      coordinates: { latitude: 37.7599, longitude: -122.4148 },
    },
    {
      id: '3',
      description: '789 Market Street, San Francisco, CA 94103',
      mainText: '789 Market Street',
      secondaryText: 'San Francisco, CA 94103',
      coordinates: { latitude: 37.7849, longitude: -122.4094 },
    },
    {
      id: '4',
      description: '321 Valencia Street, San Francisco, CA 94110',
      mainText: '321 Valencia Street',
      secondaryText: 'San Francisco, CA 94110',
      coordinates: { latitude: 37.7599, longitude: -122.4194 },
    },
    {
      id: '5',
      description: '654 Folsom Street, San Francisco, CA 94107',
      mainText: '654 Folsom Street',
      secondaryText: 'San Francisco, CA 94107',
      coordinates: { latitude: 37.7749, longitude: -122.4094 },
    },
  ];
  
  // Filter suggestions based on query
  return mockSuggestions.filter(suggestion =>
    suggestion.description.toLowerCase().includes(query.toLowerCase())
  );
};

const parseAddress = (addressString: string): Partial<Address> => {
  // Simple address parsing - in a real app, this would be more sophisticated
  const parts = addressString.split(', ');
  
  if (parts.length >= 3) {
    const street = parts[0];
    const city = parts[1];
    const stateZip = parts[2].split(' ');
    const state = stateZip[0];
    const zipCode = stateZip[1];
    
    return {
      street,
      city,
      state,
      zipCode,
      country: 'US',
    };
  }
  
  return {
    street: addressString,
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  };
};

const isInDeliveryZone = (coordinates: { latitude: number; longitude: number }): boolean => {
  return DELIVERY_ZONES.some(zone => {
    return (
      coordinates.latitude >= zone.bounds.south &&
      coordinates.latitude <= zone.bounds.north &&
      coordinates.longitude >= zone.bounds.west &&
      coordinates.longitude <= zone.bounds.east
    );
  });
};

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onAddressSelect,
  onTextChange,
  placeholder = "Enter your address",
  error,
  label,
  testID,
}) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValidatingDelivery, setIsValidatingDelivery] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value.length >= 3) {
      // Debounce search requests
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await searchAddresses(value);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Address search failed:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [value]);

  const handleSuggestionSelect = async (suggestion: AddressSuggestion) => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    
    // Parse the address
    const parsedAddress = parseAddress(suggestion.description);
    
    // Get coordinates if not provided
    let coordinates = suggestion.coordinates;
    if (!coordinates) {
      setIsValidatingDelivery(true);
      coordinates = await mockGeocode(suggestion.description);
      setIsValidatingDelivery(false);
    }
    
    if (coordinates) {
      // Check if address is in delivery zone
      if (isInDeliveryZone(coordinates)) {
        // Address is valid for delivery
        onAddressSelect({
          ...parsedAddress,
          coordinates,
        });
        
        if (onTextChange) {
          onTextChange(suggestion.description);
        }
      } else {
        // Address is outside delivery zone
        Alert.alert(
          'Delivery Unavailable',
          'Sorry, we don\'t deliver to this address yet. Please try a different location or consider pickup.',
          [
            {
              text: 'Try Another Address',
              style: 'default',
            },
            {
              text: 'Use Anyway',
              style: 'destructive',
              onPress: () => {
                onAddressSelect({
                  ...parsedAddress,
                  coordinates,
                });
                
                if (onTextChange) {
                  onTextChange(suggestion.description);
                }
              },
            },
          ]
        );
      }
    } else {
      // Geocoding failed
      Alert.alert(
        'Address Not Found',
        'We couldn\'t locate this address. Please check the address and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTextChange = (text: string) => {
    if (onTextChange) {
      onTextChange(text);
    }
    
    if (text.length < 3) {
      setShowSuggestions(false);
    }
  };

  const renderSuggestion = ({ item }: { item: AddressSuggestion }) => (
    <TouchableOpacity
      onPress={() => handleSuggestionSelect(item)}
      style={{
        backgroundColor: colors.background.surface,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
      }}
    >
      <Box flexDirection="row" alignItems="center">
        <Icon 
          name="location" 
          size={16} 
          color={colors.text.tertiary} 
          style={{ marginRight: spacing.md }}
        />
        <Box flex={1}>
          <Text variant="body" weight="medium" numberOfLines={1}>
            {item.mainText}
          </Text>
          <Text variant="caption" color={colors.text.secondary} numberOfLines={1}>
            {item.secondaryText}
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );

  return (
    <Box>
      <Input
        label={label}
        placeholder={isLoading ? "Searching..." : placeholder}
        value={value}
        onChangeText={handleTextChange}
        error={error}
        testID={testID}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <Box
          backgroundColor={colors.background.surface}
          borderRadius="medium"
          shadow="medium"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 200,
            marginTop: spacing.xs,
          }}
        >
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </Box>
      )}
      
      {isValidatingDelivery && (
        <Box
          flexDirection="row"
          alignItems="center"
          marginTop="sm"
        >
          <Icon name="clock" size={16} color={colors.accent.primary} />
          <Text 
            variant="caption" 
            color={colors.accent.primary}
            style={{ marginLeft: spacing.sm }}
          >
            Checking delivery availability...
          </Text>
        </Box>
      )}
    </Box>
  );
};
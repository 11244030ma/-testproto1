import React from 'react';
import { Platform } from 'react-native';

interface FloatingSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSpinPress?: () => void;
  testID?: string;
}

// Platform-specific FloatingSearchBar component
export const FloatingSearchBar: React.FC<FloatingSearchBarProps> = (props) => {
  if (Platform.OS === 'web') {
    // Use web-compatible version
    const { FloatingSearchBar: WebSearchBar } = require('./FloatingSearchBar.web');
    return <WebSearchBar {...props} />;
  } else {
    // Use native version
    const { FloatingSearchBar: NativeSearchBar } = require('./FloatingSearchBar');
    return <NativeSearchBar {...props} />;
  }
};
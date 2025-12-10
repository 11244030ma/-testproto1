import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Box, Icon } from './';
import { colors, spacing, borderRadius } from '../designSystem/tokens';

export type ViewMode = 'map' | 'list';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  testID?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange,
  testID,
}) => {
  return (
    <Box style={styles.container} testID={testID}>
      <BlurView intensity={80} tint="light" style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            currentView === 'map' && styles.activeButton,
          ]}
          onPress={() => onViewChange('map')}
          activeOpacity={0.7}
        >
          <Icon
            name="map"
            size={20}
            color={currentView === 'map' ? colors.background.surface : colors.text.secondary}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.toggleButton,
            currentView === 'list' && styles.activeButton,
          ]}
          onPress={() => onViewChange('list')}
          activeOpacity={0.7}
        >
          <Icon
            name="list"
            size={20}
            color={currentView === 'list' ? colors.background.surface : colors.text.secondary}
          />
        </TouchableOpacity>
      </BlurView>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: spacing.lg,
    zIndex: 1000,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
  },
  toggleButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: colors.accent.primary,
  },
});
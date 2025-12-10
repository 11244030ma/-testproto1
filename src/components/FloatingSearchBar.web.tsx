import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Box, Icon } from './';
import { colors, spacing, borderRadius, typography } from '../designSystem/tokens';

interface FloatingSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSpinPress?: () => void;
  testID?: string;
}

export const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search restaurants, cuisines...",
  onSpinPress,
  testID,
}) => {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <Box style={styles.container} testID={testID}>
      {/* Glassmorphism Search Bar - Web Compatible */}
      <Box style={styles.searchContainer}>
        <Box style={styles.searchContent}>
          <Icon 
            name="search" 
            size={20} 
            color={colors.text.secondary}
            style={styles.searchIcon}
          />
          
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.text.tertiary}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          {value.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon 
                name="x" 
                size={18} 
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </Box>
      </Box>

      {/* Spin Wheel Button */}
      {onSpinPress && (
        <TouchableOpacity
          onPress={onSpinPress}
          style={styles.spinButton}
          activeOpacity={0.8}
        >
          <Box style={styles.spinButtonContent}>
            <Icon 
              name="refresh-cw" 
              size={24} 
              color={colors.primary.green}
            />
          </Box>
        </TouchableOpacity>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)', // Safari support
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily.body,
    color: colors.text.primary,
    paddingVertical: 0,
    outline: 'none', // Remove web focus outline
    border: 'none', // Remove web border
    backgroundColor: 'transparent',
  },
  clearButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  spinButton: {
    marginLeft: spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  spinButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
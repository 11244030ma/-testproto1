import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Box, Text, Card, Icon, Button } from '../components';
import type { IconName } from '../components/Icon';
import { colors, spacing, borderRadius } from '../designSystem/tokens';
import { User, Address, PaymentMethod, Order } from '../types';

interface ProfileScreenProps {
  navigation: any; // TODO: Type this properly
}

// Mock user data - in real app this would come from user store/API
const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  savedAddresses: [
    {
      id: 'addr-1',
      label: 'Home',
      street: '456 Oak Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'US',
      coordinates: { latitude: 37.7849, longitude: -122.4094 },
    },
    {
      id: 'addr-2',
      label: 'Work',
      street: '789 Market Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'US',
      coordinates: { latitude: 37.7849, longitude: -122.4094 },
    },
  ],
  savedPaymentMethods: [
    {
      id: 'pm-1',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      isDefault: true,
    },
    {
      id: 'pm-2',
      type: 'card',
      last4: '5555',
      brand: 'mastercard',
      isDefault: false,
    },
  ],
  orderHistory: [],
  preferences: {
    dietaryRestrictions: ['vegetarian'],
    favoriteCuisines: ['Italian', 'Mexican', 'Thai'],
  },
};

interface MenuItemProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
}) => (
  <TouchableOpacity onPress={onPress} style={styles.menuItem}>
    <Box flexDirection="row" alignItems="center" flex={1}>
      <Box
        width={40}
        height={40}
        borderRadius={20}
        backgroundColor="background.secondary"
        justifyContent="center"
        alignItems="center"
        marginRight="md"
      >
        <Icon name={icon} size={20} color={colors.text.primary} />
      </Box>
      
      <Box flex={1}>
        <Text variant="body" color={colors.text.primary} weight="medium">
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" color={colors.text.secondary} style={{ marginTop: 4 }}>
            {subtitle}
          </Text>
        )}
      </Box>
      
      {showChevron && (
        <Icon name="chevron-right" size={20} color={colors.text.tertiary} />
      )}
    </Box>
  </TouchableOpacity>
);

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user] = useState<User>(mockUser); // In real app, get from user store

  const handleEditProfile = useCallback(() => {
    // TODO: Navigate to edit profile screen
    console.log('Edit profile');
  }, []);

  const handleAddresses = useCallback(() => {
    // TODO: Navigate to addresses screen
    console.log('Manage addresses');
  }, []);

  const handlePaymentMethods = useCallback(() => {
    // TODO: Navigate to payment methods screen
    console.log('Manage payment methods');
  }, []);

  const handleOrderHistory = useCallback(() => {
    // TODO: Navigate to order history screen
    console.log('View order history');
  }, []);

  const handlePreferences = useCallback(() => {
    // TODO: Navigate to preferences screen
    console.log('Manage preferences');
  }, []);

  const handleNotifications = useCallback(() => {
    // TODO: Navigate to notifications settings
    console.log('Notification settings');
  }, []);

  const handleHelp = useCallback(() => {
    // TODO: Navigate to help/support screen
    console.log('Help & Support');
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout logic
            console.log('User logged out');
          },
        },
      ]
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Box
        paddingHorizontal="lg"
        paddingTop="xl"
        paddingBottom="lg"
        backgroundColor="background.primary"
        style={styles.header}
      >
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          
          <Text variant="heading3" color="text.primary">
            Profile
          </Text>
          
          <TouchableOpacity
            onPress={handleEditProfile}
            style={styles.editButton}
          >
            <Icon name="edit-2" size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </Box>
      </Box>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <Box paddingHorizontal="lg" marginBottom="xl">
          <Card style={styles.userCard}>
            <Box padding="lg" alignItems="center">
              {/* Avatar */}
              <Box
                width={80}
                height={80}
                borderRadius={40}
                backgroundColor="accent.primary"
                justifyContent="center"
                alignItems="center"
                marginBottom="md"
              >
                <Text variant="heading2" color={colors.background.surface} weight="bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </Box>
              
              <Text variant="heading3" color={colors.text.primary} align="center">
                {user.name}
              </Text>
              
              <Text variant="body" color={colors.text.secondary} align="center" style={{ marginTop: 4 }}>
                {user.email}
              </Text>
              
              <Text variant="body" color={colors.text.secondary} align="center">
                {user.phone}
              </Text>
            </Box>
          </Card>
        </Box>

        {/* Account Section */}
        <Box paddingHorizontal="lg" marginBottom="xl">
          <Text variant="heading3" color={colors.text.primary} style={{ marginBottom: 16 }}>
            Account
          </Text>
          
          <Card style={styles.menuCard}>
            <Box padding="sm">
              <MenuItem
                icon="map-pin"
                title="Delivery Addresses"
                subtitle={`${user.savedAddresses.length} saved addresses`}
                onPress={handleAddresses}
              />
              
              <MenuItem
                icon="credit-card"
                title="Payment Methods"
                subtitle={`${user.savedPaymentMethods.length} saved cards`}
                onPress={handlePaymentMethods}
              />
              
              <MenuItem
                icon="clock"
                title="Order History"
                subtitle="View past orders"
                onPress={handleOrderHistory}
              />
              
              <MenuItem
                icon="heart"
                title="Preferences"
                subtitle={`${user.preferences.favoriteCuisines.length} favorite cuisines`}
                onPress={handlePreferences}
              />
            </Box>
          </Card>
        </Box>

        {/* Settings Section */}
        <Box paddingHorizontal="lg" marginBottom="xl">
          <Text variant="heading3" color={colors.text.primary} style={{ marginBottom: 16 }}>
            Settings
          </Text>
          
          <Card style={styles.menuCard}>
            <Box padding="sm">
              <MenuItem
                icon="bell"
                title="Notifications"
                subtitle="Manage notification preferences"
                onPress={handleNotifications}
              />
              
              <MenuItem
                icon="help-circle"
                title="Help & Support"
                subtitle="Get help or contact support"
                onPress={handleHelp}
              />
            </Box>
          </Card>
        </Box>

        {/* Logout */}
        <Box paddingHorizontal="lg" marginBottom="xl">
          <Button
            variant="secondary"
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Icon name="log-out" size={20} color={colors.error.primary} />
            <Text variant="body" color={colors.error.primary} weight="medium" style={{ marginLeft: 8 }}>
              Sign Out
            </Text>
          </Button>
        </Box>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  content: {
    flex: 1,
  },
  backButton: {
    padding: spacing.sm,
  },
  editButton: {
    padding: spacing.sm,
  },
  userCard: {
    borderRadius: borderRadius.medium,
  },
  menuCard: {
    borderRadius: borderRadius.medium,
  },
  menuItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderColor: colors.error.primary,
  },
});
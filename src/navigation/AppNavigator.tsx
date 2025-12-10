import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions, TransitionPresets } from '@react-navigation/stack';
import {
  HomeScreen,
  RestaurantDetailScreen,
  CartScreen,
  CheckoutScreen,
  OrderConfirmationScreen,
  SpinWheelScreen,
  OrderTrackingScreen,
  ProfileScreen,
} from '../screens';
import { colors, animations } from '../designSystem/tokens';

export type RootStackParamList = {
  Home: undefined;
  RestaurantDetail: { restaurantId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  SpinWheel: undefined;
  OrderTracking: { orderId: string };
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Custom transition configuration for gentle animations
 * Uses design system timing (300ms) with smooth easing curves
 */
const customTransition: StackNavigationOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: animations.timing.normal, // 300ms
        easing: require('react-native').Easing.bezier(0.4, 0.0, 0.2, 1), // standard easing
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: animations.timing.normal, // 300ms
        easing: require('react-native').Easing.bezier(0.4, 0.0, 0.2, 1), // standard easing
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.8, 1],
        }),
      },
    };
  },
};

/**
 * Default screen options applying design system styling
 */
const defaultScreenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.background.primary,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    fontFamily: 'SF Pro Display',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  headerBackTitle: '',
  headerTintColor: colors.text.primary,
  ...customTransition,
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={defaultScreenOptions}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false, // Home screen will have custom header
          }}
        />
        <Stack.Screen
          name="RestaurantDetail"
          component={RestaurantDetailScreen}
          options={{
            title: 'Restaurant',
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'transparent',
            },
          }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{
            title: 'Cart',
          }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{
            title: 'Checkout',
          }}
        />
        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmationScreen}
          options={{
            title: 'Order Confirmed',
            headerLeft: () => null, // Prevent going back
            gestureEnabled: false, // Disable swipe back
          }}
        />
        <Stack.Screen
          name="SpinWheel"
          component={SpinWheelScreen}
          options={{
            headerShown: false, // SpinWheel screen has custom header
          }}
        />
        <Stack.Screen
          name="OrderTracking"
          component={OrderTrackingScreen}
          options={{
            headerShown: false, // OrderTracking screen has custom header
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false, // Profile screen has custom header
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation';
import { ThemeProvider } from './src/designSystem/ThemeProvider';
import { useUserStore } from './src/stores/userStore';
import { sampleUser } from './src/utils/mockData';

export default function App() {
  const setUser = useUserStore(state => state.setUser);

  useEffect(() => {
    // Initialize with sample user data for development
    setUser(sampleUser);
  }, [setUser]);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
        <StatusBar style="dark" backgroundColor="#FFFDF8" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Paper
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';

// Telas
import Login from './src/pages/Login';
import SplashScreen from './src/components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#038C7F',
      secondary: '#F2E7DC',
    },
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="light" />
        <View style={{ flex: 1 }}>
          {showSplash ? (
            <SplashScreen onFinish={() => setShowSplash(false)} />
          ) : (
            <Login />
          )}
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

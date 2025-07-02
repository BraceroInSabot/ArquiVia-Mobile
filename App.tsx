import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import Login from './src/pages/Login'; 

// Paper
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

export default function App() {
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
        <StatusBar style="auto" />
        <Login />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

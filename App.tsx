import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebase';

import Login from './src/pages/Login';
import Cadastro from './src/pages/Cadastro';
import Inicio from './src/pages/Inicio'

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#038C7F',
    secondary: '#F2E7DC',
  },
};

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuarioLogado(!!user);
    });

    return unsubscribe;
  }, []);

  if (usuarioLogado === null) return null;
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {usuarioLogado ? (
              <Stack.Screen name="Inicio" component={Inicio} />
            ) : (
              <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Cadastro" component={Cadastro} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

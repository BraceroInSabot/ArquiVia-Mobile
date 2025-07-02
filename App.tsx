import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './src/services/firebase';

import Login from './src/pages/Login';
import Cadastro from './src/pages/Cadastro';
import Inicio from './src/pages/Inicio';
import Setor from './src/pages/Setor';
import Empresa from './src/pages/Empresa';
import Documentos from './src/pages/Documentos';
import Usuario from './src/pages/Usuario';
import CriarEmpresa from './src/pages/EmpresaCRUD/CriarEmpresa';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#038C7F',
    secondary: '#F2E7DC',
    secondaryContainer: '#F2E7DC',
  },
};

function FooterTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#027373',
        tabBarInactiveTintColor: '#038C7F',
        tabBarStyle: { backgroundColor: '#A9D9D0' },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Setor': iconName = 'office-building'; break;
            case 'Empresa': iconName = 'domain'; break;
            case 'Inicio': iconName = 'home'; break;
            case 'Documentos': iconName = 'file-document'; break;
            case 'Usuario': iconName = 'account'; break;
          }
          return <MaterialCommunityIcons name={iconName} color={color} size={28} />;
        },
      })}
    >
      <Tab.Screen name="Setor" component={Setor} />
      <Tab.Screen name="Empresa" component={Empresa} />
      <Tab.Screen name="Inicio" component={Inicio} />
      <Tab.Screen name="Documentos" component={Documentos} />
      <Tab.Screen name="Usuario" component={Usuario} />
    </Tab.Navigator>
  );
}

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
              <>
                <Stack.Screen name="HomeTabs" component={FooterTabs} />
                <Stack.Screen name="CriarEmpresa" component={CriarEmpresa} />
              </>
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

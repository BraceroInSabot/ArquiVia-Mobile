import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // após 3s, aciona função para ir à próxima tela
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/img/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator animating={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});

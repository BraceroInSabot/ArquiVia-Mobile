import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function Login() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineMedium">Olá com Paper</Text>
      <Button mode="contained" onPress={() => console.log('Botão pressionado')}>
        Pressione-me
      </Button>
    </View>
  );
}
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { getAuth, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  "The action 'RESET' with payload", // parte da mensagem do warning
]);

export default function PerfilUsuario({ navigation }: any) {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
      // Remover navegação aqui para evitar conflito
    });

    return () => unsubscribe();
  }, [auth]);

  const handleSair = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      alert('Erro ao sair. Tente novamente.');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Carregando usuário...</Text>
      </View>
    );
  }

  console.log(user)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Perfil do Usuário
      </Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nome de usuário</Text>
        <Text style={styles.info}>{user.displayName || 'Não definido'}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.info}>{user.email || 'Não definido'}</Text>
      </View>

      <Button mode="contained" onPress={handleSair} style={styles.button}>
        Sair
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#fff',
    marginTop: 20,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#038C7F',
  },
  infoContainer: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#444',
  },
  info: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
  },
  button: {
    marginTop: 32,
  },
});

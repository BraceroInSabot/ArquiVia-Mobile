import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [emailInvalido, setEmailInvalido] = useState(false);
  const [erro, setErro] = useState('');

  const theme = useTheme();

  const handleLogin = async () => {
    const emailEhValido = email.includes('@') && email.includes('.');
    setEmailInvalido(!emailEhValido);

    if (!emailEhValido) return;

    try {
        await signInWithEmailAndPassword(auth, email, senha);
        navigation.navigate('Inicio'); // redireciona após login
        navigation.reset({
            index: 0,
            routes: [{ name: 'Inicio' }],
        });

    } catch (error: any) {
        setErro('Email ou senha inválidos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailInvalido) setEmailInvalido(false);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        mode="outlined"
        error={emailInvalido}
      />

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={!senhaVisivel}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        mode="outlined"
        right={
          <TextInput.Icon
            icon={senhaVisivel ? 'eye-off' : 'eye'}
            onPress={() => setSenhaVisivel(!senhaVisivel)}
          />
        }
      />

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Entrar
      </Button>

      {erro !== '' && <Text style={{ color: 'red', textAlign: 'center' }}>{erro}</Text>}

      <Button mode="text" onPress={() => navigation.navigate('Cadastro')}>
        Criar uma conta
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#038C7F',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

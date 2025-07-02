import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [emailInvalido, setEmailInvalido] = useState(false);

  const theme = useTheme();

  const handleLogin = () => {
    const emailEhValido = email.includes('@') && email.includes('.');
    setEmailInvalido(!emailEhValido);

    if (!emailEhValido) return;

    console.log('Login com:', email, senha);
  };

  const handleCadastro = () => {
    console.log('Ir para tela de cadastro');
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

      <Button mode="text" onPress={handleCadastro}>
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

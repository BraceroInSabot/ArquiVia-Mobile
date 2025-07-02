import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

export default function Cadastro({ navigation }: any) {
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmacaoVisivel, setConfirmacaoVisivel] = useState(false);
  const [emailInvalido, setEmailInvalido] = useState(false);

  const handleCadastro = () => {
    const emailEhValido = email.includes('@') && email.includes('.');
    setEmailInvalido(!emailEhValido);

    if (!emailEhValido) return;

    if (senha !== confirmacaoSenha) {
      alert('As senhas não coincidem');
      return;
    }

    console.log('Usuário cadastrado:', usuario, email);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        label="Usuário"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
        autoCorrect={false}
        mode="outlined"
        style={styles.input}
      />

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
        mode="outlined"
        style={styles.input}
        error={emailInvalido}
      />

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={!senhaVisivel}
        autoCapitalize="none"
        autoCorrect={false}
        mode="outlined"
        style={styles.input}
        right={
          <TextInput.Icon
            icon={senhaVisivel ? 'eye-off' : 'eye'}
            onPress={() => setSenhaVisivel(!senhaVisivel)}
          />
        }
      />

      <TextInput
        label="Confirmar Senha"
        value={confirmacaoSenha}
        onChangeText={setConfirmacaoSenha}
        secureTextEntry={!confirmacaoVisivel}
        autoCapitalize="none"
        autoCorrect={false}
        mode="outlined"
        style={styles.input}
        right={
          <TextInput.Icon
            icon={confirmacaoVisivel ? 'eye-off' : 'eye'}
            onPress={() => setConfirmacaoVisivel(!confirmacaoVisivel)}
          />
        }
      />

      <Button mode="contained" onPress={handleCadastro} style={styles.button}>
        Cadastrar
      </Button>

      <Button mode="text" onPress={() => navigation.goBack()}>
        Voltar
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

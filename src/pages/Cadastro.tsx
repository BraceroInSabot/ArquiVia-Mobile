import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';

export default function Cadastro() {
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [erro, setErro] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmaSenhaVisivel, setConfirmaSenhaVisivel] = useState(false);

  // validação
  const [emailValido, setEmailValido] = useState(true);
  const [usuarioValido, setUsuarioValido] = useState(true);
  const [senhaValida, setSenhaValida] = useState(true);
  const [senhasIguais, setSenhasIguais] = useState(true);


  const validarSenha = (valor: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(valor);
    };


  const theme = useTheme();
  const navigation = useNavigation();

  const handleCadastro = async () => {
    setErro('');

    if (!usuario || !email || !senha || !confirmaSenha) {
      setErro('Preencha todos os campos.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErro('Email inválido.');
      return;
    }

    if (senha !== confirmaSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;

      await set(ref(database, 'users/' + uid), {
        nome: usuario,
        email: email,
      });

      navigation.goBack();
    } catch (error: any) {
      setErro('Erro ao cadastrar: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        label="Nome de usuário"
        value={usuario}
        onChangeText={(e) => {
            setUsuario(e);
            setUsuarioValido(e.trim().length >= 3);
        }}
        autoCapitalize="none"
        style={[
            styles.input,
            !usuarioValido && { borderColor: 'red' },
        ]}
        mode="outlined"
        error={!usuarioValido}
        />
        {!usuarioValido && (
            <Text style={{ color: 'red', marginBottom: 8 }}>
            Nome de usuário deve ter pelo menos 3 letras
            </Text>
            )}

      <TextInput
        label="Email"
        value={email}
        onChangeText={(e) => {
            setEmail(e);
            setEmailValido(e.includes('@') && e.includes('.'));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[
            styles.input,
            !emailValido && { borderColor: 'red' },
        ]}
        mode="outlined"
        error={!emailValido}
        />

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={(e) => {
            setSenha(e);
            setSenhaValida(validarSenha(e));
        }}
        secureTextEntry={!senhaVisivel}
        autoCapitalize="none"
        style={[
            styles.input,
            !senhaValida && { borderColor: 'red' },
        ]}
        mode="outlined"
        error={!senhaValida}
        right={
            <TextInput.Icon
            icon={senhaVisivel ? 'eye-off' : 'eye'}
            onPress={() => setSenhaVisivel(!senhaVisivel)}
            />
        }
        />

        {!senhaValida && (
        <Text style={{ color: 'red', marginBottom: 8 }}>
            A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial.
        </Text>
        )}


      <TextInput
        label="Confirmar senha"
        value={confirmaSenha}
        onChangeText={(e) => {
            setConfirmaSenha(e);
            setSenhasIguais(e === senha);
        }}
        secureTextEntry={!confirmaSenhaVisivel}
        autoCapitalize="none"
        style={[
            styles.input,
            !senhasIguais && { borderColor: 'red' },
        ]}
        mode="outlined"
        error={!senhasIguais}
        right={
            <TextInput.Icon
            icon={confirmaSenhaVisivel ? 'eye-off' : 'eye'}
            onPress={() => setConfirmaSenhaVisivel(!confirmaSenhaVisivel)}
            />
        }
        />

        {!senhasIguais && (
        <Text style={{ color: 'red', marginBottom: 8 }}>
            As senhas não coincidem.
        </Text>
        )}

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

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
  erro: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});

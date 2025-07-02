import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { ref, push } from 'firebase/database';
import { database } from '../../services/firebase'; // Certifique-se que db vem de getDatabase()

export default function CriarEmpresa({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [ramo, setRamo] = useState('');
  const [dataAbertura, setDataAbertura] = useState('');

  const handleSalvar = async () => {
    if (!nome.trim()) {
      alert('Nome da empresa é obrigatório');
      return;
    }

    const novaEmpresa = {
      nome,
      descricao,
      endereco,
      ramo,
      dataAbertura,
      criadaEm: new Date().toISOString(),
    };

    try {
      const empresasRef = ref(database, 'empresas');
      await push(empresasRef, novaEmpresa);
      Alert.alert('Sucesso', 'Empresa criada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a empresa.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Criar Empresa
      </Text>

      <TextInput
        label="Nome Empresa"
        value={nome}
        onChangeText={setNome}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <TextInput
        label="Endereço"
        value={endereco}
        onChangeText={setEndereco}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Ramo"
        value={ramo}
        onChangeText={setRamo}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Data de Abertura"
        value={dataAbertura}
        onChangeText={setDataAbertura}
        mode="outlined"
        placeholder="DD/MM/AAAA"
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSalvar} style={styles.button}>
        Salvar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#038C7F',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
});

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, Pressable } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, update } from 'firebase/database';
import { database } from '../../services/firebase';

export default function EditarEmpresa({ navigation, route }: any) {
  const { empresaId, empresaData } = route.params;

  const [nome, setNome] = useState(empresaData.nome || '');
  const [descricao, setDescricao] = useState(empresaData.descricao || '');
  const [endereco, setEndereco] = useState(empresaData.endereco || '');
  const [ramo, setRamo] = useState(empresaData.ramo || '');
  const [dataAbertura, setDataAbertura] = useState(empresaData.dataAbertura || '');
  const [imagem, setImagem] = useState(empresaData.imagem || 'https://cdn-icons-png.flaticon.com/512/5984/5984357.png');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [errors, setErrors] = useState({
    nome: '',
    descricao: '',
    dataAbertura: '',
  });

  useEffect(() => {
    const novoErrors = { nome: '', descricao: '', dataAbertura: '' };

    if (nome && nome.length > 100) {
      novoErrors.nome = 'Máx 100 caracteres';
    } else if (nome && nome.length < 3) {
      novoErrors.nome = 'O nome precisa ter 3 ou mais caracteres';
    }

    if (descricao && descricao.length > 150) {
      novoErrors.descricao = 'Máx 150 caracteres';
    } else if (descricao && descricao.length < 3) {
      novoErrors.descricao = 'Necessário possuir 3 ou mais caracteres';
    }

    setErrors(novoErrors);
  }, [nome, descricao]);

  const validarCampos = () => {
    const novoErrors = { nome: '', descricao: '', dataAbertura: '' };

    if (!nome.trim()) {
      novoErrors.nome = 'Nome é obrigatório';
    } else if (nome.length > 100) {
      novoErrors.nome = 'Máx 100 caracteres';
    } else if (nome.length < 3) {
      novoErrors.nome = 'O nome precisa ter 3 ou mais caracteres';
    }

    if (!descricao.trim()) {
      novoErrors.descricao = 'Descrição é obrigatória';
    } else if (descricao.length > 150) {
      novoErrors.descricao = 'Máx 150 caracteres';
    } else if (descricao.length < 3) {
      novoErrors.descricao = 'Necessário possuir 3 ou mais caracteres';
    }

    if (!dataAbertura.trim()) {
      novoErrors.dataAbertura = 'Data é obrigatória';
    }

    setErrors(novoErrors);

    return !novoErrors.nome && !novoErrors.descricao && !novoErrors.dataAbertura;
  };

  const formatarData = (date: Date) => {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const handleChangeData = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDataAbertura(formatarData(selectedDate));
    }
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    const empresaAtualizada = {
      imagem,
      nome,
      descricao,
      endereco,
      ramo,
      dataAbertura,
      atualizadaEm: new Date().toISOString(),
    };

    try {
      const empresaRef = ref(database, `empresas/${empresaId}`);
      await update(empresaRef, empresaAtualizada);
      alert('Empresa atualizada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('Não foi possível atualizar a empresa.');
    }
  };

  const isFormValid = !errors.nome && !errors.descricao && !errors.dataAbertura;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Editar Empresa
      </Text>

      <TextInput
        label="URL da Imagem da Empresa"
        value={imagem}
        onChangeText={setImagem}
        mode="outlined"
        style={styles.input}
        placeholder="https://exemplo.com/imagem.jpg"
      />

      <TextInput
        label="Nome Empresa"
        value={nome}
        onChangeText={setNome}
        mode="outlined"
        style={[styles.input, errors.nome ? styles.inputError : null]}
        maxLength={100}
        error={!!errors.nome}
        right={errors.nome ? <TextInput.Icon name="alert-circle" color="red" /> : null}
      />
      {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}

      <TextInput
        label="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={[styles.input, errors.descricao ? styles.inputError : null]}
        maxLength={150}
        error={!!errors.descricao}
        right={errors.descricao ? <TextInput.Icon name="alert-circle" color="red" /> : null}
      />
      {errors.descricao ? <Text style={styles.errorText}>{errors.descricao}</Text> : null}

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

      <Pressable onPress={() => setShowDatePicker(true)}>
        <TextInput
          label="Data de Abertura"
          value={dataAbertura}
          mode="outlined"
          style={[styles.input, errors.dataAbertura ? styles.inputError : null]}
          editable={false}
          pointerEvents="none"
          error={!!errors.dataAbertura}
          right={errors.dataAbertura ? <TextInput.Icon name="alert-circle" color="red" /> : null}
        />
      </Pressable>
      {errors.dataAbertura ? <Text style={styles.errorText}>{errors.dataAbertura}</Text> : null}

      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={dataAbertura ? (() => {
            const partes = dataAbertura.split('/');
            return new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
          })() : new Date()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChangeData}
        />
      )}

      <Button
        mode="contained"
        onPress={handleSalvar}
        style={styles.button}
        disabled={!isFormValid}
      >
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
    marginTop: 20,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#038C7F',
  },
  input: {
    marginBottom: 8,
  },
  inputError: {
    backgroundColor: '#fff5f5',
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    marginTop: 24,
  },
});

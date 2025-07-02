import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { TextInput, Button, Text, Menu } from 'react-native-paper';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../services/firebase';

export default function EditarSetor({ route, navigation }: any) {
  const { setorId } = route.params;

  const [imagem, setImagem] = useState('');
  const [nome, setNome] = useState('');
  const [gerente, setGerente] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const [errors, setErrors] = useState({
    nome: '',
    gerente: '',
    empresa: '',
  });

  useEffect(() => {
    const setorRef = ref(database, `setores/${setorId}`);
    onValue(setorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setImagem(data.imagem || '');
        setNome(data.nome || '');
        setGerente(data.gerente || '');
        setEmpresaSelecionada(data.empresaId || '');
      }
    });

    const empresasRef = ref(database, 'empresas');
    onValue(empresasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data).map(([id, obj]: any) => ({
          id,
          nome: obj.nome,
        }));
        setEmpresas(lista);
      }
    });
  }, []);

  useEffect(() => {
    const novoErrors = { ...errors };

    if (nome && nome.length < 3) {
      novoErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
    } else {
      novoErrors.nome = '';
    }

    if (gerente && gerente.length < 3) {
      novoErrors.gerente = 'Gerente deve ter no mínimo 3 caracteres';
    } else {
      novoErrors.gerente = '';
    }

    if (empresaSelecionada) {
      novoErrors.empresa = '';
    }

    setErrors(novoErrors);
  }, [nome, gerente, empresaSelecionada]);

  const validarCampos = () => {
    const novoErrors = {
      nome: '',
      gerente: '',
      empresa: '',
    };

    if (!nome.trim()) novoErrors.nome = 'Nome é obrigatório';
    if (!gerente.trim()) novoErrors.gerente = 'Gerente é obrigatório';
    if (!empresaSelecionada) novoErrors.empresa = 'Selecione uma empresa';

    setErrors(novoErrors);
    return !novoErrors.nome && !novoErrors.gerente && !novoErrors.empresa;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    const setorAtualizado = {
      imagem,
      nome,
      gerente,
      empresaId: empresaSelecionada,
      atualizadoEm: new Date().toISOString(),
    };

    try {
      const setorRef = ref(database, `setores/${setorId}`);
      await update(setorRef, setorAtualizado);
      alert('Setor atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar setor.');
    }
  };

  const isFormValid = !errors.nome && !errors.gerente && !errors.empresa;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Editar Setor
      </Text>

      <TextInput
        label="URL da Imagem do Setor"
        value={imagem}
        onChangeText={setImagem}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Nome do Setor"
        value={nome}
        onChangeText={setNome}
        mode="outlined"
        style={[styles.input, errors.nome ? styles.inputError : null]}
        error={!!errors.nome}
        right={errors.nome ? <TextInput.Icon name="alert-circle" color="red" /> : null}
      />
      {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}

      <TextInput
        label="Gerente Responsável"
        value={gerente}
        onChangeText={setGerente}
        mode="outlined"
        style={[styles.input, errors.gerente ? styles.inputError : null]}
        error={!!errors.gerente}
        right={errors.gerente ? <TextInput.Icon name="alert-circle" color="red" /> : null}
      />
      {errors.gerente ? <Text style={styles.errorText}>{errors.gerente}</Text> : null}

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Pressable onPress={() => setMenuVisible(true)}>
            <TextInput
              label="Empresa Vinculada"
              value={
                empresas.find((e) => e.id === empresaSelecionada)?.nome || ''
              }
              mode="outlined"
              editable={false}
              style={[styles.input, errors.empresa ? styles.inputError : null]}
              error={!!errors.empresa}
              right={
                errors.empresa ? <TextInput.Icon name="alert-circle" color="red" /> : null
              }
            />
          </Pressable>
        }
      >
        {empresas.map((empresa) => (
          <Menu.Item
            key={empresa.id}
            onPress={() => {
              setEmpresaSelecionada(empresa.id);
              setMenuVisible(false);
            }}
            title={empresa.nome}
          />
        ))}
      </Menu>
      {errors.empresa ? <Text style={styles.errorText}>{errors.empresa}</Text> : null}

      <Button
        mode="contained"
        onPress={handleSalvar}
        style={styles.button}
        disabled={!isFormValid}
      >
        Atualizar Setor
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

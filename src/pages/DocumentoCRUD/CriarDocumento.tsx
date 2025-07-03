import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Switch, Menu } from 'react-native-paper';
import { ref, push, get } from 'firebase/database';
import { database } from '../../services/firebase';

export default function AdicionarDocumento({ navigation }: any) {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [classificacao, setClassificacao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [setorSelecionado, setSetorSelecionado] = useState('');
  const [revisado, setRevisado] = useState(false);
  const [setores, setSetores] = useState<{ id: string; nome: string }[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const [errors, setErrors] = useState({
    titulo: '',
    conteudo: '',
    setores: ''
  });

  // Buscar setores no Firebase
  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const snapshot = await get(ref(database, 'setores'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const lista = Object.keys(data).map((key) => ({
            id: key,
            nome: data[key].nome,
          }));
          setSetores(lista);
        }
      } catch (error) {
        console.error('Erro ao buscar setores:', error);
      }
    };
    fetchSetores();
  }, []);

  const validarCampos = () => {
    const novoErrors = { titulo: '', conteudo: '', setores: '' };

    if (!titulo.trim()) {
      novoErrors.titulo = 'Título é obrigatório';
    } else if (titulo.length < 3) {
      novoErrors.titulo = 'Título deve ter 3 ou mais caracteres';
    }

    if (!conteudo.trim()) {
      novoErrors.conteudo = 'Conteúdo é obrigatório';
    } else if (conteudo.length < 5) {
      novoErrors.conteudo = 'Conteúdo deve ter 5 ou mais caracteres';
    }

    if (!setorSelecionado.trim()) {
      novoErrors.setores = 'Selecione um setor';
    }

    setErrors(novoErrors);

    return !novoErrors.titulo && !novoErrors.conteudo && !novoErrors.setores;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    const novoDocumento = {
      titulo,
      conteudo,
      classificacao,
      categoria,
      setor: setorSelecionado,
      revisado,
      ultimaDataAlterado: new Date().toISOString(),
      criadoEm: new Date().toISOString(),
    };

    try {
      const documentosRef = ref(database, 'documentos');
      await push(documentosRef, novoDocumento);
      alert('Documento salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar o documento.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Adicionar Documento</Text>

      <TextInput
        label="Título"
        value={titulo}
        onChangeText={setTitulo}
        mode="outlined"
        style={[styles.input, errors.titulo ? styles.inputError : null]}
        maxLength={100}
        error={!!errors.titulo}
        right={errors.titulo ? <TextInput.Icon name="alert-circle" color="red" /> : null}
      />
      {errors.titulo ? <Text style={styles.errorText}>{errors.titulo}</Text> : null}

      <TextInput
        label="Conteúdo"
        value={conteudo}
        onChangeText={setConteudo}
        mode="outlined"
        multiline
        numberOfLines={10}
        style={[styles.input, styles.conteudoInput, errors.conteudo ? styles.inputError : null]}
        error={!!errors.conteudo}
        right={errors.conteudo ? <TextInput.Icon name="alert-circle" color="red" /> : null}
      />
      {errors.conteudo ? <Text style={styles.errorText}>{errors.conteudo}</Text> : null}

      <TextInput
        label="Classificação"
        value={classificacao}
        onChangeText={setClassificacao}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Categoria"
        value={categoria}
        onChangeText={setCategoria}
        mode="outlined"
        style={styles.input}
      />

      <View style={styles.menuWrapper}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TextInput
              label="Setor"
              value={setorSelecionado}
              mode="outlined"
              onFocus={() => setMenuVisible(true)}
              style={[styles.input, errors.setores ? styles.inputError : null]}
              showSoftInputOnFocus={false}
              error={!!errors.setores}
              right={errors.setores ? <TextInput.Icon name="alert-circle" color="red" /> : null}
            />
          }
        >
          {setores.map((s) => (
            <Menu.Item
              key={s.id}
              title={s.nome}
              onPress={() => {
                setSetorSelecionado(s.nome);
                setMenuVisible(false);
              }}
            />
          ))}
        </Menu>
      </View>
      {errors.setores ? <Text style={styles.errorText}>{errors.setores}</Text> : null}

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Revisado</Text>
        <Switch
          value={revisado}
          onValueChange={setRevisado}
          color="#038C7F"
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSalvar}
        style={styles.button}
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
  conteudoInput: {
    height: 160,
    textAlignVertical: 'top',
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
  menuWrapper: {
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    marginTop: 24,
  },
});

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { TextInput, Button, Text, Menu } from 'react-native-paper';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../services/firebase';

export default function EditarDocumento({ route, navigation }: any) {
  const { documentoId } = route.params;

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [setorId, setSetorId] = useState('');
  const [classificacao, setClassificacao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [revisado, setrevisado] = useState(false);

  const [setores, setSetores] = useState([]);
  const [menuSetorVisible, setMenuSetorVisible] = useState(false);

  const classificacoes = ['Confidencial', 'Público', 'Restrito'];
  const categorias = ['Financeiro', 'RH', 'Jurídico', 'Operacional'];

  const [errors, setErrors] = useState({
    titulo: '',
    descricao: '',
    setor: '',
    classificacao: '',
    categoria: '',
  });

  useEffect(() => {
    const docRef = ref(database, `documentos/${documentoId}`);
    onValue(docRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTitulo(data.titulo || '');
        setDescricao(data.conteudo || '');
        setSetorId(data.setor || '');
        setClassificacao(data.classificacao || '');
        setCategoria(data.categoria || '');
        setrevisado(!!data.revisado);
      }
    });

    const setoresRef = ref(database, 'setores');
    onValue(setoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data).map(([id, obj]: any) => ({
          id,
          nome: obj.nome,
        }));
        setSetores(lista);
      }
    });
  }, [documentoId]);

  useEffect(() => {
    const novoErrors = { ...errors };

    novoErrors.titulo = titulo && titulo.length < 3 ? 'Título deve ter no mínimo 3 caracteres' : '';
    novoErrors.descricao = descricao && descricao.length < 5 ? 'Descrição deve ter no mínimo 5 caracteres' : '';
    novoErrors.setor = setorId ? '' : errors.setor;
    novoErrors.classificacao = classificacao ? '' : errors.classificacao;
    novoErrors.categoria = categoria ? '' : errors.categoria;

    setErrors(novoErrors);
  }, [titulo, descricao, setorId, classificacao, categoria]);

  const validarCampos = () => {
    const novoErrors = {
      titulo: '',
      descricao: '',
      setor: '',
      classificacao: '',
      categoria: '',
    };

    if (!titulo.trim()) novoErrors.titulo = 'Título é obrigatório';
    if (!descricao.trim()) novoErrors.descricao = 'Descrição é obrigatória';
    if (!setorId) novoErrors.setor = 'Selecione um setor';
    if (!classificacao) novoErrors.classificacao = 'Selecione a classificação';
    if (!categoria) novoErrors.categoria = 'Selecione a categoria';

    setErrors(novoErrors);
    return Object.values(novoErrors).every((v) => v === '');
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    const documentoAtualizado = {
      titulo,
      conteudo: descricao,
      setor: setorId,
      classificacao,
      categoria,
      revisado,
      atualizadoEm: new Date().toISOString(),
    };

    try {
      const docRef = ref(database, `documentos/${documentoId}`);
      await update(docRef, documentoAtualizado);
      alert('Documento atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar documento.');
    }
  };

  const isFormValid = Object.values(errors).every((v) => v === '');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Editar Documento
      </Text>

      <TextInput
        label="Título"
        value={titulo}
        onChangeText={setTitulo}
        mode="outlined"
        style={[styles.input, errors.titulo ? styles.inputError : null]}
        error={!!errors.titulo}
        right={errors.titulo ? <TextInput.Icon name="alert-circle" color="red" /> : null}
      />
      {errors.titulo ? <Text style={styles.errorText}>{errors.titulo}</Text> : null}

      <TextInput
        label="Conteúdo"
        value={descricao}
        onChangeText={setDescricao}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={[styles.conteudoInput, errors.descricao ? styles.inputError : null]}
        error={!!errors.descricao}
        right={errors.descricao ? <TextInput.Icon name="alert-circle" color="red" /> : null}
      />
      {errors.descricao ? <Text style={styles.errorText}>{errors.descricao}</Text> : null}

      {/* SETOR */}
      <Menu
        visible={menuSetorVisible}
        onDismiss={() => setMenuSetorVisible(false)}
        anchor={
          <Pressable onPress={() => setMenuSetorVisible(true)}>
            <TextInput
              label="Setor"
              value={setorId || ''}
              mode="outlined"
              editable={false}
              style={[styles.input, errors.setor ? styles.inputError : null]}
              error={!!errors.setor}
              right={errors.setor ? <TextInput.Icon name="alert-circle" color="red" /> : null}
            />
          </Pressable>
        }
      >
        {setores.map((setor) => (
          <Menu.Item
            key={setor.id}
            onPress={() => {
              setSetorId(setor.nome);
              setMenuSetorVisible(false);
            }}
            title={setor.nome}
          />
        ))}
      </Menu>
      {errors.setor ? <Text style={styles.errorText}>{errors.setor}</Text> : null}

      {/* CLASSIFICAÇÃO */}
      <TextInput
        label="Classificação"
        value={classificacao}
        onChangeText={setClassificacao}
        mode="outlined"
        style={[styles.input, errors.classificacao ? styles.inputError : null]}
        error={!!errors.classificacao}
        right={errors.classificacao ? <TextInput.Icon name="alert-circle" color="red" /> : null}
      />
      {errors.classificacao ? <Text style={styles.errorText}>{errors.classificacao}</Text> : null}

      {/* CATEGORIA */}
      <TextInput
        label="Categoria"
        value={categoria}
        onChangeText={setCategoria}
        mode="outlined"
        style={[styles.input, errors.categoria ? styles.inputError : null]}
        error={!!errors.categoria}
        right={errors.categoria ? <TextInput.Icon name="alert-circle" color="red" /> : null}
      />
      {errors.categoria ? <Text style={styles.errorText}>{errors.categoria}</Text> : null}

      {/* BOTÃO REVISÃO */}
      <Button
        mode={revisado ? "contained" : "outlined"}
        onPress={() => setrevisado(!revisado)}
        style={{ marginTop: 16 }}
      >
        {revisado ? "Desmarcar revisão" : "Marcar para revisão"}
      </Button>

      <Button
        mode="contained"
        onPress={handleSalvar}
        style={styles.button}
        disabled={!isFormValid}
      >
        Atualizar Documento
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
  conteudoInput: {
    height: 160,
    textAlignVertical: 'top',
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

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { Avatar, Button, Card, IconButton, Text } from 'react-native-paper';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../services/firebase';

export default function Empresa({ navigation }: any) {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [errosImagem, setErrosImagem] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const empresasRef = ref(database, 'empresas');

    const unsubscribe = onValue(empresasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listaEmpresas = Object.entries(data).map(([id, value]: any) => ({
          id,
          ...value,
        }));
        setEmpresas(listaEmpresas);
      } else {
        setEmpresas([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRemover = (id: string) => {
    Alert.alert('Confirmar', 'Deseja remover esta empresa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            const empresaRef = ref(database, `empresas/${id}`);
            await remove(empresaRef);
            Alert.alert('Removido', 'Empresa removida com sucesso');
          } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao remover a empresa.');
          }
        },
      },
    ]);
  };

  const renderLeft = (item) => {
    const erro = errosImagem[item.id];
    const url = item.imagem;

    if (!url || erro) {
      return <Avatar.Icon size={40} icon="briefcase" />;
    }

    return (
      <Image
        source={{ uri: url }}
        style={styles.avatarImage}
        onError={() =>
          setErrosImagem((prev) => ({
            ...prev,
            [item.id]: true,
          }))
        }
      />
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.nome}
        subtitle={item.ramo}
        left={() => renderLeft(item)}
        right={() => (
        <View style={styles.cardActions}>
            <IconButton
            icon="pencil"
            onPress={() => navigation.navigate('EditarEmpresa', { empresaId: item.id, empresaData: item })}
            />
            <IconButton
            icon="trash-can"
            iconColor="red"
            onPress={() => handleRemover(item.id)}
            />
        </View>
        )}
      />
      <Card.Content>
        <Text>{item.descricao}</Text>
        <Text>{item.endereco}</Text>
        <Text>Aberta em: {item.dataAbertura}</Text>
      </Card.Content>
    </Card>
  );

  if (!empresas.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.texto}>
          Parece que você ainda não possui uma empresa.
        </Text>
        <Button mode="contained" onPress={() => navigation.navigate('CriarEmpresa')}>
          Criar uma empresa
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge">Empresas</Text>
        <Button mode="contained" onPress={() => navigation.navigate('CriarEmpresa')}>
          Adicionar
        </Button>
      </View>

      <FlatList
        data={empresas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  texto: {
    marginBottom: 30,
  },
  card: {
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
});

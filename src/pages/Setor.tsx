import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { Avatar, Card, IconButton, Text, Button } from 'react-native-paper';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../services/firebase';

export default function ListaSetores({ navigation }: any) {
  const [setores, setSetores] = useState<any[]>([]);
  const [errosImagem, setErrosImagem] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const setoresRef = ref(database, 'setores');

    const unsubscribe = onValue(setoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listaSetores = Object.entries(data).map(([id, value]: any) => ({
          id,
          ...value,
        }));
        setSetores(listaSetores);
      } else {
        setSetores([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRemover = (id: string) => {
    Alert.alert('Confirmar', 'Deseja remover este setor?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            const setorRef = ref(database, `setores/${id}`);
            await remove(setorRef);
            Alert.alert('Removido', 'Setor removido com sucesso');
          } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao remover o setor.');
          }
        },
      },
    ]);
  };

  const renderLeft = (item) => {
    const erro = errosImagem[item.id];
    const url = item.imagem;

    if (!url || erro) {
      return <Avatar.Icon size={40} icon="office-building" />;
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
        subtitle={`Gerente: ${item.gerente || 'Não informado'}`}
        left={() => renderLeft(item)}
        right={() => (
          <View style={styles.cardActions}>
            <IconButton
              icon="pencil"
              onPress={() => navigation.navigate('EditarSetor', { setorId: item.id, setorData: item })}
            />
            <IconButton
              icon="trash-can"
              iconColor="red"
              onPress={() => handleRemover(item.id)}
            />
          </View>
        )}
      />
    </Card>
  );

    if (!setores.length) {
    return (
        <View style={styles.emptyContainer}>
        <Text style={styles.texto}>Nenhum setor cadastrado.</Text>
        <Button mode="contained" onPress={() => navigation.navigate('CriarSetor')}>
            Adicionar Setor
        </Button>
        </View>
    );
    }

  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <Text variant="titleLarge">Setores</Text>
        <Button mode="contained" onPress={() => navigation.navigate('CriarSetor')}>
            Adicionar
        </Button>
        </View>
      <FlatList
        data={setores}
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
  texto: {
    fontSize: 16,
    marginBottom: 30
  },
  list: {
    paddingBottom: 16,
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

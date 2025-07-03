import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, IconButton, Text, Button, Badge } from 'react-native-paper';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../services/firebase';
import moment from 'moment';

export default function Documentos({ navigation }: any) {
  const [documentos, setDocumentos] = useState<any[]>([]);

  useEffect(() => {
    const documentosRef = ref(database, 'documentos');

    const unsubscribe = onValue(documentosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listaDocumentos = Object.entries(data).map(([id, value]: any) => ({
          id,
          ...value,
        }));
        setDocumentos(listaDocumentos);
      } else {
        setDocumentos([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleExcluir = (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este documento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await remove(ref(database, `documentos/${id}`));
            } catch (error) {
              console.error('Erro ao excluir documento:', error);
              alert('Erro ao excluir documento.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={
          <View style={styles.titleContainer}>
            <Text variant="titleMedium">{item.titulo}</Text>
            <Badge style={[styles.badge, item.revisado ? styles.badgeOk : styles.badgePendencia]}>
              {item.revisado ? 'Revisado' : 'Não Revisado'}
            </Badge>
          </View>
        }
        subtitle={<Text style={styles.preview}>{item.setor}</Text>}
        right={() => (
          <View style={styles.cardActions}>
            <IconButton
              icon="pencil"
              onPress={() => navigation.navigate('EditarDocumento', { documentoId: item.id, documentoData: item })}
            />
            <IconButton
              icon="delete"
              iconColor="#F44336"
              onPress={() => handleExcluir(item.id)}
            />
          </View>
        )}
      />
      <Card.Content>
        <Text style={styles.preview} numberOfLines={3}>
          {item.conteudo}
        </Text>
        <Text style={styles.datas}>
          Criado: {moment(item.criadoEm).format('DD/MM/YYYY HH:mm')} | Última modificação:{' '}
          {moment(item.atualizadoEm).format('DD/MM/YYYY HH:mm')}
        </Text>
      </Card.Content>
    </Card>
  );

  if (!documentos.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.texto}>Nenhum documento cadastrado.</Text>
        <Button mode="contained" onPress={() => navigation.navigate('CriarDocumento')}>
          Adicionar Documento
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge">Documentos</Text>
        <Button mode="contained" onPress={() => navigation.navigate('CriarDocumento')}>
          Adicionar
        </Button>
      </View>
      <FlatList
        data={documentos}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  texto: {
    fontSize: 16,
    marginBottom: 30,
  },
  card: {
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    alignSelf: 'center',
    marginLeft: 8,
    fontSize: 12,
    paddingHorizontal: 8,
  },
  badgeOk: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  badgePendencia: {
    backgroundColor: '#F44336',
    color: 'white',
  },
  preview: {
    marginTop: 4,
    marginBottom: 4,
  },
  datas: {
    fontSize: 12,
    color: '#666',
  },
});

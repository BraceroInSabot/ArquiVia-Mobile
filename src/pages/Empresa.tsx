import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />;

// Suponha que esta lista venha de algum backend ou estado global
const empresasMock = []; // Substitua por sua lógica de dados

export default function Empresa({ navigation }: any) {
  const empresas = empresasMock; // Aqui você pode fazer fetch ou usar context/estado

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.nome} subtitle={item.ramo} left={LeftContent} />
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
            Parece que você ainda não possuí uma empresa.
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
        keyExtractor={(item, index) => index.toString()}
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
});

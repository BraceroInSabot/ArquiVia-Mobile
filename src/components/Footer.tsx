import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Setor from '../pages/Setor';
import Empresa from '../pages/Empresa';
import Inicio from '../pages/Inicio';
import Documentos from '../pages/Documentos';
import Usuario from '../pages/Usuario';

const renderIcon = ({ route, color, size }) => (
  <MaterialCommunityIcons name={route.icon} color={color} size={28} />
);

export default function Footer() {
  const [index, setIndex] = useState(2);
  const [routes] = useState([
    { key: 'setor', title: 'Setor', icon: 'office-building' },
    { key: 'empresa', title: 'Empresa', icon: 'domain' },
    { key: 'inicio', title: 'Início', icon: 'home' },
    { key: 'documentos', title: 'Documentos', icon: 'file-document' },
    { key: 'usuario', title: 'Usuário', icon: 'account' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'setor':
        return <Setor />;
      case 'empresa':
        return <Empresa />;
      case 'inicio':
        return <Inicio />;
      case 'documentos':
        return <Documentos />;
      case 'usuario':
        return <Usuario />;
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={renderIcon}
      barStyle={styles.barStyle}
      activeColor="#027373"
      inactiveColor="#038C7F"
      shifting={false}
      labeled
    />
  );
}

const styles = StyleSheet.create({
  barStyle: {
    backgroundColor: '#A9D9D0',
  },
});

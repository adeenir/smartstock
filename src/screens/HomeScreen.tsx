import React, { useState } from 'react';
import { ScrollView, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Div, Text, Button } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import SideMenu from '../components/SideMenu';

const categories = [
  { name: 'Alimentos', count: 142, icon: 'apple-whole', color: '#C0392B' },
  { name: 'Bebidas', count: 67, icon: 'wine-bottle', color: '#27AE60' },
  { name: 'Limpeza', count: 38, icon: 'spray-can', color: '#2980B9' },
  { name: 'Higiene', count: 21, icon: 'pump-soap', color: '#F39C12' },
  { name: 'Outros', count: 15, icon: 'box', color: '#7F8C8D' },
];

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <Div flex={1} bg="white">
      <Modal visible={menuVisible} animationType="slide" transparent={true} statusBarTranslucent={true} onRequestClose={() => setMenuVisible(false)}>
        <Div flex={1} bg="rgba(0,0,0,0.3)" flexDir="row">
          <SideMenu />
          <Div flex={1} onTouchEnd={() => setMenuVisible(false)} />
        </Div>
      </Modal>
      <Div row justifyContent="space-between" alignItems="center" p="lg">
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{padding: 8}}>
          <Icon name="bars" size={20} color="#222" iconStyle="solid" />
        </TouchableOpacity>
        <Text fontWeight="bold" fontSize="xl">SMART STOCK</Text>
        <TouchableOpacity style={{padding: 8, justifyContent: 'center', alignItems: 'center', height: 40, width: 40}}>
          <Icon name="magnifying-glass" size={20} color="#222" iconStyle="solid" />
        </TouchableOpacity>
      </Div>
      <Div p="lg">
        <Text fontSize="2xl" fontWeight="bold" color="#222" mb="xs">Olá, Leonardo!</Text>
        <Text fontSize="md" color="gray600" mb="xl">Navegue através do menu lateral.</Text>
        <Button block bg="#4B572A" h={45} mb="xl" rounded={30} prefix={<Icon name="chart-line" size={18} color="white" iconStyle="solid" style={{marginRight:8}}/>}>
          <Text color="white" fontWeight="bold">DASHBOARD</Text>
        </Button>
        <Div bg="#E0E0E0" rounded={20} p="lg" style={{width: '100%', maxWidth: 450}}>
          <Text fontWeight="bold" fontSize="lg" mb="md" color="#222">Categorias</Text>
          {categories.map((cat, idx) => (
            <Div key={cat.name} row alignItems="center" mb={idx < categories.length-1 ? 'md' : 0}>
              <Icon name={cat.icon as any} size={18} color={cat.color} iconStyle="solid" style={{marginRight:8}}/>
              <Text color="#222" fontSize="lg">{cat.name} ({cat.count})</Text>
            </Div>
          ))}
        </Div>
      </Div>
      <Div style={styles.spacer} />
      <Div style={styles.bottomBar} row alignItems="center" justifyContent="space-around">
        <Button bg="transparent" flex={1} alignItems="center">
          <Icon name="house" size={24} color="white" iconStyle="solid" />
        </Button>
        <Button bg="transparent" flex={1} alignItems="center">
          <Icon name="camera" size={24} color="white" iconStyle="solid" />
        </Button>
        <Button bg="transparent" flex={1} alignItems="center">
          <Icon name="user" size={24} color="white" iconStyle="solid" />
        </Button>
      </Div>
    </Div>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: '#A6B48A',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    zIndex: 10,
    paddingBottom: 0,
  },
  spacer: {
    flex: 1,
  },
});

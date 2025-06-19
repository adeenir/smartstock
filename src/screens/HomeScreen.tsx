import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Div, Text, Button } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import SideMenu from '../components/SideMenu';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const categories = [
  { name: 'Alimentos', count: 142, icon: 'apple-whole', color: '#C0392B' },
  { name: 'Bebidas', count: 67, icon: 'wine-bottle', color: '#27AE60' },
  { name: 'Limpeza', count: 38, icon: 'spray-can', color: '#2980B9' },
  { name: 'Higiene', count: 21, icon: 'pump-soap', color: '#F39C12' },
  { name: 'Outros', count: 15, icon: 'box', color: '#7F8C8D' },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(-screenWidth)).current;

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnim, {
      toValue: -screenWidth,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuVisible(false));
  };

  return (
    <Div flex={1} bg="white">
      {menuVisible && (
        <Div style={StyleSheet.absoluteFill} bg="rgba(0,0,0,0.3)">
          <Animated.View style={{
            width: 250,
            height: '100%',
            backgroundColor: 'white',
            position: 'absolute',
            left: 0,
            top: 0,
            transform: [{ translateX: menuAnim }],
            zIndex: 99
          }}>
            <SideMenu />
          </Animated.View>
          <TouchableOpacity onPress={closeMenu} style={{ flex: 1 }} />
        </Div>
      )}
      <Div row justifyContent="space-between" alignItems="center" p="lg">
        <TouchableOpacity onPress={openMenu} style={{ padding: 8 }}>
          <Icon name="bars" size={20} color="#222" iconStyle="solid" />
        </TouchableOpacity>
        <Text fontWeight="bold" fontSize="xl">SMART STOCK</Text>
        <TouchableOpacity style={{padding: 8, justifyContent: 'center', alignItems: 'center', height: 40, width: 40}}>
          <Icon name="magnifying-glass" size={20} color="#222" iconStyle="solid" />
        </TouchableOpacity>
      </Div>
      <Div p="lg">
        <Text fontSize="2xl" fontWeight="bold" color="#222" mb="xs">Olá, Leonardo!</Text>
        <Text fontSize="md" color="gray600" mb="40">Navegue através do menu lateral.</Text>
        <Button block bg="#4B572A" h={45} mb="10" rounded={30} prefix={<Icon name="chart-line" size={18} color="white" iconStyle="solid" style={{marginRight:8}}/>} onPress={() => setDashboardVisible(true)}>
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
      <Modal visible={dashboardVisible} transparent animationType="fade" onRequestClose={() => setDashboardVisible(false)}>
        <Div flex={1} justifyContent="flex-end" alignItems="center" bg="rgba(0,0,0,0.6)">
          <Div bg="#222" rounded={20} w="90%" minH={220} mb={32} p="xl" justifyContent="center" style={{position:'relative'}}>
            <TouchableOpacity style={{position:'absolute', top:12, right:12, zIndex:2}} onPress={() => setDashboardVisible(false)}>
              <Icon name="xmark" size={22} color="#fff" iconStyle="solid" />
            </TouchableOpacity>
            <Div mb={18}>
              <Text color="green" fontWeight="bold" fontSize="lg">EM ESTOQUE</Text>
              <Text color="green" fontSize="sm">3 itens cadastrados em estoque</Text>
              <Div row alignItems="center" mt={4}>
                <Div bg="green" h={32} w={4} rounded={8} mr={8} />
              </Div>
            </Div>
            <Div mb={18}>
              <Text color="#fff200" fontWeight="bold" fontSize="lg">PERTO DE VENCER</Text>
              <Text color="#fff200" fontSize="sm">1 item está a 2 dias do vencimento</Text>
              <Div row alignItems="center" mt={4}>
                <Div bg="#fff200" h={32} w={4} rounded={8} mr={8} />
              </Div>
            </Div>
            <Div>
              <Text color="#ff3b3b" fontWeight="bold" fontSize="lg">VENCIDOS</Text>
              <Text color="#ff3b3b" fontSize="sm">2 produtos estão vencidos</Text>
              <Div row alignItems="center" mt={4}>
                <Div bg="#ff3b3b" h={32} w={4} rounded={8} mr={8} />
              </Div>
            </Div>
          </Div>
        </Div>
      </Modal>
      <Div style={styles.spacer} />
      <Div style={styles.bottomBar} row alignItems="center" justifyContent="space-around">
        <Button bg="transparent" flex={1} alignItems="center" onPress={() => navigation.navigate('Home')}>
          <Icon name="house" size={24} color="white" iconStyle="solid" />
        </Button>
        <Button bg="transparent" flex={1} alignItems="center" onPress={() => navigation.navigate('ProductRegister')}>
          <Icon name="camera" size={24} color="white" iconStyle="solid" />
        </Button>
        <Button bg="transparent" flex={1} alignItems="center" onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell" size={24} color="white" iconStyle="solid" />
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

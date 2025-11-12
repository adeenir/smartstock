import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';

const products = [
  {
    id: 1,
    name: 'Pacote de arroz',
    quantity: 4,
    manufacture: '16/05/25',
    expiry: '16/06/25',
  },
  {
    id: 2,
    name: 'Pacote de feijão',
    quantity: 4,
    manufacture: '16/05/25',
    expiry: '16/06/25',
  },
  {
    id: 3,
    name: 'Pacote de massa',
    quantity: 4,
    manufacture: '16/05/25',
    expiry: '16/06/25',
  },
  {
    id: 4,
    name: 'Dúzia de ovos',
    quantity: 4,
    manufacture: '16/05/25',
    expiry: '16/06/25',
  },
  {
    id: 5,
    name: 'Guaraná',
    quantity: 4,
    manufacture: '16/05/25',
    expiry: '16/06/25',
  },
  {
    id: 6,
    name: 'Coca-cola',
    quantity: 4,
    manufacture: '16/05/25',
    expiry: '16/06/25',
  },
  {
    id: 7,
    name: 'Pacote de farinha',
    quantity: 4,
    manufacture: '16/05/25',
    expiry: '16/06/25',
  },
];

export default function StockScreen() {
  const navigation = useNavigation<any>();
  return (
    <Div flex={1} bg="white">
      <Div row alignItems="center" justifyContent="space-between" p="lg" bg="white">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 8, justifyContent: 'center', alignItems: 'center'}} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="arrow-left" size={22} color="#222" iconStyle="solid" />
        </TouchableOpacity>
        <Div alignItems="center" style={{flex: 1}}>
          <Text fontWeight="bold" fontSize="xl">SMART STOCK</Text>
          <Text fontSize="md" color="gray700">Produtos em estoque</Text>
        </Div>
        <Div style={{width: 40}} />
      </Div>
      <ScrollView style={{flex: 1, backgroundColor: '#F7F7F7'}} contentContainerStyle={{paddingBottom: 80}}>
        {products.map((item) => (
          <Div key={item.id} row alignItems="center" bg="white" rounded={10} p="md" m="md" shadow="sm" style={{elevation: 2}}>
            <Div style={styles.iconBox}>
              <Icon name="box" size={32} color="#A6B48A" iconStyle="solid" />
            </Div>
            <Div flex={1} ml={12}>
              <Text fontWeight="bold" color="#222">{item.name}</Text>
              <Text color="#222">Quantidade: {item.quantity}</Text>
              <Text color="#222" fontSize="xs">Data de fabricação: {item.manufacture}</Text>
              <Text color="#222" fontSize="xs">Data de validade: {item.expiry}</Text>
            </Div>
            <TouchableOpacity style={styles.removeCircle}>
              <Icon name="minus" size={12} color="#222" iconStyle="solid" />
            </TouchableOpacity>
          </Div>
        ))}
      </ScrollView>
      <BottomNavBar />
    </Div>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 8,
  },
});

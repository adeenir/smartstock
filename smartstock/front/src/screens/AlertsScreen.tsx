import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';

const alerts = [
  {
    id: 1,
    name: 'Pacote de farinha',
    quantity: 4,
    expiry: '16/06/25',
    icon: 'bread-slice',
    expired: true,
  },
  {
    id: 2,
    name: 'Cacho de uvas',
    quantity: 2,
    expiry: '15/06/25',
    icon: 'lemon',
    expired: true,
  },
  {
    id: 3,
    name: 'Caixa de leite',
    quantity: 1,
    expiry: '20/06/25',
    icon: 'box',
    expired: false,
  },
  {
    id: 4,
    name: 'Leite condensado',
    quantity: 1,
    expiry: '20/06/25',
    icon: 'box',
    expired: false,
  },
];

export default function AlertsScreen() {
  const navigation = useNavigation<any>();
  return (
    <Div flex={1} bg="white">
      <Div row alignItems="center" justifyContent="space-between" p="lg" bg="white">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 8, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name="arrow-left" size={22} color="#222" iconStyle="solid" />
        </TouchableOpacity>
        <Text fontWeight="bold" fontSize="xl">SMART STOCK</Text>
        <TouchableOpacity style={{padding: 8, justifyContent: 'center', alignItems: 'center', height: 40, width: 40}}>
          <Icon name="magnifying-glass" size={20} color="#222" iconStyle="solid" />
        </TouchableOpacity>
      </Div>
      <Text fontWeight="bold" fontSize="md" ml="lg" mt="md" mb="md">ALERTAS DE VENCIMENTOS</Text>
      <ScrollView style={{flex: 1, backgroundColor: '#F7F7F7'}} contentContainerStyle={{paddingBottom: 80}}>
        {alerts.map((item) => (
          <Div key={item.id} row alignItems="center" bg="white" rounded={10} p="md" m="md" shadow="sm" style={{elevation: 2, borderColor: item.expired ? '#E53935' : '#A6B48A', borderWidth: 2}}>
            <Div style={styles.iconBox}>
              <Icon name={item.icon as any} size={32} color="#A6B48A" iconStyle="solid" />
            </Div>
            <Div flex={1} ml={12}>
              <Text fontWeight="bold" color="#222">{item.name}</Text>
              <Text color="#222">Quantidade: {item.quantity}</Text>
              <Text color={item.expired ? '#E53935' : '#222'} fontSize="xs">Data de validade: {item.expiry}</Text>
            </Div>
            {item.expired && (
              <Icon name="triangle-exclamation" size={24} color="#E53935" iconStyle="solid" style={{marginLeft: 8}} />
            )}
          </Div>
        ))}
        <Div m="lg" mt="xl" p="md" bg="white" rounded={10} alignItems="center">
          <Text color="#E53935" fontWeight="bold" fontSize="md" mb={8} style={{textAlign:'center'}}>Você tem 2 produtos vencidos em seu estoque, está na hora de descartar!</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Recipes')}>
            <Text color="#38410B" fontWeight="bold" style={{textDecorationLine:'underline'}}>Acesse seu menu de receitas</Text>
          </TouchableOpacity>
        </Div>
      </ScrollView>
      <BottomNavBar />
    </Div>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});

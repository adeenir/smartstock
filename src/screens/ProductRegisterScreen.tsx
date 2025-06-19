import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';

export default function ProductRegisterScreen() {
  const navigation = useNavigation<any>();
  return (
    <Div flex={1} bg="white">
      <Div row alignItems="center" justifyContent="space-between" p="lg" bg="white">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 8, justifyContent: 'center', alignItems: 'center'}} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="arrow-left" size={22} color="#222" iconStyle="solid" />
        </TouchableOpacity>
        <Text fontWeight="bold" fontSize="xl">SMART STOCK</Text>
        <TouchableOpacity style={{padding: 8, justifyContent: 'center', alignItems: 'center', height: 40, width: 40}}>
          <Icon name="magnifying-glass" size={20} color="#222" iconStyle="solid" />
        </TouchableOpacity>
      </Div>
      <Div px="lg" mt="md">
        <Text fontWeight="bold" fontSize="md" mb="lg">CADASTRO DE PRODUTOS</Text>
        <Div>
          <TouchableOpacity style={styles.card}>
            <Div row alignItems="center">
              <Div style={styles.iconGreenBox}>
                <Icon name="camera" size={20} color="#38410B" iconStyle="solid" />
              </Div>
              <Text fontWeight="bold" fontSize="md" ml={8} color="#38410B">Ler código de barras</Text>
            </Div>
            <Text color="#38410B" fontSize="sm" mt={4}>Cadastre seus produtos com a câmera do celular.</Text>
            <Div style={styles.arrowBox}>
              <Icon name="chevron-right" size={18} color="#38410B" iconStyle="solid" />
            </Div>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductCodeInput')}>
            <Div row alignItems="center">
              <Div style={styles.iconGreenBox}>
                <Icon name="file-lines" size={20} color="#38410B" iconStyle="solid" />
              </Div>
              <Text fontWeight="bold" fontSize="md" ml={8} color="#38410B">Digite o código de barras</Text>
            </Div>
            <Text color="#38410B" fontSize="sm" mt={4}>Cadastre seus produtos por meio do código de barras.</Text>
            <Div style={styles.arrowBox}>
              <Icon name="chevron-right" size={18} color="#38410B" iconStyle="solid" />
            </Div>
          </TouchableOpacity>
        </Div>
      </Div>
      <BottomNavBar />
    </Div>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  arrowBox: {
    position: 'absolute',
    right: 16,
    top: 20,
  },
  iconGreenBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#E6E8E3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
});

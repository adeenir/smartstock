import React from 'react'
import { StyleSheet } from 'react-native'
import { Div, Text, Button } from 'react-native-magnus'
import Icon from '@react-native-vector-icons/fontawesome6'
import { useNavigation } from '@react-navigation/native';

export default function SideMenu() {
  const navigation = useNavigation<any>();
  return (
    <Div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 260, backgroundColor: '#38410B', zIndex: 9999, height: '100%'}}>
      <Div p="lg" style={{flex: 1}}>
        <Div row alignItems="center" justifyContent="space-between" mb="md" mt="25">
          <Div>
            <Text color="white" fontWeight="bold" fontSize="xl">Leonardo Fadani</Text>
            <Text color="white" opacity={0.7} fontSize="sm" mb="10">Avenida Brasil, 621 - Palmitos/SC</Text>
          </Div>
          <Button bg="transparent" p={0}>
            <Icon name="gear" size={20} color="white" iconStyle="solid" />
          </Button>
        </Div>
        <Div bg="#2C3408" rounded={10} p="md" mb="md">
          <Text color="white" fontWeight="bold" fontSize="xs" mb="sm">NOTIFICAÇÕES</Text>
          <Button bg="transparent" row alignItems="center" mb="sm" onPress={() => navigation.navigate('Notifications')}>
            <Icon name="bell" size={18} color="white" iconStyle="regular" style={{ marginRight: 12 }} />
            <Text color="white" fontSize="md">Notificações</Text>
          </Button>
        </Div>
        <Div bg="#2C3408" rounded={10} p="md" mb="md">
          <Text color="white" fontWeight="bold" fontSize="xs" mb="sm">MINHA CONTA</Text>
          <Button bg="transparent" row alignItems="center" mb="sm">
            <Icon name="user" size={18} color="white" iconStyle="regular" style={{ marginRight: 12 }} />
            <Text color="white" fontSize="md">Minha conta</Text>
          </Button>
          <Button bg="transparent" row alignItems="center">
            <Icon name="key" size={18} color="white" iconStyle="solid" style={{ marginRight: 12 }} />
            <Text color="white" fontSize="md">Alterar senha</Text>
          </Button>
        </Div>
        <Div bg="#2C3408" rounded={10} p="md" mb="md">
          <Text color="white" fontWeight="bold" fontSize="xs" mb="sm">CENTRAL DE OPÇÕES</Text>
          <Button bg="transparent" row alignItems="center" mb="sm" onPress={() => navigation.navigate('Stock')}>
            <Icon name="boxes-stacked" size={18} color="white" iconStyle="solid" style={{ marginRight: 12 }} />
            <Text color="white" fontSize="md">Estoque</Text>
          </Button>
          <Button bg="transparent" row alignItems="center" mb="sm" onPress={() => navigation.navigate('ProductRegister')}>
            <Icon name="camera" size={18} color="white" iconStyle="solid" style={{ marginRight: 12 }} />
            <Text color="white" fontSize="md">Cadastro de produtos</Text>
          </Button>
          <Button bg="transparent" row alignItems="center" mb="sm" onPress={() => navigation.navigate('Alerts')}>
            <Icon name="triangle-exclamation" size={18} color="white" iconStyle="solid" style={{ marginRight: 12 }} />
            <Text color="white" fontSize="md">Alertas</Text>
          </Button>
          <Button bg="transparent" row alignItems="center" onPress={() => navigation.navigate('Recipes')}>
            <Icon name="book-open" size={18} color="white" iconStyle="solid" style={{ marginRight: 12 }} />
            <Text color="white" fontSize="md">Receitas</Text>
          </Button>
        </Div>
        <Div bg="#2C3408" rounded={10} p="md" mt="auto">
          <Button bg="transparent" row alignItems="center" onPress={() => navigation.navigate('Index')}>
            <Icon name="arrow-right-from-bracket" size={18} color="white" iconStyle="solid" style={{ marginRight: 12 }} />
            <Text color="white" fontSize="md">Sair</Text>
          </Button>
        </Div>
      </Div>
    </Div>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    height: '100%',
  },
})

import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Div, Text} from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import BottomNavBar from '../components/BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fotoUsuario = require('../assets/images/foto_usuario.png');

export default function UserProfileScreen() {
  const navigation = useNavigation() as any;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('usuario');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
      }
    };
    loadUser();
  }, []);

  const voltar = () => navigation.goBack();
  const alterarFoto = () => {
    /* futuramente */
  };
  const sair = async () => {
    try {
      await AsyncStorage.removeItem('usuario');
      navigation.reset({
        index: 0,
        routes: [{name: 'Index'}],
      });
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  return (
    <Div flex={1} bg="white">
      {/* HEADER */}
      <Div row alignItems="center" justifyContent="space-between" p="lg">
        <TouchableOpacity
          onPress={voltar}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="arrow-left" size={22} color="#222" iconStyle="solid" />
        </TouchableOpacity>
        <Div flex={1} alignItems="center">
          <Text fontWeight="bold" fontSize="xl">
            SMART STOCK
          </Text>
          <Text fontSize="md" color="gray700">
            Minha conta
          </Text>
        </Div>
        <Div w={22} />
      </Div>

      <Div alignItems="center" mt="lg">
        <Image source={fotoUsuario} />
        <Text mt="md" fontWeight="bold">
          {user ? user.nome : 'Usuário'}
        </Text>
        <Text mt="xs" color="gray600">
          {user ? user.empresa ?? 'Empresa não definida' : 'SmartStock'}
        </Text>
      </Div>

      <Div mt="2xl" mx="xl" rounded={16} borderWidth={1} borderColor="#E0E0E0">
        <TouchableOpacity>
          <Div
            p="lg"
            borderBottomWidth={1}
            borderBottomColor="#E0E0E0"
            row
            justifyContent="space-between"
            alignItems="center">
            <Text color="gray600" fontSize="sm">
              Nome
            </Text>
            <Div row alignItems="center">
              <Text fontWeight="bold" ml="lg" mr="md">
                {user ? user.nome : '-'}
              </Text>
              <Icon
                name="chevron-right"
                size={18}
                color="#888"
                iconStyle="solid"
              />
            </Div>
          </Div>
        </TouchableOpacity>
        <TouchableOpacity>
          <Div
            p="lg"
            borderBottomWidth={1}
            borderBottomColor="#E0E0E0"
            row
            justifyContent="space-between"
            alignItems="center">
            <Text color="gray600" fontSize="sm">
              E-mail
            </Text>
            <Div row alignItems="center">
              <Text fontWeight="bold" ml="lg" mr="md">
                {user ? user.email : '-'}
              </Text>
              <Icon
                name="chevron-right"
                size={18}
                color="#888"
                iconStyle="solid"
              />
            </Div>
          </Div>
        </TouchableOpacity>
        <TouchableOpacity onPress={alterarFoto}>
          <Div p="lg" row justifyContent="space-between" alignItems="center">
            <Text color="gray600" fontSize="sm">
              Foto
            </Text>
            <Div row alignItems="center">
              <Text fontWeight="bold" ml="lg" mr="md">
                Alterar foto de perfil
              </Text>
              <Icon
                name="chevron-right"
                size={18}
                color="#888"
                iconStyle="solid"
              />
            </Div>
          </Div>
        </TouchableOpacity>
      </Div>

      <TouchableOpacity
        onPress={sair}
        style={{marginTop: 250, alignSelf: 'center'}}>
        <Div row alignItems="center">
          <Icon
            name="arrow-right-from-bracket"
            size={20}
            color="red"
            iconStyle="solid"
            style={{marginRight: 8}}
          />
          <Text color="red" fontWeight="bold">
            Sair
          </Text>
        </Div>
      </TouchableOpacity>

      <BottomNavBar />
    </Div>
  );
}

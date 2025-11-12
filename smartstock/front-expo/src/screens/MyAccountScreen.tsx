import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Div, Text} from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import BottomNavBar from '../components/BottomNavBar';
import {useAuth} from '../context/AuthContext';
const fotoUsuario = require('../assets/images/foto_usuario.png');

export default function UserProfileScreen() {
  const navigation = useNavigation() as any;
  const {user} = useAuth();

  const nomeUsuario = user?.name || user?.nome || 'Usuário';
  const emailUsuario = user?.email || user?.emailAddress || '—';
  const empresaUsuario = user?.company || user?.empresa || 'SmartStock';
  const fonteFotoUsuario = user?.photo ? {uri: user.photo} : fotoUsuario;

  const voltar = () => navigation.goBack();
  const alterarFoto = () => {
    /* futuramente */
  };
  const {signOut} = useAuth();
  const sair = async () => {
    try {
      await signOut();
      navigation.navigate('Index');
    } catch (err) {
      console.warn('MyAccountScreen: failed to sign out', err);
    }
  };

  return (
    <Div flex={1} bg="white">
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
        <Image source={fonteFotoUsuario} />
        <Text mt="md" fontWeight="bold">
          {nomeUsuario}
        </Text>
        <Text mt="xs" color="gray600">
          {empresaUsuario}
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
                {nomeUsuario}
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
                {emailUsuario}
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
          <Text
            color="red"
            fontWeight="bold">
            Sair
          </Text>
        </Div>
      </TouchableOpacity>

      <BottomNavBar />
    </Div>
  );
}

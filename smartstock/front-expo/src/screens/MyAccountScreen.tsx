import React, { useState } from 'react';
import {TouchableOpacity, Image, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
import {useNavigation} from '@react-navigation/native';
import {Div, Text, Input, Button} from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import BottomNavBar from '../components/BottomNavBar';
import {useAuth} from '../context/AuthContext';
const fotoUsuario = require('../assets/images/foto_usuario.png');

export default function UserProfileScreen() {
  const navigation = useNavigation() as any;
  const {user} = useAuth();
  const {signOut, setUser} = useAuth();

  const nomeUsuarioInit = user?.name || user?.nome || '';
  const emailUsuarioInit = user?.email || user?.emailAddress || '';
  const empresaUsuario = user?.company || user?.empresa || 'SmartStock';
  const fonteFotoUsuario = user?.photo ? {uri: user.photo} : fotoUsuario;

  const [nomeUsuario, setNomeUsuario] = useState(nomeUsuarioInit);
  const [emailUsuario, setEmailUsuario] = useState(emailUsuarioInit);
  const [saving, setSaving] = useState(false);

  const voltar = () => navigation.goBack();
  const alterarFoto = () => {
    /* futuramente */
  };

  const sair = async () => {
    try {
      await signOut();
      navigation.navigate('Index');
    } catch (err) {
      console.warn('MyAccountScreen: failed to sign out', err);
    }
  };

  const handleSave = async () => {
    if (!user || !user.id) {
      Alert.alert('Usuário não autenticado');
      return;
    }
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/usuarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ nome: nomeUsuario, email: emailUsuario }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao atualizar');

      // update local storage and context
      await AsyncStorage.setItem('usuario', JSON.stringify(data));
      try { setUser(data); } catch (err) { console.warn('MyAccount: failed setUser', err); }

      Alert.alert('Perfil atualizado com sucesso');
    } catch (err: any) {
      console.error('MyAccount: save failed', err);
      Alert.alert('Erro', err.message || 'Erro ao salvar perfil');
    } finally {
      setSaving(false);
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
          {empresaUsuario}
        </Text>
      </Div>

      <Div mt="2xl" mx="xl" rounded={16} borderWidth={1} borderColor="#E0E0E0" p="md">
        <Div mb="md">
          <Text color="gray600" fontSize="sm">Nome</Text>
          <Input value={nomeUsuario} onChangeText={setNomeUsuario} mt="sm" />
        </Div>
        <Div mb="md">
          <Text color="gray600" fontSize="sm">E-mail</Text>
          <Input value={emailUsuario} onChangeText={setEmailUsuario} mt="sm" keyboardType="email-address" autoCapitalize="none" />
        </Div>
        <TouchableOpacity onPress={alterarFoto}>
          <Div row alignItems="center" justifyContent="space-between" p="md">
            <Text color="gray600" fontSize="sm">Foto</Text>
            <Div row alignItems="center">
              <Text fontWeight="bold" ml="lg" mr="md">Alterar foto de perfil</Text>
              <Icon name="chevron-right" size={18} color="#888" iconStyle="solid" />
            </Div>
          </Div>
        </TouchableOpacity>
        <Div mt="md">
          <Button block bg="#314401" onPress={handleSave} loading={saving}>
            <Text color="white" fontWeight="bold">Salvar</Text>
          </Button>
        </Div>
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

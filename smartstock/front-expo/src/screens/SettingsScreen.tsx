import React, {useState, useEffect} from 'react';
import {StyleSheet, Switch, TouchableOpacity} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import BottomNavBar from '../components/BottomNavBar';
import {useAuth} from '../context/AuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {user} = useAuth();
  const [toggles, setToggles] = useState({
    notificacoes: false,
    vencimentos: false,
    prazo: false,
    sugestoes: false,
    camera: false,
  });

  useEffect(() => {
    // Fetch user settings from the backend
    const fetchSettings = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://10.0.2.2:3000/api/settings', {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });

        // backend returns the settings object directly
        const data = response.data || {};
        setToggles({
          notificacoes: !!data.notificacoes,
          vencimentos: !!data.vencimentos,
          prazo: !!data.prazo,
          sugestoes: !!data.sugestoes,
          camera: !!data.camera,
        });
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = async (key: keyof typeof toggles) => {
    const updatedToggles = {...toggles, [key]: !toggles[key]};
    setToggles(updatedToggles);

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        'http://10.0.2.2:3000/api/settings',
        {
          notificacoes: updatedToggles.notificacoes,
          vencimentos: updatedToggles.vencimentos,
          prazo: updatedToggles.prazo,
          sugestoes: updatedToggles.sugestoes,
          camera: updatedToggles.camera,
        },
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const settingsOptions = [
    {label: 'Notificações gerais', key: 'notificacoes'},
    {label: 'Alertas de vencimentos', key: 'vencimentos'},
    {label: 'Alertas de prazo de vencimento', key: 'prazo'},
    {label: 'Sugestões de receitas', key: 'sugestoes'},
    {label: 'Habilitar câmera', key: 'camera'},
  ];

  return (
    <Div flex={1} bg="white" p="lg">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#000" iconStyle="solid" />
      </TouchableOpacity>
      <Text fontWeight="bold" fontSize="2xl" textAlign="center">
        SMART STOCK
      </Text>
      <Text fontSize="md" textAlign="center" mb="lg">
        Configurações
      </Text>

    <Div pt="md" mt="2xl">
      <Text fontWeight="bold" mb="md">
        Ajustes gerais
      </Text>
      {settingsOptions.map(({label, key}) => (
        <Div
          key={key}
          row
          alignItems="center"
          justifyContent="flex-start"
          mb="sm"
          px="md"
          py="sm"
          rounded={20}
          borderWidth={1}
          borderColor="#ccc"
        >
          <Switch
            value={toggles[key as keyof typeof toggles]}
            onValueChange={() => handleToggle(key as keyof typeof toggles)}
            trackColor={{false: '#ccc', true: '#4B572A'}}
            thumbColor={
              toggles[key as keyof typeof toggles] ? '#2C3408' : '#888'
            }
          />
          <Text ml="md">{label}</Text>
        </Div>
      ))}
    </Div>

      <Div borderTopWidth={1} borderColor="#ccc" mt="lg" pt="md">
        <Text fontWeight="bold" mb="md">
          Utilizador
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyAccount')}>
          <Div row alignItems="center" justifyContent="space-between" p="md">
            <Div row alignItems="center">
              <Icon
                name="user"
                size={16}
                color="#000"
                style={{marginRight: 8}}
              />
              <Text>{user?.name || user?.nome || 'Usuário'}</Text>
            </Div>
            <Icon
              name="chevron-right"
              size={12}
              color="#000"
              iconStyle="solid"
            />
          </Div>
        </TouchableOpacity>
      </Div>

      <Div borderTopWidth={1} borderColor="#ccc" mt="lg" pt="md">
        <Text fontWeight="bold" mb="md">
          Faça upgrade para o Smart Stock+
        </Text>
        <TouchableOpacity>
          <Div row alignItems="center" justifyContent="space-between" p="md">
            <Div row alignItems="center">
              <Icon
                name="rectangle-ad"
                size={16}
                color="#000"
                style={{marginRight: 8}}
                iconStyle="solid"
              />
              <Text>Livre de anúncios e novas funções</Text>
            </Div>
            <Icon
              name="chevron-right"
              size={12}
              color="#000"
              iconStyle="solid"
            />
          </Div>
        </TouchableOpacity>
      </Div>

      <Div borderTopWidth={1} borderColor="#ccc" mt="lg" pt="md">
        <Text fontWeight="bold" mb="md">
          Tema
        </Text>
        <Div row alignItems="center" justifyContent="space-between" p="md">
          <Icon name="sun" size={16} color="#000" iconStyle='solid'/>
          <Text>Modo claro / Modo escuro</Text>
          <Icon name="moon" size={16} color="#000" iconStyle='solid'/>
        </Div>
      </Div>

    <Div flex={1} justifyContent="flex-end">
      <Div style={{marginBottom: 52}} row justifyContent="space-between" alignItems="center" mt="xl" mb="md">
        <Text color="gray500">Versão</Text>
        <Text fontWeight="bold">1.0.0</Text>
      </Div>
    </Div>
      <BottomNavBar />
    </Div>
  );
}

const styles = StyleSheet.create({});

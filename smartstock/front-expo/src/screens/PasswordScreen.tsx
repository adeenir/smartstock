import React, {useState} from 'react';
import {Image, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import {useNavigation} from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';
const fotoSenha = require('../assets/images/foto_senha.png');
import { Alert, Button as RNButton } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleValidate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Preencha todos os campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Nova senha e confirmação não coincidem');
      return;
    }
    // Allow validating even if newPassword === currentPassword (user requested this behaviour)
    Alert.alert('Validação OK', 'A nova senha está válida para alteração');
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Preencha todos os campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Nova senha e confirmação não coincidem');
      return;
    }
    // Allow changing to the same password per request (no bcrypt integration)

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Não autenticado', 'Faça login novamente');
        return;
      }

      const res = await fetch('http://10.0.2.2:3000/usuarios/alterar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Sucesso', data.message || 'Senha alterada com sucesso');
        navigation.goBack();
      } else {
        Alert.alert('Erro', data.message || 'Erro ao alterar senha');
      }
    } catch (err) {
      console.error('Erro ao alterar senha', err);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    }
  };

  return (
    <Div flex={1} bg="white" px="xl" pt="2xl" justifyContent="space-between">
      <Div>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={20}
            color="#000"
            style={{marginBottom: 16}}
            iconStyle="solid"
          />
        </TouchableOpacity>
        <Text fontWeight="bold" fontSize="2xl" textAlign="center">
          SMART STOCK
        </Text>
        <Text fontSize="md" textAlign="center" mb="lg" color="gray700">
          Alterar senha
        </Text>

        <Div alignItems="center" my="2xl">
          <Image
            source={fotoSenha}
            style={{width: 120, height: 120, resizeMode: 'contain'}}
          />
        </Div>

        <Div
          mt="2xl"
          mx="xl"
          rounded={16}
          borderWidth={1}
          borderColor="#E0E0E0">
          <TouchableOpacity>
            <Div
              p="lg"
              borderBottomWidth={1}
              borderBottomColor="#E0E0E0"
              row
              justifyContent="space-between"
              alignItems="center">
              <Text color="gray600" fontSize="sm">
                Senha atual
              </Text>
              <Div row alignItems="center">
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Digite a senha"
                  style={{
                    minWidth: 100,
                    textAlign: 'right',
                    color: '#000',
                    fontWeight: 'bold',
                  }}
                />
                <Icon
                  name="lock"
                  size={18}
                  color="#888"
                  iconStyle="solid"
                  style={{marginLeft: 8}}
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
                Nova senha
              </Text>
              <Div row alignItems="center">
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Digite a nova senha"
                  style={{
                    minWidth: 100,
                    textAlign: 'right',
                    color: '#000',
                    fontWeight: 'bold',
                  }}
                />
                <Icon
                  name="chevron-right"
                  size={18}
                  color="#888"
                  iconStyle="solid"
                  style={{marginLeft: 8}}
                />
              </Div>
            </Div>
          </TouchableOpacity>
          <TouchableOpacity>
            <Div p="lg" row justifyContent="space-between" alignItems="center">
              <Text color="gray600" fontSize="sm">
                Repita a nova senha
              </Text>
              <Div row alignItems="center">
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Repita a nova senha"
                  style={{
                    minWidth: 100,
                    textAlign: 'right',
                    color: '#000',
                    fontWeight: 'bold',
                  }}
                />
                <Icon
                  name="chevron-right"
                  size={18}
                  color="#888"
                  iconStyle="solid"
                  style={{marginLeft: 8}}
                />
              </Div>
            </Div>
          </TouchableOpacity>
        </Div>
      </Div>
      <Div p="lg">
        <TouchableOpacity onPress={handleValidate} style={{backgroundColor:'#314401', padding:12, borderRadius:8, alignItems:'center', marginBottom:8}}>
          <Text color="#fff" fontWeight="bold">Validar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleChangePassword} style={{backgroundColor:'#254002', padding:12, borderRadius:8, alignItems:'center'}}>
          <Text color="#fff" fontWeight="bold">Alterar senha</Text>
        </TouchableOpacity>
      </Div>
      <BottomNavBar />
    </Div>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    gap: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  label: {
    flex: 1,
    color: '#333',
    fontSize: 14,
  },
  input: {
    flex: 2,
    fontSize: 14,
    color: '#000',
    textAlign: 'right',
  },
  bottomBar: {
    height: 60,
    backgroundColor: '#A6B48A',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 32,
  },
});

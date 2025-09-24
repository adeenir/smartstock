import React from 'react';
import {Alert} from 'react-native';
import {Button, Div, Input, Text} from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import LogoComponent from '../components/LogoComponent.tsx';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = React.useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Preencha seu email!');
      return;
    }

    try {
      const response = await fetch(
        'http://10.0.2.2:3000/usuarios/redefinir-senha',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email}),
        },
      );

      const data = await response.json();
      Alert.alert(data.message);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro ao conectar com o servidor');
    }
  };

  return (
    <Div flex={1} bg="white" p="lg">
      <LogoComponent />
      <Text
        fontSize="6xl"
        fontWeight="900"
        mb="lg"
        color="gray900"
        textAlign="left">
        Redefinição de senha
      </Text>
      <Text fontSize="lg" mb="lg" color="gray600" textAlign="left">
        Informe seu e-mail e enviaremos um link para redefinição de senha.
      </Text>
      <Div row alignItems="center" mb="md">
        <Icon name="envelope" size={25} color="gray400" />
        <Input
          placeholder="Digite o seu email"
          value={email}
          onChangeText={setEmail}
          mb="md"
          keyboardType="email-address"
          autoCapitalize="none"
          borderWidth={0}
          borderBottomWidth={2}
          borderBottomColor="gray400"
          fontSize={15}
        />
      </Div>
      <Button
        block
        bg="#314401"
        py="lg"
        rounded="circle"
        onPress={handleResetPassword}>
        <Text color="white" fontWeight="bold" fontSize={15}>
          Redefinir senha
        </Text>
      </Button>
    </Div>
  );
}

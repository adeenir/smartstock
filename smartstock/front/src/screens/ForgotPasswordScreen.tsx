import React from 'react';
import {Button, Div, Input, Text} from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import LogoComponent from '../components/LogoComponent.tsx';

export default function ForgotPasswordScreen({}) {
    const [email, setEmail] = React.useState('');

    return (
        <Div flex={1} bg="white" p="lg">
            <LogoComponent />
            <Text fontSize="6xl" fontWeight="900" mb="lg" color="gray900" textAlign="left">
                Redefinição de senha
            </Text>
            <Text fontSize="lg" mb="lg" color="gray600" textAlign="left">
                Informe seu e-mail e enviaremos um link para redefinição de senha.
            </Text>
            <Div row alignItems="center" mb="md">
                <Icon name="envelope" size={25} color="gray400" />
                <Input placeholder="Digite o seu email"
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
            <Button block bg="#314401" py="lg" rounded="circle">
                <Text color="white" fontWeight="bold" fontSize={15}>
                    Redefinir senha
                </Text>
            </Button>
        </Div>
    );
}

import {Button, Div, Input, Text} from 'react-native-magnus';
import React from 'react';
import Icon from '@react-native-vector-icons/fontawesome6';
import LogoComponent from '../components/LogoComponent.tsx';

export default function RegisterScreen({}) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <Div flex={1} bg="white" p="lg">
            <LogoComponent />
            <Text fontSize="6xl" fontWeight="900" mb="lg" color="gray900" textAlign="left">
                Novo usuário
            </Text>
            <Div row alignItems="center" mb="md">
                <Icon name="user" size={25} color="gray400" />
                <Input
                    placeholder="Digite o seu nome completo"
                    value={name}
                    onChangeText={setName}
                    mb="md"
                    borderWidth={0}
                    borderBottomWidth={2}
                    borderBottomColor="gray400"
                    fontSize={15}
                />
            </Div>
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
            <Div row alignItems="center" mb="lg">
                <Icon name="lock" size={25} color="gray400" iconStyle="solid" />
                <Input
                    placeholder="Digite a sua senha"
                    value={password}
                    onChangeText={setPassword}
                    mb="md"
                    secureTextEntry
                    borderWidth={0}
                    borderBottomWidth={2}
                    borderBottomColor="gray400"
                    fontSize={15}
                />
            </Div>
            <Button block bg="#314401" py="lg" rounded="circle">
                <Text color="white" fontWeight="bold" fontSize={15}>
                    Cadastrar
                </Text>
            </Button>
        </Div>
    );
}

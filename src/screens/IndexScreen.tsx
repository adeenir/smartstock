import React from 'react';
import {Image} from 'react-native';
import {Button, Div, Input, Text} from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';

const logo = require('../assets/images/logo.png');

export default function IndexScreen({})
{
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <Div flex={1} justifyContent="center" bg="white" p="lg">
            <Div alignItems="center" mb="xl">
                <Image source={logo} style={{
                    width: 400,
                    height: 300,
                    marginTop: -200,
                    marginBottom: 16,
                }}/>
            </Div>
            <Text fontSize="2xl" fontWeight="bold" mb="lg" color="gray900" textAlign="center">
                Entrar
            </Text>
            <Div row alignItems="center" mb="md">
                <Icon name="envelope" size={20} color="gray400" />
                <Input placeholder="Digite o seu email"
                       value={email}
                       onChangeText={setEmail}
                       mb="md"
                       keyboardType="email-address"
                       autoCapitalize="none"
                       borderWidth={0}
                       borderBottomWidth={2}
                       borderBottomColor="gray400"
                />
            </Div>
            <Div row alignItems="center" mb="lg">
                <Icon name="lock" size={20} color="gray400" iconStyle="solid" />
                <Input placeholder="Digite a sua senha"
                       value={password}
                       onChangeText={setPassword}
                       mb="md"
                       secureTextEntry
                       borderWidth={0}
                       borderBottomWidth={2}
                       borderBottomColor="gray400"
                />
            </Div>
            <Div row justifyContent="flex-end" mb="lg" style={{}}>
                <Button bg="transparent" p={1} onPress={() => {}}>
                    <Text color="gray600" fontSize="sm">
                        Esqueci minha senha
                    </Text>
                </Button>
            </Div>
            <Button block bg="green600" py="md" rounded="lg">
                <Text color="white" fontWeight="bold">
                    Acessar
                </Text>
            </Button>
        </Div>
    );
}

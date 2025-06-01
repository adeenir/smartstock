import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, Div, Input, Text} from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import {navigate} from '../navigation/AppNavigator.tsx';
import LogoComponent from '../components/LogoComponent.tsx';

export default function IndexScreen({})
{
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <Div flex={1} bg="white" p="lg">
            <LogoComponent />
            <Text fontSize="6xl" fontWeight="900" mb="lg" color="gray900" textAlign="left">
                Entrar
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
            <Div row alignItems="center" mb="lg">
                <Icon name="lock" size={25} color="gray400" iconStyle="solid" />
                <Input placeholder="Digite a sua senha"
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
            <Div row justifyContent="flex-end" mb="lg" style={{}}>
                <Button bg="transparent" p={1} onPress={() => {
                    navigate('ForgotPassword');
                }}>
                    <Text color="gray600" fontSize="lg" fontWeight="bold">
                        Esqueci minha senha
                    </Text>
                </Button>
            </Div>
            <Button block bg="#314401" py="lg" rounded="circle">
                <Text color="white" fontWeight="bold" fontSize={15}>
                    Acessar
                </Text>
            </Button>
            <Text fontSize="lg" mb="lg" color="gray600" textAlign="center" style={styles.ouLabel}>
                Ou
            </Text>
            <Button
                block
                bg="gray400"
                borderWidth={1}
                borderColor="gray300"
                py="lg"
                rounded="circle"
                mb="md"
                row
                style={styles.googleButton}
                alignItems="center">
                <Icon name="google" size={20} color="#DB4437" iconStyle="brand" style={styles.googleIcon}
                />
                <Text color="gray600" fontWeight="bold" fontSize={15}>
                    Entrar com o Google
                </Text>
            </Button>
            <Div row justifyContent={"center"} mb="lg">
                <Text fontSize="lg" color="gray600" textAlign="center">
                    Não tem uma conta?&nbsp;
                </Text>
                <Button bg="transparent" p={1} onPress={() => {
                    navigate('Register');
                }}>
                    <Text color="#314401" fontSize="lg" fontWeight="bold">
                        Criar conta
                    </Text>
                </Button>
            </Div>
        </Div>
    );
}

const styles = StyleSheet.create({
    googleButton: {},
    googleIcon: {
        marginRight: 10,
    },
    ouLabel: {
        marginTop: 10,
    },
});

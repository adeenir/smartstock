import React from 'react';
import globalStyles from '../styles/globalStyles';
import {View, Text, StyleSheet, Image, TextInput} from 'react-native';

const logo = require('../assets/images/logo.png');

export default function IndexScreen({})
{
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <View style={globalStyles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.label}>Entrar</Text>

            <TextInput
                style={styles.input}
                placeholder="Digite o seu email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                />
            <TextInput
                style={styles.input}
                placeholder="Digite a sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
    },
    logo: {
        width: 250,
        height: 150,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 16,
    },
    label: {
        fontFamily: 'Poppins',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    forgotPassword: {
        color: '#4CAF50',
        textAlign: 'right',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

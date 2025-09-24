import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import {useNavigation} from '@react-navigation/native';

const MOCK_CODE = '1234567890123';

export default function ProductCodeInputScreen() {
  const navigation = useNavigation<any>();
  const [code, setCode] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'input' | 'validate' | 'success'>('input');

  const handleAdvance = () => {
    if (code.length > 0) {
      setStep('validate');
    }
  };

  const handleAddToStock = () => {
    setStep('success');
  };

  const handleClear = () => {
    setCode('');
  };

  if (step === 'validate') {
    return (
      <Div flex={1} bg="white">
        <Header navigation={navigation} />
        <Div
          style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
          <Div
            style={{
              height: 320,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 100,
            }}>
            <Text
              fontWeight="bold"
              fontSize="lg"
              mb="lg"
              style={{textAlign: 'center', fontSize: 20}}>
              Validação de cadastro
            </Text>
            <Div
              style={{
                borderColor: '#4B8B3B',
                borderWidth: 2,
                borderRadius: 12,
                backgroundColor: '#fff',
                width: 170,
                height: 170,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.06,
                shadowRadius: 2,
                elevation: 1,
              }}>
              <Icon
                name="bottle-water"
                size={130}
                color="#38410B"
                iconStyle="solid"
              />
            </Div>
            <Text
              fontWeight="bold"
              color="#38410B"
              mt={-1}
              style={{textAlign: 'center', fontSize: 20}}>
              Guaraná
            </Text>
            <Text color="#38410B" style={{textAlign: 'center', fontSize: 16}}>
              Quantidade: 1
            </Text>
            <Text
              color="#38410B"
              fontSize="sm"
              style={{textAlign: 'center', fontSize: 14}}>
              Data de fabricação: 16/05/25
            </Text>
            <Text
              color="#38410B"
              fontSize="sm"
              style={{textAlign: 'center', fontSize: 14}}>
              Data de validade: 16/06/25
            </Text>
          </Div>
        </Div>
        <Div
          px="xl"
          style={{position: 'absolute', left: 0, right: 0, bottom: 88}}>
          <TouchableOpacity
            style={[styles.button, {height: 52}]}
            onPress={handleAddToStock}>
            <Text color="white" fontWeight="bold" fontSize={16}>
              Adicionar ao estoque
            </Text>
          </TouchableOpacity>
        </Div>
        <BottomBar navigation={navigation} />
      </Div>
    );
  }

  if (step === 'success') {
    return (
      <Div flex={1} bg="white">
        <Header navigation={navigation} />
        <Div flex={1} alignItems="center" justifyContent="center" px="xl">
          <Icon
            name="circle-check"
            size={80}
            color="#38410B"
            style={{marginBottom: 24}}
          />
          <Text fontWeight="bold" fontSize="lg" color="#38410B" mb="lg">
            PRODUTO ADICIONADO COM SUCESSO!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Stock')}
            style={{marginTop: 8}}>
            <Text color="#38410B" fontWeight="bold" textDecorLine="underline">
              Acesse seu estoque
            </Text>
          </TouchableOpacity>
        </Div>
        <BottomBar navigation={navigation} />
      </Div>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Div flex={1} bg="white">
        <Header navigation={navigation} />
        <Div
          flex={1}
          px="xl"
          justifyContent="flex-start"
          style={{marginTop: 48}}>
          <Text fontWeight="bold" fontSize="lg" mb="lg">
            Digite o código
          </Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder=""
            keyboardType="numeric"
            maxLength={20}
          />
          <TouchableOpacity
            onPress={handleClear}
            style={{marginTop: 12, marginBottom: 32}}>
            <Text color="#38410B" fontWeight="bold" fontSize="sm">
              Limpar campos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, code === '' ? styles.buttonDisabled : null]}
            onPress={handleAdvance}
            disabled={code === ''}>
            <Text color="white" fontWeight="bold">
              Avançar
            </Text>
          </TouchableOpacity>
        </Div>
        <BottomBar navigation={navigation} />
      </Div>
    </KeyboardAvoidingView>
  );
}

function Header({navigation}: {navigation: any}) {
  return (
    <Div
      row
      alignItems="center"
      justifyContent="space-between"
      p="lg"
      bg="white">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{padding: 8, justifyContent: 'center', alignItems: 'center'}}>
        <Icon name="arrow-left" size={22} color="#222" iconStyle="solid" />
      </TouchableOpacity>
      <Text fontWeight="bold" fontSize="xl">
        SMART STOCK
      </Text>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{padding: 8, justifyContent: 'center', alignItems: 'center'}}>
        <Icon name="xmark" size={22} color="#222" iconStyle="solid" />
      </TouchableOpacity>
    </Div>
  );
}

function BottomBar({navigation}: {navigation: any}) {
  return (
    <Div
      style={styles.bottomBar}
      row
      alignItems="center"
      justifyContent="space-around">
      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: 60,
        }}
        onPress={() => navigation.navigate('Home')}>
        <Icon name="house" size={24} color="white" iconStyle="solid" />
      </TouchableOpacity>
    </Div>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 2,
    borderColor: '#38410B',
    fontSize: 18,
    paddingVertical: 8,
    marginBottom: 8,
    color: '#222',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#38410B',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#A6B48A',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: '#A6B48A',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    zIndex: 10,
    paddingBottom: 0,
  },
  productImageBox: {
    borderWidth: 2,
    borderColor: '#38410B',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: 80,
    height: 100,
    resizeMode: 'contain',
  },
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';

const MOCK_CODE = '1234567890123';

// static light-theme colors (provider removed)
const staticColors = {
  bg: '#FFFFFF',
  text: '#000000',
  primary: '#4B572A',
  white: '#FFFFFF',
  gray700: '#374151',
  danger: '#E53935',
  gray500: '#6B7280',
};

export default function ProductCodeInputScreen({ route }: { route?: any }) {
  const navigation = useNavigation<any>();
  const scannedCode = route?.params?.scannedCode || '';
  const [code, setCode] = useState(scannedCode);
  const [success, setSuccess] = useState(false);
  type StepType = 'choice' | 'input' | 'validate' | 'success';
  const [step, setStep] = useState<StepType>(scannedCode ? 'validate' : 'choice');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [offLoading, setOffLoading] = useState(false);
  const [offData, setOffData] = useState<any | null>(null);

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
      <Div flex={1} bg={staticColors.bg}>
        <Header navigation={navigation} />
        <Div style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
          <Div style={{height: 320, justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
            <Text fontWeight="bold" fontSize="lg" mb="lg" style={{textAlign: 'center', fontSize:20}}>Validação de cadastro</Text>
            <Div style={{
              borderColor: staticColors.primary,
              borderWidth: 2,
              borderRadius: 12,
              backgroundColor: staticColors.white,
              width: 170,
              height: 170,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 2,
              elevation: 1,
            }}>
              <Icon name="bottle-water" size={130} color={staticColors.primary} iconStyle="solid" />
            </Div>
            {loading && <Text>Buscando produto...</Text>}
            {error === 'not_found' && (
              <Div alignItems="center">
                <Text fontWeight="bold" color={staticColors.primary} mt={-1} style={{textAlign: 'center', fontSize: 20}}>Produto não encontrado</Text>
                <Text color={staticColors.primary} style={{textAlign: 'center', fontSize: 16}}>Deseja cadastrar este produto?</Text>
                {offLoading && <Text mt="sm">Buscando dados públicos (OpenFoodFacts)...</Text>}
                {!offLoading && offData && (
                  <Div alignItems="center" mt="md">
                    <Text fontWeight="bold">Sugestão encontrada</Text>
                    {offData.nome && <Text>{offData.nome}</Text>}
                    {offData.marca && <Text>Marca: {offData.marca}</Text>}
                    {offData.categoria && <Text>Categoria: {offData.categoria}</Text>}
                    <Div row mt="sm">
                      <TouchableOpacity onPress={() => navigation.navigate('ProductRegister', { prefill: { codigoBarras: code, ...offData } })} style={{marginRight: 8}}>
                        <Div style={{backgroundColor: staticColors.primary, padding: 10, borderRadius: 8}}>
                          <Text color={staticColors.white}>Cadastrar com dados</Text>
                        </Div>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigation.navigate('ProductRegister', { prefill: { codigoBarras: code } })}>
                        <Div style={{backgroundColor: staticColors.primary, padding: 10, borderRadius: 8}}>
                          <Text color={staticColors.white}>Cadastrar manualmente</Text>
                        </Div>
                      </TouchableOpacity>
                    </Div>
                  </Div>
                )}
                {!offLoading && !offData && (
                  <TouchableOpacity onPress={() => navigation.navigate('ProductRegister', { prefill: { codigoBarras: code } })} style={{marginTop: 12}}>
                    <Div style={{backgroundColor: staticColors.primary, padding: 10, borderRadius: 8}}>
                      <Text color={staticColors.white}>Cadastrar produto</Text>
                    </Div>
                  </TouchableOpacity>
                )}
              </Div>
            )}
            {error === 'error' && (
              <Text color={staticColors.danger}>Erro ao buscar produto. Tente novamente.</Text>
            )}
            {product && (
              <Div alignItems="center">
                <Text fontWeight="bold" color={staticColors.primary} mt={-1} style={{textAlign: 'center', fontSize: 20}}>{product.nome || product.name || 'Produto'}</Text>
                <Text color={staticColors.primary} style={{textAlign: 'center', fontSize: 16}}>Quantidade: {product.quantidade || 1}</Text>
                <Text color={staticColors.primary} fontSize="sm" style={{textAlign: 'center', fontSize: 14}}>Validade: {product.dataValidade || 'N/A'}</Text>
                <Text color={staticColors.primary} fontSize="sm" style={{textAlign: 'center', fontSize: 14}}>Marca: {product.marca || '—'}</Text>
              </Div>
            )}
          </Div>
        </Div>
        <Div px="xl" style={{position: 'absolute', left: 0, right: 0, bottom: 88}}>
          <TouchableOpacity style={[styles.button, {height: 52, backgroundColor: staticColors.primary}]} onPress={() => {
            if (product) {
              navigation.navigate('Stock');
            } else {
              navigation.navigate('ProductRegister', { prefill: { codigoBarras: code } });
            }
          }}>
            <Text color={staticColors.white} fontWeight="bold" fontSize={16}>{product ? 'Adicionar ao estoque' : 'Cadastrar produto'}</Text>
          </TouchableOpacity>
        </Div>
        <BottomBar navigation={navigation} />
      </Div>
    );
  }

  if (step === 'choice') {
    return (
      <Div flex={1} bg={staticColors.bg}>
        <Header navigation={navigation} />
        <Div flex={1} justifyContent="center" alignItems="center" px="xl">
          <Text fontWeight="900" fontSize={22} mb="sm">Cadastrar produto</Text>
          <Text color={staticColors.primary} mb="lg" fontSize={15} textAlign="center">Escolha como deseja cadastrar o produto</Text>

          <Div style={{width: '100%', marginTop: 8}}>
            <TouchableOpacity onPress={() => navigation.navigate('BarcodeScanner')} style={styles.choiceButtonTouchable}>
              <Div style={[styles.choiceButton, { backgroundColor: staticColors.primary }]} row alignItems="center">
                <Icon name="camera" size={22} color={staticColors.white} style={{marginRight: 12}} iconStyle="solid" />
                <Text color={staticColors.white} fontWeight="bold" fontSize={16}>Escanear código</Text>
              </Div>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep('input')} style={styles.choiceButtonTouchable}>
              <Div style={[styles.choiceButton, {backgroundColor: staticColors.primary}]} row alignItems="center">
                <Icon name="keyboard" size={20} color={staticColors.white} style={{marginRight: 12}} />
                <Text color={staticColors.white} fontWeight="bold" fontSize={16}>Digitar manualmente</Text>
              </Div>
            </TouchableOpacity>
          </Div>
        </Div>
        <BottomBar navigation={navigation} />
      </Div>
    );
  }

  if (step === 'success') {
    return (
      <Div flex={1} bg={staticColors.bg}>
        <Header navigation={navigation} />
        <Div flex={1} alignItems="center" justifyContent="center" px="xl">
          <Icon name="circle-check" size={80} color={staticColors.primary} style={{marginBottom: 24}} />
          <Text fontWeight="bold" fontSize="lg" color={staticColors.primary} mb="lg">PRODUTO ADICIONADO COM SUCESSO!</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Stock')} style={{marginTop: 8}}>
            <Text color={staticColors.primary} fontWeight="bold" textDecorLine="underline">Acesse seu estoque</Text>
          </TouchableOpacity>
        </Div>
        <BottomBar navigation={navigation} />
      </Div>
    );
  }

  // if this screen was opened with a scanned code, go directly to validate
  React.useEffect(() => {
    if (scannedCode && code) {
      setStep('validate');
    }
  }, [scannedCode]);

  // When entering validate step, query backend for product by barcode
  useEffect(() => {
    let mounted = true;
    const fetchByCode = async () => {
      if ((step as StepType) !== 'validate' || !code) return;
      setLoading(true);
      setProduct(null);
      setError(null);
      try {
        const res = await fetch(`http://10.0.2.2:3000/produtos/barcode/${encodeURIComponent(code)}`);
        if (res.status === 404) {
          if (!mounted) return;
          setError('not_found');
          return;
        }
        if (!res.ok) throw new Error('network');
        const data = await res.json();
        if (!mounted) return;
        setProduct(data);
      } catch (err) {
        console.error('Erro ao buscar produto por código:', err);
        if (!mounted) return;
        setError('error');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchByCode();
    return () => { mounted = false; };
  }, [step, code]);

  // If not found in our DB, try OpenFoodFacts for suggested data
  useEffect(() => {
    let mounted = true;
    const fetchOFF = async () => {
      if (error !== 'not_found' || !code) return;
      setOffLoading(true);
      setOffData(null);
      try {
        const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(code)}.json`);
        if (!res.ok) throw new Error('off-network');
        const data = await res.json();
        if (!mounted) return;
        if (data && data.status === 1 && data.product) {
          // map relevant fields
          const p = data.product;
          const prefill = {
            nome: p.product_name || p.generic_name || null,
            marca: (p.brands && p.brands.split(',')[0]) || null,
            categoria: (p.categories && p.categories.split(',')[0]) || null,
            imagemUrl: p.image_front_url || p.image_small_url || null,
          };
          setOffData(prefill);
        } else {
          setOffData(null);
        }
      } catch (err) {
        console.error('Erro ao consultar OpenFoodFacts:', err);
        setOffData(null);
      } finally {
        if (mounted) setOffLoading(false);
      }
    };

    fetchOFF();
    return () => { mounted = false; };
  }, [error, code]);

  // input step
  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Div flex={1} bg={staticColors.bg}>
        <Header navigation={navigation} />
        <Div flex={1} px="xl" justifyContent="flex-start" style={{marginTop: 48}}>
          <Text fontWeight="bold" fontSize="lg" mb="lg">Digite o código</Text>
          <TextInput
            style={[styles.input, { borderColor: staticColors.primary, color: staticColors.text }]}
            value={code}
            onChangeText={setCode}
            placeholder=""
            keyboardType="numeric"
            maxLength={20}
          />
          <TouchableOpacity onPress={handleClear} style={{marginTop: 12, marginBottom: 32}}>
            <Text color={staticColors.primary} fontWeight="bold" fontSize="sm">Limpar campos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: code === '' ? staticColors.gray500 : staticColors.primary }]}
            onPress={handleAdvance}
            disabled={code === ''}
          >
            <Text color={staticColors.white} fontWeight="bold">Avançar</Text>
          </TouchableOpacity>
        </Div>
        <BottomBar navigation={navigation} />
      </Div>
    </KeyboardAvoidingView>
  );
}

function Header({ navigation }: { navigation: any }) {
  return (
    <Div row alignItems="center" justifyContent="space-between" p="lg" bg={staticColors.bg}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 8, justifyContent: 'center', alignItems: 'center'}}>
        <Icon name="arrow-left" size={22} color={staticColors.text} iconStyle="solid" />
      </TouchableOpacity>
      <Text fontWeight="bold" fontSize="xl" color={staticColors.text}>SMART STOCK</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 8, justifyContent: 'center', alignItems: 'center'}}>
        <Icon name="xmark" size={22} color={staticColors.text} iconStyle="solid" />
      </TouchableOpacity>
    </Div>
  );
}

function BottomBar({ navigation }: { navigation: any }) {
  return (
    <Div style={[styles.bottomBar, { backgroundColor: staticColors.primary }]} row alignItems="center" justifyContent="space-around">
      <TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center', height:60}} onPress={() => navigation.navigate('Home')}>
        <Icon name="house" size={24} color={staticColors.white} iconStyle="solid" />
      </TouchableOpacity>
    </Div>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 2,
    borderColor: 'transparent',
    fontSize: 18,
    paddingVertical: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: 'transparent',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    zIndex: 10,
    paddingBottom: 0,
  },
  productImageBox: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'transparent',
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
  choiceButtonTouchable: {
    marginBottom: 14,
  },
  choiceButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
});

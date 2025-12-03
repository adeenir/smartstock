import React, { useState, useEffect } from 'react';
import { Alert, Platform, TouchableOpacity, Modal, ScrollView, Image, KeyboardAvoidingView } from 'react-native';
import { Div, Input, Button, Text } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import * as ImagePicker from 'expo-image-picker';
// top logo removed per UX: show back icon instead
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { API_BASE_URL } from '../config/api';
import { CATEGORIES } from '../types/Category';

export default function ProductRegisterScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  // static light-theme colors (provider removed)
  const staticColors = {
    bg: '#FFFFFF',
    text: '#000000',
    primary: '#4B572A',
    white: '#FFFFFF',
    gray500: '#6B7280',
    gray700: '#374151',
    danger: '#E53935',
  };

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoria, setCategoria] = useState('');
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [marca, setMarca] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [imagem, setImagem] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [BarCodeScannerModule, setBarCodeScannerModule] = useState<any | null>(null);
  const [scanned, setScanned] = useState(false);

  const usuarioId = 1; // substitua pelo ID do usuário logado
  const route = useRoute<any>();
  const editingId = route?.params?.productId;
  const isEditing = !!editingId;

  useEffect(() => {
    let mounted = true;
    const loadProduct = async (id: number) => {
      try {
        const res = await fetch(`${API_BASE_URL}/produtos/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setNome(data.nome || '');
        setDescricao(data.descricao || '');
        setPreco(data.preco ? String(data.preco) : '');
        setQuantidade(data.quantidade ? String(data.quantidade) : '');
        setDataValidade(data.dataValidade || '');
        if (data.dataValidade) setDate(new Date(data.dataValidade));
        setCategoria(data.categoria || '');
        setMarca(data.marca || '');
        setCodigoBarras(data.codigoBarras || '');
        if (data.imagens && data.imagens.length > 0) {
          setImagem({ uri: `${API_BASE_URL}${data.imagens[0].caminho}` });
        }
      } catch (err) {
        console.error('Erro ao carregar produto para edição', err);
      }
    };

    if (isEditing) loadProduct(editingId);
    return () => { mounted = false };
  }, [editingId]);

  // Prefill when coming from scanner or external source
  useEffect(() => {
    const prefill = route?.params?.prefill;
    if (!isEditing && prefill) {
      if (prefill.codigoBarras) setCodigoBarras(prefill.codigoBarras);
      if (prefill.nome) setNome(prefill.nome);
      if (prefill.marca) setMarca(prefill.marca);
      if (prefill.categoria) setCategoria(prefill.categoria);
      if (prefill.dataValidade) {
        setDataValidade(prefill.dataValidade);
        setDate(new Date(prefill.dataValidade));
      }
      if (prefill.imagemUrl) {
        // set imagem to a simple uri object so upload uses it
        setImagem({ uri: prefill.imagemUrl });
      }
    }
  }, [route, isEditing]);

  // Função para selecionar imagem
  const selecionarImagem = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
      });

      // Compatibilidade com o shape recente (canceled + assets)
      if (!result.canceled && (result as any).assets && (result as any).assets.length > 0) {
        setImagem((result as any).assets[0]);
        return;
      }

      // Compatibilidade com versões que retornam { cancelled, uri }
      if (!(result as any).canceled && (result as any).uri) {
        setImagem({ uri: (result as any).uri });
      }
    } catch (err) {
      console.error('Erro ao selecionar imagem:', err);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  // Função para tirar foto com a câmera
  const tirarFoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        Alert.alert('Permissão', 'Permissão para usar a câmera negada.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && (result as any).assets && (result as any).assets.length > 0) {
        setImagem((result as any).assets[0]);
        return;
      }

      if (!(result as any).canceled && (result as any).uri) {
        setImagem({ uri: (result as any).uri });
      }
    } catch (err) {
      console.error('Erro ao abrir câmera:', err);
      Alert.alert('Erro', 'Não foi possível acessar a câmera.');
    }
  };

  // Função para enviar produto ao backend
  const handleRegister = async () => {
    // Basic validation
    if (!nome || !nome.trim()) {
      Alert.alert('Validação', 'Informe o nome do produto');
      return;
    }
    if (preco && isNaN(Number(preco))) {
      Alert.alert('Validação', 'Preço inválido');
      return;
    }
    if (quantidade && isNaN(Number(quantidade))) {
      Alert.alert('Validação', 'Quantidade inválida');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('descricao', descricao);
      formData.append('preco', preco);
      formData.append('quantidade', quantidade);
      formData.append('dataValidade', dataValidade);
      formData.append('categoria', categoria);
      formData.append('marca', marca);
      formData.append('codigoBarras', codigoBarras);
      formData.append('usuarioId', usuarioId.toString());

      if (imagem) {
        formData.append('imagem', {
          uri: imagem.uri,
          name: 'produto.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const url = isEditing ? `${API_BASE_URL}/produtos/${editingId}` : `${API_BASE_URL}/produtos`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', isEditing ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
        // Ensure Home refreshes its data: navigate to Home (focus listener will refetch)
        try {
          navigation.navigate('Home');
        } catch (err) {
          navigation.goBack();
        }
      } else {
        Alert.alert('Erro', data.message || 'Erro ao cadastrar produto');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
    }
  };

  // Dynamic import of expo-barcode-scanner when scanner modal is opened
  useEffect(() => {
    let mounted = true;
    if (!showScanner) return;
    (async () => {
      try {
        // If running inside Expo Go, skip importing the native barcode module to avoid native errors.
        try {
          // @ts-ignore
          const Constants = require('expo-constants');
          if (Constants && (Constants as any).appOwnership === 'expo') {
            setBarCodeScannerModule(null);
            setHasPermission(false);
            return;
          }
        } catch (e) {
          // ignore — expo-constants not present
        }

        const mod = await import('expo-barcode-scanner');
        if (!mounted) return;
        if (mod && mod.BarCodeScanner && typeof mod.BarCodeScanner.requestPermissionsAsync === 'function') {
          setBarCodeScannerModule(mod);
          const { status } = await mod.BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        } else {
          setBarCodeScannerModule(null);
          setHasPermission(false);
        }
      } catch (err) {
        console.warn('expo-barcode-scanner not available:', err);
        setBarCodeScannerModule(null);
        setHasPermission(false);
      }
    })();
    return () => { mounted = false; };
  }, [showScanner]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setCodigoBarras(data);
    setShowScanner(false);
    setTimeout(() => setScanned(false), 1000);
  };

  return (
    <Div flex={1} bg={staticColors.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <Div row alignItems="center" mb="lg">
            <TouchableOpacity onPress={() => (navigation as any).goBack()} style={{padding: 6}}>
              <Icon name="arrow-left" size={22} color={staticColors.text} iconStyle="solid" />
            </TouchableOpacity>
            <Text fontSize={24} fontWeight="900" mb="lg" color={staticColors.text} textAlign="left" style={{marginLeft: 8}}>
              {isEditing ? 'Editar Produto' : 'Cadastrar Produto'}
            </Text>
          </Div>

          <Div mb="md">
            <Div row alignItems="center">
              <Icon name="tag" size={22} color={staticColors.gray500} iconStyle="solid" style={{width: 28}} />
              <Input
                placeholder="Nome do produto"
                value={nome}
                onChangeText={setNome}
                mb="sm"
                borderWidth={0}
                borderBottomWidth={1}
                borderBottomColor={staticColors.gray500}
                style={{flex: 1, marginLeft: 8}}
              />
            </Div>

            <Div row alignItems="center">
              <Icon name="file-lines" size={20} color={staticColors.gray500} iconStyle="solid" style={{width: 28}} />
              <Input
                placeholder="Descrição"
                value={descricao}
                onChangeText={setDescricao}
                mb="sm"
                borderWidth={0}
                borderBottomWidth={1}
                borderBottomColor={staticColors.gray500}
                style={{flex: 1, marginLeft: 8}}
              />
            </Div>

            <Div row alignItems="center">
              <Icon name="dollar-sign" size={20} color={staticColors.gray500} iconStyle="solid" style={{width: 28}} />
              <Input
                placeholder="Preço"
                value={preco}
                onChangeText={setPreco}
                mb="sm"
                keyboardType="numeric"
                borderWidth={0}
                borderBottomWidth={1}
                borderBottomColor={staticColors.gray500}
                style={{flex: 1, marginLeft: 8}}
              />
            </Div>

            <Div row alignItems="center">
              <Icon name="boxes-stacked" size={20} color={staticColors.gray500} iconStyle="solid" style={{width: 28}} />
              <Input
                placeholder="Quantidade"
                value={quantidade}
                onChangeText={setQuantidade}
                mb="sm"
                keyboardType="numeric"
                borderWidth={0}
                borderBottomWidth={1}
                borderBottomColor={staticColors.gray500}
                style={{flex: 1, marginLeft: 8}}
              />
            </Div>

            <Div row alignItems="center">
              <Icon name="calendar" size={20} color={staticColors.gray500} style={{width: 28}} />
              {Platform.OS === 'web' ? (
                <Input
                  placeholder="Data de validade (AAAA-MM-DD)"
                  value={dataValidade}
                  onChangeText={setDataValidade}
                  mb="sm"
                  borderWidth={0}
                  borderBottomWidth={1}
                  borderBottomColor={staticColors.gray500}
                  style={{flex: 1, marginLeft: 8}}
                />
              ) : (
                <Div flex={1} style={{marginLeft: 8}}>
                  <Button bg="transparent" onPress={() => setShowDatePicker(true)} alignItems="flex-start" p={0}>
                    <Text mb="sm" color={staticColors.text}>{date ? date.toISOString().slice(0,10) : 'Selecione a data de validade'}</Text>
                  </Button>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date || new Date()}
                      mode="date"
                      display="default"
                      onChange={(e: any, selectedDate?: Date | undefined) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setDate(selectedDate);
                          const iso = selectedDate.toISOString().slice(0,10);
                          setDataValidade(iso);
                        }
                      }}
                    />
                  )}
                </Div>
              )}
            </Div>

            <Div row alignItems="center">
              <Icon name="list" size={20} color={staticColors.gray500} iconStyle="solid" style={{width: 28}} />
              <Div flex={1} style={{marginLeft: 8}}>
                <Button
                  bg="transparent"
                  onPress={() => setShowCategoryList(!showCategoryList)}
                  alignItems="flex-start"
                  p={0}
                >
                  <Text mb="sm" color={categoria ? staticColors.text : staticColors.gray500}>
                    {categoria || 'Categoria'}
                  </Text>
                </Button>
                {showCategoryList && (
                  <Div bg={staticColors.white} rounded={6} shadow="xs" style={{ zIndex: 1000 }}>
                    {CATEGORIES.map((c) => (
                      <TouchableOpacity
                        key={c}
                        onPress={() => {
                          setCategoria(c);
                          setShowCategoryList(false);
                        }}
                        style={{ padding: 10 }}
                      >
                        <Text color={staticColors.text}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </Div>
                )}
              </Div>
            </Div>

            <Div row alignItems="center">
              <Icon name="industry" size={20} color={staticColors.gray500} iconStyle="solid" style={{width: 28}} />
              <Input
                placeholder="Marca"
                value={marca}
                onChangeText={setMarca}
                mb="sm"
                borderWidth={0}
                borderBottomWidth={1}
                borderBottomColor={staticColors.gray500}
                style={{flex: 1, marginLeft: 8}}
              />
            </Div>

            <Div row alignItems="center" mb="sm">
              <Icon name="barcode" size={20} color={staticColors.gray500} iconStyle="solid" style={{width: 28}} />
              <Input
                placeholder="Código de barras"
                value={codigoBarras}
                onChangeText={setCodigoBarras}
                mb="sm"
                borderWidth={0}
                borderBottomWidth={1}
                borderBottomColor={staticColors.gray500}
                style={{flex: 1, marginLeft: 8}}
              />
              <TouchableOpacity onPress={() => setShowScanner(true)} style={{marginLeft: 8}}>
                <Div bg={staticColors.primary} px="md" py="sm" rounded={6}>
                  <Text color={staticColors.white}>Escanear</Text>
                </Div>
              </TouchableOpacity>
            </Div>
          </Div>

          <Modal visible={showScanner} animationType="slide">
            <Div flex={1} bg={staticColors.bg}>
              <Div row alignItems="center" justifyContent="space-between" p="lg">
                <TouchableOpacity onPress={() => setShowScanner(false)} style={{padding: 8}}>
                  <Icon name="arrow-left" size={22} color={staticColors.text} iconStyle="solid" />
                </TouchableOpacity>
                <Text fontWeight="bold" color={staticColors.text}>Escanear código de barras</Text>
                <Div style={{width: 32}} />
              </Div>

              {hasPermission === null && (
                <Div flex={1} justifyContent="center" alignItems="center">
                  <Text>Solicitando permissão de câmera...</Text>
                </Div>
              )}

              {!BarCodeScannerModule && hasPermission !== null && (
                <Div flex={1} justifyContent="center" alignItems="center" p="lg">
                  <Icon name="circle-exclamation" size={48} color={staticColors.primary} iconStyle="solid" />
                  <Text fontWeight="bold" fontSize="lg" mt="md" mb="sm" color={staticColors.text}>Scanner indisponível</Text>
                  <Text color={staticColors.gray700} textAlign="center">O scanner nativo não está presente neste cliente.</Text>
                  <TouchableOpacity onPress={() => setShowScanner(false)} style={{marginTop:16}}>
                    <Div style={{backgroundColor: staticColors.primary, padding: 10, borderRadius: 8}}>
                      <Text color={staticColors.white}>Fechar</Text>
                    </Div>
                  </TouchableOpacity>
                </Div>
              )}

              {BarCodeScannerModule && (
                <BarCodeScannerModule.BarCodeScanner
                  onBarCodeScanned={handleBarCodeScanned}
                  style={{ flex: 1 }}
                />
              )}
            </Div>
          </Modal>

          {/* Image preview + actions */}
          {imagem && imagem.uri ? (
            <Div mb="md" alignItems="flex-start">
              <Image source={{ uri: imagem.uri }} style={{ width: 120, height: 120, borderRadius: 8, marginBottom: 8 }} />
            </Div>
          ) : null}

          <Div row mb="md" justifyContent="space-between">
            <Button flex={1} mr="sm" bg={staticColors.primary} py="sm" rounded={8} onPress={selecionarImagem}>
              <Text color={staticColors.white} fontWeight="bold" fontSize={14}>
                Galeria
              </Text>
            </Button>
            <Button flex={1} ml="sm" bg={staticColors.primary} py="sm" rounded={8} onPress={tirarFoto}>
              <Text color={staticColors.white} fontWeight="bold" fontSize={14}>
                Câmera
              </Text>
            </Button>
          </Div>

          <Button block bg={staticColors.primary} py="lg" rounded={8} onPress={handleRegister}>
            <Text color={staticColors.white} fontWeight="bold" fontSize={15}>
              {isEditing ? 'Atualizar Produto' : 'Cadastrar Produto'}
            </Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </Div>
  );
}

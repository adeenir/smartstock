import React, { useState, useEffect } from 'react';
import { Alert, Platform, TouchableOpacity } from 'react-native';
import { Div, Input, Button, Text } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import * as ImagePicker from 'expo-image-picker';
// top logo removed per UX: show back icon instead
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../config/api';
import { CATEGORIES } from '../types/Category';

export default function ProductRegisterScreen() {
  const navigation = useNavigation();

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
        navigation.goBack();
      } else {
        Alert.alert('Erro', data.message || 'Erro ao cadastrar produto');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
    }
  };

  return (
    <Div flex={1} bg="white" p="lg">
      <Div row alignItems="center" mb="lg">
        <TouchableOpacity onPress={() => (navigation as any).goBack()} style={{padding: 6}}>
          <Icon name="arrow-left" size={22} color="#222" iconStyle="solid" />
        </TouchableOpacity>
        <Text fontSize="6xl" fontWeight="900" mb="lg" color="gray900" textAlign="left" style={{marginLeft: 8}}>
          {isEditing ? 'Editar Produto' : 'Cadastrar Produto'}
        </Text>
      </Div>

      <Div row alignItems="center" mb="md">
        <Icon name="tag" size={25} color="gray400" iconStyle="solid" />
        <Input
          placeholder="Nome do produto"
          value={nome}
          onChangeText={setNome}
          mb="md"
          borderWidth={0}
          borderBottomWidth={2}
          borderBottomColor="gray400"
        />
      </Div>

      <Div row alignItems="center" mb="md">
        <Icon name="file-lines" size={25} color="gray400" />
        <Input
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          mb="md"
          borderWidth={0}
          borderBottomWidth={2}
          borderBottomColor="gray400"
        />
      </Div>

      <Div row alignItems="center" mb="md">
        <Icon name="dollar-sign" size={25} color="gray400" iconStyle="solid" />
        <Input
          placeholder="Preço"
          value={preco}
          onChangeText={setPreco}
          mb="md"
          keyboardType="numeric"
          borderWidth={0}
          borderBottomWidth={2}
          borderBottomColor="gray400"
        />
      </Div>

      <Div row alignItems="center" mb="md">
        <Icon name="boxes-stacked" size={25} color="gray400"  iconStyle="solid" />
        <Input
          placeholder="Quantidade"
          value={quantidade}
          onChangeText={setQuantidade}
          mb="md"
          keyboardType="numeric"
          borderWidth={0}
          borderBottomWidth={2}
          borderBottomColor="gray400"
        />
      </Div>

      <Div row alignItems="center" mb="md">
        <Icon name="calendar" size={25} color="gray400" />
        {Platform.OS === 'web' ? (
          <Input
            placeholder="Data de validade (AAAA-MM-DD)"
            value={dataValidade}
            onChangeText={setDataValidade}
            mb="md"
            borderWidth={0}
            borderBottomWidth={2}
            borderBottomColor="gray400"
          />
        ) : (
          <Div flex={1}>
            <Button bg="transparent" onPress={() => setShowDatePicker(true)}>
              <Text mb="md">{date ? date.toISOString().slice(0,10) : 'Selecione a data de validade'}</Text>
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

      <Div row alignItems="center" mb="md">
        <Icon name="list" size={25} color="gray400" iconStyle="solid" />
        <Div flex={1}>
          <Button
            bg="transparent"
            onPress={() => setShowCategoryList(!showCategoryList)}
            alignItems="flex-start"
            p={0}
          >
            <Text mb="md" color={categoria ? 'gray900' : 'gray400'}>
              {categoria || 'Categoria'}
            </Text>
          </Button>
          {showCategoryList && (
            <Div bg="white" rounded={6} shadow="xs" style={{ zIndex: 1000 }}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => {
                    setCategoria(c);
                    setShowCategoryList(false);
                  }}
                  style={{ padding: 10 }}
                >
                  <Text>{c}</Text>
                </TouchableOpacity>
              ))}
            </Div>
          )}
        </Div>
      </Div>

      <Div row alignItems="center" mb="md">
        <Icon name="industry" size={25} color="gray400" iconStyle="solid" />
        <Input
          placeholder="Marca"
          value={marca}
          onChangeText={setMarca}
          mb="md"
          borderWidth={0}
          borderBottomWidth={2}
          borderBottomColor="gray400"
        />
      </Div>

      <Div row alignItems="center" mb="md">
        <Icon name="barcode" size={25} color="gray400" iconStyle="solid" />
        <Input
          placeholder="Código de barras"
          value={codigoBarras}
          onChangeText={setCodigoBarras}
          mb="md"
          borderWidth={0}
          borderBottomWidth={2}
          borderBottomColor="gray400"
        />
      </Div>

      <Div row mb="md" justifyContent="space-between">
        <Button flex={1} mr="sm" bg="#314401" py="lg" rounded="circle" onPress={selecionarImagem}>
          <Text color="white" fontWeight="bold" fontSize={15}>
            Galeria
          </Text>
        </Button>
        <Button flex={1} ml="sm" bg="#314401" py="lg" rounded="circle" onPress={tirarFoto}>
          <Text color="white" fontWeight="bold" fontSize={15}>
            Câmera
          </Text>
        </Button>
      </Div>

      <Button block bg="#314401" py="lg" rounded="circle" onPress={handleRegister}>
        <Text color="white" fontWeight="bold" fontSize={15}>
          {isEditing ? 'Atualizar Produto' : 'Cadastrar Produto'}
        </Text>
      </Button>
    </Div>
  );
}

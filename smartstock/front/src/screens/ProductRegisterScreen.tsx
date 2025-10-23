import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Div, Input, Button, Text } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function ProductRegisterScreen() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [imagem, setImagem] = useState<any>(null);

  const usuarioId = 1; // substitua pelo ID do usuário logado

  // Função para selecionar imagem
  const selecionarImagem = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setImagem(result.assets[0]);
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

      const response = await fetch('http://10.0.2.2:3000/produtos', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
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
      <Text fontSize="6xl" fontWeight="900" mb="lg" color="gray900">
        Cadastrar Produto
      </Text>

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
        <Input
          placeholder="Data de validade (AAAA-MM-DD)"
          value={dataValidade}
          onChangeText={setDataValidade}
          mb="md"
          borderWidth={0}
          borderBottomWidth={2}
          borderBottomColor="gray400"
        />
      </Div>

      <Div row alignItems="center" mb="md">
        <Icon name="list" size={25} color="gray400" iconStyle="solid" />
        <Input
          placeholder="Categoria"
          value={categoria}
          onChangeText={setCategoria}
          mb="md"
          borderWidth={0}
          borderBottomWidth={2}
          borderBottomColor="gray400"
        />
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

      <Button block bg="#314401" py="lg" rounded="circle" onPress={selecionarImagem} mb="md">
        <Text color="white" fontWeight="bold" fontSize={15}>
          Selecionar Imagem
        </Text>
      </Button>

      <Button block bg="#314401" py="lg" rounded="circle" onPress={handleRegister}>
        <Text color="white" fontWeight="bold" fontSize={15}>
          Cadastrar Produto
        </Text>
      </Button>
    </Div>
  );
}

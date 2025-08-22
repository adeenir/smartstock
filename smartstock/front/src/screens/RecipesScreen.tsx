import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';

const recipes = [
  {
    id: 1,
    name: 'Caixa de leite',
    expiry: '20/06/25',
    icon: 'box',
  },
  {
    id: 2,
    name: 'Leite condensado',
    expiry: '20/06/25',
    icon: 'box',
  },
  {
    id: 3,
    name: 'Ovos',
    expiry: '22/06/25',
    icon: 'egg',
  },
];

const shortRecipes = [
  {
    id: 1,
    title: 'Pudim de Leite Condensado',
    icon: 'utensils',
    ingredients: [
      '6 colheres de sopa de açúcar',
      '1 lata de leite condensado',
      '2 latas de leite',
      '3 ovos',
    ],
    steps: [
      'Coloque o açúcar na forma de pudim, leve ao fogo médio até virar caramelo e espalhe bem. Reserve.',
      'Bata no liquidificador o leite condensado, o leite e os ovos até misturar bem.',
      'Despeje a mistura na forma caramelizada.',
      'Asse em banho-maria, forno médio (180°C), por cerca de 1h30.',
      'Espere esfriar e desenforme.',
    ],
  },
  {
    id: 2,
    title: 'Omelete Rápida',
    icon: 'egg',
    ingredients: [
      '2 ovos',
      '1 colher de sopa de leite',
      'Sal a gosto',
    ],
    steps: [
      'Bata os ovos com o leite e o sal.',
      'Despeje em uma frigideira antiaderente aquecida.',
      'Cozinhe até firmar, dobre ao meio e sirva.',
    ],
  },
];

export default function RecipesScreen() {
  const navigation = useNavigation<any>();
  return (
    <Div flex={1} bg="white">
      {/* Cabeçalho */}
      <Div row alignItems="center" justifyContent="space-between" p="lg" bg="white">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 8, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name="arrow-left" size={22} color="#222" iconStyle="solid" />
        </TouchableOpacity>
        <Text fontWeight="bold" fontSize="xl">SMART STOCK</Text>
        <TouchableOpacity style={{padding: 8, justifyContent: 'center', alignItems: 'center', height: 40, width: 40}}>
          <Icon name="magnifying-glass" size={20} color="#222" iconStyle="solid" />
        </TouchableOpacity>
      </Div>
      <ScrollView style={{ backgroundColor: '#fff', flex: 1 }} contentContainerStyle={{paddingBottom: 100}}>
        {/* Ingredientes/Produtos próximos ao vencimento */}
        <Div px={16} pt={16}>
          <Text fontWeight="bold" fontSize={16} mb={8}>MENU DE RECEITAS</Text>
          <Div row justifyContent="space-between" alignItems="center" mb={8}>
            <Text color="gray700" fontSize={12}>Produtos próximos ao vencimento</Text>
          </Div>
          {recipes.map((item) => (
            <Div
              key={item.id}
              row
              alignItems="center"
              bg="white"
              rounded={12}
              shadow="sm"
              mb={8}
              px={12}
              py={8}
              borderWidth={1}
              borderColor="#e0e0e0"
            >
              <Div mr={12} bg="#f2f2f2" rounded={16} p={8} style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name={item.icon as any} size={28} color="#A6B48A" iconStyle="solid" />
              </Div>
              <Div flex={1}>
                <Text fontWeight="bold" fontSize={14}>{item.name}</Text>
                <Text color="gray700" fontSize={11}>Data de validade: {item.expiry}</Text>
              </Div>
            </Div>
          ))}
        </Div>

        {/* Receitas sugeridas */}
        <Div px={16} mt={8}>
          <Text fontWeight="bold" fontSize={16} mb={8}>RECEITAS SUGERIDAS</Text>
          <Div bg="#4d5a1f" rounded={18} p={16}>
            {shortRecipes.map((recipe, idx) => (
              <Div key={recipe.id} mb={idx === shortRecipes.length - 1 ? 0 : 20}>
                <Div row alignItems="center" mb={8}>
                  <Div bg="white" rounded={16} p={8} mr={10} style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name={recipe.icon as any} size={28} color="#A6B48A" iconStyle="solid" />
                  </Div>
                  <Text color="white" fontWeight="bold" fontSize={15}>{recipe.title}</Text>
                </Div>
                <Div bg="white" rounded={12} p={12} mb={8}>
                  <Text fontWeight="bold" fontSize={13} mb={4} color="black">Ingredientes</Text>
                  {recipe.ingredients.map((ing, i) => (
                    <Text key={i} fontSize={12} color="black">- {ing}</Text>
                  ))}
                </Div>
                <Div bg="white" rounded={12} p={12}>
                  <Text fontWeight="bold" fontSize={13} mb={4} color="black">Modo de preparo</Text>
                  {recipe.steps.map((step, i) => (
                    <Text key={i} fontSize={12} color="black">{i + 1}. {step}</Text>
                  ))}
                </Div>
              </Div>
            ))}
          </Div>
        </Div>
      </ScrollView>
      <BottomNavBar />
    </Div>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeImage: {
    width: 120,
    height: 80,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
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
});

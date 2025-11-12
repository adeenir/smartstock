import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config/api';
import { CATEGORIES } from '../types/Category';

type Product = {
  id: number;
  nome: string;
  categoria?: string;
};

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/produtos`);
        const data = await res.json();
        if (mounted) setProducts(data);
      } catch (err) {
        console.error('Failed loading products for dashboard', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  // Aggregate counts by category
  const counts: Record<string, number> = {};
  CATEGORIES.forEach(c => counts[c] = 0);
  products.forEach(p => {
    const c = p.categoria || 'Outros';
    if (!counts[c]) counts[c] = 0;
    counts[c]++;
  });

  return (
    <Div flex={1} bg="white">
      <Div p="lg" row alignItems="center" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">Dashboard</Text>
        <Text color="gray700">Resumo por categoria</Text>
      </Div>

      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {loading ? (
          <Div p="lg"><Text>Carregando...</Text></Div>
        ) : (
          CATEGORIES.map((c) => (
            <TouchableOpacity key={c} onPress={() => navigation.navigate('Stock', { category: c })}>
              <Div row alignItems="center" bg="white" rounded={8} p="md" m="sm" shadow="xs">
                <Div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="layer-group" size={20} color="#314401" iconStyle="solid" />
                </Div>
                <Div flex={1} ml={12}>
                  <Text fontWeight="bold">{c}</Text>
                  <Text color="gray700">{counts[c] || 0} produtos</Text>
                </Div>
                <Div>
                  <Text color="gray500">Ver</Text>
                </Div>
              </Div>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </Div>
  );
}

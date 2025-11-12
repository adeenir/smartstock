import React, {useEffect, useState, useCallback, useRef} from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Div, Text } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';
import { API_BASE_URL } from '../config/api';

type Product = {
  id: number;
  nome: string; // backend field
  quantidade: number; // backend field
  dataValidade?: string; // backend field
  imagens?: Array<{ id: number; caminho: string }>;
};

export default function StockScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mountedRef = useRef(true);

  // small fetch timeout helper so requests that never respond will fail fast
  const fetchWithTimeout = async (url: string, opts: any = {}, timeout = 10000) => {
    return Promise.race([
      fetch(url, opts),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
    ] as any);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    const url = `${API_BASE_URL}/produtos`;
    console.log('[StockScreen] fetching products from', url);
    try {
      const res = await fetchWithTimeout(url, {}, 10000);
      if (!res.ok) throw new Error(`Network response not ok: ${res.status}`);
      const data = await res.json();
      const categoryFilter = route?.params?.category;
      const final = categoryFilter ? data.filter((p: any) => (p.categoria || 'Outros') === categoryFilter) : data;
      console.log('[StockScreen] fetched products count:', Array.isArray(final) ? final.length : 'not-array');
      if (mountedRef.current) setProducts(final);
    } catch (err: any) {
      console.error('[StockScreen] Failed to load products', err);
      if (mountedRef.current) setErrorMessage(err.message || 'Erro ao carregar produtos');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [route?.params?.category]);

  useEffect(() => {
    mountedRef.current = true;
    fetchProducts();
    return () => { mountedRef.current = false };
  }, [fetchProducts]);

  return (
    <Div flex={1} bg="white">
      <Div row alignItems="center" justifyContent="space-between" p="lg" bg="white">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 8}} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="arrow-left" size={22} color="#222" iconStyle="solid" />
        </TouchableOpacity>
        <Div alignItems="center" style={{flex: 1}}>
          <Text fontWeight="bold" fontSize="xl">SMART STOCK</Text>
          <Text fontSize="md" color="gray700">Produtos em estoque</Text>
        </Div>
        <Div style={{width: 40}} />
      </Div>

      <ScrollView style={{flex: 1, backgroundColor: '#F7F7F7'}} contentContainerStyle={{paddingBottom: 80}}>
        {loading ? (
          <Div p="lg"><Text>Carregando...</Text></Div>
        ) : errorMessage ? (
          <Div p="lg">
            <Text color="red">Erro: {errorMessage}</Text>
            <TouchableOpacity onPress={() => fetchProducts()} style={{marginTop: 12, padding: 8, backgroundColor: '#314401', borderRadius: 6}}>
              <Text color="#fff">Tentar novamente</Text>
            </TouchableOpacity>
          </Div>
        ) : products.length === 0 ? (
          <Div p="lg"><Text>Nenhum produto encontrado.</Text></Div>
        ) : (
          products.map((item) => {
            const imageUrl = item.imagens && item.imagens.length > 0 ? `${API_BASE_URL}${item.imagens[0].caminho}` : null;
            return (
              <Div key={item.id} row alignItems="center" bg="white" rounded={10} p="md" m="md" shadow="sm" style={{elevation: 2}}>
                {imageUrl ? (
                  // show image thumbnail using cross-platform Image
                  <Div style={styles.imageBox}>
                    <Image source={{ uri: imageUrl }} style={{ width: 56, height: 56, borderRadius: 8 }} />
                  </Div>
                ) : (
                  <Div style={styles.iconBox}>
                    <Icon name="box" size={32} color="#A6B48A" iconStyle="solid" />
                  </Div>
                )}
                <Div flex={1} ml={12}>
                  <Text fontWeight="bold" color="#222">{item.nome}</Text>
                  <Text color="#222">Quantidade: {item.quantidade}</Text>
                  {item.dataValidade && <Text color="#222" fontSize="xs">Data de validade: {item.dataValidade}</Text>}
                </Div>
                <Div row>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('ProductRegister', { productId: item.id })}
                  >
                    <Icon name="pen" size={14} color="#fff" iconStyle="solid" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#ff3b3b', marginLeft: 8 }]}
                    onPress={async () => {
                      try {
                        const res = await fetch(`${API_BASE_URL}/produtos/${item.id}`, { method: 'DELETE' });
                        if (!res.ok) throw new Error('Failed to delete');
                        // remove from state
                        setProducts(prev => prev.filter(p => p.id !== item.id));
                      } catch (err) {
                        console.error('Delete failed', err);
                        alert('Erro ao excluir produto');
                      }
                    }}
                  >
                    <Icon name="trash" size={14} color="#fff" iconStyle="solid" />
                  </TouchableOpacity>
                </Div>
              </Div>
            );
          })
        )}
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
  imageBox: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
  },
  removeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 8,
  },
  actionButton: {
    width: 36,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#314401',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

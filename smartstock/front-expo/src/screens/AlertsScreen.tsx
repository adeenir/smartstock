import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';
import { API_BASE_URL } from '../config/api';

type AlertItem = {
  id: number;
  name: string;
  quantity: number;
  expiry?: string; // formatted string for display
  expiryTs?: number; // timestamp for sorting/calculation
  expired: boolean;
  icon?: string;
  categoria?: string;
};

export default function AlertsScreen() {
  const navigation = useNavigation<any>();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expiredCount, setExpiredCount] = useState(0);
  const [nearExpiryCount, setNearExpiryCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/produtos`);
        const data = await res.json();

        const today = new Date();
        const nearDays = 2; // threshold for "near expiry" (days) — changed to 2 as requested

        const iconMap: Record<string, string> = {
          Alimentos: 'apple-whole',
          Bebidas: 'wine-bottle',
          Limpeza: 'spray-can',
          Higiene: 'pump-soap',
          Frios: 'cheese',
          Congelados: 'snowflake',
          Hortifruti: 'carrot',
          Outros: 'box',
        };

        const generated: AlertItem[] = (data || [])
          .filter((p: any) => p.dataValidade) // only products with expiry
          .map((p: any) => {
            // parse YYYY-MM-DD safely
            const parts = String(p.dataValidade).split('-');
            const expiryDate = parts.length >= 3 ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])) : new Date(p.dataValidade);
            const expiryTs = expiryDate.getTime();
            const todayStartTs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
            const diffMs = expiryTs - todayStartTs;
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            const expired = diffDays < 0;
            const expiryDisplay = expiryDate.toLocaleDateString();
            const categoria = p.categoria || 'Outros';
            return {
              id: p.id,
              name: p.nome || p.name || 'Produto',
              quantity: (p.quantidade || p.quantidade === 0) ? p.quantidade : (p.quantia || 1),
              expiry: expiryDisplay,
              expiryTs,
              expired,
              icon: iconMap[categoria] || 'box',
              categoria,
            } as AlertItem;
          })
          .sort((a: any, b: any) => { // soonest first using timestamp
            const ta = a.expiryTs || 0;
            const tb = b.expiryTs || 0;
            return ta - tb;
          });

        let eCount = 0;
        let nCount = 0;
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        generated.forEach(item => {
          const ed = item.expiryTs || 0;
          const days = Math.ceil((ed - todayStart) / (1000 * 60 * 60 * 24));
          if (isNaN(days)) return;
          if (days < 0) eCount++;
          else if (days <= nearDays) nCount++;
        });

        if (mounted) {
          setAlerts(generated);
          setExpiredCount(eCount);
          setNearExpiryCount(nCount);
        }
      } catch (err) {
        console.error('Failed loading alerts', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  return (
    <Div flex={1} bg="white">
      <Div row alignItems="center" justifyContent="space-between" p="lg" bg="white">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 8, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name="arrow-left" size={22} color="#222" iconStyle="solid" />
        </TouchableOpacity>
        <Text fontWeight="bold" fontSize="xl">SMART STOCK</Text>
        <TouchableOpacity style={{padding: 8, justifyContent: 'center', alignItems: 'center', height: 40, width: 40}}>
          <Icon name="magnifying-glass" size={20} color="#222" iconStyle="solid" />
        </TouchableOpacity>
      </Div>
      <Text fontWeight="bold" fontSize="md" ml="lg" mt="md" mb="md">ALERTAS DE VENCIMENTOS</Text>
      <ScrollView style={{flex: 1, backgroundColor: '#F7F7F7'}} contentContainerStyle={{paddingBottom: 80}}>
        {loading ? (
          <Div p="lg"><Text>Carregando...</Text></Div>
        ) : alerts.length === 0 ? (
          <Div p="lg"><Text>Nenhum alerta de vencimento encontrado.</Text></Div>
        ) : (
          alerts.map((item) => (
            <Div key={item.id} row alignItems="center" bg="white" rounded={10} p="md" m="md" shadow="sm" style={{elevation: 2, borderColor: item.expired ? '#E53935' : '#A6B48A', borderWidth: 2}}>
              <Div style={styles.iconBox}>
                <Icon name={'box' as any} size={32} color="#A6B48A" iconStyle="solid" />
              </Div>
              <Div flex={1} ml={12}>
                <Text fontWeight="bold" color="#222">{item.name}</Text>
                <Text color="#222">Quantidade: {item.quantity}</Text>
                <Text color={item.expired ? '#E53935' : '#222'} fontSize="xs">Data de validade: {item.expiry}</Text>
              </Div>
              {item.expired && (
                <Icon name="triangle-exclamation" size={24} color="#E53935" iconStyle="solid" style={{marginLeft: 8}} />
              )}
            </Div>
          ))
        )}

        <Div m="lg" mt="xl" p="md" bg="white" rounded={10} alignItems="center">
          <Text color={expiredCount > 0 ? '#E53935' : '#222'} fontWeight="bold" fontSize="md" mb={8} style={{textAlign:'center'}}>
            {expiredCount > 0 ? `Você tem ${expiredCount} produto${expiredCount > 1 ? 's' : ''} vencido${expiredCount > 1 ? 's' : ''} em seu estoque.` : 'Sem produtos vencidos.'}
          </Text>
          <Text color={nearExpiryCount > 0 ? '#fff200' : '#222'} fontSize="sm" mb={8} style={{textAlign:'center'}}>
            {nearExpiryCount > 0 ? `${nearExpiryCount} produto${nearExpiryCount > 1 ? 's' : ''} próximo${nearExpiryCount > 1 ? 's' : ''} do vencimento.` : 'Nenhum produto próximo do vencimento.'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Recipes')}>
            <Text color="#38410B" fontWeight="bold" style={{textDecorationLine:'underline'}}>Acesse seu menu de receitas</Text>
          </TouchableOpacity>
        </Div>
      </ScrollView>
      <BottomNavBar />
    </Div>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});

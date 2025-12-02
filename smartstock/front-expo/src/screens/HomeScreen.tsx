import React, {useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
} from 'react-native';
import {Div, Text, Button} from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import SideMenu from '../components/SideMenu';
import { API_BASE_URL } from '../config/api';
import { CATEGORIES } from '../types/Category';
import {useAuth} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

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

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const {user} = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [categories, setCategories] = useState<Array<{ name: string; count: number; icon: string; color: string }>>([]);
  const [totalInStock, setTotalInStock] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [nearExpiryCount, setNearExpiryCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const menuAnim = useRef(new Animated.Value(-screenWidth)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnim, {
      toValue: -screenWidth,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuVisible(false));
  };

  // Load categories counts from backend and refresh on focus
  React.useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/produtos`);
        const data = await res.json();
        // Debug: log counts to help track unexpected totals
        try {
          console.debug('HomeScreen: fetched produtos count=', Array.isArray(data) ? data.length : 'not-array');
          if (Array.isArray(data)) {
            const qtys = data.map((p: any) => ({ id: p.id, nome: p.nome, quantidade: p.quantidade }));
            console.debug('HomeScreen: product quantities sample=', qtys.slice(0, 20));
          }
        } catch (e) {
          console.warn('HomeScreen debug log failed', e);
        }
        const counts: Record<string, number> = {};
        CATEGORIES.forEach(c => (counts[c] = 0));
        // compute category counts and dashboard stats
        let total = 0;
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const nearDays = 2;
        let near = 0;
        let expired = 0;

        data.forEach((p: any) => {
          const c = p.categoria || 'Outros';
          counts[c] = (counts[c] || 0) + 1;
          const qtd = Number(p.quantidade || p.quantia || 1) || 0;
          total += qtd;
          if (p.dataValidade) {
            const parts = String(p.dataValidade).split('-');
            const expiryDate = parts.length >= 3 ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])) : new Date(p.dataValidade);
            const ed = expiryDate.getTime();
            const days = Math.ceil((ed - todayStart) / (1000 * 60 * 60 * 24));
            if (!isNaN(days)) {
              if (days < 0) expired++;
              else if (days <= nearDays) near++;
            }
          }
        });

        if (mounted) {
          setCategories(CATEGORIES.map(c => ({ name: c, count: counts[c] || 0, icon: iconMap[c] || 'box', color: '#314401' })));
          setTotalInStock(total);
          setTotalProducts(Array.isArray(data) ? data.length : 0);
          setNearExpiryCount(near);
          setExpiredCount(expired);
        }
      } catch (err) {
        console.error('Erro ao carregar categorias', err);
      }
    };

    // initial fetch
    fetchProducts();

    // refresh when screen gains focus (e.g. after creating a product and going back)
    const unsub = navigation.addListener('focus', () => {
      fetchProducts();
    });

    return () => {
      mounted = false;
      if (unsub && typeof unsub === 'function') unsub();
    };
  }, [navigation]);

  return (
    <Div flex={1} bg="white">
      {menuVisible && (
        <Div style={StyleSheet.absoluteFill} bg="rgba(0,0,0,0.3)">
          <Animated.View
            style={{
              width: 250,
              height: '100%',
              backgroundColor: 'white',
              position: 'absolute',
              left: 0,
              top: 0,
              transform: [{translateX: menuAnim}],
              zIndex: 99,
            }}>
            <SideMenu
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              inputRef={searchInputRef}
            />
          </Animated.View>
          <TouchableOpacity onPress={closeMenu} style={{flex: 1}} />
        </Div>
      )}
      <Div row justifyContent="space-between" alignItems="center" p="lg">
        <TouchableOpacity onPress={openMenu} style={{padding: 8}}>
          <Icon name="bars" size={20} color="#222" iconStyle="solid" />
        </TouchableOpacity>
        <Text fontWeight="bold" fontSize="xl">
          SMART STOCK
        </Text>
        <TouchableOpacity
          style={{
            padding: 8,
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            width: 40,
          }}
          onPress={() => {
            openMenu();
            setTimeout(() => {
              searchInputRef.current?.focus();
            }, 350);
          }}>
          <Icon
            name="magnifying-glass"
            size={20}
            color="#222"
            iconStyle="solid"
          />
        </TouchableOpacity>
      </Div>
      <Div p="lg">
          <Text fontSize="2xl" fontWeight="bold" color="#222" mb="xs">
            Olá, {user?.name || user?.nome || 'Usuário'}!
          </Text>
        <Text fontSize="md" color="gray600" mb="40">
          Navegue através do menu lateral.
        </Text>
        <Button
          block
          bg="#4B572A"
          h={45}
          mb="10"
          rounded={30}
          prefix={
            <Icon
              name="chart-line"
              size={18}
              color="white"
              iconStyle="solid"
              style={{marginRight: 8}}
            />
          }
          onPress={() => setDashboardVisible(true)}>
          <Text color="white" fontWeight="bold">
            DASHBOARD
          </Text>
        </Button>
        <Div
          bg="#E0E0E0"
          rounded={20}
          p="lg"
          style={{width: '100%', maxWidth: 450}}>
          <Text fontWeight="bold" fontSize="lg" mb="md" color="#222">
            Categorias
          </Text>
          {categories.map((cat, idx) => (
            <Div
              key={cat.name}
              row
              alignItems="center"
              mb={idx < categories.length - 1 ? 'md' : 0}>
              <Icon
                name={cat.icon as any}
                size={18}
                color={cat.color}
                iconStyle="solid"
                style={{marginRight: 8}}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Stock', { category: cat.name })}>
                <Text color="#222" fontSize="lg">
                  {cat.name} ({cat.count})
                </Text>
              </TouchableOpacity>
            </Div>
          ))}
        </Div>
      </Div>
      <Modal
        visible={dashboardVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDashboardVisible(false)}>
        <Div
          flex={1}
          justifyContent="flex-end"
          alignItems="center"
          bg="rgba(0,0,0,0.6)">
          <Div
            bg="#222"
            rounded={20}
            w="90%"
            minH={220}
            mb={32}
            p="xl"
            justifyContent="center"
            style={{position: 'relative'}}>
            <TouchableOpacity
              style={{position: 'absolute', top: 12, right: 12, zIndex: 2}}
              onPress={() => setDashboardVisible(false)}>
              <Icon name="xmark" size={22} color="#fff" iconStyle="solid" />
            </TouchableOpacity>
            <Div mb={18}>
              <Text color="green" fontWeight="bold" fontSize="lg">
                EM ESTOQUE
              </Text>
              <Text color="green" fontSize="sm">
                Produtos cadastrados: {totalProducts}
              </Text>
              <Text color="green" fontSize="sm">
                Unidades em estoque: {totalInStock}
              </Text>
              <Div row alignItems="center" mt={4}>
                <Div bg="green" h={32} w={4} rounded={8} mr={8} />
              </Div>
            </Div>
            <Div mb={18}>
              <Text color="#fff200" fontWeight="bold" fontSize="lg">
                PERTO DE VENCER
              </Text>
              <Text color="#fff200" fontSize="sm">
                {nearExpiryCount} item{nearExpiryCount !== 1 ? 's' : ''} próximo{nearExpiryCount !== 1 ? 's' : ''} do vencimento
              </Text>
              <Div row alignItems="center" mt={4}>
                <Div bg="#fff200" h={32} w={4} rounded={8} mr={8} />
              </Div>
            </Div>
            <Div>
              <Text color="#ff3b3b" fontWeight="bold" fontSize="lg">
                VENCIDOS
              </Text>
              <Text color="#ff3b3b" fontSize="sm">
                {expiredCount} produto{expiredCount !== 1 ? 's' : ''} est{expiredCount !== 1 ? 'ão' : 'á'} vencido{expiredCount !== 1 ? 's' : ''}
              </Text>
              <Div row alignItems="center" mt={4}>
                <Div bg="#ff3b3b" h={32} w={4} rounded={8} mr={8} />
              </Div>
            </Div>
          </Div>
        </Div>
      </Modal>
      <Div style={styles.spacer} />
      <Div
        style={styles.bottomBar}
        row
        alignItems="center"
        justifyContent="space-around">
        <Button
          bg="transparent"
          flex={1}
          alignItems="center"
          onPress={() => navigation.navigate('Home')}>
          <Icon name="house" size={24} color="white" iconStyle="solid" />
        </Button>
        <Button
          bg="transparent"
          flex={1}
          alignItems="center"
          onPress={() => navigation.navigate('ProductRegister')}>
          <Icon name="camera" size={24} color="white" iconStyle="solid" />
        </Button>
        <Button
          bg="transparent"
          flex={1}
          alignItems="center"
          onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell" size={24} color="white" iconStyle="solid" />
        </Button>
      </Div>
    </Div>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
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
  spacer: {
    flex: 1,
  },
});

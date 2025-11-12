import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';

// Replace this with an import from your central config if you have one in front-expo
const API_BASE_URL = 'http://192.168.0.101:3000';

function mapNotif(n: any) {
  return {
    id: n.id,
    title: n.titulo || 'Notificação',
    description: n.mensagem || '',
    date: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '',
    time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : '',
    unread: !n.lida,
    produto: n.produto || null,
  };
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Array<any>>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [clicked, setClicked] = useState<{ [id: number]: boolean }>({});
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/notificacoes`);
      const data = await res.json();
      setNotifications(data.map(mapNotif));
    } catch (err) {
      console.error('Erro ao buscar notificações', err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/notificacoes/${id}/mark-read`, { method: 'PUT' });
    } catch (err) {
      console.error('Erro ao marcar notificação como lida', err);
    }
  };

  const markAllAsRead = () => {
    notifications.forEach(async (n) => {
      if (n.unread) await markAsRead(n.id);
    });
    setClicked(Object.fromEntries(notifications.map(n => [n.id, true])));
    setModalVisible(false);
  };

  const handleNotificationClick = (id: number) => {
    setClicked(prev => ({ ...prev, [id]: !prev[id] }));
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    markAsRead(id);
  };

  const handleGoBack = () => navigation.navigate('Home');

  return (
    <Div flex={1} bg="white">
      <Div row alignItems="center" justifyContent="space-between" p="lg" bg="white">
        <TouchableOpacity onPress={handleGoBack} style={{ padding: 8, justifyContent: 'center', alignItems: 'center' }}>
          <Icon name="arrow-left" size={22} color="#222" iconStyle="solid" />
        </TouchableOpacity>
        <Div alignItems="center" style={{ flex: 1 }}>
          <Text fontWeight="bold" fontSize="xl">SMART STOCK</Text>
          <Text fontSize="md" color="gray700">Notificações</Text>
        </Div>
        <TouchableOpacity style={{ padding: 8, justifyContent: 'center', alignItems: 'center' }} onPress={() => setShowMenu(true)}>
          <Icon name="ellipsis-vertical" size={22} color="#222" iconStyle="solid" />
        </TouchableOpacity>
      </Div>

      <Div bg="#E0E0E0" h={32} justifyContent="center" pl="lg">
        <Text color="#222" fontWeight="bold">Hoje</Text>
      </Div>

      <Div style={{ flex: 1 }}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.8} onPress={() => handleNotificationClick(item.id)}>
              <Div row alignItems="center" bg={item.unread ? 'white' : 'white'} p="md" borderBottomWidth={1} borderBottomColor="#E0E0E0">
                <Icon name={item.unread ? 'circle-check' : 'circle'} size={28} color={clicked[item.id] ? '#A6B48A' : '#4B572A'} iconStyle="solid" style={{ marginRight: 16, alignSelf: 'center' }} />
                <Div flex={1} justifyContent="center">
                  <Text fontWeight="bold" color={item.unread ? '#4B572A' : '#222'} style={item.unread ? { textDecorationLine: 'underline' } : {}}>{item.title}</Text>
                  <Text color="#222" fontSize="sm">{item.description}</Text>
                  <Text color="gray700" fontSize="xs" mt={2}>{item.time}</Text>
                </Div>
              </Div>
            </TouchableOpacity>
          )}
        />
      </Div>

      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <Div flex={1} justifyContent="flex-end" alignItems="center" bg="rgba(0,0,0,0.2)">
          <Div bg="white" rounded={20} w="90%" minH={120} mb={32} p="xl" justifyContent="center">
            <TouchableOpacity style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }} onPress={() => setShowMenu(false)}>
              <Icon name="xmark" size={22} color="#222" iconStyle="solid" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { markAllAsRead(); setShowMenu(false); }} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24 }}>
              <Icon name="circle-check" size={20} color="#4B572A" iconStyle="solid" style={{ marginRight: 12 }} />
              <Text color="#222" fontSize="lg">Marcar tudo como lido</Text>
            </TouchableOpacity>
          </Div>
        </Div>
      </Modal>

      <BottomNavBar />
    </Div>
  );
}

const styles = StyleSheet.create({
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

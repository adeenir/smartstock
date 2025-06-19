import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Div, Text, Button } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';

const initialNotifications = [
  {
    id: 1,
    title: 'Cadastro de produtos',
    description: 'Você cadastrou o produto Coca-Cola 2L',
    date: '12/06/25',
    time: '09:32',
    unread: true,
    icon: 'circle-check',
    iconColor: '#4B572A',
    titleColor: '#4B572A',
  },
  {
    id: 2,
    title: 'Alerta de vencimento',
    description: 'O item queijo está próximo do vencimento',
    date: '12/06/25',
    time: '09:32',
    unread: true,
    icon: 'triangle-exclamation',
    iconColor: '#A6B48A',
    titleColor: '#4B572A',
  },
  {
    id: 3,
    title: 'Alteração de senha',
    description: 'Sua senha foi alterada com sucesso!',
    date: '12/06/25',
    time: '07:12',
    unread: true,
    icon: 'key',
    iconColor: '#A6B48A',
    titleColor: '#4B572A',
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [modalVisible, setModalVisible] = useState(false);
  const [clicked, setClicked] = useState<{[id: number]: boolean}>({});
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useNavigation<any>();

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    setClicked(Object.fromEntries(notifications.map(n => [n.id, true])));
    setModalVisible(false);
  };

  const handleNotificationClick = (id: number) => {
    setClicked(prev => ({ ...prev, [id]: !prev[id] }));
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleGoBack = () => {
    navigation.navigate('Home');
  };

  return (
    <Div flex={1} bg="white">
      <Div row alignItems="center" justifyContent="space-between" p="lg" bg="white">
        <TouchableOpacity onPress={handleGoBack} style={{padding: 8, justifyContent: 'center', alignItems: 'center'}} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="arrow-left" size={22} color="#222" iconStyle="solid" />
        </TouchableOpacity>
        <Div alignItems="center" style={{flex: 1}}>
          <Text fontWeight="bold" fontSize="xl">SMART STOCK</Text>
          <Text fontSize="md" color="gray700">Notificações</Text>
        </Div>
        <TouchableOpacity style={{padding: 8, justifyContent: 'center', alignItems: 'center'}} onPress={() => setShowMenu(true)}>
          <Icon name="ellipsis-vertical" size={22} color="#222" iconStyle="solid" />
        </TouchableOpacity>
      </Div>
      <Div bg="#E0E0E0" h={32} justifyContent="center" pl="lg">
        <Text color="#222" fontWeight="bold">Hoje</Text>
      </Div>
      <Div style={{flex: 1}}>
        {notifications.map((n, idx) => (
          <TouchableOpacity key={n.id} activeOpacity={0.8} onPress={() => handleNotificationClick(n.id)}>
            <Div row alignItems="center" bg={n.unread ? 'white' : 'white'} p="md" borderBottomWidth={1} borderBottomColor="#E0E0E0">
              {n.icon === 'circle-check' && (
                <Icon name="circle-check" size={28} color={clicked[n.id] ? '#A6B48A' : '#4B572A'} iconStyle="solid" style={{marginRight:16, alignSelf:'center'}} />
              )}
              {n.icon === 'triangle-exclamation' && (
                <Icon name="triangle-exclamation" size={28} color={clicked[n.id] ? '#A6B48A' : '#4B572A'} iconStyle="solid" style={{marginRight:16, alignSelf:'center'}} />
              )}
              {n.icon === 'key' && (
                <Icon name="key" size={28} color={clicked[n.id] ? '#A6B48A' : '#4B572A'} iconStyle="solid" style={{marginRight:16, alignSelf:'center'}} />
              )}
              <Div flex={1} justifyContent="center">
                <Text fontWeight="bold" color={n.unread ? n.titleColor : '#222'} style={n.unread ? {textDecorationLine: 'underline'} : {}}>{n.title}</Text>
                <Text color="#222" fontSize="sm">{n.description}</Text>
                <Text color="gray700" fontSize="xs" mt={2}>{n.time}</Text>
              </Div>
            </Div>
          </TouchableOpacity>
        ))}
      </Div>
      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <Div flex={1} justifyContent="flex-end" alignItems="center" bg="rgba(0,0,0,0.2)">
          <Div bg="white" rounded={20} w="90%" minH={120} mb={32} p="xl" justifyContent="center">
            <TouchableOpacity style={{position:'absolute', top:12, right:12, zIndex:2}} onPress={() => setShowMenu(false)}>
              <Icon name="xmark" size={22} color="#222" iconStyle="solid" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { markAllAsRead(); setShowMenu(false); }} style={{flexDirection:'row', alignItems:'center', marginTop:24}}>
              <Icon name="circle-check" size={20} color="#4B572A" iconStyle="solid" style={{marginRight:12}}/>
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

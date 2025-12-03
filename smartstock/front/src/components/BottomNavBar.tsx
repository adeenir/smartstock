import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';

interface BottomNavBarProps {
  onlyHome?: boolean;
}

export default function BottomNavBar({ onlyHome = false }: BottomNavBarProps) {
  const navigation = useNavigation<any>();
  console.log('BottomNavBar (front) rendered');
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="house" size={24} color="white" iconStyle="solid" />
      </TouchableOpacity>
      {!onlyHome && (
        <>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('ProductCodeInput')}>
            <Icon name="camera" size={24} color="white" iconStyle="solid" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
            <Icon name="bell" size={24} color="white" iconStyle="solid" />
          </TouchableOpacity>
        </>
      )}
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 0,
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
});

import React from 'react';
import { View, Text } from 'react-native';

// Minimal mock for expo-barcode-scanner used during Expo Go / dev when native
// module isn't present. It provides a component and a static
// requestPermissionsAsync method so code calling the real API won't crash.

const BarCodeScanner = ({ style }: any) => (
  <View style={[{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }, style]}>
    <Text style={{ color: '#fff' }}>Scanner não disponível neste cliente</Text>
  </View>
);

BarCodeScanner.requestPermissionsAsync = async () => {
  return { status: 'denied' };
};

module.exports = {
  BarCodeScanner,
};

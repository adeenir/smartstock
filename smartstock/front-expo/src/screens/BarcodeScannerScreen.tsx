import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert, View } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';

// We dynamically import `expo-barcode-scanner` at runtime. This lets the app run
// inside Expo Go even when the native module isn't present (it will show a
// fallback UI). For production/dev-client builds the native module will be used.

export default function BarcodeScannerScreen() {
  const navigation = useNavigation<any>();
  // Using static light-theme colors to avoid dependency on removed ThemeContext
  const staticColors = {
    bg: '#FFFFFF',
    text: '#000000',
    primary: '#4B572A',
    white: '#FFFFFF',
    gray700: '#374151',
    danger: '#E53935',
  };
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [BarCodeScannerModule, setBarCodeScannerModule] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      // If running inside Expo Go, avoid importing the native module —
      // some Expo Go builds don't include the native 'ExpoBarCodeScanner'
      // and importing can trigger a native error. Use fallback UI instead.
      try {
        // If available, require expo-constants to detect Expo Go. Use ts-ignore to avoid TS module errors.
        // @ts-ignore
        const Constants = require('expo-constants');
        if (Constants && (Constants as any).appOwnership === 'expo') {
          setBarCodeScannerModule(null);
          setHasPermission(false);
          return;
        }
      } catch (e) {
        // expo-constants not available — continue to attempt barcode import.
      }
      try {
        const mod = await import('expo-barcode-scanner');
        // Only use the module if it exposes BarCodeScanner with permission helper
        if (mod && mod.BarCodeScanner && typeof mod.BarCodeScanner.requestPermissionsAsync === 'function') {
          setBarCodeScannerModule(mod);
          const { status } = await mod.BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        } else {
          // Native module not available in this client (Expo Go etc.)
          setBarCodeScannerModule(null);
          setHasPermission(false);
        }
      } catch (err) {
        // Module not available (likely running in Expo Go without matching native module)
        console.warn('expo-barcode-scanner not available:', err && (err as Error)?.message ? (err as Error).message : err);
        setBarCodeScannerModule(null);
        setHasPermission(false);
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    // Navigate to code input screen with scanned code
    navigation.navigate('ProductCodeInput', { scannedCode: data });
  };

  if (hasPermission === null) {
    return (
      <Div flex={1} justifyContent="center" alignItems="center" bg={staticColors.bg}>
        <Text color={staticColors.text}>Solicitando permissão de câmera...</Text>
      </Div>
    );
  }

  // If the native scanner module isn't available, show a friendly fallback
  if (!BarCodeScannerModule) {
    return (
      <Div flex={1} justifyContent="center" alignItems="center" p="lg" bg={staticColors.bg}>
        <Icon name="circle-exclamation" size={48} color={staticColors.danger} iconStyle="solid" />
        <Text fontWeight="bold" fontSize="lg" mt="md" mb="sm" color={staticColors.text}>Scanner indisponível</Text>
        <Text color={staticColors.gray700} textAlign="center">O scanner nativo não está presente neste cliente. Você pode digitar o código manualmente.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ProductCodeInput')} style={[{...styles.button, marginTop:16, backgroundColor: staticColors.primary}] }>
          <Text style={{color: staticColors.white}}>Inserir código manualmente</Text>
        </TouchableOpacity>
      </Div>
    );
  }

  const BarCodeScanner = BarCodeScannerModule.BarCodeScanner;

  return (
    <Div flex={1} bg={staticColors.bg}>
      <Div row alignItems="center" justifyContent="space-between" p="lg">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 8}}>
          <Icon name="arrow-left" size={22} color={staticColors.text} iconStyle="solid" />
        </TouchableOpacity>
        <Text fontWeight="bold" color={staticColors.text}>Escanear código de barras</Text>
        <Div style={{width: 32}} />
      </Div>

      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={{ flex: 1 }}
      />

      <Div style={{...styles.bottom, backgroundColor: staticColors.primary}} row alignItems="center" justifyContent="center">
        <Text style={{color: staticColors.white}}>Aponte a câmera para o código de barras</Text>
      </Div>
    </Div>
  );
}

const styles = StyleSheet.create({
  bottom: {
    height: 80,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  }
});

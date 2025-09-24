import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://10.0.2.2:3000/api/hello') 
      .then(response => response.json())
      .then(json => setData(json.message))
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {data ? data : 'Carregando...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 }
});

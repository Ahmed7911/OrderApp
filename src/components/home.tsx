import React  from 'react';
import { Linking, Pressable, StyleSheet, Text, View , Alert } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  {/* Check if the app is connected to the backend */}
  useEffect(() => {
    const connected = navigator.onLine;
    if (!connected) {
      Alert.alert(
        'No Internet Connection',
        'Please connect to the internet to use the app.',
        [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
            style: 'cancel',
          },
        ],
        { cancelable: false }
      );
      AsyncStorage.setItem('user', 'true');
    }
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Order App</Text>
      <Text style={styles.subtitle}>
        Built for Digital Heroes Training Task"  
      </Text>
      <Pressable
        onPress={() => Linking.openURL('https://digitalheroesco.com/')}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Visit Digital Heroes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  linkButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  linkText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
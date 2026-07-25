import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';

interface CustomerProfileProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  photo: string;
}
export default function CustomerProfile(props: CustomerProfileProps) {
  // const navigation = useNavigation();
  const [customer, setCustomer] = useState<CustomerProfileProps>({
    id: props.id || '',
    name: props.name || '',
    email: props.email || '',
    phone: props.phone || '',
    address: props.address || '',
    city: props.city || '',
    photo: props.photo || '',
  });

  useEffect(() => {
    const hasProfileData = Boolean(
      props.name || props.email || props.phone || props.address || props.city || props.photo
    );

    if (hasProfileData) {
      setCustomer({
        id: props.id || '',
        name: props.name || '',
        email: props.email || '',
        phone: props.phone || '',
        address: props.address || '',
        city: props.city || '',
        photo: props.photo || '',
      });
      return;
    }

    const fetchCustomer = async () => {
      const savedCustomer = await AsyncStorage.getItem('user');
      if (savedCustomer) {
        setCustomer(JSON.parse(savedCustomer));
      }
    };
    fetchCustomer();
  }, [props.name, props.email, props.phone, props.address, props.city, props.photo]);

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: customer.photo }}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{customer.name}</Text>
            <Text style={styles.profileEmail}>{customer.email}</Text>
            <Text style={styles.profilePhone}>{customer.phone}</Text>
            <Text style={styles.profileAddress}>{customer.address}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 24,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 24,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1F2937',
  },
  profileEmail: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  profilePhone: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  profileAddress: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
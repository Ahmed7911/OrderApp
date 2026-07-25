import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface OrderProps {
  id: string;
  customer: string;
  status: string;
  total: number;
  items?: string[];
  createdAt: string;
}

export default function Order(props: OrderProps) {
  const router = useRouter();
  const items = props.items ?? [];

  const handlePress = () => {
    router.push({
      pathname: '/staus',
      params: {
        id: props.id,
        customer: props.customer,
        status: props.status,
        total: String(props.total),
        items: items.join(','),
        createdAt: props.createdAt,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <Text style={styles.id}>#{props.id}</Text>
        <Text style={styles.customer}>{props.customer}</Text>
        <Text style={styles.date}>Order Date: {props.createdAt}</Text>
        <Text style={styles.items}>
          {items.length} Products  - ${props.total}
        </Text>
      </View>

      <View style={styles.rightSide}>
        <Text style={[styles.status, getStatusStyle(props.status)]}>
          {props.status}
        </Text>
        <TouchableOpacity style={styles.detailsButton} onPress={handlePress}>
          <Text style={styles.detailsText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// function to get the status color based on the status
function getStatusStyle(status: string) {
  switch (status) {
    case 'completed':
      return { backgroundColor: '#4CAF50' }; // أخضر
    case 'pending':
      return { backgroundColor: '#FF9800' }; // برتقالي
    case 'waiting':
      return { backgroundColor: '#FFC107' }; // أصفر
    case 'cancelled':
      return { backgroundColor: '#F44336' }; // أحمر
    default:
      return { backgroundColor: 'gray' };
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leftSide: {
    flex: 3,
  },
  rightSide: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  id: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  customer: {
    fontSize: 18,
    color: '#030303',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginVertical: 2,
  },
  items: {
    fontSize: 13,
    color: '#444',
    marginTop: 4,
    fontWeight: 'bold',
  },
  status: {
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  detailsButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  detailsText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import OrderDetails from '../components/OrderDetails';

export default function StatusScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    customer?: string;
    status?: string;
    total?: string;
    items?: string;
    createdAt?: string;
  }>();

  const items = params.items ? params.items.split(',') : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <OrderDetails
        id={params.id ?? '1'}
        customer={params.customer ?? 'Ahmed Ali'}
        status={params.status ?? 'pending'}
        total={Number(params.total ?? 0)}
        items={items}
        createdAt={params.createdAt ?? '2025-07-20T10:00:00Z'}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  content: {
    paddingBottom: 24,
  },
});
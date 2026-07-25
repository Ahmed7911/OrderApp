import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Order from '../components/Order';

type OrderItem = {
  id: string;
  customer: string;
  status: string;
  total: number;
  items: string[];
  createdAt: string;
};

type StatusFilter = 'all' | 'pending' | 'completed' | 'cancelled';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
const statusOptions: StatusFilter[] = ['all', 'pending', 'completed', 'cancelled'];

export default function OrdersScreen() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        const data = await response.json();

        if (isMounted) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = selectedStatus === 'all' || order.status.toLowerCase() === selectedStatus;
      const searchableText = `${order.customer} ${order.id} ${order.status} ${order.items.join(' ')}`.toLowerCase();
      const matchesQuery = query.length === 0 || searchableText.includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [orders, searchQuery, selectedStatus]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.subtitle}>Manage your orders in one place</Text>
      </View>

      <View style={styles.operations}>
        <TextInput
          style={styles.formInput}
          placeholder="Search orders by customer, id, or item"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      <View style={styles.filterRow}>
        {statusOptions.map((status) => {
          const label = status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1);
          const isActive = selectedStatus === status;

          return (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : filteredOrders.length === 0 ? (
        <Text style={styles.emptyText}>No orders match your current filters.</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Order
              id={item.id}
              customer={item.customer}
              status={item.status}
              total={item.total}
              items={item.items}
              createdAt={item.createdAt}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#fff',
  },
  
  listContent: {
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgb(56, 5, 240)',
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
  operations: {
    marginTop: 12,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
  },
  filterChipText: {
    color: '#374151',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#fff',
  },
});

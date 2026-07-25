import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View ,Alert} from 'react-native';
import OrderProductsList from './OrderProductsList';

interface OrderDetailsProps {
  id: string;
  customer: string;
  status: string;
  total: number;
  items: string[];
  createdAt: string;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  photo: string;
}

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';

export default function OrderDetails(props: OrderDetailsProps) {
  const [products, setProducts] = React.useState<ProductItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentStatus, setCurrentStatus] = React.useState(props.status);

  React.useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();

        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    setCurrentStatus(props.status);
  }, [props.status]);

  const handleUpdateStatus = async () => {
    const nextStatus = currentStatus === 'pending' ? 'completed' : 'cancelled';
    Alert.alert(`Are you sure you want to ${nextStatus} this order?`);
    setCurrentStatus(nextStatus);

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${props.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      if (response.ok) {
        console.log('Order updated successfully');
      } else {
        setCurrentStatus(currentStatus);
        console.error('Failed to update order:', response.statusText);
      }
    } catch (error) {
      setCurrentStatus(currentStatus);
      console.error('Failed to update order:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.id}>#{props.id}</Text>
      <Text style={styles.customer}>{props.customer}</Text>
      <Text style={styles.date}>Order Date: {props.createdAt}</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>Status</Text>
        <Text style={[styles.status, getStatusStyle(currentStatus)]}>{currentStatus}</Text>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>Items</Text>
        {props.items.map((item, index) => (
          <Text key={`${item}-${index}`} style={styles.items}>
            • {item}
          </Text>
        ))}
      </View>

      <Text style={styles.total}>Total: ${props.total.toFixed(2)}</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading products...</Text>
      ) : (
        <OrderProductsList products={products} />
      )}

      <TouchableOpacity style={styles.updateStatusButton} onPress={handleUpdateStatus}>
        <Text style={styles.updateStatusText}>Update Status</Text>
      </TouchableOpacity>
    </View>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'completed':
      return { backgroundColor: '#4CAF50' };
    case 'pending':
      return { backgroundColor: '#FF9800' };
    case 'waiting':
      return { backgroundColor: '#FFC107' };
    case 'cancelled':
      return { backgroundColor: '#F44336' };
    default:
      return { backgroundColor: 'gray' };
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  id: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 4,
  },
  customer: {
    fontSize: 18,
    color: '#030303',
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginVertical: 6,
  },
  summaryBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F7F9FC',
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
    color: '#6B7280',
  },
  items: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  status: {
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    fontSize: 13,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  total: {
    fontSize: 16,
    color: '#030303',
    fontWeight: '700',
    marginTop: 12,
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
  },
  updateStatusButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateStatusText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
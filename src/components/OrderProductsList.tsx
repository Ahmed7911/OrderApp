import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  photo: string;
}

interface OrderProductsListProps {
  products: ProductItem[];
}

export default function OrderProductsList({ products }: OrderProductsListProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Products</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <Image source={{ uri: product.photo }} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  scrollContent: {
    paddingRight: 8,
  },
  productCard: {
    width: 140,
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#F7F9FC',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
  },
});

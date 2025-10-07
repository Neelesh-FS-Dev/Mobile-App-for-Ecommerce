/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { ordersAPI } from '../services/api';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderCard}>
      {/* Header */}
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === 'confirmed'
              ? styles.statusConfirmed
              : styles.statusPending,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'confirmed'
                ? styles.statusConfirmedText
                : styles.statusPendingText,
            ]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Order date */}
      <Text style={styles.orderDate}>
        Ordered on: {formatDate(item.createdAt)}
      </Text>

      {/* Items */}
      <View style={styles.orderItems}>
        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.itemRow}>
            <Image source={{ uri: orderItem.image }} style={styles.itemImage} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.itemName}>{orderItem.name}</Text>
              <Text style={styles.itemQtyPrice}>
                x{orderItem.quantity} • ${orderItem.price.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Shipping Address */}
      <View style={styles.shippingAddress}>
        <Text style={styles.addressTitle}>Shipping:</Text>
        <Text style={styles.addressText}>
          {JSON.parse(item.shippingAddress).fullName}
        </Text>
        <Text style={styles.addressText}>
          {JSON.parse(item.shippingAddress).address}
        </Text>
        <Text style={styles.addressText}>
          {JSON.parse(item.shippingAddress).city} -{' '}
          {JSON.parse(item.shippingAddress).zipCode}
        </Text>
        <Text style={styles.addressText}>
          {JSON.parse(item.shippingAddress).country}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>
          Total: ${item.totalAmount.toFixed(2)}
        </Text>
        {/* <View
          style={[
            styles.paymentBadge,
            item.paymentStatus === 'completed'
              ? styles.paymentCompleted
              : styles.paymentPending,
          ]}
        >
          <Text style={styles.paymentText}>
            {item.paymentStatus.toUpperCase()}
          </Text>
        </View> */}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.ordersList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('Products')}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  ordersList: { padding: 10 },
  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusConfirmed: { backgroundColor: '#d4edda' },
  statusPending: { backgroundColor: '#fff3cd' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  statusConfirmedText: { color: '#155724' },
  statusPendingText: { color: '#856404' },
  orderDate: { fontSize: 12, color: '#666', marginBottom: 10 },
  orderItems: { marginBottom: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  itemImage: { width: 50, height: 50, borderRadius: 6 },
  itemName: { fontSize: 14, fontWeight: '500', color: '#333' },
  itemQtyPrice: { fontSize: 12, color: '#666' },
  shippingAddress: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addressTitle: { fontWeight: 'bold', marginBottom: 4 },
  addressText: { fontSize: 12, color: '#555' },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  paymentBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  paymentCompleted: { backgroundColor: '#d4edda' },
  paymentPending: { backgroundColor: '#fff3cd' },
  paymentText: { fontSize: 12, fontWeight: 'bold' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 20 },
  shopButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  shopButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default OrdersScreen;

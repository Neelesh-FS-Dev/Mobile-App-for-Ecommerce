import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';

const CheckoutScreen = ({ navigation }) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });

  const handleInputChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { fullName, address, city, zipCode, country } = shippingAddress;
    if (!fullName || !address || !city || !zipCode || !country) {
      Alert.alert('Error', 'Please fill all shipping details');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderData = {
        items: cart.items,
        totalAmount: getCartTotal(),
        shippingAddress: JSON.stringify(shippingAddress),
      };

      await ordersAPI.create(orderData);

      Alert.alert('Success', 'Your order has been placed successfully!', [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.navigate('Orders');
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to place order',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cart.items.map(item => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            <Text style={styles.itemTotal}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${getCartTotal().toFixed(2)}</Text>
        </View>
      </View>

      {/* Shipping Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Details</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={shippingAddress.fullName}
          onChangeText={value => handleInputChange('fullName', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Address"
          value={shippingAddress.address}
          onChangeText={value => handleInputChange('address', value)}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          value={shippingAddress.city}
          onChangeText={value => handleInputChange('city', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="ZIP Code"
          value={shippingAddress.zipCode}
          onChangeText={value => handleInputChange('zipCode', value)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Country"
          value={shippingAddress.country}
          onChangeText={value => handleInputChange('country', value)}
        />
      </View>

      {/* Place Order Button */}
      <TouchableOpacity
        style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.placeOrderButtonText}>
            Place Order - ${getCartTotal().toFixed(2)}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    flex: 2,
    fontSize: 14,
  },
  itemQuantity: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  itemTotal: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  placeOrderButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;

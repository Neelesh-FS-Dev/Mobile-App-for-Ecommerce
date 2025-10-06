import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const CartScreen = ({ navigation }) => {
  const { cart, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to clear your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCart },
    ]);
  };

  return (
    <View style={styles.container}>
      {cart.items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart.items}
            renderItem={({ item }) => <CartItem item={item} />}
            keyExtractor={item => item.id.toString()}
            style={styles.cartList}
          />

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                Total: ${getCartTotal().toFixed(2)}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={handleClearCart}
              >
                <Text style={styles.clearButtonText}>Clear Cart</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.checkoutButton]}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutButtonText}>
                  Proceed to Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartList: {
    flex: 1,
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalContainer: {
    marginBottom: 15,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#ff3b30',
  },
  checkoutButton: {
    backgroundColor: '#34C759',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;

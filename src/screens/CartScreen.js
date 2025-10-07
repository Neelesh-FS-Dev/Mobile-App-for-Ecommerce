import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const CartScreen = ({ navigation }) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

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
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          clearCart();
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
        },
      },
    ]);
  };

  const itemCount = cart.items.length;
  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <View style={styles.container}>
      {cart.items.length === 0 ? (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
          <View style={styles.emptyIconContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>🛒</Text>
            </View>
            <View style={styles.emptyCircle1} />
            <View style={styles.emptyCircle2} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Looks like you haven't added anything yet
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Products')}
            activeOpacity={0.8}
          >
            <Text style={styles.shopButtonText}>Explore Products</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <>
          <FlatList
            data={cart.items}
            renderItem={({ item }) => <CartItem item={item} />}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (8%)</Text>
                <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearCart}
                activeOpacity={0.8}
              >
                <Text style={styles.clearButtonText}>🗑️ Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
                activeOpacity={0.8}
              >
                <Text style={styles.checkoutButtonText}>
                  Checkout · ${total.toFixed(2)}
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  itemBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  itemBadgeText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 30,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 1,
  },
  emptyIconText: {
    fontSize: 50,
  },
  emptyCircle1: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    opacity: 0.1,
    top: -10,
    right: -10,
  },
  emptyCircle2: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#764ba2',
    opacity: 0.1,
    bottom: 0,
    left: -5,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 35,
    textAlign: 'center',
  },
  shopButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#667eea',
    backgroundColor: '#667eea',
    paddingHorizontal: 40,
    paddingVertical: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  shopButtonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
  cartList: {
    padding: 16,
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 15,
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#56ab2f',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 0.35,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff6b6b',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#ff6b6b',
    fontSize: 15,
    fontWeight: '700',
  },
  checkoutButton: {
    flex: 0.65,
    borderRadius: 14,
    backgroundColor: '#56ab2f',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 16,
    overflow: 'hidden',
    shadowColor: '#56ab2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutButtonGradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
  },
});

export default CartScreen;

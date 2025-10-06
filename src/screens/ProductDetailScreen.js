import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useCart } from '../context/CartContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert('Success', 'Product added to cart!');
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigation.navigate('Cart');
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>${product.price}</Text>

        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.stockInfo}>
          <Text style={styles.stockText}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.addToCartButton]}
            onPress={handleAddToCart}
            disabled={product.stock === 0}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buyNowButton]}
            onPress={handleBuyNow}
            disabled={product.stock === 0}
          >
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  stockInfo: {
    marginBottom: 20,
  },
  stockText: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: '500',
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
  addToCartButton: {
    backgroundColor: '#007AFF',
  },
  buyNowButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;

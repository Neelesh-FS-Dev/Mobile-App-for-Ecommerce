import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, View } from 'react-native';
import { useCart } from '../context/CartContext';
import { storage, STORAGE_KEYS } from '../services/api';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrdersScreen from '../screens/OrdersScreen';
import LogoutButton from '../components/LogoutButton';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { getCartItemsCount } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = await storage.getItem(STORAGE_KEYS.TOKEN);
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? 'Products' : 'Login'}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Products"
        component={ProductListScreen}
        options={({ navigation }) => ({
          title: 'Products',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Button
                title={`Cart (${getCartItemsCount()})`}
                onPress={() => navigation.navigate('Cart')}
              />
              <LogoutButton navigation={navigation} />
            </View>
          ),
          headerLeft: () => (
            <Button
              title="Orders"
              onPress={() => navigation.navigate('Orders')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Shopping Cart' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: 'My Orders' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

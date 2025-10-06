import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;

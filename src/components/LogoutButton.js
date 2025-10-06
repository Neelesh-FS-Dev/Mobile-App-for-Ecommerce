import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { storage, STORAGE_KEYS } from '../services/api';

const LogoutButton = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await storage.removeItem(STORAGE_KEYS.TOKEN);
          await storage.removeItem(STORAGE_KEYS.USER);
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Text style={{ color: '#007AFF', marginHorizontal: 10 }}>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TrainingListScreen from './src/screens/TrainingListScreen';

// Import providers
import { AuthProvider } from './src/providers/AuthProvider';
import { useAuth } from './src/hooks/useAuth';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // You can add a loading screen here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Dashboard" : "Login"}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#dc2626',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardScreen} 
              options={{ title: 'Dashboard' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{ title: 'Profile' }}
            />
            <Stack.Screen 
              name="TrainingList" 
              component={TrainingListScreen} 
              options={{ title: 'Trainings' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </AuthProvider>
  );
}
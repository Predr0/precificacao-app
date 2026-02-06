import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initDatabase } from './src/database/database';

// Importação das telas (Certifique-se de que os caminhos estão corretos)
import Login from './src/screens/Login'; 
import ConfiguracaoNegocio from './src/screens/ConfiguracaoNegocio';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Inicializa o banco de dados SQLite (RNF01)
    initDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Tela de Login (RF01) */}
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        
        {/* Tela de Configuração (RF05) */}
        <Stack.Screen 
          name="ConfiguracaoNegocio" 
          component={ConfiguracaoNegocio} 
          options={{ title: 'Minha Empresa' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
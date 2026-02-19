import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './src/context/AppContext';

import ConfiguracaoNegocio from './src/screens/ConfiguracaoNegocio';
import Insumos from './src/screens/Insumos';
import CalculoProduto from './src/screens/CalculoProduto';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ConfiguracaoNegocio">
          <Stack.Screen name="ConfiguracaoNegocio" component={ConfiguracaoNegocio} options={{ title: 'Configurações' }} />
          <Stack.Screen name="Insumos" component={Insumos} options={{ title: 'Insumos' }} />
          <Stack.Screen name="CalculoProduto" component={CalculoProduto} options={{ title: 'Motor de Precificação' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
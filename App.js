import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './src/context/AppContext';

// Telas
import HomeScreen from './src/screens/HomeScreen'; // Certifique-se de criar este arquivo
import ConfiguracaoNegocio from './src/screens/ConfiguracaoNegocio';
import Insumos from './src/screens/Insumos';
import CalculoProduto from './src/screens/CalculoProduto';
import DespesasFixas from './src/screens/DespesasFixas';
import DespesasVariaveis from './src/screens/DespesasVariaveis';
import RelatoriosScreen from './src/screens/relatorioScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen 
            name="HomeScreen" 
            component={HomeScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ConfiguracaoNegocio" 
            component={ConfiguracaoNegocio} 
            options={{ title: 'Configurações' }} 
          />
          <Stack.Screen 
            name="DespesasFixas" 
            component={DespesasFixas} 
            options={{ title: 'Despesas Fixas' }} 
          />
          <Stack.Screen 
            name="DespesasVariaveis" 
            component={DespesasVariaveis} 
            options={{ title: 'Despesas Variáveis' }} 
          />
          <Stack.Screen 
            name="Insumos" 
            component={Insumos} 
            options={{ title: 'Insumos' }} 
          />
          <Stack.Screen 
            name="CalculoProduto" 
            component={CalculoProduto} 
            options={{ title: 'Motor de Precificação' }} 
          />
          <Stack.Screen 
            name="relatorioScreen" 
            component={RelatoriosScreen} 
            options={{ title: 'Relatórios Estratégicos' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
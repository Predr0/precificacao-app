import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();


  const lavanda = '#9e86bd'; 
  const roxoProfundo = '#4d235e'; 

  return (
    <ScrollView className="flex-1 bg-white p-6">
      

      <View className="mb-8">
        <Text className="text-3xl font-extrabold" style={{ color: roxoProfundo }}>Bem-vinda, Annik!</Text>
      </View>

      <TouchableOpacity 
        className="p-8 rounded-[40px] mb-6 shadow-2xl border-b-8" 
        style={{ backgroundColor: roxoProfundo, borderBottomColor: '#3a1a47' }}
        onPress={() => console.log('Plano de Negócio pressionado')}
      >
        <View className="flex-row items-center mb-4">
          <Text className="text-4xl">💼</Text> 
          <Text className="text-2xl font-black text-white ml-3">Faça seu Plano de Negócio</Text>
        </View>
        <Text className="text-white text-xs opacity-90 italic">Uma ferramenta de precificação inteligente para você.</Text>
      </TouchableOpacity>

      <View className="flex-row justify-between mb-16">
        
        <View className="w-[48%] gap-4">
          
          <TouchableOpacity 
            className="p-6 rounded-[30px] shadow-lg flex-col justify-between" 
            style={{ backgroundColor: lavanda }}
            onPress={() => navigation.navigate('ConfiguracaoNegocio')} 
          >
            <Text className="text-3xl mb-3">💸</Text>
            <Text className="font-extrabold text-white text-lg">Precificação</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="p-6 rounded-[30px] shadow-lg flex-col justify-between" 
            style={{ backgroundColor: lavanda }}
            onPress={() => navigation.navigate('relatorioScreen')} 
          >
            <Text className="text-3xl mb-3">📈</Text>
            <Text className="font-extrabold text-white text-lg">Gerar Relatórios</Text>
          </TouchableOpacity>
        </View>

        <View className="w-[48%] gap-4">
          
          <TouchableOpacity 
            className="p-6 rounded-[30px] shadow-lg flex-col justify-between" 
            style={{ backgroundColor: roxoProfundo }}
            onPress={() => console.log('Personalização pressionada')}
          >
            <Text className="text-3xl mb-3">✍️</Text>
            <Text className="font-extrabold text-white text-lg">Personalização</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="p-6 rounded-[30px] shadow-lg flex-col justify-between" 
            style={{ backgroundColor: roxoProfundo }}
            onPress={() => console.log('Configurações pressionada')}
          >
            <Text className="text-3xl mb-3">⚙️</Text>
            <Text className="font-extrabold text-white text-lg">Configurações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
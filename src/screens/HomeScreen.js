import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

export default function HomeScreen({ navigation }) {
  const lavanda = '#9e86bd'; 
  const roxoProfundo = '#4d235e'; 

  const MenuCard = ({ title, icon, onPress, fullWidth = false }) => (
    <TouchableOpacity 
      onPress={onPress}
      style={{ 
        backgroundColor: roxoProfundo,
        width: fullWidth ? '100%' : '48%',
        aspectRatio: fullWidth ? 2.8 : 1.1,
      }}
      className="rounded-[40px] p-5 mb-4 shadow-2xl flex-col justify-center items-center"
    >
      <MaterialCommunityIcons 
        name={icon} 
        size={fullWidth ? 32 : 36} 
        color="white" 
      />
      <Text 
        className="text-center font-black mt-2 text-[10px] uppercase text-white"
        style={{ letterSpacing: 1.5 }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ backgroundColor: lavanda }} className="flex-1">
      <ScrollView className="flex-1 p-6">
        
        <View className="mb-10 mt-6 flex-row justify-between items-center">
          <View>
            <Text className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Seja bem-vinda ao (nome do aplicativo)</Text>
            <Text className="text-white text-4xl font-black">Annik</Text>
          </View>
          <TouchableOpacity className="bg-white/20 p-3 rounded-full border border-white/30">
            <MaterialCommunityIcons name="face-woman-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <MenuCard 
          title="Meu Plano de Negócio" 
          icon="briefcase-edit-outline" 
          fullWidth 
          onPress={() => navigation.navigate('PlanoNegocio')}
        />

        <View className="flex-row flex-wrap justify-between mt-2">
          
          <MenuCard 
            title="Precificação" 
            icon="calculator-variant-outline" 
            onPress={() => navigation.navigate('ConfiguracaoNegocio')} 
          />

          <MenuCard 
            title="Relatórios" 
            icon="chart-timeline-variant-outline" 
            onPress={() => navigation.navigate('relatorioScreen')} 
          />

          <MenuCard 
            title="Financeiro" 
            icon="bank-outline" 
            onPress={() => {}} 
          />

          <MenuCard 
            title="Configurações" 
            icon="cog-outline" 
            onPress={() => {}} 
          />
        </View>

        <View className="mt-8 mb-20 items-center">
          <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest italic text-center">
            "Transformando sonhos em negócios viáveis"
          </Text>
          <View className="h-[2px] w-12 bg-white/30 mt-4 rounded-full" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
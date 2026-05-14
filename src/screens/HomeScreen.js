import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, useWindowDimensions, Alert, PixelRatio } from 'react-native'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { AppContext } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
  const { height, width } = useWindowDimensions();
  const { popularDadosTeste } = useContext(AppContext); 
  const lavanda = '#9e86bd'; 
  const roxoProfundo = '#4d235e'; 

  // Lógica de Escalonamento baseada no seu Pixel 7 (largura 412)
  const scale = width / 412;
  const rf = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

  const responsivePaddingTop = height * 0.08;
  const responsiveMarginLogo = height * 0.04;

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
        size={fullWidth ? rf(32) : rf(36)} 
        color="white" 
      />
      <Text 
        className="text-center font-black mt-2 uppercase text-white"
        style={{ letterSpacing: 1.5, fontSize: rf(10) }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ backgroundColor: lavanda, flex: 1 }}>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ 
          paddingHorizontal: 24, 
          paddingBottom: 60,
          paddingTop: responsivePaddingTop
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 flex-row justify-between items-center">
          <View>
            <Text style={{ fontSize: rf(12) }} className="text-white/70 font-bold uppercase tracking-widest">
              Seja bem-vinda ao ConectaValor
            </Text>
            <Text style={{ fontSize: rf(36) }} className="text-white font-black italic">
              Annik
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => {
              popularDadosTeste();
              Alert.alert("Sucesso", "Dados de teste carregados!");
            }}
            className="bg-white/20 p-3 rounded-full border border-white/30"
          >
            <MaterialCommunityIcons name="face-woman-outline" size={rf(28)} color="white" />
          </TouchableOpacity>
        </View>

        <View 
          style={{ borderColor: 'rgba(255, 255, 255, 0.4)', borderStyle: 'solid' }}
          className="border-2 p-6 rounded-[60px]"
        >
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
              onPress={() => navigation.navigate('SelecaoProduto')} 
            />
            <MenuCard 
              title="Gestão de Gastos" 
              icon="newspaper-variant-outline" 
              onPress={() => navigation.navigate('relatorioScreen')} 
            />
            <MenuCard 
              title="Projeções de Vendas" 
              icon="bank-outline" 
              onPress={() => navigation.navigate('ProjecoesVendas')} 
            />
            <MenuCard 
              title="Instruções" 
              icon="cog-outline" 
              onPress={() => {}} 
            />
          </View>

          <View className="mt-8 mb-4 items-center">
            <Text style={{ fontSize: rf(16) }} className="text-white/60 font-bold uppercase tracking-[2px] italic text-center leading-tight">
              "A conexão entre negócios e{"\n"}empreendedoras"
            </Text>
            <View className="h-[2px] w-10 bg-white/30 mt-4 rounded-full" />
          </View>
        </View>

        <Image
          source={require('../../assets/logo/ass-horizontal1(branco).png')}
          style={{
            alignSelf: 'center',
            marginTop: responsiveMarginLogo,
            width: width * 0.6,
            height: 70,
            resizeMode: 'contain',
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
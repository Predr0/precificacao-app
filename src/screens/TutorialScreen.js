import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, useWindowDimensions, Dimensions, PixelRatio } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Lógica de Escalonamento baseada no seu Pixel 7 (largura 412)
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 412;

function rf(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function TutorialScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  
  const roxo = '#4d235e';
  const lavanda = '#9e86bd';


  const paginasTutorial = [
    require('../../assets/tutorial1.jpg'), 
    require('../../assets/tutorial.jpg'),  
  ];

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: height * 0.05, paddingBottom: 60 }} 
        showsVerticalScrollIndicator={false}
      >

        <View className="mb-8 flex-row justify-between items-end">
          <View className="flex-1">
            <Text style={{ color: roxo, fontSize: rf(30) }} className="font-black uppercase tracking-tighter">Instruções</Text>
            <Text style={{ fontSize: rf(12) }} className="text-gray-400 font-bold uppercase">Manual do Aplicativo</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={rf(32)} color={roxo} />
          </TouchableOpacity>
        </View>

        <View className="items-center">
          {paginasTutorial.map((pagina, index) => (
            <Image
              key={index}
              source={pagina}
              style={{
                width: width - 40, 
                height: (width - 40) * 1.414,
                resizeMode: 'contain',
              }}
              className="mb-4 bg-white rounded-3xl shadow-sm border border-gray-100"
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
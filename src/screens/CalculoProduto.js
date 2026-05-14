import React, { useContext } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 412;

function rf(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function CalculoProduto({ navigation }) {
  const { 
    config, 
    insumos, 
    totalCF_Mensal, 
    totalDF_Mensal, 
    totalDV_Mensal 
  } = useContext(AppContext);

  const roxoProfundo = '#4d235e';
  const lavanda = '#9e86bd';

  const calcular = () => {
    const dias = parseFloat(config.dias) || 1;
    const horas = parseFloat(config.horas) || 1;
    const tempoProd = parseFloat(config.tempoProducao) || 1; 
    const minutosTotaisMes = dias * horas * 60;
    const lucroDesejado = parseFloat(config.lucroDesejado) || 0;

    const CVR = insumos.reduce((acc, curr) => acc + (parseFloat(curr.custoFração) || 0), 0);

    const CFR = (totalCF_Mensal / minutosTotaisMes) * tempoProd;
    const DFR = (totalDF_Mensal / minutosTotaisMes) * tempoProd;
    const DVR = (totalDV_Mensal / minutosTotaisMes) * tempoProd;

    const totalGeral = CFR + CVR + DFR + DVR;

    const pCF = totalGeral > 0 ? (CFR / totalGeral) * 100 : 0;
    const pCV = totalGeral > 0 ? (CVR / totalGeral) * 100 : 0;
    const pDF = totalGeral > 0 ? (DFR / totalGeral) * 100 : 0;
    const pDV = totalGeral > 0 ? (DVR / totalGeral) * 100 : 0;

    const PV = totalGeral + (totalGeral * (lucroDesejado / 100));

    const denominadorMarkup = 100 - (pDF + pDV + lucroDesejado);
    const markupIndice = denominadorMarkup > 0 ? 100 / denominadorMarkup : 1;
    const PVM = totalGeral * markupIndice;

    const denominadorPE = PVM - CVR;
    const PE = denominadorPE > 0 ? totalCF_Mensal / denominadorPE : 0;

    return { 
      CFR, CVR, DFR, DVR, totalGeral, 
      PV, markupIndice, PVM, PE,
      pCF, pCV, pDF, pDV,
      denominadorPE, minutosTotaisMes, lucroDesejado, tempoProd
    };
  };

  const res = calcular();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <Text 
          style={{ color: roxoProfundo, fontSize: rf(30) }} 
          className="font-black text-center uppercase tracking-tighter mb-6"
        >
          Relatório Final
        </Text>
        
        {/* CARD DO PREÇO MARK-UP */}
        <View style={{ backgroundColor: roxoProfundo }} className="p-8 rounded-[40px] mb-4 shadow-xl border-b-8 border-[#3a1a46]">
          <Text 
            style={{ fontSize: rf(12) }}
            className="text-white opacity-80 uppercase font-bold text-center mb-1 tracking-widest"
          >
            Preço Sugerido (PVM)
          </Text>
          <Text 
            style={{ fontSize: rf(48) }}
            className="text-white font-black text-center"
          >
            R$ {res.PVM.toFixed(2)}
          </Text>
          <Text 
            style={{ fontSize: rf(12) }}
            className="text-white mt-3 text-center italic"
          >
            Índice Mark-up: {res.markupIndice.toFixed(2)}
          </Text>
        </View>

        <View className="bg-amber-50 p-5 rounded-3xl mb-6 border border-amber-200">
          <Text 
            style={{ fontSize: rf(13) }}
            className="text-amber-800 text-center font-medium leading-5"
          >
            💡 Você pode praticar entre <Text className="font-bold">R$ {res.PV.toFixed(2)}</Text> e <Text className="font-bold">R$ {res.PVM.toFixed(2)}</Text>
          </Text>
        </View>

        <View className="bg-red-50 p-6 rounded-[35px] mb-6 border border-red-100">
          <Text 
            style={{ fontSize: rf(12) }}
            className="text-red-600 uppercase font-black mb-2 tracking-widest text-center"
          >
            Meta para o Lucro (PE)
          </Text>
          <Text 
            style={{ fontSize: rf(18) }}
            className="text-gray-800 text-center"
          >
            Venda <Text className="font-bold text-red-600">{Math.ceil(res.PE)}</Text> unidades/mês para não ter prejuízo.
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => navigation.navigate('HomeScreen')}
          style={{ backgroundColor: roxoProfundo }}
          className="p-6 rounded-[35px] mb-8 shadow-xl flex-row justify-center items-center"
        >
          <MaterialCommunityIcons name="home-outline" size={24} color="white" />
          <Text 
            style={{ fontSize: rf(18) }}
            className="text-white font-black ml-3 uppercase"
          >
            Ir para o Início
          </Text>
        </TouchableOpacity>

        {/* COMPOSIÇÃO DO PREÇO (%) */}
        <View className="bg-gray-100 p-6 rounded-[35px] mb-12">
          <Text 
            style={{ fontSize: rf(12) }}
            className="text-gray-500 uppercase font-bold mb-4 tracking-widest text-center"
          >
            Composição do Preço (%)
          </Text>
          
          {[
            { label: "Custo Fixo (CF):", value: res.pCF },
            { label: "Custo Variável (CV):", value: res.pCV },
            { label: "Despesa Fixa (DF):", value: res.pDF },
            { label: "Despesa Variável (DV):", value: res.pDV }
          ].map((item, index) => (
            <View key={index} className="flex-row justify-between mb-2">
              <Text style={{ fontSize: rf(14) }} className="text-gray-600 font-medium">{item.label}</Text>
              <Text style={{ color: roxoProfundo, fontSize: rf(14) }} className="font-black">{item.value.toFixed(2)}%</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
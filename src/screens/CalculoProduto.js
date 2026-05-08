import React, { useContext } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    // 1. DADOS DE CAPACIDADE
    const dias = parseFloat(config.dias) || 1;
    const horas = parseFloat(config.horas) || 1;
    const tempoProd = parseFloat(config.tempoProducao) || 1; 
    const minutosTotaisMes = dias * horas * 60;
    const lucroDesejado = parseFloat(config.lucroDesejado) || 0;

    // 2. RF05: CVR (Soma dos materiais)
    const CVR = insumos.reduce((acc, curr) => acc + (parseFloat(curr.custoFração) || 0), 0);

    // 3. RF06, RF07 e RF08: RATEIOS POR TEMPO
    const CFR = (totalCF_Mensal / minutosTotaisMes) * tempoProd;
    const DFR = (totalDF_Mensal / minutosTotaisMes) * tempoProd;
    const DVR = (totalDV_Mensal / minutosTotaisMes) * tempoProd;

    // 4. RF09: TOTAL GERAL UNITÁRIO
    const totalGeral = CFR + CVR + DFR + DVR;

    // 5. RF10: PORCENTAGENS SOBRE O TOTAL GERAL
    const pCF = totalGeral > 0 ? (CFR / totalGeral) * 100 : 0;
    const pCV = totalGeral > 0 ? (CVR / totalGeral) * 100 : 0;
    const pDF = totalGeral > 0 ? (DFR / totalGeral) * 100 : 0;
    const pDV = totalGeral > 0 ? (DVR / totalGeral) * 100 : 0;

    // 6. RF12: PREÇO DE VENDA TRADICIONAL (PV)
    const PV = totalGeral + (totalGeral * (lucroDesejado / 100));

    // 7. RF13: PREÇO COM MARK-UP (PVM)
    const denominadorMarkup = 100 - (pDF + pDV + lucroDesejado);
    const markupIndice = denominadorMarkup > 0 ? 100 / denominadorMarkup : 1;
    const PVM = totalGeral * markupIndice;

    // 8. RF14: PONTO DE EQUILÍBRIO (Rígido conforme Requisito)
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
        <Text style={{ color: roxoProfundo }} className="text-3xl font-black mb-6 text-center uppercase tracking-tighter">Relatório Final</Text>
        
        {/* CARD DO PREÇO MARK-UP */}
        <View style={{ backgroundColor: roxoProfundo }} className="p-8 rounded-[40px] mb-4 shadow-xl border-b-8 border-[#3a1a46]">
          <Text className="text-white opacity-80 uppercase text-xs font-bold text-center mb-1 tracking-widest">Preço Sugerido (PVM)</Text>
          <Text className="text-white text-5xl font-black text-center">R$ {res.PVM.toFixed(2)}</Text>
          <Text className="text-white mt-3 text-center italic text-xs">Índice Mark-up: {res.markupIndice.toFixed(2)}</Text>
        </View>

        {/* RF15: FAIXA DE PREÇO */}
        <View className="bg-amber-50 p-5 rounded-3xl mb-6 border border-amber-200">
          <Text className="text-amber-800 text-center font-medium text-xs leading-5">
            💡 Você pode praticar entre <Text className="font-bold">R$ {res.PV.toFixed(2)}</Text> e <Text className="font-bold">R$ {res.PVM.toFixed(2)}</Text>
          </Text>
        </View>

        {/* RF14: META PARA LUCRO */}
        <View className="bg-red-50 p-6 rounded-[35px] mb-6 border border-red-100">
          <Text className="text-red-600 uppercase text-xs font-black mb-2 tracking-widest text-center">Meta para o Lucro (PE)</Text>
          <Text className="text-gray-800 text-lg text-center">
            Venda <Text className="font-bold text-red-600">{Math.ceil(res.PE)}</Text> unidades/mês para não ter prejuízo.
          </Text>
        </View>

        {/* BOTÃO IR PARA O INÍCIO (ROXO PADRÃO) */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('HomeScreen')}
          style={{ backgroundColor: roxoProfundo }}
          className="p-6 rounded-[35px] mb-8 shadow-xl flex-row justify-center items-center"
        >
          <MaterialCommunityIcons name="home-outline" size={24} color="white" />
          <Text className="text-white font-black text-lg ml-3 uppercase">Ir para o Início</Text>
        </TouchableOpacity>

        {/* COMPOSIÇÃO DO PREÇO (%) */}
        <View className="bg-gray-100 p-6 rounded-[35px] mb-12">
          <Text className="text-gray-500 uppercase text-xs font-bold mb-4 tracking-widest text-center">Composição do Preço (%)</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 font-medium">Custo Fixo (CF):</Text>
            <Text style={{ color: roxoProfundo }} className="font-black">{res.pCF.toFixed(2)}%</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 font-medium">Custo Variável (CV):</Text>
            <Text style={{ color: roxoProfundo }} className="font-black">{res.pCV.toFixed(2)}%</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 font-medium">Despesa Fixa (DF):</Text>
            <Text style={{ color: roxoProfundo }} className="font-black">{res.pDF.toFixed(2)}%</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600 font-medium">Despesa Variável (DV):</Text>
            <Text style={{ color: roxoProfundo }} className="font-black">{res.pDV.toFixed(2)}%</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
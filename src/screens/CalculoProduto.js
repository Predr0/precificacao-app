import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function CalculoProduto() {
  // 1. IMPORTANTE: Puxar TODOS os totais que você definiu no AppContext
  const { 
    config, 
    insumos, 
    totalCF_Mensal, 
    totalDF_Mensal, 
    totalDV_Mensal 
  } = useContext(AppContext);

  const calcular = () => {
    const tempoProd = 30;
    const totalMinutosMes = (parseFloat(config.dias) || 1) * (parseFloat(config.horas) || 1) * 60;
    
    // RF06, RF07 e RF08: Rateios por tempo (R$)
    const CFR = (totalCF_Mensal / totalMinutosMes) * tempoProd;
    const DFR = (totalDF_Mensal / totalMinutosMes) * tempoProd;
    const DVR = (totalDV_Mensal / totalMinutosMes) * tempoProd;
    
    // RF05: CVR (Custo Variável de Materiais)
    const CVR = insumos.reduce((acc, curr) => acc + curr.custoFração, 0);

    // RF09: TOTAL GERAL
    const totalGeral = CFR + CVR + DFR + DVR;

    // RF10: PORCENTAGENS (Para o Mark-up e para o Relatório)
    // Usamos uma verificação simples para não dividir por zero
    const pCFR = totalGeral > 0 ? (CFR / totalGeral) * 100 : 0;
    const pCVR = totalGeral > 0 ? (CVR / totalGeral) * 100 : 0;
    const pDF = totalGeral > 0 ? (DFR / totalGeral) * 100 : 0;
    const pDV = totalGeral > 0 ? (DVR / totalGeral) * 100 : 0;
    const pLucro = parseFloat(config.lucroDesejado) || 0;

    // RF13: MARK-UP
    // A fórmula: 100 / [100 - (%DF + %DV + %Lucro)]
    const denominador = 100 - (pDF + pDV + pLucro);
    const markup = denominador > 0 ? 100 / denominador : 1;
    const precoFinalMarkup = totalGeral * markup;

    // RF14: PONTO DE EQUILÍBRIO
    // Unidades = Custo Fixo Total / (Preço Venda - Custo Variável Unitário)
    const pontoEquilibrio = totalCF_Mensal / (precoFinalMarkup - CVR);

    return { 
      totalGeral, 
      precoFinalMarkup, 
      markup, 
      pontoEquilibrio, 
      pDF, 
      pDV, 
      pCVR, 
      pCFR,
      CFR,
      CVR,
      DFR,
      DVR
    };
  };

  const res = calcular();

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-black text-green-700 mb-6 text-center">Relatório Final Annik</Text>
      
      <View className="bg-blue-600 p-8 rounded-[40px] mb-6 shadow-xl border-b-8 border-blue-800">
        <Text className="text-white opacity-80 uppercase text-xs font-bold text-center mb-1">Preço de Venda Sugerido</Text>
        <Text className="text-white text-5xl font-black text-center">R$ {res.precoFinalMarkup.toFixed(2)}</Text>
        <Text className="text-white mt-3 text-center italic text-xs">Mark-up aplicado: {res.markup.toFixed(2)}</Text>
      </View>

      <View className="bg-red-50 p-6 rounded-3xl mb-6 border border-red-100">
        <Text className="text-red-600 uppercase text-xs font-black mb-2">Meta para o Lucro (RF14)</Text>
        <Text className="text-gray-800 text-lg mb-1">
          Venda <Text className="font-bold text-red-600">{Math.ceil(res.pontoEquilibrio)}</Text> unidades/mês para cobrir os custos.
        </Text>
      </View>

      <View className="bg-gray-100 p-6 rounded-3xl mb-6">
        <Text className="text-gray-500 uppercase text-xs font-bold mb-4">Composição do Preço (%)</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Custo Fixo (CFR):</Text>
          <Text className="font-bold">{res.pCFR.toFixed(1)}%</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Custo Variável (CVR):</Text>
          <Text className="font-bold">{res.pCVR.toFixed(1)}%</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Despesa Fixa (DFR):</Text>
          <Text className="font-bold">{res.pDF.toFixed(1)}%</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600">Despesa Variável (DVR):</Text>
          <Text className="font-bold">{res.pDV.toFixed(1)}%</Text>
        </View>
      </View>

      <View className="p-6 border border-gray-100 rounded-3xl mb-12">
        <Text className="font-bold text-gray-800 mb-2">Ficha Técnica (R$):</Text>
        <Text className="text-gray-500 text-sm">Custo Material: R$ {res.CVR.toFixed(2)}</Text>
        <Text className="text-gray-500 text-sm">Custo Operação: R$ {res.CFR.toFixed(2)}</Text>
        <Text className="text-gray-500 text-sm">Despesas: R$ {(res.DFR + res.DVR).toFixed(2)}</Text>
        <View className="h-[1px] bg-gray-200 my-2" />
        <Text className="font-bold text-blue-900">Total Geral: R$ {res.totalGeral.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
}
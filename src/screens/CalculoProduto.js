import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function CalculoProduto() {
  const { config, insumos, totalCF_Mensal } = useContext(AppContext);

  const calcular = () => {
    // 1. Rateio (CFR) - Fórmulas do seu documento
    const tempoProducaoMin = 30; 
    const totalMinutosMes = (parseFloat(config.dias) || 1) * (parseFloat(config.horas) || 1) * 60;
    
    const custoPorMinuto = totalCF_Mensal / totalMinutosMes;
    const CFR = custoPorMinuto * tempoProducaoMin;

    // 2. Custos Variáveis
    const CVR = insumos.reduce((acc, curr) => acc + curr.custoFração, 0);

    // 3. Total e Mark-up (RF13)
    const totalGeral = CVR + CFR;
    const lucro = parseFloat(config.lucroDesejado) || 30;
    const markupIndice = 100 / (100 - (5 + 3 + lucro));
    const precoFinal = totalGeral * markupIndice;

    // 4. RF10: Porcentagens
    const pCVR = totalGeral > 0 ? (CVR / totalGeral) * 100 : 0;
    const pCFR = totalGeral > 0 ? (CFR / totalGeral) * 100 : 0;

    const pontoEquilibrio = totalCF_Mensal / (precoFinal - CVR);

    return { totalGeral, precoFinal, markupIndice, CVR, CFR, pCVR, pCFR, pontoEquilibrio };
  };

  const res = calcular();

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-black text-green-700 mb-6 text-center">Relatório Final Annik</Text>
      
      <View className="bg-blue-600 p-8 rounded-[40px] mb-6 shadow-xl border-b-8 border-blue-800">
        <Text className="text-white opacity-80 uppercase text-xs font-bold text-center mb-1">Preço de Venda Sugerido</Text>
        <Text className="text-white text-5xl font-black text-center">R$ {res.precoFinal.toFixed(2)}</Text>
        <Text className="text-white mt-3 text-center italic text-xs">Margem de lucro aplicada: {config.lucroDesejado}%</Text>
      </View>

      <View className="bg-red-50 p-6 rounded-3xl mb-6 border border-red-100">
        <Text className="text-red-600 uppercase text-xs font-black mb-2">Meta para o Lucro</Text>
        <Text className="text-gray-800 text-lg mb-1">
          Você precisa vender <Text className="font-bold text-red-600">{Math.ceil(res.pontoEquilibrio)}</Text> unidades/mês.
        </Text>
        <Text className="text-gray-500 text-xs italic">
          Isso cobre o seu salário e todos os custos fixos antes de começar a lucrar de fato.
        </Text>
      </View>

      <View className="bg-gray-100 p-6 rounded-3xl mb-6">
        <Text className="text-gray-500 uppercase text-xs font-bold mb-4">Composição do Preço (RF10)</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Peso dos Insumos:</Text>
          <Text className="font-bold">{res.pCVR.toFixed(1)}%</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600">Peso da Operação:</Text>
          <Text className="font-bold">{res.pCFR.toFixed(1)}%</Text>
        </View>
      </View>

      <View className="p-6 border border-gray-100 rounded-3xl mb-12">
        <Text className="font-bold text-gray-800 mb-2">Ficha Técnica Simplificada:</Text>
        <Text className="text-gray-500">Custo Material: R$ {res.CVR.toFixed(2)}</Text>
        <Text className="text-gray-500">Rateio de Estrutura: R$ {res.CFR.toFixed(2)}</Text>
        <Text className="text-gray-500 mt-2">Custo Mensal Total: R$ {totalCF_Mensal.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
}
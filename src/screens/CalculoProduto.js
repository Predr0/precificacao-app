import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function CalculoProduto() {
  const { config, insumos } = useContext(AppContext);
  const [lucroDesejado] = useState(30); // %

  const calcular = () => {
    const tempoProducaoMin = 30; // Exemplo de tempo gasto
    const totalMinutosMes = parseFloat(config.dias) * parseFloat(config.horas) * 60;
    
    // 1. Custo Variável Total (Insumos)
    const CVR = insumos.reduce((acc, curr) => acc + curr.custoFração, 0);

    // 2. Rateio Mão de Obra e Fixos
    const custoPorMinuto = (parseFloat(config.salario) + parseFloat(config.custoFixo)) / totalMinutosMes;
    const CFR = custoPorMinuto * tempoProducaoMin;

    // 3. Total Geral
    const totalGeral = CVR + CFR;

    // 4. Mark-up
    // MARK-UP = 100 / [100 – (%DFR + %DVR + %Lucro)]
    // Para o MVP, usaremos os percentuais fixos do seu exemplo (5% despesas + lucro)
    const markup = 100 / (100 - (5 + 3 + lucroDesejado)); 
    const precoFinal = totalGeral * markup;

    return { totalGeral, precoFinal, markup, CVR };
  };

  const res = calcular();

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-center mb-6 text-green-700">Relatório de Rentabilidade</Text>
      
      <View className="bg-gray-100 p-5 rounded-3xl mb-4">
        <Text className="text-gray-600">Custo de Materiais (CVR):</Text>
        <Text className="text-xl font-bold">R$ {res.CVR.toFixed(2)}</Text>
        
        <View className="h-[1px] bg-gray-300 my-4" />
        
        <Text className="text-gray-600">Total de Custos + Rateio:</Text>
        <Text className="text-xl font-bold text-blue-800">R$ {res.totalGeral.toFixed(2)}</Text>
      </View>

      <View className="bg-green-600 p-6 rounded-3xl shadow-xl">
        <Text className="text-white opacity-80 uppercase text-xs font-bold">Preço de Venda Sugerido (Mark-up)</Text>
        <Text className="text-white text-4xl font-black">R$ {res.precoFinal.toFixed(2)}</Text>
        <Text className="text-white mt-2">Índice Mark-up: {res.markup.toFixed(2)}</Text>
      </View>

      <View className="mt-6 p-4 border border-red-200 rounded-2xl">
        <Text className="text-red-600 font-bold">Ponto de Equilíbrio</Text>
        <Text className="text-sm">Você precisa vender aprox. {Math.ceil((parseFloat(config.salario) + parseFloat(config.custoFixo)) / (res.precoFinal - res.CVR))} unidades para não ter prejuízo.</Text>
      </View>
    </ScrollView>
  );
}
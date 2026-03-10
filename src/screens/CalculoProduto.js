import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function CalculoProduto() {
  const { config, insumos, totalCustosFixos } = useContext(AppContext); // Puxando o total somado
  const [lucroDesejado] = useState(30); 

  const calcular = () => {
    const tempoProducaoMin = 30; 
    const totalMinutosMes = (parseFloat(config.dias) || 1) * (parseFloat(config.horas) || 1) * 60;
    
    const CVR = insumos.reduce((acc, curr) => acc + curr.custoFração, 0);

    // Mão de obra + SOMA de todos os custos fixos cadastrados
    const custoPorMinuto = (parseFloat(config.salario) + totalCustosFixos) / totalMinutosMes;
    const CFR = custoPorMinuto * tempoProducaoMin;

    const totalGeral = CVR + CFR;

    // Mark-up
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
        
        <Text className="text-gray-600">Total (Custos + Rateio de {totalCustosFixos > 0 ? 'Fixos' : 'Mão de Obra'}):</Text>
        <Text className="text-xl font-bold text-blue-800">R$ {res.totalGeral.toFixed(2)}</Text>
      </View>

      <View className="bg-green-600 p-6 rounded-3xl shadow-xl">
        <Text className="text-white opacity-80 uppercase text-xs font-bold">Preço de Venda Sugerido (Mark-up)</Text>
        <Text className="text-white text-4xl font-black">R$ {res.precoFinal.toFixed(2)}</Text>
        <Text className="text-white mt-2">Índice Mark-up: {res.markup.toFixed(2)}</Text>
      </View>

      <View className="mt-6 p-4 border border-red-200 rounded-2xl mb-10">
        <Text className="text-red-600 font-bold">Ponto de Equilíbrio</Text>
        <Text className="text-sm">Venda {Math.ceil((parseFloat(config.salario) + totalCustosFixos) / (res.precoFinal - res.CVR))} unidades/mês para cobrir os gastos fixos.</Text>
      </View>
    </ScrollView>
  );
}
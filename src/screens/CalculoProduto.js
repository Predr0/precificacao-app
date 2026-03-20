import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function CalculoProduto() {
  const { 
    config, 
    insumos, 
    totalCF_Mensal, 
    totalDF_Mensal, 
    totalDV_Mensal 
  } = useContext(AppContext);

  const calcular = () => {
    // Inputs básicos do Contexto
    const dias = parseFloat(config.dias) || 1;
    const horas = parseFloat(config.horas) || 1;
    const tempoProd = parseFloat(config.tempoProducao) || 1; 
    const minutosTotaisMes = dias * horas * 60;
    const lucroDesejado = parseFloat(config.lucroDesejado) || 0;

    // RF05: CVR (Materiais)
    const CVR = insumos.reduce((acc, curr) => acc + (parseFloat(curr.custoFração) || 0), 0);

    // RF06, RF07 e RF08: Rateios
    const CFR = (totalCF_Mensal / minutosTotaisMes) * tempoProd;
    const DFR = (totalDF_Mensal / minutosTotaisMes) * tempoProd;
    const DVR = (totalDV_Mensal / minutosTotaisMes) * tempoProd;

    // RF09: Total Geral
    const totalGeral = CFR + CVR + DFR + DVR;

    // RF10: Porcentagens
    const pCF = totalGeral > 0 ? (CFR / totalGeral) * 100 : 0;
    const pCV = totalGeral > 0 ? (CVR / totalGeral) * 100 : 0;
    const pDF = totalGeral > 0 ? (DFR / totalGeral) * 100 : 0;
    const pDV = totalGeral > 0 ? (DVR / totalGeral) * 100 : 0;

    // RF12: PV Tradicional
    const PV = totalGeral + (totalGeral * (lucroDesejado / 100));

    // RF13: PVM Mark-up
    const denominadorMarkup = 100 - (pDF + pDV + lucroDesejado);
    const markupIndice = denominadorMarkup > 0 ? 100 / denominadorMarkup : 1;
    const PVM = totalGeral * markupIndice;

    // RF14: PE (Ponto de Equilíbrio)
    const denominadorPE = PVM - CVR;
    const PE = denominadorPE > 0 ? totalCF_Mensal / denominadorPE : 0;

    // CRÍTICO: Todos os valores usados no JSX devem estar no return abaixo!
    return { 
      CFR, CVR, DFR, DVR, totalGeral, 
      PV, markupIndice, PVM, PE,
      pCF, pCV, pDF, pDV,
      denominadorPE, minutosTotaisMes
    };
  };

  const res = calcular();

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-black text-green-700 mb-6 text-center">Relatório Final Annik</Text>
      
      {/* Box do Preço Sugerido */}
      <View className="bg-blue-600 p-8 rounded-[40px] mb-4 shadow-xl border-b-8 border-blue-800">
        <Text className="text-white opacity-80 uppercase text-xs font-bold text-center mb-1">Preço Sugerido (PVM)</Text>
        <Text className="text-white text-5xl font-black text-center">R$ {res.PVM.toFixed(2)}</Text>
        <Text className="text-white mt-3 text-center italic text-xs">Mark-up: {res.markupIndice.toFixed(2)}</Text>
      </View>

      {/* Faixa de Preço RF15 */}
      <View className="bg-amber-50 p-4 rounded-2xl mb-6 border border-amber-200">
        <Text className="text-amber-800 text-center font-medium text-xs">
          💡 Pratique entre <Text className="font-bold text-sm">R$ {res.PV.toFixed(2)}</Text> e <Text className="font-bold text-sm">R$ {res.PVM.toFixed(2)}</Text>
        </Text>
      </View>

      {/* Meta para o Lucro RF14 */}
      <View className="bg-red-50 p-6 rounded-3xl mb-6 border border-red-100">
        <Text className="text-red-600 uppercase text-xs font-black mb-2">Meta para o Lucro (PE)</Text>
        <Text className="text-gray-800 text-lg">
          Venda <Text className="font-bold text-red-600">{Math.ceil(res.PE)}</Text> unidades/mês para pagar os gastos (custos e despesas).
        </Text>
      </View>

      {/* Composição RF10 */}
      <View className="bg-gray-100 p-6 rounded-3xl mb-6">
        <Text className="text-gray-500 uppercase text-xs font-bold mb-4">Composição do Preço (%)</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Custo Fixo (CF):</Text>
          <Text className="font-bold">{res.pCF.toFixed(1)}%</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Custo Variável (CV):</Text>
          <Text className="font-bold">{res.pCV.toFixed(1)}%</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Despesa Fixa (DF):</Text>
          <Text className="font-bold">{res.pDF.toFixed(1)}%</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600">Despesa Variável (DV):</Text>
          <Text className="font-bold">{res.pDV.toFixed(1)}%</Text>
        </View>
      </View>

      {/* ------------------------------------------------------------ */}
      {/* SEÇÃO DE DEBUG PARA VALIDAR AS 42 UNIDADES */}
      {/* ------------------------------------------------------------ */}
      <View className="bg-black p-6 rounded-3xl mb-6 border-2 border-red-500">
        <Text className="text-red-500 font-bold uppercase mb-4 text-center text-xs">🛠 DEBUG: Validação da Fórmula PE</Text>
        
        <View className="space-y-1">
          <Text className="text-white text-[11px]">1. CF Mensal Total: <Text className="text-green-400">R$ {(totalCF_Mensal || 0).toFixed(2)}</Text></Text>
          <Text className="text-white text-[11px]">2. Preço Venda (PVM): <Text className="text-green-400">R$ {res.PVM.toFixed(2)}</Text></Text>
          <Text className="text-white text-[11px]">3. Custo Mat. (CVR): <Text className="text-green-400">R$ {res.CVR.toFixed(2)}</Text></Text>
          
          <View className="h-[1px] bg-gray-700 my-2" />
          
          <Text className="text-white text-[11px]">4. Denom. (PV - CV): <Text className="text-yellow-400">R$ {res.denominadorPE.toFixed(4)}</Text></Text>
          <Text className="text-white text-[11px]">5. Resultado Cru: <Text className="text-yellow-400">{res.PE.toFixed(4)}</Text></Text>
          
          <Text className="text-white text-[9px] mt-2 italic opacity-50">Rateio CF baseado em {res.minutosTotaisMes} min/mês.</Text>
        </View>
      </View>

      {/* Ficha Técnica Final */}
      <View className="p-6 border border-gray-100 rounded-3xl mb-12">
        <Text className="font-bold text-gray-800 mb-2">Ficha Técnica (R$):</Text>
        <Text className="text-gray-500 text-sm">Material: R$ {res.CVR.toFixed(2)} | Op: R$ {res.CFR.toFixed(2)}</Text>
        <Text className="text-gray-500 text-sm">Despesas: R$ {(res.DFR + res.DVR).toFixed(2)}</Text>
        <View className="h-[1px] bg-gray-200 my-2" />
        <Text className="font-bold text-blue-900">Total Geral: R$ {res.totalGeral.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
}
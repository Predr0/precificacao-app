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
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-black text-green-700 mb-6 text-center">Relatório Final Annik</Text>
      
      {/* CARD DO PREÇO MARK-UP */}
      <View className="bg-blue-600 p-8 rounded-[40px] mb-4 shadow-xl border-b-8 border-blue-800">
        <Text className="text-white opacity-80 uppercase text-xs font-bold text-center mb-1">Preço Sugerido (PVM)</Text>
        <Text className="text-white text-5xl font-black text-center">R$ {res.PVM.toFixed(2)}</Text>
        <Text className="text-white mt-3 text-center italic text-xs">Índice Mark-up: {res.markupIndice.toFixed(2)}</Text>
      </View>

      {/* RF15: FAIXA DE PREÇO */}
      <View className="bg-amber-50 p-4 rounded-2xl mb-6 border border-amber-200">
        <Text className="text-amber-800 text-center font-medium text-xs">
          💡 Você pode praticar entre <Text className="font-bold">R$ {res.PV.toFixed(2)}</Text> e <Text className="font-bold">R$ {res.PVM.toFixed(2)}</Text>
        </Text>
      </View>

      {/* RF14: META PARA LUCRO */}
      <View className="bg-red-50 p-6 rounded-3xl mb-6 border border-red-100">
        <Text className="text-red-600 uppercase text-xs font-black mb-2">Meta para o Lucro (PE)</Text>
        <Text className="text-gray-800 text-lg">
          Venda <Text className="font-bold text-red-600">{Math.ceil(res.PE)}</Text> unidades/mês para não ter prejuízo.
        </Text>
      </View>

      {/* AUDITORIA DE CÁLCULO (DEBUG TOTAL) */}
      <View className="bg-slate-900 p-6 rounded-3xl mb-6 border-2 border-red-500 shadow-2xl">
        <Text className="text-red-400 font-black uppercase mb-4 text-center text-[10px]">🛠 RAIO-X DE AUDITORIA (DEBUG)</Text>
        
        <Text className="text-blue-300 font-bold text-[10px] mb-1">A. BASE MENSAL (INPUTS)</Text>
        <View className="mb-3 pl-2 border-l border-slate-700">
          <Text className="text-white text-[11px]">Custo Fixo Total (CF): R$ {totalCF_Mensal.toFixed(2)}</Text>
          <Text className="text-white text-[11px]">Lucro Digitado: {res.lucroDesejado}%</Text>
          <Text className="text-white text-[11px]">Tempo/Produto: {res.tempoProd} min</Text>
          <Text className="text-white text-[11px]">Capacidade Total: {res.minutosTotaisMes} min</Text>
        </View>

        <Text className="text-blue-300 font-bold text-[10px] mb-1">B. RATEIO UNITÁRIO (R$)</Text>
        <View className="mb-3 pl-2 border-l border-slate-700">
          <Text className="text-green-400 text-[11px]">CFR (Fixo): R$ {res.CFR.toFixed(4)}</Text>
          <Text className="text-green-400 text-[11px]">CVR (Material): R$ {res.CVR.toFixed(4)}</Text>
          <Text className="text-green-400 text-[11px]">DFR (Desp. Fixa): R$ {res.DFR.toFixed(4)}</Text>
          <Text className="text-green-400 text-[11px]">DVR (Desp. Var): R$ {res.DVR.toFixed(4)}</Text>
          <Text className="text-white font-bold text-[11px]">TOTAL GERAL: R$ {res.totalGeral.toFixed(4)}</Text>
        </View>

        <Text className="text-orange-400 font-bold text-[10px] mb-1">C. VALIDAÇÃO P.E. (RF14)</Text>
        <View className="pl-2 border-l border-orange-900">
          <Text className="text-white text-[11px]">Numerador (CF Mensal): R$ {totalCF_Mensal.toFixed(2)}</Text>
          <Text className="text-white text-[11px]">PVM (Preço): R$ {res.PVM.toFixed(2)}</Text>
          <Text className="text-white text-[11px]">CVR (Material): R$ {res.CVR.toFixed(2)}</Text>
          <Text className="text-yellow-400 font-bold text-[11px]">Denominador (PVM - CVR): R$ {res.denominadorPE.toFixed(4)}</Text>
          <Text className="text-green-400 font-black text-sm mt-1">PE Cru: {res.PE.toFixed(4)} un.</Text>
        </View>
      </View>

      {/* COMPOSIÇÃO PERCENTUAL RF10 */}
      <View className="bg-gray-100 p-6 rounded-3xl mb-12">
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
    </ScrollView>
  );
}
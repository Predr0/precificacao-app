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
    // 1. DADOS DE TEMPO
    const dias = parseFloat(config.dias) || 1;
    const horas = parseFloat(config.horas) || 1;
    const tempoProd = parseFloat(config.tempoProducao) || 1; 
    const minutosTotaisMes = dias * horas * 60;
    const lucroDesejado = parseFloat(config.lucroDesejado) || 0;

    // 2. CVR (Custo Variável Unitário - Materiais)
    // Aqui somamos todos os insumos que você cadastrou
    const CVR = insumos.reduce((acc, curr) => acc + (parseFloat(curr.custoFração) || 0), 0);

    // 3. RATEIOS (RF06, RF07, RF08)
    const CFR = (totalCF_Mensal / minutosTotaisMes) * tempoProd;
    const DFR = (totalDF_Mensal / minutosTotaisMes) * tempoProd;
    const DVR = (totalDV_Mensal / minutosTotaisMes) * tempoProd;

    // 4. TOTAL GERAL (RF09)
    const totalGeral = CFR + CVR + DFR + DVR;

    // 5. PORCENTAGENS (RF10)
    const pCF = totalGeral > 0 ? (CFR / totalGeral) * 100 : 0;
    const pCV = totalGeral > 0 ? (CVR / totalGeral) * 100 : 0;
    const pDF = totalGeral > 0 ? (DFR / totalGeral) * 100 : 0;
    const pDV = totalGeral > 0 ? (DVR / totalGeral) * 100 : 0;

    // 6. PREÇOS (RF12, RF13)
    const PV = totalGeral + (totalGeral * (lucroDesejado / 100));
    const denominadorMarkup = 100 - (pDF + pDV + lucroDesejado);
    const markupIndice = denominadorMarkup > 0 ? 100 / denominadorMarkup : 1;
    const PVM = totalGeral * markupIndice;

    // 7. PONTO DE EQUILÍBRIO (RF14)
    // Ponto de Equilíbrio = Custo Fixo Mensal / (Preço de Venda Mark-up - Custo Variável Unitário)
    const denominadorPE = PVM - CVR;
    const PE = denominadorPE > 0 ? totalCF_Mensal / denominadorPE : 0;

    return { 
      CFR, CVR, DFR, DVR, totalGeral, 
      PV, markupIndice, PVM, PE,
      pCF, pCV, pDF, pDV,
      denominadorPE, minutosTotaisMes, denominadorMarkup,
      dias, horas, tempoProd, lucroDesejado
    };
  };

  const res = calcular();

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-black text-green-700 mb-6 text-center">Relatório Final Annik</Text>
      
      <View className="bg-blue-600 p-8 rounded-[40px] mb-6 shadow-xl border-b-8 border-blue-800">
        <Text className="text-white opacity-80 uppercase text-xs font-bold text-center mb-1">Preço Sugerido (PVM)</Text>
        <Text className="text-white text-5xl font-black text-center">R$ {res.PVM.toFixed(2)}</Text>
        <Text className="text-white mt-3 text-center italic text-xs">Margem: {res.lucroDesejado}% | Mark-up: {res.markupIndice.toFixed(2)}</Text>
      </View>

      <View className="bg-slate-900 p-6 rounded-3xl mb-12 border-2 border-red-500">
        <Text className="text-red-400 font-black uppercase mb-4 text-center text-xs">🛠 AUDITORIA TÉCNICA (DEBUG)</Text>
        
        <Text className="text-blue-300 font-bold text-[10px] mb-1">A. VALORES MENSAIS TOTAIS (BASE)</Text>
        <View className="mb-4 pl-2 border-l border-slate-700">
          <Text className="text-white text-[11px]">Custo Fixo (CF): R$ {totalCF_Mensal.toFixed(2)}</Text>
          <Text className="text-white text-[11px]">Despesa Fixa (DF): R$ {totalDF_Mensal.toFixed(2)}</Text>
          <Text className="text-white text-[11px]">Despesa Var (DV): R$ {totalDV_Mensal.toFixed(2)}</Text>
          <Text className="text-white text-[11px]">Capacidade: {res.minutosTotaisMes} min/mês</Text>
        </View>

        <Text className="text-blue-300 font-bold text-[10px] mb-1">B. VALORES UNITÁRIOS (RATEIO)</Text>
        <View className="mb-4 pl-2 border-l border-slate-700">
          <Text className="text-green-400 text-[11px]">CFR (Fixo): R$ {res.CFR.toFixed(4)}</Text>
          <Text className="text-green-400 text-[11px]">CVR (Materiais): R$ {res.CVR.toFixed(4)}</Text>
          <Text className="text-green-400 text-[11px]">DFR (Desp. Fixa): R$ {res.DFR.toFixed(4)}</Text>
          <Text className="text-green-400 text-[11px]">DVR (Desp. Var): R$ {res.DVR.toFixed(4)}</Text>
          <Text className="text-white font-bold text-[11px]">TOTAL GERAL: R$ {res.totalGeral.toFixed(4)}</Text>
        </View>

        <Text className="text-blue-300 font-bold text-[10px] mb-1">C. COMPOSIÇÃO PERCENTUAL (%)</Text>
        <View className="mb-4 pl-2 border-l border-slate-700">
          <Text className="text-white text-[11px]">% Custo Fixo: {res.pCF.toFixed(2)}%</Text>
          <Text className="text-white text-[11px]">% Custo Variável: {res.pCV.toFixed(2)}%</Text>
          <Text className="text-white text-[11px]">% Despesa Fixa: {res.pDF.toFixed(2)}%</Text>
          <Text className="text-white text-[11px]">% Despesa Variável: {res.pDV.toFixed(2)}%</Text>
        </View>

        <Text className="text-orange-400 font-bold text-[10px] mb-1">D. CÁLCULO DO P.E. (DETALHADO)</Text>
        <View className="pl-2 border-l border-orange-900">
          <Text className="text-white text-[11px]">Numerador (CF Mensal): <Text className="font-bold">R$ {totalCF_Mensal.toFixed(2)}</Text></Text>
          <Text className="text-white text-[11px]">Preço Venda (PVM): <Text className="font-bold">R$ {res.PVM.toFixed(2)}</Text></Text>
          <Text className="text-white text-[11px]">Custo Variável (CVR): <Text className="font-bold text-red-400">- R$ {res.CVR.toFixed(2)}</Text></Text>
          <Text className="text-yellow-400 font-bold text-[11px]">Denominador (PV - CV): R$ {res.denominadorPE.toFixed(4)}</Text>
          
          <View className="h-[1px] bg-slate-700 my-2" />
          
          <Text className="text-white text-[11px]">Conta: {totalCF_Mensal.toFixed(2)} / {res.denominadorPE.toFixed(4)}</Text>
          <Text className="text-green-400 font-black text-lg mt-1">Resultado: {res.PE.toFixed(4)} un.</Text>
          <Text className="text-gray-500 text-[9px] italic">No app: Math.ceil({res.PE.toFixed(2)}) = {Math.ceil(res.PE)}</Text>
        </View>
      </View>


      <View className="bg-gray-100 p-6 rounded-3xl mb-12">
        <Text className="text-gray-500 uppercase text-xs font-bold mb-4">Composição do Preço (%)</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Custos Fixos:</Text>
          <Text className="font-bold">{res.pCF.toFixed(1)}%</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Insumos (Materiais):</Text>
          <Text className="font-bold">{res.pCV.toFixed(1)}%</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600">Despesas Totais:</Text>
          <Text className="font-bold">{(res.pDF + res.pDV).toFixed(1)}%</Text>
        </View>
      </View>
    </ScrollView>
  );
}
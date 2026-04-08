import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function RelatoriosScreen() {
  const { 
    config, insumos, listaCustosFixos, listaColaboradores, 
    listaDespesasFixas, listaDespesasVariaveis,
    totalCF_Mensal, totalDF_Mensal, totalDV_Mensal 
  } = useContext(AppContext);
  
  const [exibirRelatorio, setExibirRelatorio] = useState(false);
  const roxo = '#4d235e';
  const lavanda = '#9e86bd';

  const calcularTudo = () => {
    const dias = parseFloat(config.dias) || 1;
    const horas = parseFloat(config.horas) || 1;
    const tempoProd = parseFloat(config.tempoProducao) || 1;
    const minMes = dias * horas * 60;
    const lucroDesejado = parseFloat(config.lucroDesejado) || 0;

    const CVR = insumos.reduce((acc, curr) => acc + (parseFloat(curr.custoFração) || 0), 0);
    const CFR = (totalCF_Mensal / minMes) * tempoProd;
    const DFR = (totalDF_Mensal / minMes) * tempoProd;
    const DVR = (totalDV_Mensal / minMes) * tempoProd;
    const totalGeral = CFR + CVR + DFR + DVR;

    const pDF = totalGeral > 0 ? (DFR / totalGeral) * 100 : 0;
    const pDV = totalGeral > 0 ? (DVR / totalGeral) * 100 : 0;
    const pCF = totalGeral > 0 ? (CFR / totalGeral) * 100 : 0;
    const pCV = totalGeral > 0 ? (CVR / totalGeral) * 100 : 0;

    const divisorMarkup = 100 - (pDF + pDV + lucroDesejado);
    const markupIndice = divisorMarkup > 0 ? 100 / divisorMarkup : 1.0;

    const PV = totalGeral + (totalGeral * (lucroDesejado / 100));
    const PVM = totalGeral * markupIndice;

    const margemContribuicao = PVM - CVR;
    const PE = margemContribuicao > 0 ? totalCF_Mensal / margemContribuicao : 0;

    return { 
      CFR, CVR, DFR, DVR, totalGeral, PV, PVM, PE, 
      pCF, pCV, pDF, pDV, markupIndice, 
      totalCF_Mensal, margemContribuicao, lucroDesejado 
    };
  };

  const r = calcularTudo();

  const TabelaDinamica = ({ titulo, dados, valorTotal, labelTotal, cor }) => (
    <View className="mb-6 border border-gray-100 rounded-[30px] overflow-hidden bg-white shadow-sm">
      <View style={{ backgroundColor: cor }} className="p-4">
        <Text className="text-white font-black text-[10px] uppercase tracking-widest">{titulo}</Text>
      </View>
      {dados.map((item, index) => (
        <View key={index} className="flex-row justify-between p-4 border-b border-gray-50">
          <Text className="text-gray-500 text-xs flex-1">{item.nome || 'Item'}</Text>
          <Text className="font-bold text-gray-800 text-xs">R$ {parseFloat(item.valor || item.salario || item.custoFração || 0).toFixed(2)}</Text>
        </View>
      ))}
      <View className="bg-gray-50 p-4 flex-row justify-between">
        <Text className="font-black text-gray-400 text-[9px] uppercase">{labelTotal}</Text>
        <Text style={{ color: roxo }} className="font-black text-xs">R$ {valorTotal.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FF]">
      <ScrollView className="flex-1 p-6">
        
        <View className="mb-8 flex-row justify-between items-center">
          <View>
            <Text style={{ color: roxo }} className="text-2xl font-black uppercase">Relatório</Text>
            <Text className="text-gray-400 font-bold text-[10px] uppercase">Dados Dinâmicos do Negócio</Text>
          </View>
          {exibirRelatorio && (
            <TouchableOpacity className="bg-green-600 p-2 rounded-full shadow-md">
              <MaterialCommunityIcons name="printer" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {!exibirRelatorio ? (
          <TouchableOpacity 
            onPress={() => setExibirRelatorio(true)} 
            style={{ backgroundColor: roxo }} 
            className="p-10 rounded-[45px] items-center shadow-2xl"
          >
            <MaterialCommunityIcons name="finance" size={50} color="white" />
            <Text className="text-white font-black mt-4 uppercase text-center">Processar Dados Atuais</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <TabelaDinamica titulo="Custos Fixos Mensais" dados={[...listaColaboradores, ...listaCustosFixos]} valorTotal={r.totalCF_Mensal} labelTotal="Total CF" cor={roxo} />
            <TabelaDinamica titulo="Materiais (Insumos)" dados={insumos} valorTotal={r.CVR} labelTotal="Total CV Unidade" cor="#2D6A4F" />
            <TabelaDinamica titulo="Despesas Fixas" dados={listaDespesasFixas} valorTotal={r.totalDF_Mensal} labelTotal="Total DF" cor="#1B4332" />
            <TabelaDinamica titulo="Despesas Variáveis" dados={listaDespesasVariaveis} valorTotal={r.totalDV_Mensal} labelTotal="Total DV" cor="#D4A373" />

            <View className="bg-white border border-gray-200 rounded-[35px] overflow-hidden mb-8 shadow-sm">
              <View style={{ backgroundColor: '#F2F2F2' }} className="p-4"><Text className="font-black text-[10px] uppercase">Motor de Precificação</Text></View>
              <View className="p-5">
                <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs">Custo Unitário Total</Text><Text className="font-bold text-xs">R$ {r.totalUnitario.toFixed(2)}</Text></View>
                <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs">Margem de Lucro</Text><Text className="font-bold text-xs">{r.lucroDesejado}%</Text></View>
                <View className="flex-row justify-between mb-4 border-t border-gray-100 pt-2"><Text className="font-bold text-xs">Mark-up Calculado</Text><Text className="font-black text-purple-700">{r.markupIndice.toFixed(2)}x</Text></View>
                
                <View style={{ backgroundColor: roxo }} className="p-5 rounded-3xl">
                  <Text className="text-white/70 text-[10px] font-bold uppercase text-center">Preço Final com Mark-up</Text>
                  <Text className="text-white text-3xl font-black text-center mt-1">R$ {r.PVM.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            <View className="bg-amber-50 p-8 rounded-[40px] mb-10 border border-amber-200 items-center">
              <Text className="text-amber-900 font-black text-xs mb-2 uppercase">Ponto de Equilíbrio</Text>
              <Text className="text-amber-900 text-5xl font-black">{Math.ceil(r.PE)}</Text>
              <Text className="text-amber-700 font-bold text-[10px] uppercase mt-2">Unidades p/ Mês</Text>
              <View className="h-[1px] w-full bg-amber-200 my-4" />
              <Text className="text-gray-400 text-[8px] text-center italic">Este valor é dinâmico e muda conforme seus custos fixos e sua margem de lucro.</Text>
            </View>

            <TouchableOpacity onPress={() => setExibirRelatorio(false)} className="items-center mb-20">
              <Text className="text-gray-400 font-bold uppercase text-[10px]">Ajustar Informações</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
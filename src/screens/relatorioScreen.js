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

  const calcular = () => {
    const dias = parseFloat(config.dias) || 1;
    const horas = parseFloat(config.horas) || 1;
    const tempoProd = parseFloat(config.tempoProducao) || 1;
    const minMes = dias * horas * 60; 
    const lucroDesejadoPercent = parseFloat(config.lucroDesejado) || 0;


    const CFR = (totalCF_Mensal / minMes) * tempoProd; 
    const DFR = (totalDF_Mensal / minMes) * tempoProd;
    const DVR = (totalDV_Mensal / minMes) * tempoProd;

 
    const CVR = insumos.reduce((acc, curr) => acc + (parseFloat(curr.custoFração) || 0), 0);

    const totalGeral = CFR + CVR + DFR + DVR; 


    const PV = totalGeral + (totalGeral * (lucroDesejadoPercent / 100));
    const pDF = totalGeral > 0 ? (DFR / totalGeral) * 100 : 0;
    const pDV = totalGeral > 0 ? (DVR / totalGeral) * 100 : 0;
    const denoMarkup = 100 - (pDF + pDV + lucroDesejadoPercent);
    const markupIdx = denoMarkup > 0 ? 100 / denoMarkup : 1;
    const PVM = totalGeral * markupIdx;

    const margemContribuicao = PVM - CVR;
    const PE = margemContribuicao > 0 ? totalCF_Mensal / margemContribuicao : 0;

    return { 
      CFR, CVR, DFR, DVR, totalGeral, PV, PVM, PE, markupIdx, 
      minMes, totalCF_Mensal, totalDF_Mensal, totalDV_Mensal, tempoProd, margemContribuicao
    };
  };

  const r = calcular();
  const imprimirPDF = async () => {

    Alert.alert("PDF", "Gerando documento estruturado...");

  };

  const TabelaTransparencia = ({ titulo, dados, valorTotal, labelTotal, cor }) => (
    <View className="mb-6 border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
      <View style={{ backgroundColor: cor }} className="p-3">
        <Text className="text-white font-black text-[10px] uppercase">{titulo}</Text>
      </View>
      {dados.map((item, index) => (
        <View key={index} className="flex-row justify-between p-3 border-b border-gray-50">
          <Text className="text-gray-500 text-xs flex-1">{item.nome || 'Item'}</Text>
          <Text className="font-bold text-gray-800 text-xs">R$ {parseFloat(item.valor || item.salario || item.custoFração || 0).toFixed(2)}</Text>
        </View>
      ))}
      <View className="bg-gray-50 p-3 flex-row justify-between">
        <Text className="font-black text-gray-400 text-[9px] uppercase">{labelTotal}</Text>
        <Text style={{ color: roxo }} className="font-black text-xs">R$ {valorTotal.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FBFBFF]">
      <ScrollView className="flex-1 p-6">
        
        <View className="mb-8 flex-row justify-between items-center">
          <Text style={{ color: roxo }} className="text-2xl font-black uppercase">Relatório Transparente</Text>
          {exibirRelatorio && (
            <TouchableOpacity onPress={imprimirPDF} className="bg-green-600 p-2 rounded-full">
              <MaterialCommunityIcons name="printer" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {!exibirRelatorio ? (
          <TouchableOpacity onPress={() => setExibirRelatorio(true)} style={{ backgroundColor: roxo }} className="p-10 rounded-[40px] items-center">
            <MaterialCommunityIcons name="file-find" size={50} color="white" />
            <Text className="text-white font-black mt-4">VER DETALHAMENTO COMPLETO</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <TabelaTransparencia 
              titulo="1. Custos Fixos (Operação + Pessoal)" 
              dados={[...listaColaboradores, ...listaCustosFixos, {nome: 'Seu Prólabore', valor: config.salario}]}
              valorTotal={r.totalCF_Mensal}
              labelTotal="Total Custo Fixo Mensal"
              cor={roxo}
            />

            <TabelaTransparencia 
              titulo="2. Custos Variáveis (Insumos/Materiais)" 
              dados={insumos}
              valorTotal={r.CVR}
              labelTotal="Custo Variável Unitário"
              cor="#2D6A4F"
            />

            <TabelaTransparencia 
              titulo="3. Despesas Fixas (Administrativas)" 
              dados={listaDespesasFixas}
              valorTotal={r.totalDF_Mensal}
              labelTotal="Total Despesa Fixa Mensal"
              cor="#1B4332"
            />

            <TabelaTransparencia 
              titulo="4. Despesas Variáveis (Vendas/Entrega)" 
              dados={listaDespesasVariaveis}
              valorTotal={r.totalDV_Mensal}
              labelTotal="Total Despesa Variável Mensal"
              cor="#D4A373"
            />
            <View className="bg-amber-50 p-6 rounded-[35px] mb-8 border border-amber-200">
              <Text className="text-amber-900 font-black text-xs mb-4 uppercase">Caminho até o PE</Text>
              
              <View className="mb-4">
                <Text className="text-gray-500 text-[10px] uppercase font-bold">Passo 1: Numerador (Seus Gastos Fixos)</Text>
                <Text className="text-gray-800 text-sm">Você precisa pagar <Text className="font-black">R$ {r.totalCF_Mensal.toFixed(2)}</Text> todo mês (Custos Fixos).</Text>
              </View>

              <View className="mb-4">
                <Text className="text-gray-500 text-[10px] uppercase font-bold">Passo 2: Margem de Contribuição</Text>
                <Text className="text-gray-800 text-sm">Ao vender por R$ {r.PVM.toFixed(2)} e tirar R$ {r.CVR.toFixed(2)} de material, te sobram <Text className="font-black text-green-700">R$ {r.margemContribuicao.toFixed(2)}</Text> por unidade para pagar as contas.</Text>
              </View>

              <View className="pt-4 border-t border-amber-200">
                <Text className="text-amber-900 font-black text-center text-lg">Ponto de Equilíbrio: {Math.ceil(r.PE)} unidades</Text>
                <Text className="text-amber-700 text-[10px] text-center italic">Calculado como: R$ {r.totalCF_Mensal.toFixed(2)} ÷ R$ {r.margemContribuicao.toFixed(2)}</Text>
              </View>
            </View>

            <View style={{ backgroundColor: roxo }} className="p-8 rounded-[45px] mb-20 shadow-xl">
               <Text className="text-white font-black text-center text-xl mb-6">Rentabilidade Final</Text>
               <View className="flex-row justify-between mb-4 border-b border-white/20 pb-2">
                  <Text className="text-white/70">Preço com Mark-up</Text>
                  <Text className="text-white font-black">R$ {r.PVM.toFixed(2)}</Text>
               </View>
               <View className="flex-row justify-between">
                  <Text className="text-white/70">Lucro Líquido Unitário</Text>
                  <Text className="text-green-400 font-black">R$ {(r.PVM - r.totalGeral).toFixed(2)}</Text>
               </View>
            </View>

            <TouchableOpacity onPress={() => setExibirRelatorio(false)} className="items-center mb-10">
              <Text className="text-gray-400 font-bold uppercase text-[10px]">Fechar e Revisar Dados</Text>
            </TouchableOpacity>

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
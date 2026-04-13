import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, useWindowDimensions } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RelatoriosScreen() {
  const { 
    config, insumos, listaCustosFixos, listaColaboradores, 
    listaDespesasFixas, listaDespesasVariaveis,
    totalCF_Mensal, totalDF_Mensal, totalDV_Mensal 
  } = useContext(AppContext);
  
  const [abaAtiva, setAbaAtiva] = useState('geral'); // 'geral' ou 'formacao'
  const [exibirRelatorio, setExibirRelatorio] = useState(false);
  const { height, width } = useWindowDimensions();

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

    // Percentuais sobre o Total Geral (Custo)
    const pCV = totalGeral > 0 ? (CVR / totalGeral) * 100 : 0;
    const pCF = totalGeral > 0 ? (CFR / totalGeral) * 100 : 0;
    const pDF = totalGeral > 0 ? (DFR / totalGeral) * 100 : 0;
    const pDV = totalGeral > 0 ? (DVR / totalGeral) * 100 : 0;

    // 1. Preço de Venda Sem Mark-up (Margem Simples)
    const valorLucroDesejado = totalGeral * (lucroDesejado / 100);
    const PV_sem = totalGeral + valorLucroDesejado;

    // 2. Preço de Venda Com Mark-up
    // Requisito: % de Despesas e Lucro sobre o PREÇO DE VENDA FINAL
    const pDF_total = totalGeral > 0 ? (DFR / totalGeral) * 100 : 0;
    const pDV_total = totalGeral > 0 ? (DVR / totalGeral) * 100 : 0;
    
    const divisorMarkup = 100 - (pDF + pDV + lucroDesejado);
    const markupIndice = divisorMarkup > 0 ? 100 / divisorMarkup : 1.0;
    const PVM = totalGeral * markupIndice;

    const diferencaAbsoluta = PVM - PV_sem;
    const ganhoPercentual = PV_sem > 0 ? (diferencaAbsoluta / PV_sem) * 100 : 0;

    const margemContribuicao = PVM - CVR;
    const PE = margemContribuicao > 0 ? totalCF_Mensal / margemContribuicao : 0;

    return { 
      CFR, CVR, DFR, DVR, totalGeral, PV_sem, PVM, PE, 
      pCF, pCV, pDF, pDV, markupIndice, 
      totalCF_Mensal, lucroDesejado, valorLucroDesejado,
      diferencaAbsoluta, ganhoPercentual
    };
  };

  const r = calcularTudo();

  const LinhaTabela = ({ label, valor, porcentagem, negrito = false, corTexto = '#4b5563' }) => (
    <View className="flex-row justify-between p-4 border-b border-gray-50 items-center">
      <Text style={{ color: corTexto }} className={`text-xs flex-1 ${negrito ? 'font-black' : 'font-medium'}`}>{label}</Text>
      <Text style={{ color: corTexto }} className={`text-xs w-24 text-right ${negrito ? 'font-black' : 'font-bold'}`}>R$ {valor.toFixed(2)}</Text>
      <Text style={{ color: corTexto }} className={`text-xs w-16 text-right ${negrito ? 'font-black' : 'font-bold'}`}>{porcentagem}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: '#F9F9FF', flex: 1 }}>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: height * 0.05, paddingBottom: 60 }}
      >
        
        <View className="mb-8 flex-row justify-between items-end">
          <View>
            <Text style={{ color: roxo }} className="text-3xl font-black uppercase tracking-tighter">Relatórios</Text>
            <Text className="text-gray-400 font-bold text-[10px] uppercase">Inteligência de Dados</Text>
          </View>
          <MaterialCommunityIcons name="newspaper-variant-outline" size={32} color={roxo} />
        </View>

        {!exibirRelatorio ? (
          <TouchableOpacity 
            onPress={() => setExibirRelatorio(true)} 
            style={{ backgroundColor: roxo }} 
            className="p-12 rounded-[50px] items-center shadow-2xl border-b-8 border-black/20"
          >
            <MaterialCommunityIcons name="finance" size={60} color="white" />
            <Text className="text-white font-black mt-6 uppercase text-center tracking-widest">Processar Relatórios</Text>
          </TouchableOpacity>
        ) : (
          <View>
            {/* SELETOR DE RELATÓRIO */}
            <View className="flex-row bg-gray-200 p-1 rounded-full mb-8">
              <TouchableOpacity 
                onPress={() => setAbaAtiva('geral')}
                className={`flex-1 py-3 rounded-full ${abaAtiva === 'geral' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text style={{ color: abaAtiva === 'geral' ? roxo : '#9ca3af' }} className="text-center font-black text-[9px] uppercase">Visão Geral</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setAbaAtiva('formacao')}
                className={`flex-1 py-3 rounded-full ${abaAtiva === 'formacao' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text style={{ color: abaAtiva === 'formacao' ? roxo : '#9ca3af' }} className="text-center font-black text-[9px] uppercase">Formação de Preço</Text>
              </TouchableOpacity>
            </View>

            {abaAtiva === 'geral' ? (
              <View>

                <View className="mb-6 border border-gray-100 rounded-[35px] overflow-hidden bg-white shadow-sm">
                  <View style={{ backgroundColor: roxo }} className="p-4"><Text className="text-white font-black text-[10px] uppercase">Custos Fixos</Text></View>
                  <LinhaTabela label="Total CF Mensal" valor={r.totalCF_Mensal} porcentagem="-" />
                  <LinhaTabela label="Rateio/Unidade" valor={r.CFR} porcentagem={`${r.pCF.toFixed(1)}%`} negrito />
                </View>

                <View className="mb-6 border border-gray-100 rounded-[35px] overflow-hidden bg-white shadow-sm">
                  <View style={{ backgroundColor: '#2D6A4F' }} className="p-4"><Text className="text-white font-black text-[10px] uppercase">Insumos (Variáveis)</Text></View>
                  <LinhaTabela label="Total Insumos" valor={r.CVR} porcentagem={`${r.pCV.toFixed(1)}%`} negrito />
                </View>

                <View className="bg-amber-50 p-8 rounded-[45px] mb-10 border border-amber-200 items-center">
                  <Text className="text-amber-900 font-black text-[10px] mb-2 uppercase">Ponto de Equilíbrio</Text>
                  <Text className="text-amber-900 text-5xl font-black">{Math.ceil(r.PE)}</Text>
                  <Text className="text-amber-700 font-bold text-[10px] uppercase mt-2">Unidades p/ Mês</Text>
                </View>
              </View>
            ) : (
              <View>

                <View className="mb-6 border border-gray-100 rounded-[40px] overflow-hidden bg-white shadow-xl">
                  <View style={{ backgroundColor: '#f3f4f6' }} className="p-5 flex-row justify-between">
                    <Text className="font-black text-[9px] uppercase text-gray-400">Descrição</Text>
                    <View className="flex-row">
                      <Text className="font-black text-[9px] uppercase text-gray-400 w-24 text-right">Valor (R$)</Text>
                      <Text className="font-black text-[9px] uppercase text-gray-400 w-16 text-right">%</Text>
                    </View>
                  </View>

                  <LinhaTabela label="Custo variável (CV)" valor={r.CVR} porcentagem={r.pCV.toFixed(2)} />
                  <LinhaTabela label="Custos fixos (CF)" valor={r.CFR} porcentagem={r.pCF.toFixed(2)} />
                  <LinhaTabela label="Despesas fixas (DF)" valor={r.DFR} porcentagem={r.pDF.toFixed(2)} />
                  <LinhaTabela label="Despesas variáveis (DV)" valor={r.DVR} porcentagem={r.pDV.toFixed(2)} />
                  
                  <View style={{ backgroundColor: roxo }} className="flex-row justify-between p-5">
                    <Text className="text-white font-black text-xs uppercase">TOTAL (CV+CF+DF+DV)</Text>
                    <View className="flex-row">
                      <Text className="text-white font-black text-xs w-24 text-right">R$ {r.totalGeral.toFixed(2)}</Text>
                      <Text className="text-white font-black text-xs w-16 text-right">100%</Text>
                    </View>
                  </View>

                  <LinhaTabela label="Margem de lucro desejada" valor={r.valorLucroDesejado} porcentagem={`${r.lucroDesejado}%`} />
                  
                  <View className="bg-gray-50 flex-row justify-between p-5 border-b border-gray-100">
                    <Text className="text-gray-900 font-black text-xs uppercase">Preço de venda (sem mark-up)</Text>
                    <Text className="text-gray-900 font-black text-xs">R$ {r.PV_sem.toFixed(2)}</Text>
                  </View>

                  <View className="flex-row justify-between p-5 border-b border-gray-100">
                    <Text className="text-gray-500 font-bold text-xs">Mark-up</Text>
                    <Text className="text-purple-700 font-black text-xs">{r.markupIndice.toFixed(2)}</Text>
                  </View>

                  <View style={{ backgroundColor: '#059669' }} className="flex-row justify-between p-5">
                    <Text className="text-white font-black text-xs uppercase">Preço de venda (com mark-up)</Text>
                    <Text className="text-white font-black text-xs">R$ {r.PVM.toFixed(2)}</Text>
                  </View>
                </View>

                <View className="bg-red-50 p-6 rounded-[40px] border border-red-100 mb-8">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-red-600 font-black text-[10px] uppercase">Diferença (com e sem mark-up)</Text>
                    <Text className="text-red-600 font-black text-lg">R$ {r.diferencaAbsoluta.toFixed(2)}</Text>
                  </View>
                  <View className="bg-white p-4 rounded-3xl items-center">
                    <Text className="text-gray-400 font-bold text-[10px] uppercase mb-1">Potencial de Ganho Extra</Text>
                    <Text className="text-green-600 font-black text-3xl">{r.ganhoPercentual.toFixed(2)}%</Text>
                  </View>
                  <Text className="text-red-400 text-[9px] font-bold text-center mt-4 italic">
                    *** Você pode ganhar até {r.ganhoPercentual.toFixed(2)}% por unidade vendida
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity 
              onPress={() => setExibirRelatorio(false)} 
              className="items-center mb-20 bg-gray-100 p-4 rounded-full"
            >
              <Text className="text-gray-400 font-bold uppercase text-[10px]">← Ajustar Informações</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
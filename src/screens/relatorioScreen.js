import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, useWindowDimensions } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RelatoriosScreen() {
  const { 
    config, insumos, listaCustosFixos, listaColaboradores, 
    listaDespesasFixas, listaDespesasVariaveis,
    totalCF_Mensal, totalDF_Mensal, totalDV_Mensal 
  } = useContext(AppContext);
  
  const [abaAtiva, setAbaAtiva] = useState('geral');
  const [exibirRelatorio, setExibirRelatorio] = useState(false);
  const { height } = useWindowDimensions();

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

    const PV_sem = totalGeral + (totalGeral * (lucroDesejado / 100));
    const PVM = totalGeral * markupIndice;

    const diferencaAbsoluta = PVM - PV_sem;
    const ganhoPercentual = PV_sem > 0 ? (diferencaAbsoluta / PV_sem) * 100 : 0;

    const margemBrutaSem = PV_sem - CVR;
    const margemBrutaCom = PVM - CVR;
    const margemBrutaPercSem = PV_sem > 0 ? (margemBrutaSem / PV_sem) * 100 : 0;
    const margemBrutaPercCom = PVM > 0 ? (margemBrutaCom / PVM) * 100 : 0;

    const somaCF_DF_DV = CFR + DFR + DVR;
    const lucroFinalSem = PV_sem - totalGeral;
    const lucroFinalCom = PVM - totalGeral;

    const PE_Sem = margemBrutaSem > 0 ? totalCF_Mensal / margemBrutaSem : 0;
    const PE_Com = margemBrutaCom > 0 ? totalCF_Mensal / margemBrutaCom : 0;

    return { 
      CFR, CVR, DFR, DVR, totalGeral, PV_sem, PVM, PE_Sem, PE_Com,
      pCF, pCV, pDF, pDV, markupIndice, 
      totalCF_Mensal, totalDF_Mensal, totalDV_Mensal, lucroDesejado,
      diferencaAbsoluta, ganhoPercentual, margemBrutaSem, margemBrutaCom,
      margemBrutaPercSem, margemBrutaPercCom, somaCF_DF_DV, lucroFinalSem, lucroFinalCom
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

  const LinhaFormacao = ({ label, valor, porcentagem, negrito = false, corFundo = 'transparent', corTexto = '#4b5563' }) => (
    <View style={{ backgroundColor: corFundo }} className="flex-row justify-between p-4 border-b border-gray-50 items-center">
      <Text style={{ color: corTexto }} className={`text-xs flex-1 ${negrito ? 'font-black' : 'font-medium'}`}>{label}</Text>
      <Text style={{ color: corTexto }} className={`text-xs w-24 text-right ${negrito ? 'font-black' : 'font-bold'}`}>R$ {valor.toFixed(2)}</Text>
      <Text style={{ color: corTexto }} className={`text-xs w-16 text-right ${negrito ? 'font-black' : 'font-bold'}`}>{porcentagem}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: '#F9F9FF', flex: 1 }}>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: height * 0.05, paddingBottom: 60 }}
      >
        <View className="mb-8 flex-row justify-between items-end">
          <View>
            <Text style={{ color: roxo }} className="text-3xl font-black uppercase tracking-tighter">Relatórios</Text>
            <Text className="text-gray-400 font-bold text-[10px] uppercase">Gestão e Performance</Text>
          </View>
          <MaterialCommunityIcons name="finance" size={32} color={roxo} />
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
            <View className="flex-row bg-gray-200 p-1 rounded-2xl mb-8">
              {['geral', 'formacao', 'margem'].map((item) => (
                <TouchableOpacity 
                  key={item}
                  onPress={() => setAbaAtiva(item)}
                  className={`flex-1 py-3 rounded-xl ${abaAtiva === item ? 'bg-white shadow-sm' : ''}`}
                >
                  <Text style={{ color: abaAtiva === item ? roxo : '#9ca3af' }} className="text-center font-black text-[8px] uppercase">
                    {item === 'geral' ? 'Visão Geral' : item === 'formacao' ? 'Formação Preço de Venda' : 'Margem/Rentab'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {abaAtiva === 'geral' && (
              <View>
                <TabelaDinamica titulo="Custos Fixos Mensais" dados={[...listaColaboradores, ...listaCustosFixos]} valorTotal={r.totalCF_Mensal} labelTotal="Total CF" cor={roxo} />
                <TabelaDinamica titulo="Materiais (Insumos)" dados={insumos} valorTotal={r.CVR} labelTotal="Total CV Unidade" cor="#2D6A4F" />
                <TabelaDinamica titulo="Despesas Fixas" dados={listaDespesasFixas} valorTotal={r.totalDF_Mensal} labelTotal="Total DF" cor="#1B4332" />
                <TabelaDinamica titulo="Despesas Variáveis" dados={listaDespesasVariaveis} valorTotal={r.totalDV_Mensal} labelTotal="Total DV" cor="#D4A373" />

                <View className="bg-white border border-gray-200 rounded-[35px] overflow-hidden mb-8 shadow-sm">
                  <View style={{ backgroundColor: '#F2F2F2' }} className="p-4"><Text className="font-black text-[10px] uppercase">Motor de Precificação</Text></View>
                  <View className="p-5">
                    <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs">Custo Unitário Total</Text><Text className="font-bold text-xs">R$ {r.totalGeral.toFixed(2)}</Text></View>
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
                  <Text className="text-amber-900 text-5xl font-black">{Math.ceil(r.PE_Com)}</Text>
                  <Text className="text-amber-700 font-bold text-[10px] uppercase mt-2">Unidades p/ Mês</Text>
                </View>
              </View>
            )}

            {abaAtiva === 'formacao' && (
              <View>
                <View className="mb-6 border border-gray-100 rounded-[40px] overflow-hidden bg-white shadow-xl">
                  <View style={{ backgroundColor: '#f3f4f6' }} className="p-5 flex-row justify-between">
                    <Text className="font-black text-[9px] uppercase text-gray-400">Descrição</Text>
                    <View className="flex-row">
                      <Text className="font-black text-[9px] uppercase text-gray-400 w-24 text-right">Valor (R$)</Text>
                      <Text className="font-black text-[9px] uppercase text-gray-400 w-16 text-right">%</Text>
                    </View>
                  </View>
                  <LinhaFormacao label="Custo variável (CV)" valor={r.CVR} porcentagem={`${r.pCV.toFixed(2)}%`} />
                  <LinhaFormacao label="Custos fixos (CF)" valor={r.CFR} porcentagem={`${r.pCF.toFixed(2)}%`} />
                  <LinhaFormacao label="Despesas fixas (DF)" valor={r.DFR} porcentagem={`${r.pDF.toFixed(2)}%`} />
                  <LinhaFormacao label="Despesas variáveis (DV)" valor={r.DVR} porcentagem={`${r.pDV.toFixed(2)}%`} />
                  <LinhaFormacao label="TOTAL (CV+CF+DF+DV)" valor={r.totalGeral} porcentagem="100%" negrito corFundo="#f9fafb" />
                  <LinhaFormacao label="Margem de lucro desejada" valor={r.totalGeral * (r.lucroDesejado/100)} porcentagem={`${r.lucroDesejado}%`} />
                  <LinhaFormacao label="Preço de venda (sem mark-up)" valor={r.PV_sem} porcentagem="-" negrito />
                  <View className="flex-row justify-between p-4 border-b border-gray-50"><Text className="text-gray-500 text-xs font-medium">Mark-up</Text><Text className="font-black text-purple-700 text-xs">{r.markupIndice.toFixed(2)}</Text></View>
                  <View style={{ backgroundColor: roxo }} className="flex-row justify-between p-5"><Text className="text-white font-black text-xs uppercase">Preço de venda (com mark-up)</Text><Text className="text-white font-black text-xs">R$ {r.PVM.toFixed(2)}</Text></View>
                </View>
                <View className="bg-red-50 p-6 rounded-[40px] border border-red-100 mb-8 items-center">
                  <Text className="text-red-600 font-black text-[10px] uppercase mb-2">Diferença (com e sem mark-up)</Text>
                  <Text className="text-red-600 font-black text-2xl mb-2">R$ {r.diferencaAbsoluta.toFixed(2)}</Text>
                  <Text className="text-green-600 font-black text-sm uppercase">Ganho Extra: {r.ganhoPercentual.toFixed(2)}%</Text>
                  <Text className="text-red-400 text-[9px] font-bold text-center mt-4 italic">*** Você pode ganhar até {r.ganhoPercentual.toFixed(2)}% por unidade vendida</Text>
                </View>
              </View>
            )}

            {abaAtiva === 'margem' && (
              <View>
                <View className="mb-6 border border-gray-100 rounded-[40px] overflow-hidden bg-white shadow-xl">
                  <View style={{ backgroundColor: roxo }} className="p-5 flex-row justify-between">
                    <Text className="text-white font-black text-[9px] uppercase flex-1">Indicador</Text>
                    <Text className="text-white font-black text-[9px] uppercase w-20 text-right">Simples</Text>
                    <Text className="text-white font-black text-[9px] uppercase w-20 text-right">Mark-up</Text>
                  </View>
                  <View className="flex-row justify-between p-4 border-b border-gray-50"><Text className="text-[10px] font-bold text-gray-500 uppercase flex-1">Preço de venda (PV)</Text><Text className="text-xs font-bold w-20 text-right">R$ {r.PV_sem.toFixed(2)}</Text><Text style={{ color: roxo }} className="text-xs font-black w-20 text-right">R$ {r.PVM.toFixed(2)}</Text></View>
                  <View className="flex-row justify-between p-4 border-b border-gray-50"><Text className="text-[10px] font-bold text-gray-500 uppercase flex-1">Custo variável (CV)</Text><Text className="text-xs font-bold w-20 text-right">R$ {r.CVR.toFixed(2)}</Text><Text style={{ color: roxo }} className="text-xs font-black w-20 text-right">R$ {r.CVR.toFixed(2)}</Text></View>
                  <View className="flex-row justify-between p-4 border-b border-gray-50"><Text className="text-[10px] font-bold text-gray-500 uppercase flex-1">Margem bruta (PV-CV)</Text><Text className="text-xs font-bold w-20 text-right">R$ {r.margemBrutaSem.toFixed(2)}</Text><Text style={{ color: roxo }} className="text-xs font-black w-20 text-right">R$ {r.margemBrutaCom.toFixed(2)}</Text></View>
                  <View className="flex-row justify-between p-4 border-b border-gray-50"><Text className="text-[10px] font-bold text-gray-500 uppercase flex-1">Margem bruta (%)</Text><Text className="text-xs font-bold w-20 text-right">{r.margemBrutaPercSem.toFixed(2)}%</Text><Text style={{ color: roxo }} className="text-xs font-black w-20 text-right">{r.margemBrutaPercCom.toFixed(2)}%</Text></View>
                  <View className="flex-row justify-between p-4 border-b border-gray-50"><Text className="text-[10px] font-bold text-gray-500 uppercase flex-1">Custos + Despesas</Text><Text className="text-xs font-bold w-20 text-right">R$ {r.somaCF_DF_DV.toFixed(2)}</Text><Text style={{ color: roxo }} className="text-xs font-black w-20 text-right">R$ {r.somaCF_DF_DV.toFixed(2)}</Text></View>
                  <View className="flex-row justify-between p-4 border-b border-gray-50 bg-purple-50"><Text className="text-[10px] font-black text-purple-900 uppercase flex-1">Lucro/Prejuízo</Text><Text className="text-xs font-black w-20 text-right">R$ {r.lucroFinalSem.toFixed(2)}</Text><Text className="text-xs font-black text-purple-900 w-20 text-right">R$ {r.lucroFinalCom.toFixed(2)}</Text></View>
                  <View className="flex-row justify-between p-4 bg-gray-50"><Text className="text-[10px] font-bold text-gray-400 uppercase flex-1">Ponto de Equilíbrio</Text><Text className="text-xs font-bold text-gray-400 w-20 text-right">{Math.ceil(r.PE_Sem)} un</Text><Text style={{ color: roxo }} className="text-xs font-black w-20 text-right">{Math.ceil(r.PE_Com)} un</Text></View>
                </View>
                <View className="bg-purple-50 p-6 rounded-[40px] border border-purple-100 mb-10">
                  <Text className="text-gray-600 text-[11px] font-bold leading-tight text-center">
                    Seu lucro final é de <Text style={{ color: roxo }}>R$ {r.lucroFinalSem.toFixed(2)}</Text> por unidade sem mark-up{"\n"}
                    Seu lucro final é de <Text style={{ color: roxo }}>R$ {r.lucroFinalCom.toFixed(2)}</Text> por unidade com mark-up
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity onPress={() => setExibirRelatorio(false)} className="items-center mb-20 bg-gray-100 p-4 rounded-full">
              <Text className="text-gray-400 font-bold uppercase text-[10px]">Ajustar Informações</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
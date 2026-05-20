import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, useWindowDimensions, Dimensions, PixelRatio } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Lógica de Escalonamento baseada no seu Pixel 7 (largura 412)
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 412;

function rf(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function RelatoriosScreen() {
  const { produtos } = useContext(AppContext);
  
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('geral');
  const { height } = useWindowDimensions();

  const roxo = '#4d235e';
  const lavanda = '#9e86bd';

  const calcular = (p) => {
    if (!p) return null;

    const config = p.config;
    const insumos = p.insumos;
    const listaColaboradores = p.listaColaboradores;
    const listaCustosFixos = p.listaCustosFixos;
    const listaDespesasFixas = p.listaDespesasFixas;
    const listaDespesasVariaveis = p.listaDespesasVariaveis;

    const totalCF_Mensal = (parseFloat(config.salario) || 0) + 
      listaColaboradores.reduce((acc, c) => acc + (parseFloat(c.salario) || 0), 0) +
      listaCustosFixos.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);

    const totalDF_Mensal = listaDespesasFixas.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);
    const totalDV_Mensal = listaDespesasVariaveis.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);

    const dias = parseFloat(config.dias) || 1;
    const horas = parseFloat(config.horas) || 1;
    const tempoProd = parseFloat(config.tempoProducao) || 1;
    const minMes = dias * horas * 60;
    const lucroDesejado = parseFloat(config.lucroDesejado) || 0;

    const fatorRateio = tempoProd / minMes;

    const CVR = insumos.reduce((acc, curr) => acc + (parseFloat(curr.custoFração) || 0), 0);
    const CFR = totalCF_Mensal * fatorRateio;
    const DFR = totalDF_Mensal * fatorRateio;
    const DVR = totalDV_Mensal * fatorRateio;
    const totalGeral = CFR + CVR + DFR + DVR;

    const pDF = totalGeral > 0 ? (DFR / totalGeral) * 100 : 0;
    const pDV = totalGeral > 0 ? (DVR / totalGeral) * 100 : 0;
    const pCF = totalGeral > 0 ? (CFR / totalGeral) * 100 : 0;
    const pCV = totalGeral > 0 ? (CVR / totalGeral) * 100 : 0;

    const divisorMarkup = 100 - (pDF + pDV + lucroDesejado);
    const markupIndice = divisorMarkup > 0 ? 100 / divisorMarkup : 1.0;

    const PV_sem = totalGeral + (totalGeral * (lucroDesejado / 100));
    const PVM = totalGeral * markupIndice;

    return { 
      CFR, CVR, DFR, DVR, totalGeral, PV_sem, PVM, 
      pCF, pCV, pDF, pDV, markupIndice, 
      totalCF_Mensal, totalDF_Mensal, totalDV_Mensal, lucroDesejado,
      margemBrutaSem: PV_sem - CVR,
      margemBrutaCom: PVM - CVR,
      margemBrutaPercSem: PV_sem > 0 ? ((PV_sem - CVR) / PV_sem) * 100 : 0,
      margemBrutaPercCom: PVM > 0 ? ((PVM - CVR) / PVM) * 100 : 0,
      somaCF_DF_DV: CFR + DFR + DVR,
      lucroFinalSem: PV_sem - totalGeral,
      lucroFinalCom: PVM - totalGeral,
      PE_Sem: (PV_sem - CVR) > 0 ? totalCF_Mensal / (PV_sem - CVR) : 0,
      PE_Com: (PVM - CVR) > 0 ? totalCF_Mensal / (PVM - CVR) : 0,
      fatorRateio
    };
  };

  const r = calcular(produtoSelecionado);

  const TabelaDinamica = ({ titulo, dados, valorTotal, labelTotal, cor, mostrarRateio = false, fator = 0, isCV = false }) => (
    <View className="mb-6 border border-gray-100 rounded-[30px] overflow-hidden bg-white shadow-sm">
      <View style={{ backgroundColor: cor }} className="p-4">
        <Text style={{ fontSize: rf(10) }} className="text-white font-black uppercase tracking-widest text-center">{titulo}</Text>
      </View>
      {dados.map((item, index) => {
        let principal = 0;
        let rateado = 0;
        if (isCV) {
          principal = parseFloat(item.precoEmbalagem || 0);
          rateado = parseFloat(item.custoFração || 0);
        } else {
          principal = parseFloat(item.valor || item.salario || 0);
          rateado = principal * fator;
        }
        return (
          <View key={index} className="flex-row justify-between p-4 border-b border-gray-50">
            <Text style={{ fontSize: rf(11) }} className="text-gray-500 flex-1">{item.nome || 'Item'}</Text>
            <View className="items-end">
              <Text style={{ fontSize: rf(11) }} className="font-bold text-gray-800">
                R$ {principal.toFixed(2)}
                {mostrarRateio && (
                  <Text style={{ color: lavanda }} className="font-medium"> ({rateado.toFixed(2)})</Text>
                )}
              </Text>
            </View>
          </View>
        );
      })}
      <View className="bg-gray-50 p-4 flex-row justify-between">
        <Text style={{ fontSize: rf(9) }} className="font-black text-gray-400 uppercase">{labelTotal}</Text>
        <Text style={{ color: roxo, fontSize: rf(12) }} className="font-black text-center">R$ {valorTotal.toFixed(2)}</Text>
      </View>
    </View>
  );

  const LinhaFormacao = ({ label, valor, porcentagem, negrito = false, corFundo = 'transparent', corTexto = '#4b5563' }) => (
    <View style={{ backgroundColor: corFundo }} className="flex-row justify-between p-4 border-b border-gray-50 items-center">
      <Text style={{ color: corTexto, fontSize: rf(12) }} className={`flex-1 ${negrito ? 'font-black' : 'font-medium'}`}>{label}</Text>
      <Text style={{ color: corTexto, fontSize: rf(12) }} className={`w-24 text-right ${negrito ? 'font-black' : 'font-bold'}`}>R$ {valor.toFixed(2)}</Text>
      <Text style={{ color: corTexto, fontSize: rf(12) }} className={`w-16 text-right ${negrito ? 'font-black' : 'font-bold'}`}>{porcentagem}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: '#F9F9FF', flex: 1 }}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: height * 0.05, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        <View className="mb-8 flex-row justify-between items-end">
          <View>
            <Text style={{ color: roxo, fontSize: rf(30) }} className="text-3xl font-black uppercase tracking-tighter">Relatórios</Text>
            {produtoSelecionado && (
              <Text style={{ color: roxo, fontSize: rf(10) }} className="font-bold uppercase mt-1">
                Analisando: <Text className="font-black">{produtoSelecionado.nome?.trim() ? produtoSelecionado.nome : "Produto sem nome"}</Text>
              </Text>
            )}
          </View>
          {produtoSelecionado && (
            <TouchableOpacity onPress={() => setProdutoSelecionado(null)}>
              <MaterialCommunityIcons name="swap-horizontal" size={rf(32)} color={roxo} />
            </TouchableOpacity>
          )}
        </View>

        {!produtoSelecionado ? (
          <View>
            <Text style={{ fontSize: rf(10) }} className="text-gray-400 font-bold uppercase mb-4 ml-2">Selecione o produto:</Text>
            {produtos.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => setProdutoSelecionado(item)} style={{ backgroundColor: roxo }} className="p-8 rounded-[40px] items-center shadow-xl mb-4 flex-row justify-between">
                <Text style={{ fontSize: rf(14) }} className="text-white font-black uppercase text-center">
                  {item.nome?.trim() ? item.nome : "Produto sem nome"}
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={rf(24)} color="white" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View>
            {/* SELETOR DE ABAS */}
            <View className="flex-row bg-gray-200 p-1 rounded-2xl mb-8">
              {['geral', 'formacao', 'margem'].map((item) => (
                <TouchableOpacity key={item} onPress={() => setAbaAtiva(item)} className={`flex-1 py-3 rounded-xl ${abaAtiva === item ? 'bg-white shadow-sm' : ''}`}>
                  <Text style={{ color: abaAtiva === item ? roxo : '#9ca3af', fontSize: rf(8) }} className="text-center font-black uppercase">
                    {item === 'geral' ? 'Visão Geral' : item === 'formacao' ? 'Preço de Venda' : 'Rentabilidade'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {abaAtiva === 'geral' && (
              <View>
                <TabelaDinamica 
                  titulo="Custos Fixos (Mês vs Rateio)" 
                  dados={[
                    { nome: "Pró-labore (Dono)", salario: produtoSelecionado.config.salario },
                    ...produtoSelecionado.listaColaboradores,
                    ...produtoSelecionado.listaCustosFixos
                  ]} 
                  valorTotal={r.CFR} 
                  labelTotal="Total CF Unitário" 
                  cor={roxo} 
                  mostrarRateio={true}
                  fator={r.fatorRateio}
                />
                <TabelaDinamica titulo="Materiais (Insumos)" dados={produtoSelecionado.insumos} valorTotal={r.CVR} labelTotal="Total Material Unidade" cor={roxo} mostrarRateio={true} isCV={true} />
                <TabelaDinamica titulo="Despesas Fixas" dados={produtoSelecionado.listaDespesasFixas} valorTotal={r.DFR} labelTotal="Total DF Rateado" cor={roxo} mostrarRateio={true} fator={r.fatorRateio} />
                <TabelaDinamica titulo="Despesas Variáveis" dados={produtoSelecionado.listaDespesasVariaveis} valorTotal={r.DVR} labelTotal="Total DV Rateado" cor={roxo} mostrarRateio={true} fator={r.fatorRateio} />
                
                <View className="bg-white border border-gray-200 rounded-[35px] overflow-hidden mb-8 shadow-sm">
                  <View style={{ backgroundColor: lavanda }} className="p-4">
                    <Text style={{ fontSize: rf(10) }} className="font-black uppercase text-center text-white">Motor de Precificação</Text>
                  </View>
                  <View className="p-5">
                    <View className="flex-row justify-between mb-2"><Text style={{ fontSize: rf(12) }} className="text-gray-500">Custo Unitário Total</Text><Text style={{ fontSize: rf(12) }} className="font-bold">R$ {r.totalGeral.toFixed(2)}</Text></View>
                    <View className="flex-row justify-between mb-2"><Text style={{ fontSize: rf(12) }} className="text-gray-500">Preço de Venda (Simples)</Text><Text style={{ fontSize: rf(12) }} className="font-bold">R$ {r.PV_sem.toFixed(2)}</Text></View>
                    <View className="flex-row justify-between mb-4 border-t border-gray-100 pt-2"><Text style={{ fontSize: rf(12) }} className="font-bold">Mark-up Calculado</Text><Text style={{ fontSize: rf(12) }} className="font-black text-purple-700">{r.markupIndice.toFixed(2)}</Text></View>
                    <View style={{ backgroundColor: roxo }} className="p-5 rounded-3xl">
                      <Text style={{ fontSize: rf(10) }} className="text-white/70 font-bold uppercase text-center">Preço Sugerido com Mark-up</Text>
                      <Text style={{ fontSize: rf(30) }} className="text-white font-black text-center mt-1">R$ {r.PVM.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {abaAtiva === 'formacao' && (
              <View className="mb-6 border border-gray-100 rounded-[40px] overflow-hidden bg-white shadow-xl">
                <View style={{ backgroundColor: '#f3f4f6' }} className="p-5 flex-row justify-between">
                  <Text style={{ fontSize: rf(9) }} className="font-black uppercase text-gray-400">Descrição</Text>
                  <View className="flex-row">
                    <Text style={{ fontSize: rf(9) }} className="font-black uppercase text-gray-400 w-24 text-right">Valor (R$)</Text>
                    <Text style={{ fontSize: rf(9) }} className="font-black uppercase text-gray-400 w-16 text-right">%</Text>
                  </View>
                </View>
                <LinhaFormacao label="Custo variável (CV)" valor={r.CVR} porcentagem={`${r.pCV.toFixed(2)}%`} />
                <LinhaFormacao label="Custos fixos (CF)" valor={r.CFR} porcentagem={`${r.pCF.toFixed(2)}%`} />
                <LinhaFormacao label="Despesas fixas (DF)" valor={r.DFR} porcentagem={`${r.pDF.toFixed(2)}%`} />
                <LinhaFormacao label="Despesas variáveis (DV)" valor={r.DVR} porcentagem={`${r.pDV.toFixed(2)}%`} />
                <LinhaFormacao label="TOTAL GERAL" valor={r.totalGeral} porcentagem="100%" negrito corFundo="#f9fafb" />
                <LinhaFormacao label="Margem de lucro desejada" valor={r.totalGeral * (r.lucroDesejado/100)} porcentagem={`${r.lucroDesejado}%`} />
                <View style={{ backgroundColor: roxo }} className="flex-row justify-between p-5"><Text style={{ fontSize: rf(12) }} className="text-white font-black uppercase">Preço com Mark-up</Text><Text style={{ fontSize: rf(12) }} className="text-white font-black text-right">R$ {r.PVM.toFixed(2)}</Text></View>
              </View>
            )}

            {/* ABA RENTABILIDADE COMPLETA CONFORME O MODELO SOLICITADO */}
            {abaAtiva === 'margem' && (
              <View className="mb-6 border border-gray-100 rounded-[40px] overflow-hidden bg-white shadow-xl">
                {/* Cabeçalho da Tabela de Rentabilidade */}
                <View style={{ backgroundColor: roxo }} className="p-5 flex-row justify-between">
                  <Text style={{ fontSize: rf(9) }} className="text-white font-black uppercase flex-1">Indicador</Text>
                  <Text style={{ fontSize: rf(9) }} className="text-white font-black uppercase w-24 text-right">Valor</Text>
                  <Text style={{ fontSize: rf(9) }} className="text-white font-black uppercase w-24 text-right">Valor com Mark-up</Text>
                </View>

                {/* 1. Preço de venda (PV) */}
                <View className="flex-row justify-between p-4 border-b border-gray-50 items-center">
                  <Text style={{ fontSize: rf(10) }} className="font-bold text-gray-500 flex-1 uppercase">Preço de venda (PV)</Text>
                  <Text style={{ fontSize: rf(11) }} className="w-24 text-right text-gray-700 font-medium">R$ {r.PV_sem.toFixed(2)}</Text>
                  <Text style={{ color: roxo, fontSize: rf(11) }} className="w-24 text-right font-black">R$ {r.PVM.toFixed(2)}</Text>
                </View>

                {/* 2. Custo variável (CV) */}
                <View className="flex-row justify-between p-4 border-b border-gray-50 items-center">
                  <Text style={{ fontSize: rf(10) }} className="font-bold text-gray-500 flex-1 uppercase">Custo variável (CV)</Text>
                  <Text style={{ fontSize: rf(11) }} className="w-24 text-right text-gray-700 font-medium">R$ {r.CVR.toFixed(2)}</Text>
                  <Text style={{ fontSize: rf(11) }} className="w-24 text-right text-gray-700 font-medium">R$ {r.CVR.toFixed(2)}</Text>
                </View>

                {/* 3. Margem bruta (PV-CV) */}
                <View className="flex-row justify-between p-4 border-b border-gray-50 items-center">
                  <Text style={{ fontSize: rf(10) }} className="font-bold text-gray-500 flex-1 uppercase">Margem bruta (PV-CV)</Text>
                  <Text style={{ fontSize: rf(11) }} className="w-24 text-right text-gray-700 font-medium">R$ {r.margemBrutaSem.toFixed(2)}</Text>
                  <Text style={{ color: roxo, fontSize: rf(11) }} className="w-24 text-right font-black">R$ {r.margemBrutaCom.toFixed(2)}</Text>
                </View>

                {/* 4. Margem bruta (%) */}
                <View className="flex-row justify-between p-4 border-b border-gray-50 items-center">
                  <Text style={{ fontSize: rf(10) }} className="font-bold text-gray-500 flex-1 uppercase">Margem bruta (%)</Text>
                  <Text style={{ fontSize: rf(11) }} className="w-24 text-right text-gray-700 font-medium">{r.margemBrutaPercSem.toFixed(0)}%</Text>
                  <Text style={{ color: roxo, fontSize: rf(11) }} className="w-24 text-right font-black">{r.margemBrutaPercCom.toFixed(0)}%</Text>
                </View>

                {/* 5. Custos + Despesas (CF + DF + DV) */}
                <View className="flex-row justify-between p-4 border-b border-gray-50 items-center">
                  <Text style={{ fontSize: rf(10) }} className="font-bold text-gray-500 flex-1 uppercase">Custos + Despesas (CF+DF+DV)</Text>
                  <Text style={{ fontSize: rf(11) }} className="w-24 text-right text-gray-700 font-medium">R$ {r.somaCF_DF_DV.toFixed(2)}</Text>
                  <Text style={{ fontSize: rf(11) }} className="w-24 text-right text-gray-700 font-medium">R$ {r.somaCF_DF_DV.toFixed(2)}</Text>
                </View>

                {/* 6. Lucro líquido unitário ou Prejuízo (Mantido destaque estético roxo) */}
                <View className="flex-row justify-between p-4 border-b border-gray-50 bg-purple-50 items-center">
                  <Text style={{ fontSize: rf(10) }} className="font-black text-purple-900 flex-1 uppercase">Lucro líquido / Prejuízo</Text>
                  <Text style={{ fontSize: rf(11) }} className="w-24 text-right font-bold text-purple-900">R$ {r.lucroFinalSem.toFixed(2)}</Text>
                  <Text style={{ fontSize: rf(11) }} className="text-purple-900 w-24 text-right font-black">R$ {r.lucroFinalCom.toFixed(2)}</Text>
                </View>

                {/* 7. Ponto de equilíbrio (unidade/mês) (Mantido destaque estético cinza) */}
                <View className="flex-row justify-between p-4 bg-gray-50 items-center">
                  <Text style={{ fontSize: rf(10) }} className="font-bold text-gray-400 flex-1 uppercase">Ponto de equilíbrio (un/mês)</Text>
                  <Text style={{ fontSize: rf(11) }} className="w-24 text-right text-gray-400 font-bold">{Math.ceil(r.PE_Sem)} un</Text>
                  <Text style={{ color: roxo, fontSize: rf(11) }} className="w-24 text-right font-black">{Math.ceil(r.PE_Com)} un</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
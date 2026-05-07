import React, { useContext, useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProjecaoVendasScreen() {
  const { produtos } = useContext(AppContext);
  const { height } = useWindowDimensions();
  
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [unidadesProjetadas, setUnidadesProjetadas] = useState('100');
  
  const roxo = '#4d235e';
  const lavanda = '#9e86bd';

  const calcularDadosProduto = (produto) => {
    if (!produto) return null;
    const unidades = parseFloat(unidadesProjetadas) || 0;
    const { config, insumos, listaColaboradores, listaCustosFixos, listaDespesasFixas, listaDespesasVariaveis } = produto;

    const dias = parseFloat(config.dias) || 1;
    const horas = parseFloat(config.horas) || 1;
    const tempoProd = parseFloat(config.tempoProducao) || 1;
    const minMes = dias * horas * 60;
    const lucroDesejado = parseFloat(config.lucroDesejado) || 0;

    const totalCF_M = (parseFloat(config.salario) || 0) + 
      listaColaboradores.reduce((acc, c) => acc + (parseFloat(c.salario) || 0), 0) +
      listaCustosFixos.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);

    const totalDF_M = listaDespesasFixas.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);
    const totalDV_M = listaDespesasVariaveis.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);

    const CVR = insumos.reduce((acc, curr) => acc + (parseFloat(curr.custoFração) || 0), 0);
    const CFR = (totalCF_M / minMes) * tempoProd;
    const DFR = (totalDF_M / minMes) * tempoProd;
    const DVR = (totalDV_M / minMes) * tempoProd;
    const totalGeral = CFR + CVR + DFR + DVR;

    const pDF = totalGeral > 0 ? (DFR / totalGeral) * 100 : 0;
    const pDV = totalGeral > 0 ? (DVR / totalGeral) * 100 : 0;

    const divisorMarkup = 100 - (pDF + pDV + lucroDesejado);
    const markupIndice = divisorMarkup > 0 ? 100 / divisorMarkup : 1.0;

    const PV_sem = totalGeral + (totalGeral * (lucroDesejado / 100));
    const PVM = totalGeral * markupIndice;

    const diferencaUnitaria = PVM - PV_sem;
    const variacaoTotalBruta = diferencaUnitaria * unidades;
    const faturamentoTotal = PVM * unidades;

    return { PV_sem, PVM, variacaoTotalBruta, faturamentoTotal, unidades, totalGeral };
  };

  const res = calcularDadosProduto(produtoSelecionado);

  return (
    <SafeAreaView style={{ backgroundColor: '#F9F9FF', flex: 1 }}>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: height * 0.05, paddingBottom: 60 }}
      >
        {/* HEADER COM BOTÃO DE TROCA */}
        <View className="mb-8 flex-row justify-between items-center">
          <View>
            <Text style={{ color: roxo }} className="text-3xl font-black uppercase tracking-tighter">Projeções</Text>
            {produtoSelecionado && (
              <Text className="text-gray-400 font-bold text-[10px] uppercase">Simulando: {produtoSelecionado.nome}</Text>
            )}
          </View>
          {produtoSelecionado && (
            <TouchableOpacity 
              onPress={() => setProdutoSelecionado(null)}
              className="bg-white p-3 rounded-full shadow-sm border border-gray-100"
            >
              <MaterialCommunityIcons name="swap-horizontal" size={24} color={roxo} />
            </TouchableOpacity>
          )}
        </View>

        {!produtoSelecionado ? (
          /* TELA DE SELEÇÃO */
          <View>
            <Text className="text-gray-400 font-bold text-[10px] uppercase mb-4 ml-2">Escolha um produto para simular:</Text>
            {produtos.map((item) => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => setProdutoSelecionado(item)}
                style={{ backgroundColor: roxo }}
                className="p-6 rounded-[30px] mb-4 flex-row justify-between items-center shadow-lg"
              >
                <View>
                  <Text className="text-white font-black text-lg uppercase">{item.nome}</Text>
                  <Text className="text-white/60 text-[10px] font-bold uppercase">Toque para projetar escala</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
              </TouchableOpacity>
            ))}
            {produtos.length === 0 && (
              <Text className="text-gray-400 text-center italic mt-10">Nenhum produto cadastrado.</Text>
            )}
          </View>
        ) : (
          /* TELA DE RESULTADOS DO PRODUTO */
          <View>
            {/* INPUT DE UNIDADES */}
            <View className="bg-white p-6 rounded-[40px] mb-8 border border-purple-100 flex-row items-center justify-between shadow-sm">
              <View className="flex-1">
                <Text style={{ color: roxo }} className="font-black text-[10px] uppercase mb-2 ml-1 tracking-widest">Meta de Vendas</Text>
                <TextInput 
                  keyboardType="numeric"
                  className="bg-purple-50 p-4 rounded-3xl font-black text-2xl text-center border-2 border-purple-100"
                  style={{ color: roxo }}
                  value={unidadesProjetadas}
                  onChangeText={setUnidadesProjetadas}
                  placeholder="Ex: 100"
                />
              </View>
              <View className="ml-6 items-center">
                 <MaterialCommunityIcons name="rocket-launch-outline" size={32} color={lavanda} />
                 <Text className="text-[8px] font-bold text-gray-400 uppercase mt-1">Simular</Text>
              </View>
            </View>

            {/* CARD DE COMPARATIVO */}
            <View className="bg-white border border-gray-100 rounded-[40px] shadow-sm overflow-hidden mb-8">
              <View className="p-5 bg-gray-50 border-b border-gray-100">
                <Text style={{ color: roxo }} className="font-black text-[10px] uppercase text-center">Comparativo Unitário</Text>
              </View>
              
              <View className="p-6 flex-row justify-around items-center">
                <View className="items-center">
                  <Text className="text-gray-400 font-bold text-[9px] uppercase mb-1">Margem Simples</Text>
                  <Text className="text-gray-700 font-black text-lg">R$ {res.PV_sem.toFixed(2)}</Text>
                </View>
                <View className="h-10 w-[1px] bg-gray-200" />
                <View className="items-center">
                  <Text style={{ color: lavanda }} className="font-black text-[9px] uppercase mb-1">Com Mark-up</Text>
                  <Text style={{ color: roxo }} className="font-black text-xl">R$ {res.PVM.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            {/* INSIGHT DE RENTABILIDADE */}
            <View style={{ backgroundColor: roxo }} className="p-8 rounded-[45px] shadow-xl items-center mb-6">
              <MaterialCommunityIcons name="currency-usd" size={32} color="#FFF" />
              <Text className="text-white font-black text-xs uppercase mt-4 mb-2 tracking-widest text-center">
                Ganho Extra Projetado
              </Text>
              <Text className="text-white text-5xl font-black mb-2">
                R$ {res.variacaoTotalBruta.toFixed(2)}
              </Text>
              <Text className="text-white/70 text-center text-[11px] leading-tight font-medium">
                Ao vender {unidadesProjetadas} unidades do produto "{produtoSelecionado.nome}" usando Mark-up, você lucra R$ {res.variacaoTotalBruta.toFixed(2)} a mais do que na precificação simples.
              </Text>
            </View>

            <View className="bg-purple-50 p-6 rounded-[30px] border border-purple-100">
              <Text style={{ color: roxo }} className="text-center text-[10px] font-bold leading-tight italic uppercase">
                Faturamento Total Previsto:{"\n"}
                <Text className="text-lg font-black">R$ {res.faturamentoTotal.toFixed(2)}</Text>
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
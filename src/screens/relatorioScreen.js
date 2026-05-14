import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, useWindowDimensions } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RelatoriosScreen() {
  const { produtos } = useContext(AppContext);
  
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
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

    const divisorMarkup = 100 - (pDF + pDV + lucroDesejado);
    const markupIndice = divisorMarkup > 0 ? 100 / divisorMarkup : 1.0;

    const PV_sem = totalGeral + (totalGeral * (lucroDesejado / 100));
    const PVM = totalGeral * markupIndice;

    const diferencaAbsoluta = PVM - PV_sem;
    const ganhoPercentual = PV_sem > 0 ? (diferencaAbsoluta / PV_sem) * 100 : 0;
    
    // Simulação base de 100 unidades para a variação
    const variacaoTotalBruta = diferencaAbsoluta * 100; 

    return { 
      CFR, CVR, DFR, DVR, totalGeral, PV_sem, PVM, 
      totalCF_Mensal, totalDF_Mensal, totalDV_Mensal, lucroDesejado,
      diferencaAbsoluta, ganhoPercentual, variacaoTotalBruta,
      fatorRateio, markupIndice,
      PE_Com: (PVM - CVR) > 0 ? totalCF_Mensal / (PVM - CVR) : 0
    };
  };

  const r = calcular(produtoSelecionado);

  const HeaderTabelaSimples = ({ labels }) => (
    <View className="flex-row px-4 py-3 bg-gray-100 rounded-t-[20px] mb-1">
      {labels.map((l, i) => (
        <Text key={i} className={`font-black text-[8px] uppercase text-gray-400 ${i === 0 ? 'flex-1' : 'w-20 text-right'}`}>
          {l}
        </Text>
      ))}
    </View>
  );

  const TabelaDinamica = ({ titulo, dados, valorTotal, labelTotal, cor, mostrarRateio = false, fator = 0, isCV = false }) => (
    <View className="mb-6 border border-gray-100 rounded-[30px] overflow-hidden bg-white shadow-sm">
      <View style={{ backgroundColor: cor }} className="p-4">
        <Text className="text-white font-black text-[10px] uppercase tracking-widest text-center">{titulo}</Text>
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
            <Text className="text-gray-500 text-[11px] flex-1">{item.nome || 'Item'}</Text>
            <View className="items-end">
              <Text className="font-bold text-gray-800 text-[11px]">
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
        <Text className="font-black text-gray-400 text-[9px] uppercase">{labelTotal}</Text>
        <Text style={{ color: roxo }} className="font-black text-xs text-center">R$ {valorTotal.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: '#FFF', flex: 1 }}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: height * 0.05, paddingBottom: 60 }}>
        
        <View className="mb-8 flex-row justify-between items-end">
          <View>
            <Text style={{ color: roxo }} className="text-3xl font-black uppercase tracking-tighter">Relatórios</Text>
            {produtoSelecionado && <Text className="text-gray-400 font-bold text-[10px] uppercase">Análise Estratégica</Text>}
          </View>
          {produtoSelecionado && (
            <TouchableOpacity onPress={() => setProdutoSelecionado(null)}>
              <MaterialCommunityIcons name="swap-horizontal" size={32} color={roxo} />
            </TouchableOpacity>
          )}
        </View>

        {!produtoSelecionado ? (
          <View>
            <Text className="text-gray-400 font-bold text-[10px] uppercase mb-4 ml-2">Selecione o produto:</Text>
            {produtos.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => setProdutoSelecionado(item)} style={{ backgroundColor: roxo }} className="p-8 rounded-[40px] items-center shadow-xl mb-4 flex-row justify-between">
                <Text className="text-white font-black uppercase text-center">{item.nome}</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View>
            {/* 1. TABELA DE PERFORMANCE (DESIGN ORIGINAL) */}
            <View className="mb-8">
              <HeaderTabelaSimples labels={['Produto', 'Precificação', 'Ganho', 'Variação']} />
              <View className="bg-white border border-gray-100 rounded-b-[30px] shadow-sm overflow-hidden">
                <View className="flex-row items-center p-4">
                  <View className="flex-1">
                    <Text style={{ color: roxo }} className="font-black text-xs uppercase">{produtoSelecionado.nome}</Text>
                    <Text className="text-[8px] text-gray-400 font-bold uppercase">Análise Unitária</Text>
                  </View>
                  <View className="w-24">
                    <Text className="text-[10px] font-bold text-gray-400 text-right">R$ {r.PV_sem.toFixed(2)}</Text>
                    <Text style={{ color: roxo }} className="text-[10px] font-black text-right">R$ {r.PVM.toFixed(2)}</Text>
                  </View>
                  <Text className="w-16 text-right font-black text-green-600 text-[10px]">
                    {r.ganhoPercentual.toFixed(2)}%
                  </Text>
                  <Text style={{ color: roxo }} className="w-20 text-right font-black text-[10px]">
                    R$ {r.diferencaAbsoluta.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* 2. CARD DE INSIGHTS (DESIGN ORIGINAL) */}
            <View style={{ backgroundColor: roxo }} className="p-8 rounded-[45px] shadow-xl items-center mb-10">
              <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#FFF" />
              <Text className="text-white font-black text-xs uppercase mt-4 mb-2 tracking-widest text-center">
                Insights de Rentabilidade
              </Text>
              <Text className="text-white/80 text-center text-[11px] leading-tight font-medium">
                Ao utilizar o Mark-up de <Text className="text-white font-black">{r.markupIndice.toFixed(2)}x</Text>, você garante um lucro real de 
                <Text className="text-white font-black"> {r.lucroDesejado}% </Text> 
                sobre o preço de venda final.
              </Text>
            </View>

            {/* 3. TABELAS DETALHADAS (DESIGN DA IMAGEM E IDENTIDADE) */}
            <TabelaDinamica 
              titulo="Custos Fixos Mensais" 
              dados={[
                { nome: "Pró-labore (Dono)", salario: produtoSelecionado.config.salario },
                ...produtoSelecionado.listaColaboradores,
                ...produtoSelecionado.listaCustosFixos
              ]} 
              valorTotal={r.CFR} 
              labelTotal="Total CF Rateado" 
              cor={roxo} 
              mostrarRateio={true}
              fator={r.fatorRateio}
            />
            
            <TabelaDinamica 
              titulo="Materiais (Insumos)" 
              dados={produtoSelecionado.insumos} 
              valorTotal={r.CVR} 
              labelTotal="Total Material Unidade" 
              cor={roxo} 
              mostrarRateio={true}
              isCV={true}
            />

            <TabelaDinamica 
              titulo="Despesas Fixas" 
              dados={produtoSelecionado.listaDespesasFixas} 
              valorTotal={r.DFR} 
              labelTotal="Total DF Rateado" 
              cor={roxo} 
              mostrarRateio={true}
              fator={r.fatorRateio}
            />

            <TabelaDinamica 
              titulo="Despesas Variáveis" 
              dados={produtoSelecionado.listaDespesasVariaveis} 
              valorTotal={r.DVR} 
              labelTotal="Total DV Rateado" 
              cor={roxo} 
              mostrarRateio={true}
              fator={r.fatorRateio}
            />

            {/* MOTOR DE PRECIFICAÇÃO (DESIGN LAVANDA SOLICITADO) */}
            <View className="bg-white border border-gray-200 rounded-[35px] overflow-hidden mb-12 shadow-sm">
              <View style={{ backgroundColor: lavanda }} className="p-4">
                <Text className="font-black text-[10px] uppercase text-center text-white">Motor de Precificação</Text>
              </View>
              <View className="p-5">
                <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs">Custo Unitário Total</Text><Text className="font-bold text-xs text-center">R$ {r.totalGeral.toFixed(2)}</Text></View>
                <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs">Preço de Venda (Simples)</Text><Text className="font-bold text-xs text-center">R$ {r.PV_sem.toFixed(2)}</Text></View>
                <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs">Margem de Lucro</Text><Text className="font-bold text-xs text-center">{r.lucroDesejado}%</Text></View>
                <View className="flex-row justify-between mb-4 border-t border-gray-100 pt-2"><Text className="font-bold text-xs">Mark-up Calculado</Text><Text className="font-black text-purple-700 text-center">{r.markupIndice.toFixed(2)}x</Text></View>
                <View style={{ backgroundColor: roxo }} className="p-5 rounded-3xl">
                  <Text className="text-white/70 text-[10px] font-bold uppercase text-center">Preço Sugerido com Mark-up</Text>
                  <Text className="text-white text-3xl font-black text-center mt-1">R$ {r.PVM.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
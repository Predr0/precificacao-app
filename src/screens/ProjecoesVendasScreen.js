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

  const calcularProjecao = (p) => {
    if (!p) return null;
    const unidades = parseFloat(unidadesProjetadas) || 0;
    const config = p.config;
    const insumos = p.insumos;
    const listaColaboradores = p.listaColaboradores;
    const listaCustosFixos = p.listaCustosFixos;

    const dias = parseFloat(config.dias) || 1;
    const horas = parseFloat(config.horas) || 1;
    const tempoProd = parseFloat(config.tempoProducao) || 1;
    const minMes = dias * horas * 60;
    const lucroDesejado = parseFloat(config.lucroDesejado) || 0;

    const totalCF_Mensal = (parseFloat(config.salario) || 0) + 
      listaColaboradores.reduce((acc, c) => acc + (parseFloat(c.salario) || 0), 0) +
      listaCustosFixos.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);

    const CVR = insumos.reduce((acc, curr) => acc + (parseFloat(curr.custoFração) || 0), 0);
    const CFR = (totalCF_Mensal / minMes) * tempoProd;
    
    // Simplificado para bater com a estrutura da tabela original
    const totalGeral = CFR + CVR; 

    const divisorMarkup = 100 - (lucroDesejado + 5); // Exemplo de taxa simulada como no original
    const markupIndice = divisorMarkup > 0 ? 100 / divisorMarkup : 1.0;

    const PV_sem = totalGeral + (totalGeral * (lucroDesejado / 100));
    const PVM = totalGeral * markupIndice;

    const diferencaUnitaria = PVM - PV_sem;
    const ganhoPercentual = PV_sem > 0 ? (diferencaUnitaria / PV_sem) * 100 : 0;
    const variacaoTotalBruta = diferencaUnitaria * unidades;
    const faturamentoTotal = PVM * unidades;

    return { PV_sem, PVM, ganhoPercentual, variacaoTotalBruta, unidades, faturamentoTotal };
  };

  const res = calcularProjecao(produtoSelecionado);

  const HeaderTabela = ({ labels }) => (
    <View className="flex-row px-4 py-3 bg-gray-100 rounded-t-[20px] mb-1">
      {labels.map((l, i) => (
        <Text key={i} className={`font-black text-[8px] uppercase text-gray-400 ${i === 0 ? 'flex-1' : 'w-20 text-right'}`}>
          {l}
        </Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: '#FFF', flex: 1 }}>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: height * 0.05, paddingBottom: 60 }}
      >
        <View className="mb-8 flex-row justify-between items-end">
          <View>
            <Text style={{ color: roxo }} className="text-3xl font-black uppercase tracking-tighter">Projeções</Text>
            <Text className="text-gray-400 font-bold text-[10px] uppercase">Simulação de Escala</Text>
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
              <TouchableOpacity 
                key={item.id}
                onPress={() => setProdutoSelecionado(item)} 
                style={{ backgroundColor: roxo }} 
                className="p-8 rounded-[40px] items-center shadow-xl mb-4 flex-row justify-between"
              >
                <Text className="text-white font-black uppercase text-center">{item.nome}</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View>
            <View className="bg-purple-50/50 p-6 rounded-[40px] mb-8 border border-purple-100 flex-row items-center justify-between">
              <View className="flex-1">
                <Text style={{ color: roxo }} className="font-black text-[10px] uppercase mb-2 ml-1 tracking-widest">Unidades Vendidas</Text>
                <TextInput 
                  keyboardType="numeric"
                  className="bg-white p-4 rounded-3xl font-black text-xl text-center border-2 border-purple-100"
                  value={unidadesProjetadas}
                  onChangeText={setUnidadesProjetadas}
                />
              </View>
              <View className="ml-6 items-center">
                 <MaterialCommunityIcons name="rocket-launch-outline" size={32} color={lavanda} />
                 <Text className="text-[8px] font-bold text-gray-400 uppercase mt-1">Simular</Text>
              </View>
            </View>

            <View className="mb-8">
              <HeaderTabela labels={['Produto', 'Precificação', 'Ganho', 'Variação']} />
              <View className="bg-white border border-gray-100 rounded-b-[30px] shadow-sm overflow-hidden">
                <View className="flex-row items-center p-4 border-b border-gray-50">
                  <View className="flex-1">
                    <Text style={{ color: roxo }} className="font-black text-xs uppercase">{produtoSelecionado.nome}</Text>
                    <Text className="text-[8px] text-gray-400 font-bold uppercase">Base: {res.unidades} un.</Text>
                  </View>
                  <View className="w-24">
                    <Text className="text-[10px] font-bold text-gray-700 text-right">R$ {res.PV_sem.toFixed(2)}</Text>
                    <Text style={{ color: roxo }} className="text-[10px] font-black text-right">R$ {res.PVM.toFixed(2)}</Text>
                  </View>
                  <Text className="w-16 text-right font-black text-green-600 text-[10px]">
                    {res.ganhoPercentual.toFixed(2)}%
                  </Text>
                  <Text style={{ color: roxo }} className="w-20 text-right font-black text-[10px]">
                    R$ {res.variacaoTotalBruta.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ backgroundColor: roxo }} className="p-8 rounded-[45px] shadow-xl items-center mb-6">
              <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#FFF" />
              <Text className="text-white font-black text-xs uppercase mt-4 mb-2 tracking-widest text-center">
                Insights de Rentabilidade
              </Text>
              <Text className="text-white/80 text-center text-[11px] leading-tight font-medium">
                Ao vender {res.unidades} unidades utilizando o Mark-up, você garante um faturamento extra de 
                <Text className="text-white font-black"> R$ {res.variacaoTotalBruta.toFixed(2)} </Text> 
                em comparação à margem simples.
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
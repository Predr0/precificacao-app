import React, { useContext, useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProjecaoVendasScreen() {
  const { config, insumos, totalCF_Mensal, totalDF_Mensal, totalDV_Mensal } = useContext(AppContext);
  const { height } = useWindowDimensions();
  
  const [unidadesProjetadas, setUnidadesProjetadas] = useState('100');
  
  const roxo = '#4d235e';
  const lavanda = '#9e86bd';

  const calcularProjecao = () => {
    const unidades = parseFloat(unidadesProjetadas) || 0;
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

    const divisorMarkup = 100 - (pDF + pDV + lucroDesejado);
    const markupIndice = divisorMarkup > 0 ? 100 / divisorMarkup : 1.0;

    const PV_sem = totalGeral + (totalGeral * (lucroDesejado / 100));
    const PVM = totalGeral * markupIndice;

    const diferencaUnitaria = PVM - PV_sem;
    const ganhoPercentual = PV_sem > 0 ? (diferencaUnitaria / PV_sem) * 100 : 0;
    const variacaoTotalBruta = diferencaUnitaria * unidades;

    return {
      PV_sem,
      PVM,
      ganhoPercentual,
      variacaoTotalBruta,
      unidades
    };
  };

  const res = calcularProjecao();

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
        <View className="mb-8">
          <Text style={{ color: roxo }} className="text-3xl font-black uppercase tracking-tighter">Projeções</Text>
          <Text className="text-gray-400 font-bold text-[10px] uppercase">Simulação de Escala</Text>
        </View>

        {/* INPUT DE UNIDADES */}
        <View className="bg-purple-50/50 p-6 rounded-[40px] mb-8 border border-purple-100 flex-row items-center justify-between">
          <View className="flex-1">
            <Text style={{ color: roxo }} className="font-black text-[10px] uppercase mb-2 ml-1 tracking-widest">Unidades Vendidas</Text>
            <TextInput 
              keyboardType="numeric"
              className="bg-white p-4 rounded-3xl font-black text-xl text-center border-2 border-purple-100"
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

        {/* TABELA DE PRODUTOS (PROJETO AAA EXEMPLO) */}
        <View className="mb-8">
          <HeaderTabela labels={['Produto', 'Precificação', 'Ganho', 'Variação']} />
          
          <View className="bg-white border border-gray-100 rounded-b-[30px] shadow-sm overflow-hidden">
            {/* LINHA DO PRODUTO ATUAL */}
            <View className="flex-row items-center p-4 border-b border-gray-50">
              <View className="flex-1">
                <Text style={{ color: roxo }} className="font-black text-xs uppercase">{config.nomeNegocio || "Produto Atual"}</Text>
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

        <View style={{ backgroundColor: roxo }} className="p-8 rounded-[45px] shadow-xl items-center">
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

        <Text className="text-black-300 text-[10x] text-center mt-6 italic">
          Os valores acima consideram todos os custos e despesas rateados por tempo de produção.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}
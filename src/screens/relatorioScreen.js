import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RelatoriosScreen() {
  const { config, insumos, totalCF_Mensal, totalDF_Mensal, totalDV_Mensal } = useContext(AppContext);
  const [exibirRelatorio, setExibirRelatorio] = useState(false);

  const roxo = '#4d235e';
  const lavanda = '#9e86bd';

  const calcularRelatorio = () => {
    const dias = parseFloat(config.dias) || 1;
    const horas = parseFloat(config.horas) || 1;
    const tempoProd = parseFloat(config.tempoProducao) || 1;
    const minMes = dias * horas * 60;
    const lucroDes = parseFloat(config.lucroDesejado) || 0;

    const CVR = insumos.reduce((acc, curr) => acc + (parseFloat(curr.custoFração) || 0), 0);
    const CFR = (totalCF_Mensal / minMes) * tempoProd;
    const DFR = (totalDF_Mensal / minMes) * tempoProd;
    const DVR = (totalDV_Mensal / minMes) * tempoProd;
    const totalGeral = CFR + CVR + DFR + DVR;

    const PV = totalGeral + (totalGeral * (lucroDes / 100));
    const pDF = totalGeral > 0 ? (DFR / totalGeral) * 100 : 0;
    const pDV = totalGeral > 0 ? (DVR / totalGeral) * 100 : 0;
    const pCF = totalGeral > 0 ? (CFR / totalGeral) * 100 : 0;
    const pCV = totalGeral > 0 ? (CVR / totalGeral) * 100 : 0;

    const denoMarkup = 100 - (pDF + pDV + lucroDes);
    const markupIdx = denoMarkup > 0 ? 100 / denoMarkup : 1;
    const PVM = totalGeral * markupIdx;

    return { CFR, CVR, DFR, DVR, totalGeral, PV, PVM, markupIdx, lucroDes, pCF, pCV, pDF, pDV, tempoProd };
  };

  const r = calcularRelatorio();

  const Row = ({ cols, isHeader = false }) => (
    <View className={`flex-row border-b border-gray-200 py-2 ${isHeader ? 'bg-gray-100' : ''}`}>
      {cols.map((txt, i) => (
        <Text key={i} className={`flex-1 text-[9px] px-1 ${isHeader ? 'font-black' : 'text-gray-600'}`} style={{ textAlign: i === 0 ? 'left' : 'center' }}>
          {txt}
        </Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-5">
        
        <View className="mb-6">
          <Text style={{ color: roxo }} className="text-2xl font-black uppercase">Relatório Consolidado</Text>
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Annik - Gestão Estratégica</Text>
        </View>

        {!exibirRelatorio ? (
          <TouchableOpacity onPress={() => setExibirRelatorio(true)} style={{ backgroundColor: roxo }} className="p-10 rounded-[40px] items-center shadow-2xl">
            <MaterialCommunityIcons name="file-chart" size={60} color="white" />
            <Text className="text-white font-black text-lg mt-4">GERAR RELATÓRIO DO MÊS</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={{ color: roxo }} className="font-black text-xs mb-2 uppercase">1. Detalhamento de Custos (Ficha Técnica)</Text>
            <View className="border border-gray-200 rounded-xl overflow-hidden mb-6">
              <Row isHeader cols={['Item', 'Tipo', 'Qtd', 'Custo Un.', 'Total']} />
              {insumos.map((item, index) => (
                <Row key={index} cols={[item.nome, 'Variável', item.quantidadeUso, `R$ ${item.custoUnidade}`, `R$ ${item.custoFração}`]} />
              ))}
              <Row cols={['Mão de Obra', 'Variável', `${r.tempoProd} min`, '-', `R$ ${r.CFR.toFixed(2)}`]} />
              <Row cols={['Custos Fixos', 'Fixo', 'Rateio', '-', `R$ ${r.DFR.toFixed(2)}`]} />
              <Row cols={['Desp. Variáveis', 'Fixo', 'Rateio', '-', `R$ ${r.DVR.toFixed(2)}`]} />
              <View className="bg-purple-50 py-2 flex-row">
                <Text className="flex-[4] font-black text-xs px-2 text-purple-900 uppercase text-right">Total do custo unitário:</Text>
                <Text className="flex-1 font-black text-xs text-center text-purple-900">R$ {r.totalGeral.toFixed(2)}</Text>
              </View>
            </View>

            <Text style={{ color: roxo }} className="font-black text-xs mb-2 uppercase">2. Formação de Preço de Venda</Text>
            <View className="border border-gray-200 rounded-xl overflow-hidden mb-6">
              <Row isHeader cols={['Descrição', 'Valor (R$)', '%']} />
              <Row cols={['Custo variável (CV)', `R$ ${r.CVR.toFixed(2)}`, `${r.pCV.toFixed(0)}%`]} />
              <Row cols={['Despesas fixas (DF)', `R$ ${r.DFR.toFixed(2)}`, `${r.pDF.toFixed(0)}%`]} />
              <Row cols={['Despesas variáveis (DV)', `R$ ${r.DVR.toFixed(2)}`, `${r.pDV.toFixed(0)}%`]} />
              <Row cols={['Custos fixos (CF)', `R$ ${r.CFR.toFixed(2)}`, `${r.pCF.toFixed(0)}%`]} />
              <Row cols={['Margem de lucro desejada', `R$ ${(r.PV - r.totalGeral).toFixed(2)}`, `${r.lucroDes}%`]} />
              <Row isHeader cols={['Preço de venda', `R$ ${r.PV.toFixed(2)}`, '100%']} />
              <View className="bg-gray-100 p-2"><Text className="font-black text-[9px] uppercase">Cálculo com Mark-up</Text></View>
              <Row cols={['Mark-up', r.markupIdx.toFixed(2), '-']} />
              <View style={{ backgroundColor: roxo }} className="py-3 flex-row">
                <Text className="flex-[2] font-black text-white px-2 text-xs uppercase">Preço de venda final (PVM):</Text>
                <Text className="flex-1 font-black text-white text-center text-xs">R$ {r.PVM.toFixed(2)}</Text>
              </View>
            </View>

  
            <Text style={{ color: roxo }} className="font-black text-xs mb-2 uppercase">3. Margem e Rentabilidade</Text>
            <View className="border border-gray-200 rounded-xl overflow-hidden mb-10">
              <Row isHeader cols={['Indicador', 'Valor (PV)', 'Valor (PVM)']} />
              <Row cols={['Preço de Venda', `R$ ${r.PV.toFixed(2)}`, `R$ ${r.PVM.toFixed(2)}`]} />
              <Row cols={['Custo Variável (CV)', `R$ ${r.CVR.toFixed(2)}`, `R$ ${r.CVR.toFixed(2)}`]} />
              <Row cols={['Margem Bruta (R$)', `R$ ${(r.PV - r.CVR).toFixed(2)}`, `R$ ${(r.PVM - r.CVR).toFixed(2)}`]} />
              <Row cols={['Lucro Líquido Unitário', `R$ ${(r.PV - r.totalGeral).toFixed(2)}`, `R$ ${(r.PVM - r.totalGeral).toFixed(2)}`]} />
              <View className="bg-amber-50 py-3 flex-row border-t border-amber-200">
                <Text className="flex-[2] font-black text-amber-900 px-2 text-[10px] uppercase">Ponto de Equilíbrio (unidades/mês):</Text>
                <Text className="flex-1 font-black text-amber-900 text-center text-sm">{Math.ceil(r.PE)}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => setExibirRelatorio(false)} className="mb-20 items-center">
              <Text style={{ color: lavanda }} className="font-bold uppercase text-xs">← Voltar e ajustar dados</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
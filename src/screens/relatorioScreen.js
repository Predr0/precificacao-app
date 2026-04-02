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
    const lucroDesejado = parseFloat(config.lucroDesejado) || 0;

    const CVR = insumos.reduce((acc, curr) => acc + (parseFloat(curr.custoFração) || 0), 0);
    const CFR = (totalCF_Mensal / minMes) * tempoProd;
    const DFR = (totalDF_Mensal / minMes) * tempoProd;
    const DVR = (totalDV_Mensal / minMes) * tempoProd;
    const totalUnitario = CFR + CVR + DFR + DVR;

    const pCF = totalUnitario > 0 ? (CFR / totalUnitario) * 100 : 0;
    const pCV = totalUnitario > 0 ? (CVR / totalUnitario) * 100 : 0;
    const pDF = totalUnitario > 0 ? (DFR / totalUnitario) * 100 : 0;
    const pDV = totalUnitario > 0 ? (DVR / totalUnitario) * 100 : 0;

    const PV = totalUnitario + (totalUnitario * (lucroDesejado / 100));
    const denoMarkup = 100 - (pDF + pDV + lucroDesejado);
    const markupIdx = denoMarkup > 0 ? 100 / denoMarkup : 1;
    const PVM = totalUnitario * markupIdx;
    const diferenca = PVM - PV;

    const margemContribuicao = PVM - CVR;
    const PE = margemContribuicao > 0 ? totalCF_Mensal / margemContribuicao : 0;

    return {
      CFR, CVR, DFR, DVR, totalUnitario, PV, PVM, PE,
      pCF, pCV, pDF, pDV, markupIdx, diferenca,
      totalCF_Mensal, totalDF_Mensal, totalDV_Mensal, margemContribuicao, tempoProd
    };
  };

  const r = calcular();

  const imprimirPDF = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica'; padding: 20px; color: #333; }
            h1 { color: ${roxo}; text-align: center; text-transform: uppercase; }
            h2 { color: ${roxo}; border-bottom: 2px solid ${lavanda}; font-size: 14px; margin-top: 20px; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: ${roxo}; color: white; font-size: 10px; padding: 8px; }
            td { border: 1px solid #eee; padding: 8px; font-size: 10px; text-align: center; }
            .total { background-color: #f9f9f9; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Relatório Annik</h1>
          <h2>Detalhamento de Custos e Insumos</h2>
          <table>
            <tr><th>Item</th><th>Descrição</th><th>Tipo</th><th>Valor Unit.</th></tr>
            ${[...listaColaboradores, ...listaCustosFixos].map(i => `<tr><td>Custo Fixo</td><td>${i.nome || 'Salário'}</td><td>Fixo</td><td>R$ ${parseFloat(i.valor || i.salario || 0).toFixed(2)}</td></tr>`).join('')}
            ${insumos.map(i => `<tr><td>Insumo</td><td>${i.nome}</td><td>Variável</td><td>R$ ${parseFloat(i.custoFração).toFixed(2)}</td></tr>`).join('')}
          </table>
          <h2>Formação de Preço</h2>
          <table>
            <tr><th>Descrição</th><th>Valor</th><th>%</th></tr>
            <tr><td>Custo Variável (CV)</td><td>R$ ${r.CVR.toFixed(2)}</td><td>${r.pCV.toFixed(0)}%</td></tr>
            <tr><td>Despesas Fixas (DF)</td><td>R$ ${r.DFR.toFixed(2)}</td><td>${r.pDF.toFixed(0)}%</td></tr>
            <tr><td>Custos Fixos (CF)</td><td>R$ ${r.CFR.toFixed(2)}</td><td>${r.pCF.toFixed(0)}%</td></tr>
            <tr class="total"><td>Preço de Venda (PV)</td><td>R$ ${r.PV.toFixed(2)}</td><td>100%</td></tr>
            <tr><td>Mark-up</td><td>${r.markupIdx.toFixed(2)}</td><td>-</td></tr>
            <tr class="total" style="background: ${roxo}; color: white;"><td>Preço Final (PVM)</td><td>R$ ${r.PVM.toFixed(2)}</td><td>-</td></tr>
          </table>
          <h2>Rentabilidade</h2>
          <table>
            <tr><th>Indicador</th><th>Valor PV</th><th>Valor PVM</th></tr>
            <tr><td>Margem Bruta</td><td>R$ ${(r.PV - r.CVR).toFixed(2)}</td><td>R$ ${(r.PVM - r.CVR).toFixed(2)}</td></tr>
            <tr class="total"><td>Ponto de Equilíbrio</td><td colspan="2">${Math.ceil(r.PE)} unidades/mês</td></tr>
          </table>
        </body>
      </html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert("Erro", "Falha ao gerar PDF.");
    }
  };

  const Tabela = ({ titulo, dados, valorTotal, labelTotal, cor }) => (
    <View className="mb-6 border border-gray-100 rounded-[30px] overflow-hidden bg-white shadow-sm">
      <View style={{ backgroundColor: cor }} className="p-3">
        <Text className="text-white font-black text-[10px] uppercase tracking-widest">{titulo}</Text>
      </View>
      {dados.map((item, i) => (
        <View key={i} className="flex-row justify-between p-3 border-b border-gray-50">
          <Text className="text-gray-500 text-xs flex-1">{item.nome || item.id}</Text>
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
    <SafeAreaView className="flex-1 bg-[#F9F9FF]">
      <ScrollView className="flex-1 p-6">
        <View className="mb-8 flex-row justify-between items-center">
          <View>
            <Text style={{ color: roxo }} className="text-2xl font-black uppercase">Relatório Estratégico</Text>
            <Text className="text-gray-400 font-bold text-[10px] uppercase">Detalhamento Técnico e Financeiro</Text>
          </View>
          {exibirRelatorio && (
            <TouchableOpacity onPress={imprimirPDF} className="bg-green-600 p-2 rounded-full shadow-md">
              <MaterialCommunityIcons name="printer" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {!exibirRelatorio ? (
          <TouchableOpacity onPress={() => setExibirRelatorio(true)} style={{ backgroundColor: roxo }} className="p-10 rounded-[40px] items-center shadow-xl">
            <MaterialCommunityIcons name="file-chart" size={50} color="white" />
            <Text className="text-white font-black mt-4 uppercase">Gerar Relatório Completo</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <Tabela titulo="Custos Fixos (Mensal)" dados={[...listaColaboradores, ...listaCustosFixos]} valorTotal={r.totalCF_Mensal} labelTotal="Total CF Mensal" cor={roxo} />
            <Tabela titulo="Insumos (Por Unidade)" dados={insumos} valorTotal={r.CVR} labelTotal="Total CV Unidade" cor="#2D6A4F" />
            <Tabela titulo="Despesas Fixas" dados={listaDespesasFixas} valorTotal={r.totalDF_Mensal} labelTotal="Total DF Mensal" cor="#1B4332" />
            <Tabela titulo="Despesas Variáveis" dados={listaDespesasVariaveis} valorTotal={r.totalDV_Mensal} labelTotal="Total DV Mensal" cor="#D4A373" />

            <View className="bg-white border border-gray-200 rounded-[30px] overflow-hidden mb-8 shadow-sm">
              <View style={{ backgroundColor: '#f2f2f2' }} className="p-3"><Text className="font-black text-[10px] uppercase">Formação de Preço</Text></View>
              <View className="p-4">
                <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs">Custo Variável (CV)</Text><Text className="font-bold text-xs">R$ {r.CVR.toFixed(2)} ({r.pCV.toFixed(0)}%)</Text></View>
                <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs">Despesas Fixas (DF)</Text><Text className="font-bold text-xs">R$ {r.DFR.toFixed(2)} ({r.pDF.toFixed(0)}%)</Text></View>
                <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs">Custos Fixos (CF)</Text><Text className="font-bold text-xs">R$ {r.CFR.toFixed(2)} ({r.pCF.toFixed(0)}%)</Text></View>
                <View className="flex-row justify-between mb-2 border-t border-gray-100 pt-2"><Text className="font-bold text-xs">Preço de Venda (PV)</Text><Text className="font-black text-xs">R$ {r.PV.toFixed(2)}</Text></View>
                <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs">Mark-up Aplicado</Text><Text className="font-bold text-xs">{r.markupIdx.toFixed(2)}</Text></View>
                <View style={{ backgroundColor: roxo }} className="p-4 rounded-2xl mt-2 flex-row justify-between">
                  <Text className="text-white font-black text-xs">PREÇO FINAL (PVM)</Text>
                  <Text className="text-white font-black text-xs">R$ {r.PVM.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between mt-2"><Text className="text-gray-400 text-[10px]">Diferença (PVM - PV)</Text><Text className="text-gray-400 text-[10px]">R$ {r.diferenca.toFixed(2)}</Text></View>
              </View>
            </View>

            <View className="bg-amber-50 p-6 rounded-[35px] mb-10 border border-amber-200">
              <Text className="text-amber-900 font-black text-xs mb-4 uppercase">Auditoria Ponto de Equilíbrio</Text>
              <Text className="text-gray-600 text-xs mb-4">O cálculo considera quanto do preço final sobra para pagar os gastos fixos após descontar os materiais.</Text>
              <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs">Gasto Fixo Mensal (CF):</Text><Text className="font-bold">R$ {r.totalCF_Mensal.toFixed(2)}</Text></View>
              <View className="flex-row justify-between mb-4"><Text className="text-gray-500 text-xs">Margem por Venda:</Text><Text className="font-bold text-green-700">R$ {r.margemContribuicao.toFixed(2)}</Text></View>
              <View className="bg-white p-6 rounded-3xl items-center border border-amber-100 shadow-sm">
                <Text className="text-amber-900 font-black text-4xl">{Math.ceil(r.PE)}</Text>
                <Text className="text-amber-700 font-bold text-[10px] uppercase">Unidades por Mês</Text>
                <Text className="text-gray-400 text-[8px] mt-2 text-center">Fórmula: R$ {r.totalCF_Mensal.toFixed(2)} / R$ {r.margemContribuicao.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => setExibirRelatorio(false)} className="items-center mb-20"><Text className="text-gray-400 font-bold uppercase text-[10px]">Fechar Relatório</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
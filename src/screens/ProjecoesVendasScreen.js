import React, { useContext, useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, useWindowDimensions, Dimensions, PixelRatio, Alert, ActivityIndicator } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 412;

function rf(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function ProjecaoVendasScreen() {
  const { produtos } = useContext(AppContext);
  const { height } = useWindowDimensions();
  
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [unidadesProjetadas, setUnidadesProjetadas] = useState('100');
  const [gerandoPdf, setGerandoPdf] = useState(false);
  
  const roxo = '#4d235e';
  const lavanda = '#9e86bd';

  const calcularProjecao = (p) => {
    if (!p) return null;
    const unidades = parseFloat(unidadesProjetadas) || 0;
    const config = p.config;
    const insumos = p.insumos;
    const listaColaboradores = p.listaColaboradores;
    const listaCustosFixos = p.listaCustosFixos;
    const listaDespesasFixas = p.listaDespesasFixas || [];
    const listaDespesasVariaveis = p.listaDespesasVariaveis || [];

    const dias = parseFloat(config.dias) || 1;
    const hours = parseFloat(config.horas) || 1;
    const tempoProd = parseFloat(config.tempoProducao) || 1;
    const minMes = dias * hours * 60;
    const lucroDesejado = parseFloat(config.lucroDesejado) || 0;

    const totalCF_Mensal = (parseFloat(config.salario) || 0) + 
      listaColaboradores.reduce((acc, c) => acc + (parseFloat(c.salario) || 0), 0) +
      listaCustosFixos.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);

    const totalDF_Mensal = listaDespesasFixas.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);
    const totalDV_Mensal = listaDespesasVariaveis.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);

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

    const diferencaUnitaria = PVM - PV_sem;
    const ganhoPercentual = PV_sem > 0 ? (diferencaUnitaria / PV_sem) * 100 : 0;
    const variacaoTotalBruta = diferencaUnitaria * unidades;
    const faturamentoTotal = PVM * unidades;

    return { PV_sem, PVM, ganhoPercentual, variacaoTotalBruta, unidades, faturamentoTotal };
  };

  const res = calcularProjecao(produtoSelecionado);

  const executarGeracaoPDF = async () => {
    if (gerandoPdf) return;
    setGerandoPdf(true);

    const nomeProd = produtoSelecionado.nome?.trim() ? produtoSelecionado.nome : "Produto sem nome";

    const htmlTemplate = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 30px; }
            .header { border-bottom: 4px solid #4d235e; padding-bottom: 15px; margin-bottom: 30px; }
            .header h1 { color: #4d235e; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: -1px; }
            .header p { margin: 5px 0 0 0; color: #9e86bd; font-weight: bold; text-transform: uppercase; font-size: 12px; }
            .sub-header { font-size: 16px; font-weight: bold; color: #4d235e; margin-bottom: 20px; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; margin-top: 10px; }
            th, td { padding: 12px; font-size: 12px; border-bottom: 1px solid #f3f4f6; }
            th { background-color: #f3f4f6; color: #9ca3af; font-weight: bold; text-transform: uppercase; font-size: 10px; }
            .insight-box { background-color: #4d235e; color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 25px; }
            .insight-box h2 { margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; }
            .insight-box p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.85; line-height: 1.4; }
            .faturamento-box { background-color: #faf5ff; border: 1px solid #e9d5ff; padding: 20px; border-radius: 12px; text-align: center; }
            .faturamento-box h3 { margin: 0 0 12px 0; color: #4d235e; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
            .faturamento-box p { margin: 6px 0; font-size: 14px; font-weight: bold; color: #4b5563; }
            .faturamento-box span { color: #4d235e; font-weight: 900; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Projeções de Vendas</h1>
            <p>Simulação de Escala e Faturamento</p>
          </div>
          
          <div class="sub-header">Produto: ${nomeProd}</div>

          <table>
            <thead>
              <tr>
                <th style="text-align: left;">Produto</th>
                <th style="text-align: right;">Precificação</th>
                <th style="text-align: right;">Ganho</th>
                <th style="text-align: right;">Variação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong style="color: #4d235e; text-transform: uppercase;">${nomeProd}</strong><br/>
                  <small style="color: #9ca3af;">Simulado: ${res.unidades} un.</small>
                </td>
                <td style="text-align: right;">
                  Simples: R$ ${res.PV_sem.toFixed(2)}<br/>
                  <strong>Markup: R$ ${res.PVM.toFixed(2)}</strong>
                </td>
                <td style="text-align: right; color: #16a34a; font-weight: bold;">${res.ganhoPercentual.toFixed(2)}%</td>
                <td style="text-align: right; color: #4d235e; font-weight: bold;">R$ ${res.variacaoTotalBruta.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="insight-box">
            <h2>Insights de Rentabilidade</h2>
            <p>Ao vender ${res.unidades} unidades utilizando a variação entre o preço de venda e o preço com mark-up você garante um lucro de <strong>R$ ${res.variacaoTotalBruta.toFixed(2)}</strong></p>
          </div>

          <div class="faturamento-box">
            <h3>Faturamento Total Previsto</h3>
            <p>Preço de Venda: <span>R$ ${(res.PV_sem * res.unidades).toFixed(2)}</span></p>
            <p>Preço com mark-up: <span>R$ ${res.faturamentoTotal.toFixed(2)}</span></p>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlTemplate });
      const nomeSanitizado = nomeProd.replace(/\s+/g, '_');
      const uriPermanente = `${FileSystem.documentDirectory}Projecao_${nomeSanitizado}.pdf`;

      await FileSystem.moveAsync({
        from: uri,
        to: uriPermanente
      });

      Alert.alert(
        "Projeção Salva!",
        "O arquivo de simulação foi armazenado com sucesso no aplicativo.",
        [
          { text: "Visualizar / Abrir", onPress: () => Print.printAsync({ uri: uriPermanente }) },
          { text: "Compartilhar", onPress: () => Sharing.shareAsync(uriPermanente) },
          { text: "Fechar", style: "cancel" }
        ]
      );
    } catch (error) {
      console.error("Erro ao gerar PDF de Projeção:", error);
    } finally { // CORRIGIDO AQUI: De 'file' para 'finally'
      setGerandoPdf(false);
    }
  };

  const geradorPDFComFiltro = () => {
    if (!produtoSelecionado || gerandoPdf) return;
    const nomeProd = produtoSelecionado.nome?.trim() ? produtoSelecionado.nome : "Produto sem nome";

    Alert.alert(
      "Exportar Projeção",
      `Deseja gerar o pdf das projeções do seu Produto "${nomeProd}"?`,
      [
        { text: "Não", style: "cancel" },
        { text: "Sim, Gerar", onPress: () => executarGeracaoPDF() }
      ]
    );
  };

  const HeaderTabela = ({ labels }) => (
    <View className="flex-row px-4 py-3 bg-gray-100 rounded-t-[20px] mb-1">
      {labels.map((l, i) => (
        <Text key={i} style={{ fontSize: rf(8) }} className={`font-black uppercase text-gray-400 ${i === 0 ? 'flex-1' : 'w-20 text-right'}`}>
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
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 flex-row justify-between items-end">
          <View className="flex-1">
            <Text style={{ color: roxo, fontSize: rf(30) }} className="font-black uppercase tracking-tighter">Projeções</Text>
            <Text style={{ fontSize: rf(10) }} className="text-gray-400 font-bold uppercase">Simulação de Escala</Text>
          </View>
          {produtoSelecionado && (
            <View className="flex-row items-center">
              <TouchableOpacity onPress={geradorPDFComFiltro} style={{ marginRight: rf(16) }} disabled={gerandoPdf}>
                {gerandoPdf ? (
                  <ActivityIndicator size="small" color={roxo} />
                ) : (
                  <MaterialCommunityIcons name="file-pdf-box" size={rf(32)} color={roxo} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setProdutoSelecionado(null)}>
                 <MaterialCommunityIcons name="swap-horizontal" size={rf(32)} color={roxo} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!produtoSelecionado ? (
          <View>
            <Text style={{ fontSize: rf(10) }} className="text-gray-400 font-bold uppercase mb-4 ml-2">Selecione o produto:</Text>
            {produtos.map((item) => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => setProdutoSelecionado(item)} 
                style={{ backgroundColor: roxo }} 
                className="p-8 rounded-[40px] items-center shadow-xl mb-4 flex-row justify-between"
              >
                <Text style={{ fontSize: rf(16) }} className="text-white font-black uppercase text-center">
                  {item.nome?.trim() ? item.nome : "Produto sem nome"}
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={rf(24)} color="white" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View>
            <View className="bg-purple-50/50 p-6 rounded-[40px] mb-8 border border-purple-100 flex-row items-center justify-between">
              <View className="flex-1">
                <Text style={{ color: roxo, fontSize: rf(10) }} className="font-black uppercase mb-2 ml-1 tracking-widest">Unidades Vendidas</Text>
                <TextInput 
                  keyboardType="numeric"
                  style={{ fontSize: rf(20) }}
                  className="bg-white p-4 rounded-3xl font-black text-center border-2 border-purple-100"
                  value={unidadesProjetadas}
                  onChangeText={setUnidadesProjetadas}
                />
              </View>
              <View className="ml-6 items-center">
                 <MaterialCommunityIcons name="rocket-launch-outline" size={rf(32)} color={lavanda} />
                 <Text style={{ fontSize: rf(8) }} className="font-bold text-gray-400 uppercase mt-1">Simular</Text>
              </View>
            </View>

            <View className="mb-8">
              <HeaderTabela labels={['Produto', 'Precificação', 'Ganho', 'Variação']} />
              <View className="bg-white border border-gray-100 rounded-b-[30px] shadow-sm overflow-hidden">
                <View className="flex-row items-center p-4 border-b border-gray-50">
                  <View className="flex-1">
                    <Text style={{ color: roxo, fontSize: rf(12) }} className="font-black uppercase">
                      {produtoSelecionado.nome?.trim() ? produtoSelecionado.nome : "Produto sem nome"}
                    </Text>
                    <Text style={{ fontSize: rf(8) }} className="text-gray-400 font-bold uppercase">Base: {res.unidades} un.</Text>
                  </View>
                  <View className="w-24">
                    <Text style={{ fontSize: rf(10) }} className="font-bold text-gray-700 text-right">R$ {res.PV_sem.toFixed(2)}</Text>
                    <Text style={{ color: roxo, fontSize: rf(10) }} className="font-black text-right">R$ {res.PVM.toFixed(2)}</Text>
                  </View>
                  <Text style={{ fontSize: rf(10) }} className="w-16 text-right font-black text-green-600">
                    {res.ganhoPercentual.toFixed(2)}%
                  </Text>
                  <Text style={{ color: roxo, fontSize: rf(10) }} className="w-20 text-right font-black">
                    R$ {res.variacaoTotalBruta.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={{ backgroundColor: roxo }} className="p-8 rounded-[45px] shadow-xl items-center mb-6">
              <MaterialCommunityIcons name="lightbulb-on-outline" size={rf(24)} color="#FFF" />
              <Text style={{ fontSize: rf(11) }} className="text-white/80 text-center leading-tight font-medium">
                Ao vender {res.unidades} unidades utilizando a variação entre o preço de venda e o preço com mark-up você garante um lucro de
                <Text className="text-white font-black"> R$ {res.variacaoTotalBruta.toFixed(2)} </Text> 
              </Text>
            </View>

            <View className="bg-purple-50 p-6 rounded-[30px] border border-purple-100">
              <Text style={{ color: roxo, fontSize: rf(10) }} className="text-center font-black uppercase mb-3 tracking-wider">
                Faturamento Total Previsto
              </Text>
              
              <Text style={{ color: '#4b5563', fontSize: rf(12) }} className="text-center font-bold mb-1">
                Preço de Venda: <Text style={{ color: roxo }} className="font-black">R$ {(res.PV_sem * res.unidades).toFixed(2)}</Text>
              </Text>
              
              <Text style={{ color: '#4b5563', fontSize: rf(12) }} className="text-center font-bold">
                Preço com mark-up: <Text style={{ color: roxo }} className="font-black">R$ {res.faturamentoTotal.toFixed(2)}</Text>
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
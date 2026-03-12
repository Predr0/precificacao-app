import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function Precificacao() {

  const [precoInsumo, setPrecoInsumo] = useState('25.00'); 
  const [qtdEmbalagem, setQtdEmbalagem] = useState('1000'); 
  const [qtdUtilizada, setQtdUtilizada] = useState('200'); 
  

  const [tempoMinutos, setTempoMinutos] = useState('60');
  const [lucroDesejado, setLucroDesejado] = useState('30'); 

  const [res, setRes] = useState(null);

  const calcular = () => {
    const config = { salario: 5000, dias: 22, horas: 8, CF: 500, DF: 200, DV: 300 };
    const cargaHorariaMinutos = config.dias * config.horas * 60;
    const tempo = parseFloat(tempoMinutos);

    const CV_Insumo = (parseFloat(precoInsumo) / parseFloat(qtdEmbalagem)) * parseFloat(qtdUtilizada);

    const minMaoObra = config.salario / cargaHorariaMinutos;
    const minCF = config.CF / cargaHorariaMinutos;
    const minDF = config.DF / cargaHorariaMinutos;
    const minDV = config.DV / cargaHorariaMinutos;


    const totalMaoObra = minMaoObra * tempo;
    const totalCF = minCF * tempo;
    const totalDF = minDF * tempo;
    const totalDV = minDV * tempo;
    const totalGeral = CV_Insumo + totalMaoObra + totalCF + totalDF + totalDV;

    // 4. Preço Tradicional
    const lucro = totalGeral * (parseFloat(lucroDesejado) / 100);
    const PV_Tradicional = totalGeral + lucro;

    // 5. MARK-UP
    // Markup = 100 / [100 - (%DF + %DV + %Lucro)] 
    // Percentuais baseados no rateio sobre o total
    const pDF = (totalDF / totalGeral) * 100;
    const pDV = (totalDV / totalGeral) * 100;
    const pLucro = parseFloat(lucroDesejado);
    const markup = 100 / (100 - (pDF + pDV + pLucro));
    const PV_Markup = totalGeral * markup;

    // 6. Ponto de Equilíbrio (Unidades)
    const PE = config.CF / (PV_Tradicional - CV_Insumo);

    setRes({ cv: CV_Insumo, total: totalGeral, pvt: PV_Tradicional, pvm: PV_Markup, mkp: markup, pe: PE });
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Cálculo de Produto</Text>
      
      <View className="bg-blue-50 p-4 rounded-xl mb-4">
        <Text className="font-bold text-blue-700">Cadastro de Insumo</Text>
        <TextInput placeholder="Preço de Compra" value={precoInsumo} onChangeText={setPrecoInsumo} keyboardType="numeric" className="bg-white p-3 rounded-lg my-2 border border-blue-200" />
        <View className="flex-row justify-between">
          <TextInput placeholder="Qtd Embalagem" value={qtdEmbalagem} onChangeText={setQtdEmbalagem} keyboardType="numeric" className="bg-white p-3 rounded-lg w-[48%] border border-blue-200" />
          <TextInput placeholder="Qtd Utilizada" value={qtdUtilizada} onChangeText={setQtdUtilizada} keyboardType="numeric" className="bg-white p-3 rounded-lg w-[48%] border border-blue-200" />
        </View>
      </View>

      <TextInput placeholder="Tempo de Produção (Minutos)" value={tempoMinutos} onChangeText={setTempoMinutos} keyboardType="numeric" className="bg-gray-100 p-3 rounded-lg mb-2" />
      <TextInput placeholder="Margem de Lucro (%)" value={lucroDesejado} onChangeText={setLucroDesejado} keyboardType="numeric" className="bg-gray-100 p-3 rounded-lg mb-4" />

      <TouchableOpacity className="bg-green-600 p-4 rounded-2xl" onPress={calcular}>
        <Text className="text-white text-center font-bold">CALCULAR PREÇO FINAL</Text>
      </TouchableOpacity>

      {res && (
        <View className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-10">
          <Text>Custo Fracionado Material: R$ {res.cv.toFixed(2)}</Text>
          <Text>Total Custos/Despesas: R$ {res.total.toFixed(2)}</Text>
          <Text className="font-bold text-lg mt-2">PV Tradicional: R$ {res.pvt.toFixed(2)}</Text>
          <Text className="font-bold text-lg text-blue-700">PV Mark-up ({res.mkp.toFixed(2)}): R$ {res.pvm.toFixed(2)}</Text>
          <Text className="mt-2 text-red-600">Ponto de Equilíbrio: {Math.ceil(res.pe)} unid.</Text>
        </View>
      )}
    </ScrollView>
  );
}
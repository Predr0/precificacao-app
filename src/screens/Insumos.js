import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Você precisará instalar: npm install @react-native-picker/picker
import { AppContext } from '../context/AppContext';

export default function Insumos({ navigation }) {
  const { insumos, setInsumos } = useContext(AppContext);
  const [item, setItem] = useState({ nome: '', preco: '', unidade: 'unidade', qtdTotal: '', qtdUso: '' });

  const addInsumo = () => {
    // RF04: Cálculo da Fração (Preço / Qtd Total * Qtd Uso)
    const custoFração = (parseFloat(item.preco) / parseFloat(item.qtdTotal)) * parseFloat(item.qtdUso);
    setInsumos([...insumos, { ...item, custoFração }]);
    setItem({ nome: '', preco: '', unidade: 'unidade', qtdTotal: '', qtdUso: '' });
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-xl font-bold mb-4">2. Cadastro de Materiais (CV)</Text>

      <View className="bg-blue-50 p-4 rounded-2xl mb-4">
        <TextInput placeholder="Nome (Ex: Tecido)" value={item.nome} onChangeText={(v) => setItem({...item, nome: v})} className="bg-white p-3 rounded-lg mb-2 border border-blue-200" />
        
        <View className="flex-row justify-between mb-2">
          <TextInput placeholder="Preço Pago (R$)" keyboardType="decimal-pad" value={item.preco} onChangeText={(v) => setItem({...item, preco: v.replace(/[^0-9.]/g, '')})} className="bg-white p-3 rounded-lg w-[48%]" />
          <View className="bg-white rounded-lg w-[48%] justify-center">
            <Picker selectedValue={item.unidade} onValueChange={(v) => setItem({...item, unidade: v})}>
              <Picker.Item label="unidade" value="unid" />
              <Picker.Item label="kg" value="kg" />
              <Picker.Item label="grama" value="g" />
              <Picker.Item label="metro" value="m" />
              <Picker.Item label="cm" value="cm" />
            </Picker>
          </View>
        </View>

        <View className="flex-row justify-between mb-4">
          <TextInput placeholder="Qtd Embalagem" keyboardType="numeric" value={item.qtdTotal} onChangeText={(v) => setItem({...item, qtdTotal: v})} className="bg-white p-3 rounded-lg w-[48%]" />
          <TextInput placeholder="Qtd Utilizada" keyboardType="numeric" value={item.qtdUso} onChangeText={(v) => setItem({...item, qtdUso: v})} className="bg-white p-3 rounded-lg w-[48%]" />
        </View>

        <TouchableOpacity className="bg-blue-800 p-4 rounded-xl" onPress={addInsumo}>
          <Text className="text-white text-center font-bold">+ ADICIONAR AO PRODUTO</Text>
        </TouchableOpacity>
      </View>

      <Text className="font-bold mb-2">Materiais na Ficha Técnica:</Text>
      <ScrollView className="flex-1 mb-4">
        {insumos.map((ins, index) => (
          <View key={index} className="bg-gray-50 p-3 mb-2 rounded-lg border-l-4 border-blue-500">
            <Text className="font-bold">{ins.nome} ({ins.qtdUso} {ins.unidade})</Text>
            <Text className="text-blue-700">Custo Fracionado: R$ {ins.custoFração.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity className="bg-green-600 p-5 rounded-2xl" onPress={() => navigation.navigate('CalculoProduto')}>
        <Text className="text-white text-center font-bold text-lg">GERAR PREÇO FINAL</Text>
      </TouchableOpacity>
    </View>
  );
}
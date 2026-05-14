import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, Dimensions, PixelRatio } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 412;

function rf(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function DespesasFixas({ navigation }) {
  const { listaDespesasFixas, setListaDespesasFixas, removerItem } = useContext(AppContext);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');

  const roxo = '#4d235e';
  const lavanda = '#9e86bd';

  const adicionar = () => {
    if (nome.trim() === '' || valor.trim() === '') {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    setListaDespesasFixas([...listaDespesasFixas, { id: Date.now().toString(), nome, valor }]);
    setNome(''); setValor('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        
        <View className="mb-8">
          <Text style={{ color: roxo, fontSize: rf(30) }} className="font-black uppercase tracking-tighter">Despesas</Text>
          <Text style={{ fontSize: rf(12) }} className="text-gray-400 font-bold uppercase">Gastos Fixos Mensais (RF07)</Text>
        </View>

        <View className="bg-purple-50/50 p-6 rounded-[40px] mb-8 border border-purple-100">
          <View className="mb-4">
            <View className="flex-row items-center mb-2 ml-1">
              <MaterialCommunityIcons name="tag-outline" size={rf(14)} color={roxo} />
              <Text style={{ color: roxo, fontSize: rf(9) }} className="font-black uppercase ml-2 tracking-widest">Identificação</Text>
            </View>
            <TextInput 
              placeholder="Ex: Contador, Software, MEI" 
              placeholderTextColor="#CCC"
              style={{ fontSize: rf(14) }}
              className="border-2 border-purple-100 p-4 rounded-3xl font-bold bg-white shadow-sm" 
              value={nome} 
              onChangeText={setNome} 
            />
          </View>

          <View className="mb-6">
            <View className="flex-row items-center mb-2 ml-1">
              <MaterialCommunityIcons name="cash-outline" size={rf(14)} color={roxo} />
              <Text style={{ color: roxo, fontSize: rf(9) }} className="font-black uppercase ml-2 tracking-widest">Valor Mensal (R$)</Text>
            </View>
            <TextInput 
              placeholder="0.00" 
              placeholderTextColor="#CCC"
              keyboardType="decimal-pad" 
              style={{ fontSize: rf(14) }}
              className="border-2 border-purple-100 p-4 rounded-3xl font-bold bg-white shadow-sm" 
              value={valor} 
              onChangeText={(v) => setValor(v.replace(',', '.').replace(/[^0-9.]/g, ''))} 
            />
          </View>

          <TouchableOpacity 
            style={{ backgroundColor: roxo }} 
            className="p-5 rounded-3xl flex-row justify-center items-center shadow-md" 
            onPress={adicionar}
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={rf(20)} color="white" />
            <Text style={{ fontSize: rf(12) }} className="text-white font-black uppercase ml-2">Adicionar Despesa</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-10">
          <Text style={{ color: lavanda, fontSize: rf(10) }} className="font-black mb-4 uppercase tracking-widest ml-1">Itens Listados</Text>
          {listaDespesasFixas.map(item => (
            <View key={item.id} className="flex-row justify-between items-center bg-white p-5 rounded-[30px] mb-3 border border-purple-50 shadow-sm">
              <View>
                <Text style={{ color: roxo, fontSize: rf(12) }} className="font-black uppercase">{item.nome}</Text>
                <Text style={{ color: lavanda, fontSize: rf(12) }} className="font-bold">R$ {parseFloat(item.valor).toFixed(2)}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => removerItem(item.id, listaDespesasFixas, setListaDespesasFixas)}
                className="bg-red-50 p-2 rounded-full"
              >
                <MaterialCommunityIcons name="trash-can-outline" size={rf(20)} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
          {listaDespesasFixas.length === 0 && (
            <Text style={{ fontSize: rf(12) }} className="text-gray-300 text-center italic mt-4">Nenhuma despesa fixa cadastrada.</Text>
          )}
        </View>

        <TouchableOpacity 
          style={{ backgroundColor: roxo }} 
          className="p-6 rounded-[35px] mb-20 shadow-xl flex-row justify-center items-center" 
          onPress={() => navigation.navigate('DespesasVariaveis')}
        >
          <Text style={{ fontSize: rf(12) }} className="text-white text-center font-black uppercase tracking-widest">Próximo: Despesas Variáveis</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
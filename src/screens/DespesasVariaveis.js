import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DespesasVariaveis({ navigation }) {
  const { listaDespesasVariaveis, setListaDespesasVariaveis, removerItem } = useContext(AppContext);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');

  const roxo = '#4d235e';
  const lavanda = '#9e86bd';

  const adicionar = () => {
    if (nome.trim() === '' || valor.trim() === '') {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    setListaDespesasVariaveis([...listaDespesasVariaveis, { id: Date.now().toString(), nome, valor }]);
    setNome(''); setValor('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        
        <View className="mb-8">
          <Text style={{ color: roxo }} className="text-3xl font-black uppercase tracking-tighter">Variáveis</Text>
          <Text className="text-gray-400 font-bold text-xs uppercase">Gastos Ocasionais (RF08)</Text>
        </View>

        <View className="bg-purple-50/50 p-6 rounded-[40px] mb-8 border border-purple-100">
          <View className="mb-4">
            <View className="flex-row items-center mb-2 ml-1">
              <MaterialCommunityIcons name="truck-delivery-outline" size={14} color={roxo} />
              <Text style={{ color: roxo }} className="font-black text-[9px] uppercase ml-2 tracking-widest">Identificação</Text>
            </View>
            <TextInput 
              placeholder="Ex: Frete, Embalagem Extra, Gasolina" 
              placeholderTextColor="#CCC"
              className="border-2 border-purple-100 p-4 rounded-3xl font-bold bg-white shadow-sm" 
              value={nome} 
              onChangeText={setNome} 
            />
          </View>

          <View className="mb-6">
            <View className="flex-row items-center mb-2 ml-1">
              <MaterialCommunityIcons name="cash-fast" size={14} color={roxo} />
              <Text style={{ color: roxo }} className="font-black text-[9px] uppercase ml-2 tracking-widest">Valor Mensal (R$)</Text>
            </View>
            <TextInput 
              placeholder="0.00" 
              placeholderTextColor="#CCC"
              keyboardType="decimal-pad" 
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
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="white" />
            <Text className="text-white font-black text-xs uppercase ml-2">Adicionar Variável</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-10">
          <Text style={{ color: lavanda }} className="font-black text-[10px] mb-4 uppercase tracking-widest ml-1">Itens Listados</Text>
          {listaDespesasVariaveis.map(item => (
            <View key={item.id} className="flex-row justify-between items-center bg-white p-5 rounded-[30px] mb-3 border border-purple-50 shadow-sm">
              <View>
                <Text style={{ color: roxo }} className="font-black text-xs uppercase">{item.nome}</Text>
                <Text style={{ color: lavanda }} className="font-bold text-xs">R$ {parseFloat(item.valor).toFixed(2)}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => removerItem(item.id, listaDespesasVariaveis, setListaDespesasVariaveis)}
                className="bg-red-50 p-2 rounded-full"
              >
                <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
          {listaDespesasVariaveis.length === 0 && (
            <Text className="text-gray-300 text-center italic text-xs mt-4">Nenhuma despesa variável cadastrada.</Text>
          )}
        </View>

        <TouchableOpacity 
          style={{ backgroundColor: roxo}} 
          className="p-6 rounded-[35px] mb-20 shadow-xl flex-row justify-center items-center" 
          onPress={() => navigation.navigate('Insumos')}
        >
          <Text className="text-white text-center font-black text-xs uppercase tracking-widest">Próximo: Insumos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
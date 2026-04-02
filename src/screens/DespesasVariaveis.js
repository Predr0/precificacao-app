import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function DespesasVariaveis({ navigation }) {
  const { listaDespesasVariaveis, setListaDespesasVariaveis, removerItem } = useContext(AppContext);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');

  const adicionar = () => {
    if (nome.trim() === '' || valor.trim() === '') {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    setListaDespesasVariaveis([...listaDespesasVariaveis, { id: Date.now().toString(), nome, valor }]);
    setNome(''); setValor('');
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-black text-orange-800 mb-6">Despesas Variáveis (RF08)</Text>
      
      <View className="bg-orange-50 p-5 rounded-3xl mb-6 border border-orange-100">
        <TextInput 
          placeholder="Nome (Ex: Gasolina, Frete)" 
          className="bg-white p-4 rounded-2xl mb-2 border border-orange-200" 
          value={nome} 
          onChangeText={setNome} 
        />
        <TextInput 
          placeholder="Valor Mensal (R$)" 
          keyboardType="decimal-pad" 
          className="bg-white p-4 rounded-2xl mb-4 border border-orange-200" 
          value={valor} 
          onChangeText={(v) => setValor(v.replace(',', '.').replace(/[^0-9.]/g, ''))} 
        />
        <TouchableOpacity className="bg-orange-600 p-4 rounded-2xl" onPress={adicionar}>
          <Text className="text-white text-center font-bold">ADICIONAR DESPESA VAR.</Text>
        </TouchableOpacity>
      </View>

      {listaDespesasVariaveis.map(item => (
        <View key={item.id} className="flex-row justify-between items-center bg-gray-50 p-4 rounded-2xl mb-2 border border-gray-100">
          <View>
            <Text className="text-gray-700 font-medium">{item.nome}</Text>
            <Text className="text-orange-800 font-bold">R$ {parseFloat(item.valor).toFixed(2)}</Text>
          </View>
          <TouchableOpacity onPress={() => removerItem(item.id, listaDespesasVariaveis, setListaDespesasVariaveis)}>
            <Text className="text-lg">🗑️</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity className="bg-black p-6 rounded-3xl mt-6 mb-10" onPress={() => navigation.navigate('Insumos')}>
        <Text className="text-white text-center font-black">AVANÇAR PARA INSUMOS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
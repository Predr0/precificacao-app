import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function DespesasFixas({ navigation }) {
  const { listaDespesasFixas, setListaDespesasFixas } = useContext(AppContext);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');

  const adicionar = () => {
    if (nome.trim() === '' || valor.trim() === '') {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    setListaDespesasFixas([...listaDespesasFixas, { id: Date.now().toString(), nome, valor }]);
    setNome(''); setValor('');
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-xl font-bold text-purple-800 mb-6">Despesas Fixas (RF07)</Text>

      <View className="bg-purple-50 p-4 rounded-2xl mb-6">
        <TextInput placeholder="Nome (Ex: MEI, Contador)" className="bg-white p-3 rounded-lg mb-2" value={nome} onChangeText={setNome} />
        <TextInput placeholder="Valor Mensal (R$)" keyboardType="numeric" className="bg-white p-3 rounded-lg mb-4" value={valor} onChangeText={(v) => setValor(v.replace(/[^0-9.]/g, ''))} />
        <TouchableOpacity className="bg-purple-600 p-3 rounded-xl" onPress={adicionar}>
          <Text className="text-white text-center font-bold">+ ADICIONAR DESPESA FIXA</Text>
        </TouchableOpacity>
      </View>

      {listaDespesasFixas.map(item => (
        <View key={item.id} className="flex-row justify-between bg-gray-50 p-4 rounded-xl mb-2 border border-gray-100">
          <Text className="text-gray-700">{item.nome}</Text>
          <Text className="font-bold text-purple-800">R$ {parseFloat(item.valor).toFixed(2)}</Text>
        </View>
      ))}

      <TouchableOpacity className="bg-black p-5 rounded-2xl mt-6 mb-10" onPress={() => navigation.navigate('Insumos')}>
        <Text className="text-white text-center font-bold">PRÓXIMO: DESPESAS VARIÁVEIS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function CustosFixos() {
  const { listaCustosFixos, setListaCustosFixos, totalCustosFixos } = useContext(AppContext);

  // Função para atualizar o valor de um custo específico
  const handleUpdateValue = (id, valor) => {
    const novaLista = listaCustosFixos.map(item => 
      item.id === id ? { ...item, valor: valor.replace(/[^0-9.]/g, '') } : item
    );
    setListaCustosFixos(novaLista);
  };

  // Função para adicionar um novo custo personalizado
  const adicionarNovoCusto = () => {
    const novoCusto = { id: Date.now().toString(), nome: 'Novo Gasto', valor: '0' };
    setListaCustosFixos([...listaCustosFixos, novoCusto]);
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-xl font-bold mb-2">Custos Fixos Mensais</Text>
      <Text className="text-gray-500 mb-6 text-xs italic">Insira os gastos que não mudam com a produção.</Text>

      {listaCustosFixos.map((gasto) => (
        <View key={gasto.id} className="mb-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <Text className="text-gray-700 font-bold mb-2">{gasto.nome}</Text>
          <TextInput
            placeholder="R$ 0,00"
            keyboardType="decimal-pad"
            value={gasto.valor}
            onChangeText={(v) => handleUpdateValue(gasto.id, v)}
            className="bg-white p-3 rounded-lg border border-gray-200 font-bold text-blue-800"
          />
        </View>
      ))}

      <TouchableOpacity 
        className="border-2 border-dashed border-blue-400 p-4 rounded-2xl mb-6" 
        onPress={adicionarNovoCusto}
      >
        <Text className="text-blue-500 text-center font-bold">+ CADASTRAR OUTRO CUSTO</Text>
      </TouchableOpacity>

      <View className="bg-blue-600 p-6 rounded-3xl mb-10">
        <Text className="text-white opacity-80 uppercase text-xs font-bold">Total Acumulado Mensal</Text>
        <Text className="text-white text-3xl font-black">R$ {totalCustosFixos.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
}
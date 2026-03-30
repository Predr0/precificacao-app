import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function Insumos({ navigation }) {
  const { insumos, setInsumos, removerItem } = useContext(AppContext);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [qtdE, setQtdE] = useState('');
  const [qtdU, setQtdU] = useState('');

  const adicionar = () => {
    if (!nome || !preco || !qtdE || !qtdU) {
      Alert.alert("Erro", "Preencha a ficha técnica do insumo.");
      return;
    }
    const custoFração = (parseFloat(preco) / parseFloat(qtdE)) * parseFloat(qtdU);
    
    setInsumos([...insumos, { 
      id: Date.now().toString(), 
      nome, 
      custoFração 
    }]);
    
    setNome(''); setPreco(''); setQtdE(''); setQtdU('');
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-black text-purple-900 mb-6">Insumos (Custo Variável)</Text>
      
      <View className="bg-purple-50 p-5 rounded-3xl mb-6 border border-purple-100">
        <TextInput placeholder="Nome do Material" className="bg-white p-4 rounded-2xl mb-2" value={nome} onChangeText={setNome} />
        <TextInput placeholder="Preço da Embalagem (R$)" keyboardType="default" className="bg-white p-4 rounded-2xl mb-2" value={preco} onChangeText={setPreco} />
        <View className="flex-row justify-between">
          <TextInput placeholder="Qtd Embalagem" keyboardType="default" className="bg-white p-4 rounded-2xl w-[48%]" value={qtdE} onChangeText={setQtdE} />
          <TextInput placeholder="Qtd Usada" keyboardType="default" className="bg-white p-4 rounded-2xl w-[48%]" value={qtdU} onChangeText={setQtdU} />
        </View>
        <TouchableOpacity className="bg-purple-700 p-4 rounded-2xl mt-4" onPress={adicionar}>
          <Text className="text-white text-center font-bold">ADICIONAR INSUMO</Text>
        </TouchableOpacity>
      </View>

      {insumos.map(item => (
        <View key={item.id} className="flex-row justify-between items-center bg-gray-50 p-4 rounded-2xl mb-2 border border-gray-100">
          <View>
            <Text className="text-gray-700 font-medium">{item.nome}</Text>
            <Text className="text-purple-900 font-bold">Custo: R$ {item.custoFração.toFixed(2)}</Text>
          </View>
          <TouchableOpacity onPress={() => removerItem(item.id, insumos, setInsumos)}>
            <Text className="text-lg">🗑️</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity className="bg-green-700 p-6 rounded-3xl mt-6 mb-10 shadow-lg" onPress={() => navigation.navigate('CalculoProduto')}>
        <Text className="text-white text-center font-black text-lg">VER RESULTADO FINAL</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
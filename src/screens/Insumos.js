import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AppContext } from '../context/AppContext';

export default function Insumos({ navigation }) {
  const { insumos, setInsumos, unidades, setUnidades } = useContext(AppContext);
  const [item, setItem] = useState({ nome: '', preco: '', unidade: 'unid', qtdTotal: '', qtdUso: '' });
  const [novaUnidade, setNovaUnidade] = useState('');

  const addNovaMedida = () => {
    if (novaUnidade.trim() === '') return;
    if (!unidades.includes(novaUnidade.toLowerCase())) {
      setUnidades([...unidades, novaUnidade.toLowerCase()]);
      setItem({...item, unidade: novaUnidade.toLowerCase()});
      setNovaUnidade('');
    } else {
      Alert.alert("Aviso", "Esta unidade já existe.");
    }
  };

  const salvarInsumo = () => {
    if (!item.nome || !item.preco || !item.qtdTotal || !item.qtdUso) {
      Alert.alert("Erro", "Preencha todos os campos numéricos.");
      return;
    }
    const custoFração = (parseFloat(item.preco) / parseFloat(item.qtdTotal)) * parseFloat(item.qtdUso);
    setInsumos([...insumos, { ...item, custoFração }]);
    setItem({ nome: '', preco: '', unidade: 'unid', qtdTotal: '', qtdUso: '' });
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-xl font-bold mb-4">Cadastro de Materiais (Custos Variáveis)</Text>

      <View className="flex-row mb-4">
        <TextInput placeholder="Nova Unidade (ex: kw)" className="bg-gray-100 p-3 rounded-l-lg flex-1" value={novaUnidade} onChangeText={setNovaUnidade} />
        <TouchableOpacity className="bg-gray-800 p-3 rounded-r-lg justify-center" onPress={addNovaMedida}>
          <Text className="text-white font-bold">ADD MEDIDA</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-blue-50 p-4 rounded-2xl mb-6">
        <TextInput placeholder="Nome do Material" className="bg-white p-3 rounded-lg mb-2" value={item.nome} onChangeText={(v) => setItem({...item, nome: v})} />
        <View className="flex-row justify-between mb-2">
          <TextInput placeholder="Preço (R$)" keyboardType="numeric" className="bg-white p-3 rounded-lg w-[48%]" value={item.preco} onChangeText={(v) => setItem({...item, preco: v.replace(/[^0-9.]/g, '')})} />
          <View className="bg-white rounded-lg w-[48%] justify-center">
            <Picker selectedValue={item.unidade} onValueChange={(v) => setItem({...item, unidade: v})}>
              {unidades.map(u => <Picker.Item key={u} label={u} value={u} />)}
            </Picker>
          </View>
        </View>
        <View className="flex-row justify-between mb-4">
          <TextInput placeholder="Qtd Embalagem" keyboardType="numeric" className="bg-white p-3 rounded-lg w-[48%]" value={item.qtdTotal} onChangeText={(v) => setItem({...item, qtdTotal: v.replace(/[^0-9.]/g, '')})} />
          <TextInput placeholder="Qtd Utilizada" keyboardType="numeric" className="bg-white p-3 rounded-lg w-[48%]" value={item.qtdUso} onChangeText={(v) => setItem({...item, qtdUso: v.replace(/[^0-9.]/g, '')})} />
        </View>
        <TouchableOpacity className="bg-blue-800 p-4 rounded-xl" onPress={salvarInsumo}>
          <Text className="text-white text-center font-bold">SALVAR MATERIAL</Text>
        </TouchableOpacity>
      </View>

      {insumos.map((ins, i) => (
        <View key={i} className="p-3 border-b border-gray-100">
          <Text>{ins.nome}: R$ {ins.custoFração.toFixed(2)}</Text>
        </View>
      ))}

      <TouchableOpacity className="bg-green-600 p-5 rounded-2xl mt-6 mb-10" onPress={() => navigation.navigate('DespesasVariaveis')}>
        <Text className="text-white text-center font-bold">VER RESULTADO FINAL</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
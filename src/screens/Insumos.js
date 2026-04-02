import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Insumos({ navigation }) {
  const { insumos, setInsumos, removerItem } = useContext(AppContext);
  
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [qtdE, setQtdE] = useState('');
  const [qtdU, setQtdU] = useState('');
  const [unidade, setUnidade] = useState('unid');
  const [modalVisible, setModalVisible] = useState(false);
  const [novaUnidade, setNovaUnidade] = useState('');

  const roxo = '#4d235e';

  const adicionarInsumo = () => {
    if (!nome || !preco || !qtdE || !qtdU) {
      Alert.alert("Erro", "Preencha a ficha técnica completa.");
      return;
    }
    const p = parseFloat(preco.replace(',', '.'));
    const qE = parseFloat(qtdE.replace(',', '.'));
    const qU = parseFloat(qtdU.replace(',', '.'));
    
    const custoFração = (p / qE) * qU;
    
    setInsumos([...insumos, { 
      id: Date.now().toString(), 
      nome, 
      unidade, 
      custoFração,
      detalhes: `${qU}${unidade} de ${qE}${unidade}`
    }]);
    
    setNome(''); setPreco(''); setQtdE(''); setQtdU('');
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text style={{ color: roxo }} className="text-2xl font-black mb-6 uppercase">Insumos (Custos Variáveis)</Text>
      
      <View className="bg-purple-50 p-6 rounded-[40px] mb-8 border border-purple-100">
        <TextInput placeholder="Material (ex: Energia, Farinha)" className="bg-white p-4 rounded-2xl mb-3" value={nome} onChangeText={setNome} />
        <TextInput placeholder="Preço Pago (R$)" keyboardType="decimal-pad" className="bg-white p-4 rounded-2xl mb-3" value={preco} onChangeText={setPreco} />
        
        <View className="flex-row justify-between mb-4">
          <TextInput placeholder="Qtd Total" keyboardType="decimal-pad" className="bg-white p-4 rounded-2xl w-[48%]" value={qtdE} onChangeText={setQtdE} />
          <TextInput placeholder="Qtd Usada" keyboardType="decimal-pad" className="bg-white p-4 rounded-2xl w-[48%]" value={qtdU} onChangeText={setQtdU} />
        </View>

        <Text className="text-[10px] font-black text-purple-900 mb-2 ml-1 uppercase">Unidade de Medida Personalizada</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {['unid', 'kg', 'g', 'ml', 'L'].map(m => (
            <TouchableOpacity key={m} onPress={() => setUnidade(m)} style={{ backgroundColor: unidade === m ? roxo : 'white' }} className="px-4 py-2 rounded-full border border-purple-200">
              <Text style={{ color: unidade === m ? 'white' : roxo }} className="font-bold text-xs">{m}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setModalVisible(true)} className="px-4 py-2 rounded-full bg-white border border-dashed border-purple-400">
            <Text style={{ color: roxo }} className="font-bold text-xs">+ {unidade === 'unid' || ['kg','g','ml','L'].includes(unidade) ? 'Personalizar' : unidade}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ backgroundColor: roxo }} className="p-5 rounded-2xl flex-row justify-center items-center" onPress={adicionarInsumo}>
          <MaterialCommunityIcons name="plus-circle" size={20} color="white" />
          <Text className="text-white font-black ml-2">ADICIONAR MATERIAL</Text>
        </TouchableOpacity>
      </View>

      {insumos.map(item => (
        <View key={item.id} className="flex-row justify-between items-center bg-gray-50 p-4 rounded-3xl mb-3 border border-gray-100">
          <View>
            <Text className="text-gray-800 font-black">{item.nome}</Text>
            <Text className="text-gray-400 text-[10px]">{item.detalhes}</Text>
            <Text style={{ color: roxo }} className="font-bold">Custo: R$ {item.custoFração.toFixed(2)}</Text>
          </View>
          <TouchableOpacity onPress={() => removerItem(item.id, insumos, setInsumos)} className="bg-red-50 p-2 rounded-full">
            <MaterialCommunityIcons name="trash-can-outline" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity className="bg-green-700 p-6 rounded-[35px] mt-6 mb-20 shadow-lg" onPress={() => navigation.navigate('relatorioScreen')}>
        <Text className="text-white text-center font-black text-lg uppercase">Gerar Relatórios Finais</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center bg-black/50 p-6">
          <View className="bg-white p-8 rounded-[40px]">
            <Text style={{ color: roxo }} className="font-black text-lg mb-4 text-center">Defina sua Unidade (ex: Kilowatt)</Text>
            <TextInput placeholder="Digite a unidade aqui..." className="bg-gray-100 p-4 rounded-2xl mb-6 text-center" value={novaUnidade} onChangeText={setNovaUnidade} autoFocus />
            <TouchableOpacity style={{ backgroundColor: roxo }} className="p-4 rounded-2xl" onPress={() => { setUnidade(novaUnidade); setModalVisible(false); }}>
              <Text className="text-white text-center font-bold uppercase">Confirmar Unidade</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
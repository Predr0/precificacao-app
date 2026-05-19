import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, Modal, Dimensions, PixelRatio } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 412;

function rf(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function Insumos({ navigation }) {
  const { insumos, setInsumos, removerItem } = useContext(AppContext);
  
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [qtdE, setQtdE] = useState('');
  const [qtdU, setQtdU] = useState('');
  
  const [listaUnidades, setListaUnidades] = useState(['unid', 'kg', 'g', 'ml', 'L']);
  const [unidade, setUnidade] = useState('unid');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [novaUnidade, setNovaUnidade] = useState('');

  const roxo = '#4d235e';
  const lavanda = '#9e86bd';

  const adicionarInsumo = () => {
    if (!nome || !preco || !qtdE || !qtdU) {
      Alert.alert("Erro", "Preencha a ficha técnica completa.");
      return;
    }
    const p = parseFloat(preco);
    const qE = parseFloat(qtdE);
    const qU = parseFloat(qtdU);
    const custoFração = (p / qE) * qU;
    
    setInsumos([...insumos, { 
      id: Date.now().toString(), 
      nome, 
      unidade, 
      precoEmbalagem: p, 
      custoFração,
      detalhes: `${qU}${unidade} de ${qE}${unidade}`
    }]);
    
    setNome(''); setPreco(''); setQtdE(''); setQtdU('');
  };

  const confirmarNovaUnidade = () => {
    const valorFormatado = novaUnidade.trim().toLowerCase();
    if (valorFormatado) {
      if (!listaUnidades.includes(valorFormatado)) {
        setListaUnidades([...listaUnidades, valorFormatado]);
      }
      setUnidade(valorFormatado);
    }
    setNovaUnidade('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        
        <View className="mb-8">
          <Text style={{ color: roxo, fontSize: rf(30) }} className="font-black uppercase tracking-tighter">Insumos</Text>
          <Text style={{ fontSize: rf(12) }} className="text-gray-400 font-bold uppercase text-center">Ficha Técnica de Materiais</Text>
        </View>

        <View className="bg-purple-50/50 p-6 rounded-[40px] mb-8 border border-purple-100">
          <View className="mb-4">
            <TextInput 
              placeholder="Material (ex: Farinha, Resina, Tecido)" 
              placeholderTextColor="#CCC"
              style={{ fontSize: rf(14) }}
              className="bg-white p-4 rounded-2xl border border-purple-100 font-bold text-gray-700" 
              value={nome} 
              onChangeText={setNome} 
            />
          </View>

          <View className="mb-4">
             <Text style={{ color: roxo, fontSize: rf(9) }} className="font-black uppercase mb-2 ml-1 tracking-widest">Preço da Embalagem Fechada</Text>
             <TextInput 
              placeholder="R$ 0.00" 
              placeholderTextColor="#CCC"
              keyboardType="decimal-pad" 
              style={{ fontSize: rf(14) }}
              className="bg-white p-4 rounded-2xl border border-purple-100 font-bold text-gray-700" 
              value={preco} 
              onChangeText={(v) => setPreco(v.replace(',', '.').replace(/[^0-9.]/g, ''))} 
            />
          </View>
          
          <View className="flex-row justify-between mb-6">
            <View className="w-[48%]">
              <Text style={{ color: roxo, fontSize: rf(9) }} className="font-black uppercase mb-2 ml-1 tracking-widest">Qtd Total</Text>
              <TextInput 
                placeholder="Ex: 1000" 
                keyboardType="decimal-pad" 
                style={{ fontSize: rf(14) }}
                className="bg-white p-4 rounded-2xl border border-purple-100 font-bold text-center" 
                value={qtdE} 
                onChangeText={(v) => setQtdE(v.replace(',', '.').replace(/[^0-9.]/g, ''))} 
              />
            </View>
            <View className="w-[48%]">
              <Text style={{ color: roxo, fontSize: rf(9) }} className="font-black uppercase mb-2 ml-1 tracking-widest">Qtd Usada</Text>
              <TextInput 
                placeholder="Ex: 150" 
                keyboardType="decimal-pad" 
                style={{ fontSize: rf(14) }}
                className="bg-white p-4 rounded-2xl border border-purple-100 font-bold text-center" 
                value={qtdU} 
                onChangeText={(v) => setQtdU(v.replace(',', '.').replace(/[^0-9.]/g, ''))} 
              />
            </View>
          </View>

          <Text style={{ color: lavanda, fontSize: rf(10) }} className="font-black uppercase mb-3 ml-1 tracking-widest text-center">Unidade de Medida</Text>
          <View className="flex-row flex-wrap justify-center gap-2 mb-6">
            {listaUnidades.map(m => (
              <TouchableOpacity 
                key={m} 
                onPress={() => setUnidade(m)} 
                style={{ backgroundColor: unidade === m ? roxo : 'white' }} 
                className="px-4 py-2 rounded-full border border-purple-200"
              >
                <Text style={{ color: unidade === m ? 'white' : roxo, fontSize: rf(10) }} className="font-black uppercase text-center">{m}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(true)} className="px-4 py-2 rounded-full bg-white border border-dashed border-purple-400">
              <Text style={{ color: roxo, fontSize: rf(10) }} className="font-black uppercase text-center">+ Outra</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={{ backgroundColor: roxo }} 
            className="p-5 rounded-3xl flex-row justify-center items-center shadow-lg" 
            onPress={adicionarInsumo}
          >
            <MaterialCommunityIcons name="plus-circle" size={rf(20)} color="white" />
            <Text style={{ fontSize: rf(12) }} className="text-white font-black uppercase ml-2 text-center">Cadastrar Insumo</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-10">
          <Text style={{ color: lavanda, fontSize: rf(10) }} className="font-black mb-4 uppercase tracking-widest ml-1">Ficha de Insumos</Text>
          {insumos.map(item => (
            <View key={item.id} className="flex-row justify-between items-center bg-white p-5 rounded-[30px] mb-3 border border-purple-50 shadow-sm">
              <View className="flex-1 pr-4">
                <Text style={{ color: roxo, fontSize: rf(12) }} className="font-black uppercase">{item.nome}</Text>
                <Text style={{ fontSize: rf(9) }} className="text-gray-400 font-bold uppercase tracking-tighter">{item.detalhes}</Text>
                <Text style={{ color: '#059669', fontSize: rf(12) }} className="font-bold mt-1">Custo Fração: R$ {item.custoFração.toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={() => removerItem(item.id, insumos, setInsumos)} className="bg-red-50 p-2 rounded-full">
                <MaterialCommunityIcons name="trash-can-outline" size={rf(20)} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={{ backgroundColor: roxo}} 
          className="p-6 rounded-[35px] mb-20 shadow-xl flex-row justify-center items-center" 
          onPress={() => navigation.navigate('CalculoProduto')}
        >
          <Text style={{ fontSize: rf(12) }} className="text-white text-center font-black uppercase tracking-widest">Finalizar e Ver Preço</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="fade">
          <View className="flex-1 justify-center bg-black/50 p-6">
            <View className="bg-white p-8 rounded-[40px] shadow-2xl">
              <Text style={{ color: roxo, fontSize: rf(18) }} className="font-black mb-4 text-center">Nova Unidade</Text>
              <TextInput 
                placeholder="Ex: Hora, Metro, Par" 
                style={{ fontSize: rf(14) }}
                className="bg-gray-100 p-4 rounded-2xl mb-6 text-center font-bold" 
                value={novaUnidade} 
                onChangeText={setNovaUnidade} 
                autoFocus 
              />
              <TouchableOpacity 
                style={{ backgroundColor: roxo }} 
                className="p-4 rounded-2xl" 
                onPress={confirmarNovaUnidade}
              >
                <Text style={{ fontSize: rf(12) }} className="text-white text-center font-black uppercase">Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}
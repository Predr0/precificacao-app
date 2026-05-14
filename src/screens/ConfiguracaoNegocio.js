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

const roxo = '#4d235e';
const lavanda = '#9e86bd';

const InputLabel = ({ label, icon, placeholder, value, onChangeText, keyboardType = "decimal-pad", color = '#4d235e' }) => (
  <View className="mb-4">
    <View className="flex-row items-center mb-2 ml-1">
      <MaterialCommunityIcons name={icon} size={14} color={roxo} />
      <Text style={{ color: roxo, fontSize: rf(9) }} className="font-black uppercase ml-2 tracking-widest">{label}</Text>
    </View>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#CCC"
      keyboardType={keyboardType}
      style={{ 
        borderColor: '#F0F0F0', 
        backgroundColor: '#FFF', 
        color: color,
        fontSize: rf(14) 
      className="border-2 p-4 rounded-3xl font-bold shadow-sm"
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

export default function ConfiguracaoNegocio({ navigation }) {
  const { 
    nomeProduto,
    setNomeProduto,
    config, 
    setConfig, 
    listaCustosFixos, 
    setListaCustosFixos, 
    listaColaboradores, 
    setListaColaboradores,
    removerItem,
    salvarAlteracoes
  } = useContext(AppContext);

  const [nomeCusto, setNomeCusto] = useState('');
  const [valorCusto, setValorCusto] = useState('');
  const [nomeColab, setNomeColab] = useState('');
  const [salarioColab, setSalarioColab] = useState('');
  const [diasColab, setDiasColab] = useState('');
  const [horasColab, setHorasColab] = useState('');

  const handleAvancar = () => {
    if (!nomeProduto || nomeProduto.trim() === '') {
      Alert.alert("Erro", "Por favor, dê um nome ao produto.");
      return;
    }
    salvarAlteracoes(); 
    navigation.navigate('DespesasFixas');
  };

  const validarEAdd = (nome, valor, lista, setLista, limpar) => {
    if (nome.trim() === '' || valor.trim() === '') {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }
    
    let novoItem;
    if (lista === listaColaboradores) {
      if (diasColab.trim() === '' || horasColab.trim() === '') {
        Alert.alert("Erro", "Preencha os dias e horas do colaborador.");
        return;
      }
      novoItem = { 
        id: Date.now().toString(), 
        nome, 
        salario: valor,
        dias: diasColab,
        horas: horasColab
      };
    } else {
      novoItem = { 
        id: Date.now().toString(), 
        nome, 
        valor: valor 
      };
    }

    setLista([...lista, novoItem]);
    limpar();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        
        <View className="mb-8">
          <Text style={{ color: roxo, fontSize: rf(30) }} className="font-black uppercase tracking-tighter">Capacidade</Text>
          <Text style={{ fontSize: rf(12) }} className="text-gray-400 font-bold uppercase">Configuração do Produto</Text>
        </View>

        <View className="mb-6">
          <InputLabel 
            label="Nome do Produto" 
            icon="tag-outline"
            placeholder="Ex: Vestido de Festa"
            value={nomeProduto}
            onChangeText={setNomeProduto}
            keyboardType="default"
          />
        </View>

        <View className="bg-purple-50/50 p-6 rounded-[40px] mb-6 border border-purple-100">
          <InputLabel 
            label="Pro Labore Desejado (R$)" 
            icon="cash-marker"
            placeholder="Ex: 5000"
            value={config.salario}
            onChangeText={(v) => setConfig({...config, salario: v.replace(',', '.').replace(/[^0-9.]/g, '')})}
          />
          
          <View className="flex-row justify-between">
            <View className="w-[48%]">
              <InputLabel 
                label="Dias trab/ mês" 
                icon="calendar-month-outline"
                placeholder="22"
                value={config.dias}
                onChangeText={(v) => setConfig({...config, dias: v.replace(/[^0-9]/g, '')})}
              />
            </View>
            <View className="w-[48%]">
              <InputLabel 
                label="Horas trab/ dia" 
                icon="clock-outline"
                placeholder="8"
                value={config.horas}
                onChangeText={(v) => setConfig({...config, horas: v.replace(/[^0-9]/g, '')})}
              />
            </View>
          </View>

          <InputLabel 
            label="Tempo de Produção (Minutos)" 
            icon="timer-outline"
            placeholder="30"
            color="#7c3aed"
            value={config.tempoProducao}
            onChangeText={(v) => setConfig({...config, tempoProducao: v.replace(/[^0-9]/g, '')})}
          />

          <InputLabel 
            label="Margem de Lucro (%)" 
            icon="trending-up"
            placeholder="30"
            color="#059669"
            value={config.lucroDesejado}
            onChangeText={(v) => setConfig({...config, lucroDesejado: v.replace(',', '.').replace(/[^0-9.]/g, '')})}
          />
        </View>

        <View className="bg-purple-50/50 p-6 rounded-[40px] mb-6 border border-purple-100">
          <Text style={{ color: lavanda, fontSize: rf(10) }} className="font-black mb-4 uppercase tracking-widest ml-1">Colaboradores</Text>
          <TextInput placeholder="Nome" style={{ fontSize: rf(14) }} className="bg-white p-4 rounded-2xl mb-2 border border-purple-100 font-bold" value={nomeColab} onChangeText={setNomeColab} />
          <TextInput placeholder="Salário (R$)" style={{ fontSize: rf(14) }} keyboardType="decimal-pad" className="bg-white p-4 rounded-2xl mb-2 border border-purple-100 font-bold" value={salarioColab} onChangeText={(v) => setSalarioColab(v.replace(',', '.').replace(/[^0-9.]/g, ''))} />
          <View className="flex-row justify-between mb-4">
            <TextInput placeholder="Dias trab/ mês" style={{ fontSize: rf(14) }} keyboardType="numeric" className="bg-white p-4 rounded-2xl w-[48%] border border-purple-100 font-bold text-center" value={diasColab} onChangeText={setDiasColab} />
            <TextInput placeholder="Horas trab/ dia" style={{ fontSize: rf(14) }} keyboardType="numeric" className="bg-white p-4 rounded-2xl w-[48%] border border-purple-100 font-bold text-center" value={horasColab} onChangeText={setHorasColab} />
          </View>
          <TouchableOpacity style={{ backgroundColor: roxo }} className="p-4 rounded-2xl shadow-sm" onPress={() => validarEAdd(nomeColab, salarioColab, listaColaboradores, setListaColaboradores, () => {setNomeColab(''); setSalarioColab(''); setDiasColab(''); setHorasColab('')})}>
            <Text style={{ fontSize: rf(12) }} className="text-white text-center font-black uppercase">Cadastrar Colaborador</Text>
          </TouchableOpacity>
          {listaColaboradores.map(c => (
            <View key={c.id} className="mt-3 p-4 bg-white rounded-2xl flex-row justify-between items-center border border-purple-100 shadow-sm">
              <View>
                <Text style={{ color: roxo, fontSize: rf(12) }} className="font-black uppercase">{c.nome}</Text>
                <Text style={{ fontSize: rf(10) }} className="font-bold text-gray-400">{c.dias} dias/mês • {c.horas}h/dia</Text>
                <Text style={{ fontSize: rf(10) }} className="font-bold text-gray-400">R$ {parseFloat(c.salario).toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={() => removerItem(c.id, listaColaboradores, setListaColaboradores)}>
                <MaterialCommunityIcons name="delete-outline" size={rf(20)} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View className="bg-purple-50/50 p-6 rounded-[40px] mb-8 border border-purple-100">
          <Text style={{ color: lavanda, fontSize: rf(10) }} className="font-black mb-4 uppercase tracking-widest ml-1">Custos Fixos da Operação</Text>
          <TextInput placeholder="Ex: Aluguel" style={{ fontSize: rf(14) }} className="bg-white p-4 rounded-2xl mb-2 border border-purple-100 font-bold" value={nomeCusto} onChangeText={setNomeCusto} />
          <TextInput placeholder="Valor Mensal(R$)" style={{ fontSize: rf(14) }} keyboardType="decimal-pad" className="bg-white p-4 rounded-2xl mb-4 border border-purple-100 font-bold" value={valorCusto} onChangeText={(v) => setValorCusto(v.replace(',', '.').replace(/[^0-9.]/g, ''))} />
          <TouchableOpacity style={{ backgroundColor: roxo }} className="p-4 rounded-2xl shadow-sm" onPress={() => validarEAdd(nomeCusto, valorCusto, listaCustosFixos, setListaCustosFixos, () => {setNomeCusto(''); setValorCusto('')})}>
            <Text style={{ fontSize: rf(12) }} className="text-white text-center font-black uppercase">Adicionar Custo</Text>
          </TouchableOpacity>
          {listaCustosFixos.map(i => (
            <View key={i.id} className="mt-3 p-4 bg-white rounded-2xl flex-row justify-between items-center border border-purple-100 shadow-sm">
              <View>
                <Text style={{ color: roxo, fontSize: rf(12) }} className="font-black uppercase">{i.nome}</Text>
                <Text style={{ fontSize: rf(10) }} className="font-bold text-gray-400">R$ {parseFloat(i.valor).toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={() => removerItem(i.id, listaCustosFixos, setListaCustosFixos)}>
                <MaterialCommunityIcons name="delete-outline" size={rf(20)} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={{ backgroundColor: roxo }}
          className="p-6 rounded-[35px] mb-20 shadow-xl flex-row justify-center items-center" 
          onPress={handleAvancar}
        >
          <Text style={{ fontSize: rf(13) }} className="text-white text-center font-black uppercase tracking-widest">Avançar para Despesas Fixas</Text>
          <MaterialCommunityIcons name="chevron-right" size={rf(20)} color="white" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
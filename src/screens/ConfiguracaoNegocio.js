import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function ConfiguracaoNegocio({ navigation }) {
  const { config, setConfig, listaCustosFixos, setListaCustosFixos, listaColaboradores, setListaColaboradores } = useContext(AppContext);
  
  const [nomeCusto, setNomeCusto] = useState('');
  const [valorCusto, setValorCusto] = useState('');
  const [nomeColab, setNomeColab] = useState('');
  const [salarioColab, setSalarioColab] = useState('');

  const validarEAdd = (nome, valor, lista, setLista, limpar) => {
    if (nome.trim() === '' || valor.trim() === '') {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }
    const novoItem = { id: Date.now().toString(), nome, [lista === listaColaboradores ? 'salario' : 'valor']: valor };
    setLista([...lista, novoItem]);
    limpar();
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-blue-900 mb-6">Configuração do Negócio</Text>

      {/* SEÇÃO 1: SUA MÃO DE OBRA */}
      <View className="bg-gray-50 p-5 rounded-3xl mb-6 border border-gray-100 shadow-sm">
        <Text className="font-bold text-gray-800 mb-4">Seu Pró-Labore e Tempo</Text>
        
        {/* Label para Salário */}
        <Text className="text-xs font-bold text-gray-500 mb-1 ml-1">Salário Mensal Desejado (R$)</Text>
        <TextInput 
          placeholder="Ex: 5000"
          keyboardType="numeric"
          className="bg-white p-4 rounded-2xl mb-4 border border-gray-200 font-bold text-blue-800"
          value={config.salario}
          onChangeText={(v) => setConfig({...config, salario: v.replace(/[^0-9.]/g, '')})} 
        />

        <View className="flex-row justify-between">
          <View className="w-[48%]">
            {/* Label para Dias */}
            <Text className="text-xs font-bold text-gray-500 mb-1 ml-1">Dias p/ mês</Text>
            <TextInput 
              placeholder="Ex: 22"
              keyboardType="numeric"
              className="bg-white p-4 rounded-2xl border border-gray-200 text-center"
              value={config.dias}
              onChangeText={(v) => setConfig({...config, dias: v.replace(/[^0-9]/g, '')})}
            />
          </View>
          <View className="w-[48%]">
            {/* Label para Horas */}
            <Text className="text-xs font-bold text-gray-500 mb-1 ml-1">Horas p/ dia</Text>
            <TextInput 
              placeholder="Ex: 8"
              keyboardType="numeric"
              className="bg-white p-4 rounded-2xl border border-gray-200 text-center"
              value={config.horas}
              onChangeText={(v) => setConfig({...config, horas: v.replace(/[^0-9]/g, '')})}
            />
          </View>
        </View>
      </View>

      {/* SEÇÃO 2: COLABORADORES */}
      <View className="bg-green-50 p-5 rounded-3xl mb-6 border border-green-100">
        <Text className="font-bold text-green-800 mb-4">Adicionar Colaborador (Fixo)</Text>
        <TextInput placeholder="Nome" className="bg-white p-4 rounded-2xl mb-2 border border-green-200" value={nomeColab} onChangeText={setNomeColab} />
        <TextInput placeholder="Salário (R$)" keyboardType="numeric" className="bg-white p-4 rounded-2xl mb-4 border border-green-200" value={salarioColab} onChangeText={(v) => setSalarioColab(v.replace(/[^0-9.]/g, ''))} />
        <TouchableOpacity className="bg-green-600 p-4 rounded-2xl" onPress={() => validarEAdd(nomeColab, salarioColab, listaColaboradores, setListaColaboradores, () => {setNomeColab(''); setSalarioColab('')})}>
          <Text className="text-white text-center font-bold">CADASTRAR FUNCIONÁRIO</Text>
        </TouchableOpacity>
        
        {listaColaboradores.map(c => (
          <View key={c.id} className="mt-3 p-2 bg-white/50 rounded-lg flex-row justify-between">
            <Text className="text-green-900">{c.nome}</Text>
            <Text className="font-bold">R$ {parseFloat(c.salario).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* SEÇÃO 3: CUSTOS FIXOS */}
      <View className="bg-blue-50 p-5 rounded-3xl mb-10 border border-blue-100">
        <Text className="font-bold text-blue-800 mb-4">Outros Custos Fixos (Luz, MEI...)</Text>
        <TextInput placeholder="Nome do Custo" className="bg-white p-4 rounded-2xl mb-2 border border-blue-200" value={nomeCusto} onChangeText={setNomeCusto} />
        <TextInput placeholder="Valor (R$)" keyboardType="numeric" className="bg-white p-4 rounded-2xl mb-4 border border-blue-200" value={valorCusto} onChangeText={(v) => setValorCusto(v.replace(/[^0-9.]/g, ''))} />
        <TouchableOpacity className="bg-blue-600 p-4 rounded-2xl" onPress={() => validarEAdd(nomeCusto, valorCusto, listaCustosFixos, setListaCustosFixos, () => {setNomeCusto(''); setValorCusto('')})}>
          <Text className="text-white text-center font-bold">ADICIONAR GASTO</Text>
        </TouchableOpacity>
        
        {listaCustosFixos.map(i => (
          <View key={i.id} className="mt-3 p-2 bg-white/50 rounded-lg flex-row justify-between">
            <Text className="text-blue-900">{i.nome}</Text>
            <Text className="font-bold">R$ {parseFloat(i.valor).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity className="bg-black p-6 rounded-3xl mb-12 shadow-lg" onPress={() => navigation.navigate('Insumos')}>
        <Text className="text-white text-center font-black text-lg">PROSSEGUIR PARA MATERIAIS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
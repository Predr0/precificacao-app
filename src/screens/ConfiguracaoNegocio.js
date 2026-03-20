import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function ConfiguracaoNegocio({ navigation }) {
  const { 
    config, 
    setConfig, 
    listaCustosFixos, 
    setListaCustosFixos, 
    listaColaboradores, 
    setListaColaboradores 
  } = useContext(AppContext);
  
  const [nomeCusto, setNomeCusto] = useState('');
  const [valorCusto, setValorCusto] = useState('');
  const [nomeColab, setNomeColab] = useState('');
  const [salarioColab, setSalarioColab] = useState('');

  const validarEAdd = (nome, valor, lista, setLista, limpar) => {
    if (nome.trim() === '' || valor.trim() === '') {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }
    const novoItem = { 
      id: Date.now().toString(), 
      nome, 
      [lista === listaColaboradores ? 'salario' : 'valor']: valor 
    };
    setLista([...lista, novoItem]);
    limpar();
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-blue-900 mb-6">Configuração do Negócio</Text>

      {/* SEÇÃO 1: PRÓ-LABORE, CARGA HORÁRIA E PRODUÇÃO (RF06/RF07/RF08) */}
      <View className="bg-gray-50 p-5 rounded-3xl mb-6 border border-gray-100 shadow-sm">
        <Text className="font-bold text-gray-800 mb-4 italic text-sm">Base de Tempo e Salário</Text>
        
        {/* Input Salário */}
        <Text className="text-xs font-bold text-gray-500 mb-1 ml-1">Seu Salário Mensal Desejado (R$)</Text>
        <TextInput 
          placeholder="Ex: 5000"
          keyboardType="numeric"
          className="bg-white p-4 rounded-2xl mb-4 border border-gray-200 font-bold text-blue-800"
          value={config.salario}
          onChangeText={(v) => setConfig({...config, salario: v.replace(/[^0-9.]/g, '')})} 
        />

        {/* Inputs de Dias e Horas Lado a Lado */}
        <View className="flex-row justify-between mb-4">
          <View className="w-[48%]">
            <Text className="text-xs font-bold text-gray-500 mb-1 ml-1">Dias p/ mês</Text>
            <TextInput 
              placeholder="Ex: 22"
              keyboardType="numeric"
              className="bg-white p-4 rounded-2xl border border-gray-200 text-center font-bold"
              value={config.dias}
              onChangeText={(v) => setConfig({...config, dias: v.replace(/[^0-9]/g, '')})}
            />
          </View>
          <View className="w-[48%]">
            <Text className="text-xs font-bold text-gray-500 mb-1 ml-1">Horas p/ dia</Text>
            <TextInput 
              placeholder="Ex: 8"
              keyboardType="numeric"
              className="bg-white p-4 rounded-2xl border border-gray-200 text-center font-bold"
              value={config.horas}
              onChangeText={(v) => setConfig({...config, horas: v.replace(/[^0-9]/g, '')})}
            />
          </View>
        </View>

        {/* NOVO CAMPO: TEMPO DE PRODUÇÃO (Solicitado para o cálculo de rateio) */}
        <Text className="text-xs font-bold text-gray-500 mb-1 ml-1">Tempo de Produção deste Produto (Minutos)</Text>
        <TextInput 
          placeholder="Ex: 30"
          keyboardType="numeric"
          className="bg-white p-4 rounded-2xl border border-gray-200 font-bold text-purple-700"
          value={config.tempoProducao}
          onChangeText={(v) => setConfig({...config, tempoProducao: v.replace(/[^0-9]/g, '')})}
        />
        <Text className="text-[10px] text-gray-400 mt-2 italic">* Este tempo será usado para fatiar seus custos fixos e despesas.</Text>
      </View>

      {/* SEÇÃO 2: COLABORADORES (RF06) */}
      <View className="bg-green-50 p-5 rounded-3xl mb-6 border border-green-100">
        <Text className="font-bold text-green-800 mb-4">Adicionar Colaborador (Fixo)</Text>
        <TextInput placeholder="Nome do funcionário" className="bg-white p-4 rounded-2xl mb-2 border border-green-200" value={nomeColab} onChangeText={setNomeColab} />
        <TextInput placeholder="Salário (R$)" keyboardType="numeric" className="bg-white p-4 rounded-2xl mb-4 border border-green-200" value={salarioColab} onChangeText={(v) => setSalarioColab(v.replace(/[^0-9.]/g, ''))} />
        <TouchableOpacity className="bg-green-600 p-4 rounded-2xl shadow-sm" onPress={() => validarEAdd(nomeColab, salarioColab, listaColaboradores, setListaColaboradores, () => {setNomeColab(''); setSalarioColab('')})}>
          <Text className="text-white text-center font-bold uppercase">Cadastrar Colaborador</Text>
        </TouchableOpacity>
        
        {listaColaboradores.map(c => (
          <View key={c.id} className="mt-3 p-3 bg-white/60 rounded-xl flex-row justify-between border border-green-100">
            <Text className="text-green-900 font-medium">{c.nome}</Text>
            <Text className="font-bold">R$ {parseFloat(c.salario).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* SEÇÃO 3: CUSTOS FIXOS (RF06) */}
      <View className="bg-blue-50 p-5 rounded-3xl mb-10 border border-blue-100">
        <Text className="font-bold text-blue-800 mb-4">Custos Fixos da Operação (Luz, Aluguel...)</Text>
        <TextInput placeholder="Ex: Conta de Energia" className="bg-white p-4 rounded-2xl mb-2 border border-blue-200" value={nomeCusto} onChangeText={setNomeCusto} />
        <TextInput placeholder="Valor Mensal (R$)" keyboardType="numeric" className="bg-white p-4 rounded-2xl mb-4 border border-blue-200" value={valorCusto} onChangeText={(v) => setValorCusto(v.replace(/[^0-9.]/g, ''))} />
        <TouchableOpacity className="bg-blue-600 p-4 rounded-2xl shadow-sm" onPress={() => validarEAdd(nomeCusto, valorCusto, listaCustosFixos, setListaCustosFixos, () => {setNomeCusto(''); setValorCusto('')})}>
          <Text className="text-white text-center font-bold uppercase">Adicionar Custo Fixo</Text>
        </TouchableOpacity>
        
        {listaCustosFixos.map(i => (
          <View key={i.id} className="mt-3 p-3 bg-white/60 rounded-xl flex-row justify-between border border-blue-100">
            <Text className="text-blue-900 font-medium">{i.nome}</Text>
            <Text className="font-bold">R$ {parseFloat(i.valor).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* BOTÃO DE NAVEGAÇÃO PARA O PRÓXIMO REQUISITO (RF07) */}
      <TouchableOpacity 
        className="bg-black p-6 rounded-3xl mb-16 shadow-xl" 
        onPress={() => navigation.navigate('DespesasFixas')}
      >
        <Text className="text-white text-center font-black text-lg">CONFIGURAR DESPESAS FIXAS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
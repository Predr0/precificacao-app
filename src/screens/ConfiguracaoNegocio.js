import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function ConfiguracaoNegocio({ navigation }) {
  const { config, setConfig, listaCustosFixos, setListaCustosFixos } = useContext(AppContext);
  
  // Estados locais para o novo custo que está sendo digitado
  const [novoNome, setNovoNome] = useState('');
  const [novoPreco, setNovoPreco] = useState('');

  // Função para adicionar um custo à lista com validação
  const adicionarCusto = () => {
    // Validação: Proibir espaços em branco ou campos vazios
    if (novoNome.trim() === '' || novoPreco.trim() === '') {
      Alert.alert("Atenção", "Por favor, preencha o nome e o preço do custo fixo.");
      return;
    }

    const novoCusto = {
      id: Date.now().toString(),
      nome: novoNome,
      valor: novoPreco
    };

    setListaCustosFixos([...listaCustosFixos, novoCusto]);
    setNovoNome('');
    setNovoPreco('');
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-xl font-bold text-blue-800 mb-6">Mão de Obra e Custos Fixos</Text>

      {/* Seção 1: Mão de Obra (RF06) */}
      <View className="bg-gray-50 p-4 rounded-2xl mb-6">
        <Text className="font-bold text-gray-700 mb-2">Configuração de Salário</Text>
        <TextInput 
          placeholder="Salário Mensal (R$)"
          keyboardType="numeric"
          className="bg-white p-3 rounded-lg mb-2 border border-gray-200"
          value={config.salario}
          onChangeText={(v) => setConfig({...config, salario: v.replace(/[^0-9.]/g, '')})} 
        />
        <View className="flex-row justify-between">
          <TextInput 
            placeholder="Dias/mês"
            keyboardType="numeric"
            className="bg-white p-3 rounded-lg w-[48%] border border-gray-200"
            value={config.dias}
            onChangeText={(v) => setConfig({...config, dias: v.replace(/[^0-9]/g, '')})}
          />
          <TextInput 
            placeholder="Horas/dia"
            keyboardType="numeric"
            className="bg-white p-3 rounded-lg w-[48%] border border-gray-200"
            value={config.horas}
            onChangeText={(v) => setConfig({...config, horas: v.replace(/[^0-9]/g, '')})}
          />
        </View>
      </View>

      {/* Seção 2: Cadastro Dinâmico de Custos Fixos (RF06, RF07) */}
      <View className="bg-blue-50 p-4 rounded-2xl mb-4">
        <Text className="font-bold text-blue-800 mb-3">Cadastrar Novo Custo Fixo</Text>
        <TextInput 
          placeholder="Nome (ex: Luz, Aluguel)"
          className="bg-white p-3 rounded-lg mb-2 border border-blue-100"
          value={novoNome}
          onChangeText={setNovoNome}
        />
        <TextInput 
          placeholder="Preço (R$)"
          keyboardType="numeric" // Permite apenas números no teclado
          className="bg-white p-3 rounded-lg mb-3 border border-blue-100"
          value={novoPreco}
          onChangeText={(v) => setNovoPreco(v.replace(/[^0-9.]/g, ''))} // Bloqueia letras via código
        />
        <TouchableOpacity className="bg-blue-600 p-3 rounded-xl" onPress={adicionarCusto}>
          <Text className="text-white text-center font-bold">+ ADICIONAR CUSTO</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Custos Já Cadastrados */}
      <Text className="font-bold text-gray-600 mb-2">Custos Registrados:</Text>
      {listaCustosFixos.map((item) => (
        <View key={item.id} className="flex-row justify-between bg-gray-100 p-3 rounded-lg mb-2">
          <Text className="text-gray-800">{item.nome}</Text>
          <Text className="font-bold text-blue-800">R$ {parseFloat(item.valor).toFixed(2)}</Text>
        </View>
      ))}

      <TouchableOpacity 
        className="bg-green-600 p-5 rounded-2xl mt-6 mb-10"
        onPress={() => navigation.navigate('Insumos')}
      >
        <Text className="text-white text-center font-bold text-lg">SALVAR E IR PARA INSUMOS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
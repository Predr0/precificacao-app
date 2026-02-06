import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import db from '../database/database';

export default function ConfiguracaoNegocio() {
  const [salario, setSalario] = useState('');
  const [horas, setHoras] = useState('');

  const salvarConfiguracao = () => {
    if (!salario || !horas) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    // Lógica para salvar no SQLite (RNF01 - Offline)
    db.runSync(
      'INSERT OR REPLACE INTO configuracoes (id, salario_pretendido, horas_mensais) VALUES (1, ?, ?)',
      [parseFloat(salario), parseFloat(horas)]
    );
    
    Alert.alert("Sucesso", "Configurações salvas!");
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-2">Configuração do Negócio</Text>
      <Text className="text-gray-500 mb-8">Defina sua base de cálculo para a mão de obra.</Text>

      {/* Input Salário Pretendido (RF05) */}
      <View className="mb-6">
        <Text className="text-gray-700 font-semibold mb-2">Salário Mensal Pretendido (R$)</Text>
        <TextInput 
          className="border border-gray-300 rounded-lg p-4 text-lg"
          placeholder="Ex: 3000"
          keyboardType="numeric"
          value={salario}
          onChangeText={setSalario}
        />
      </View>

      {/* Input Horas Trabalhadas (RF05) */}
      <View className="mb-10">
        <Text className="text-gray-700 font-semibold mb-2">Horas de Trabalho por Mês</Text>
        <TextInput 
          className="border border-gray-300 rounded-lg p-4 text-lg"
          placeholder="Ex: 160"
          keyboardType="numeric"
          value={horas}
          onChangeText={setHoras}
        />
      </View>

      <TouchableOpacity 
        className="bg-blue-600 p-4 rounded-xl shadow-md"
        onPress={salvarConfiguracao}
      >
        <Text className="text-white text-center font-bold text-lg">Salvar Configurações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
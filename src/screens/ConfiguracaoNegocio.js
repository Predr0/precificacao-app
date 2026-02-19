import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function ConfiguracaoNegocio({ navigation }) {
  const { config, setConfig } = useContext(AppContext);

  const validarEAvançar = () => {
    if (parseFloat(config.salario) > 0 && parseFloat(config.dias) > 0) {
      navigation.navigate('Insumos');
    } else {
      Alert.alert("Erro", "Preencha os valores de salário e tempo de trabalho.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-xl font-bold text-blue-800 mb-6">Custos Fixos e Mão de Obra</Text>
      
      <Text className="text-gray-600 font-bold">Salário Mensal Desejado (R$)</Text>
      <TextInput 
        className="bg-gray-100 p-4 rounded-xl mb-4 border border-gray-200"
        keyboardType="decimal-pad"
        value={config.salario}
        onChangeText={(v) => setConfig({...config, salario: v.replace(/[^0-9.]/g, '')})} 
      />

      <View className="flex-row justify-between mb-4">
        <View className="w-[48%]">
          <Text className="text-gray-600 font-bold">Dias/Mês</Text>
          <TextInput keyboardType="numeric" className="bg-gray-100 p-4 rounded-xl" value={config.dias} onChangeText={(v) => setConfig({...config, dias: v.replace(/[^0-9]/g, '')})} />
        </View>
        <View className="w-[48%]">
          <Text className="text-gray-600 font-bold">Horas/Dia</Text>
          <TextInput keyboardType="numeric" className="bg-gray-100 p-4 rounded-xl" value={config.horas} onChangeText={(v) => setConfig({...config, horas: v.replace(/[^0-9]/g, '')})} />
        </View>
      </View>

      <Text className="text-gray-600 font-bold">Custos Fixos (Aluguel, Luz, etc.)</Text>
      <TextInput keyboardType="decimal-pad" className="bg-gray-100 p-4 rounded-xl mb-4" value={config.custoFixo} onChangeText={(v) => setConfig({...config, custoFixo: v})} />

      <TouchableOpacity className="bg-blue-600 p-5 rounded-2xl mt-4" onPress={validarEAvançar}>
        <Text className="text-white text-center font-bold text-lg">DEFINIR INSUMOS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
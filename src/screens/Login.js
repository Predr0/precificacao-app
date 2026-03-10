import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    navigation.navigate('ConfiguracaoNegocio');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white justify-center p-8"
    >
      <View className="items-center mb-12">
        <View className="w-20 h-20 bg-blue-600 rounded-3xl items-center justify-center mb-4 shadow-lg">
          <Text className="text-white text-4xl font-bold">A</Text>
        </View>
        <Text className="text-3xl font-bold text-gray-800">Annik App</Text>
        <Text className="text-gray-500">Gestão e Precificação</Text>
      </View>

      {/* Formulário (RF01) */}
      <View className="space-y-4">
        <View>
          <Text className="text-gray-600 ml-1 mb-1">E-mail</Text>
          <TextInput
            className="bg-gray-100 p-4 rounded-2xl text-lg border border-gray-200 focus:border-blue-500"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="mt-4">
          <Text className="text-gray-600 ml-1 mb-1">Senha</Text>
          <TextInput
            className="bg-gray-100 p-4 rounded-2xl text-lg border border-gray-200 focus:border-blue-500"
            placeholder="********"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
        </View>
      </View>

      {/*Entrar no app aqui*/}
      <TouchableOpacity 
        className="bg-blue-600 p-5 rounded-2xl mt-10 shadow-md active:bg-blue-700"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-bold text-lg">Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity className="mt-6">
        <Text className="text-blue-600 text-center font-semibold">Ainda não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
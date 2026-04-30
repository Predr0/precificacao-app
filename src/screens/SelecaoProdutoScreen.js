import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SelecaoProdutoScreen({ navigation }) {
  const { produtos, carregarProduto, novoProduto } = useContext(AppContext);

  const handleEditar = (produto) => {
    carregarProduto(produto);
    navigation.navigate('ConfiguracaoNegocio');
  };

  const handleCriarNovo = () => {
    novoProduto();
    navigation.navigate('ConfiguracaoNegocio');
  };

  const renderItem = ({ item }) => (
    <View className="flex-row justify-between items-center bg-white p-5 rounded-3xl mb-3 shadow-sm border border-purple-50">
      <View className="flex-1">
        <Text className="text-[#4d235e] font-black text-lg uppercase">
          {item.nome || "Produto sem nome"}
        </Text>
        <Text className="text-gray-400 font-bold text-[10px] uppercase">
          {item.insumos?.length || 0} Insumos • R$ {item.config?.salario || '0'} Pro Labore
        </Text>
      </View>

      <TouchableOpacity 
        onPress={() => handleEditar(item)}
        className="bg-purple-100 p-3 rounded-2xl"
      >
        <MaterialCommunityIcons name="pencil" size={24} color="#4d235e" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FF]">
      <View className="p-6 flex-1">
        <View className="mb-8 flex-row justify-between items-center">
          <View>
            <Text className="text-[#4d235e] text-3xl font-black uppercase tracking-tighter">Produtos</Text>
            <Text className="text-gray-400 font-bold text-xs uppercase">Selecione para Precificar</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleCriarNovo}
            className="bg-[#4d235e] p-4 rounded-2xl shadow-lg"
          >
            <MaterialCommunityIcons name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View className="items-center mt-20">
              <MaterialCommunityIcons name="package-variant" size={80} color="#DDD" />
              <Text className="text-gray-400 font-bold mt-4 text-center">
                Nenhum produto cadastrado.{"\n"}Clique no "+" para começar.
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
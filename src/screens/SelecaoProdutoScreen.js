import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Dimensions, PixelRatio, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Lógica de Escalonamento baseada no seu Pixel 7 (largura 412)
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 412;

function rf(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function SelecaoProdutoScreen({ navigation }) {
  // Puxando a função removerProduto do Contexto
  const { produtos, carregarProduto, novoProduto, removerProduto } = useContext(AppContext);

  const handleEditar = (produto) => {
    carregarProduto(produto);
    navigation.navigate('ConfiguracaoNegocio');
  };

  const handleCriarNovo = () => {
    novoProduto();
    navigation.navigate('ConfiguracaoNegocio');
  };

  // Função de confirmação para segurança do usuário
  const handleExcluir = (produto) => {
    Alert.alert(
      "Excluir Produto",
      `Tem certeza que deseja remover "${produto.nome || 'este produto'}"? Toda a ficha técnica será perdida.`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: () => {
            if (removerProduto) {
              removerProduto(produto.id);
            }
          } 
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View className="flex-row justify-between items-center bg-white p-5 rounded-3xl mb-3 shadow-sm border border-purple-50">
      <View className="flex-1 pr-2">
        <Text 
          style={{ fontSize: rf(18) }}
          className="text-[#4d235e] font-black uppercase"
        >
          {item.nome || "Produto sem nome"}
        </Text>
        <Text 
          style={{ fontSize: rf(10) }}
          className="text-gray-400 font-bold uppercase"
        >
          {item.insumos?.length || 0} Insumos • R$ {item.config?.salario || '0'} Pro Labore
        </Text>
      </View>

      {/* Container dos Botões de Ação */}
      <View className="flex-row items-center">
        {/* BOTÃO EXCLUIR (Lixeira em vermelho suave) */}
        <TouchableOpacity 
          onPress={() => handleExcluir(item)}
          className="bg-red-50 p-3 rounded-2xl mr-2"
        >
          <MaterialCommunityIcons name="trash-can-outline" size={rf(22)} color="#ff4444" />
        </TouchableOpacity>

        {/* BOTÃO EDITAR */}
        <TouchableOpacity 
          onPress={() => handleEditar(item)}
          className="bg-purple-100 p-3 rounded-2xl"
        >
          <MaterialCommunityIcons name="pencil" size={rf(22)} color="#4d235e" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FF]">
      <View className="p-6 flex-1">
        <View className="mb-8 flex-row justify-between items-center">
          <View>
            <Text 
              style={{ fontSize: rf(30) }}
              className="text-[#4d235e] font-black uppercase tracking-tighter"
            >
              Produtos
            </Text>
            <Text 
              style={{ fontSize: rf(12) }}
              className="text-gray-400 font-bold uppercase"
            >
              Selecione para Precificar
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleCriarNovo}
            className="bg-[#4d235e] p-4 rounded-2xl shadow-lg"
          >
            <MaterialCommunityIcons name="plus" size={rf(24)} color="white" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View className="items-center mt-20">
              <MaterialCommunityIcons name="package-variant" size={rf(80)} color="#DDD" />
              <Text 
                style={{ fontSize: rf(14) }}
                className="text-gray-400 font-bold mt-4 text-center"
              >
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
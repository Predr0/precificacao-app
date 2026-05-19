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

const formatarCNPJ = (txt) => {
  const limpo = txt.replace(/\D/g, '');
  return limpo
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18);
};

const InputLabel = ({ label, icon, placeholder, value, onChangeText, multiline = false, keyboardType = 'default' }) => (
  <View className="mb-5">
    <View className="flex-row items-center mb-2 ml-1">
      <MaterialCommunityIcons name={icon} size={rf(16)} color={roxo} />
      <Text style={{ color: roxo, fontSize: rf(10) }} className="font-black uppercase ml-2 tracking-widest">{label}</Text>
    </View>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#CCC"
      multiline={multiline}
      keyboardType={keyboardType}
      numberOfLines={multiline ? 3 : 1}
      style={{ 
        borderColor: '#F0F0F0', 
        backgroundColor: '#FFF',
        textAlignVertical: multiline ? 'top' : 'center',
        minHeight: multiline ? rf(80) : rf(55),
        fontSize: rf(14)
      }}
      className="border-2 p-4 rounded-3xl font-bold text-gray-700 shadow-sm"
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

export default function PlanoNegocioScreen({ navigation }) {
  const { config, setConfig } = useContext(AppContext);

  const [dados, setDados] = useState({
    nomeNegocio: config.nomeNegocio || '',
    cnpj: config.cnpj || '',
    segmento: config.segmento || '',
    descricao: config.descricao || '',
    propostaValor: config.propostaValor || '',
    objetivoCurtoPrazo: config.objetivoCurtoPrazo || '', 
    metaCurtoPrazo: config.metaCurtoPrazo || '',     
    redesSociais: config.redesSociais || [], 
  });

  const [novaRede, setNovaRede] = useState('');

  const adicionarRede = () => {
    if (novaRede.trim() === '') return;
    setDados({
      ...dados,
      redesSociais: [...dados.redesSociais, novaRede.trim()]
    });
    setNovaRede('');
  };

  const removerRede = (index) => {
    const atualizadas = dados.redesSociais.filter((_, i) => i !== index);
    setDados({ ...dados, redesSociais: atualizadas });
  };

  const salvar = () => {
    if (!dados.nomeNegocio) {
      Alert.alert("Atenção", "O nome do negócio é essencial para a identidade.");
      return;
    }
    setConfig({ ...config, ...dados });
    Alert.alert("Sucesso", "Identidade do negócio atualizada!", [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        
        <View className="mb-8">
          <Text style={{ color: roxo, fontSize: rf(30) }} className="font-black uppercase tracking-tighter">Identidade</Text>
        </View>

        <View className="bg-purple-50/50 p-6 rounded-[40px] mb-6 border border-purple-100">
          <Text style={{ color: lavanda, fontSize: rf(12) }} className="font-black mb-4 uppercase">1. Dados Oficiais</Text>
          
          <InputLabel 
            label="Nome do Empreendimento" 
            icon="store-outline"
            placeholder="Ex: Annik Doceria"
            value={dados.nomeNegocio}
            onChangeText={(t) => setDados({...dados, nomeNegocio: t})}
          />

          <InputLabel 
            label="CNPJ (Opcional)" 
            icon="card-account-details-outline"
            placeholder="00.000.000/0000-00"
            keyboardType="numeric"
            value={dados.cnpj}
            onChangeText={(t) => setDados({...dados, cnpj: formatarCNPJ(t)})}
          />

          {/* Seção de Redes Sociais Dinâmica */}
          <View className="mb-2 ml-1 flex-row items-center">
            <MaterialCommunityIcons name="at" size={rf(16)} color={roxo} />
            <Text style={{ color: roxo, fontSize: rf(10) }} className="font-black uppercase ml-2 tracking-widest">Redes Sociais / Contatos</Text>
          </View>
          
          <View className="flex-row items-center mb-4">
            <TextInput
              placeholder="Ex: @seu_negocio"
              placeholderTextColor="#CCC"
              className="border-2 p-4 rounded-3xl font-bold text-gray-700 shadow-sm flex-1 bg-white"
              style={{ borderColor: '#F0F0F0', minHeight: rf(55), fontSize: rf(14) }}
              value={novaRede}
              onChangeText={setNovaRede}
            />
            <TouchableOpacity 
              onPress={adicionarRede}
              style={{ backgroundColor: roxo }}
              className="ml-2 p-4 rounded-full shadow-md"
            >
              <MaterialCommunityIcons name="plus" size={rf(20)} color="white" />
            </TouchableOpacity>
          </View>

          {/* Listagem das redes adicionadas */}
          <View className="flex-row flex-wrap mb-4">
            {dados.redesSociais.map((rede, index) => (
              <View 
                key={index} 
                style={{ backgroundColor: roxo }}
                className="flex-row items-center px-4 py-2 rounded-full mr-2 mb-2 shadow-sm"
              >
                <Text style={{ fontSize: rf(12) }} className="text-white font-bold mr-2">{rede}</Text>
                <TouchableOpacity onPress={() => removerRede(index)}>
                  <MaterialCommunityIcons name="close-circle" size={rf(16)} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-purple-50/50 p-6 rounded-[40px] mb-6 border border-purple-100">
          <Text style={{ color: lavanda, fontSize: rf(12) }} className="font-black mb-4 uppercase">2. Posicionamento</Text>
          
          <InputLabel 
            label="Nicho / Segmento" 
            icon="tag-outline"
            placeholder="Ex: Confeitaria Artesanal"
            value={dados.segmento}
            onChangeText={(t) => setDados({...dados, segmento: t})}
          />

          <InputLabel 
            label="O que seu negócio faz?" 
            icon="text-box-outline"
            placeholder="Descreva brevemente seus produtos ou serviços..."
            multiline
            value={dados.descricao}
            onChangeText={(t) => setDados({...dados, descricao: t})}
          />

          <InputLabel 
            label="Proposta de Valor" 
            icon="star-outline"
            placeholder="Qual o seu diferencial no mercado?"
            multiline
            value={dados.propostaValor}
            onChangeText={(t) => setDados({...dados, propostaValor: t})}
          />
        </View>

        <View className="bg-purple-50/50 p-6 rounded-[40px] mb-10 border border-purple-100">
          <Text style={{ color: lavanda, fontSize: rf(12) }} className="font-black mb-4 uppercase">3. Visão de Futuro</Text>
          
          <InputLabel 
            label="Objetivo a Curto Prazo" 
            icon="target"
            placeholder="Aumentar as vendas a cada mês"
            value={dados.objetivoCurtoPrazo}
            onChangeText={(t) => setDados({...dados, objetivoCurtoPrazo: t})}
          />
          <InputLabel
            label="Metas a Curto Prazo"
            icon="chart-line"
            placeholder="Ex: Crescer 5% no faturamento em janeiro"
            multiline
            value={dados.metaCurtoPrazo}
            onChangeText={(t) => setDados({...dados, metaCurtoPrazo: t})}
          />
        </View>

        <TouchableOpacity 
          onPress={salvar}
          style={{ backgroundColor: roxo }}
          className="p-6 rounded-[35px] mb-20 shadow-xl items-center flex-row justify-center"
        >
          <MaterialCommunityIcons name="check-decagram-outline" size={rf(24)} color="white" />
          <Text style={{ fontSize: rf(18) }} className="text-white font-black ml-3 uppercase">Confirmar Identidade</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
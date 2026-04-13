import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ConfiguracaoNegocio({ navigation }) {
  const { 
    config, 
    setConfig, 
    listaCustosFixos, 
    setListaCustosFixos, 
    listaColaboradores, 
    setListaColaboradores,
    removerItem 
  } = useContext(AppContext);
  
  const [nomeCusto, setNomeCusto] = useState('');
  const [valorCusto, setValorCusto] = useState('');
  const [nomeColab, setNomeColab] = useState('');
  const [salarioColab, setSalarioColab] = useState('');
  const [diasColab, setDiasColab] = useState('');
  const [horasColab, setHorasColab] = useState('');

  const roxo = '#4d235e';
  const lavanda = '#9e86bd';

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

  const InputLabel = ({ label, icon, placeholder, value, onChangeText, keyboardType = "decimal-pad", color = '#4d235e' }) => (
    <View className="mb-4">
      <View className="flex-row items-center mb-2 ml-1">
        <MaterialCommunityIcons name={icon} size={14} color={roxo} />
        <Text style={{ color: roxo }} className="font-black text-[9px] uppercase ml-2 tracking-widest">{label}</Text>
      </View>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#CCC"
        keyboardType={keyboardType}
        style={{ borderColor: '#F0F0F0', backgroundColor: '#FFF', color: color }}
        className="border-2 p-4 rounded-3xl font-bold shadow-sm"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        
        <View className="mb-8">
          <Text style={{ color: roxo }} className="text-3xl font-black uppercase tracking-tighter">Capacidade</Text>
          <Text className="text-gray-400 font-bold text-xs uppercase">Parâmetros de Operação</Text>
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
          <Text style={{ color: lavanda }} className="font-black text-[10px] mb-4 uppercase tracking-widest ml-1">Colaboradores</Text>
          <TextInput placeholder="Nome" className="bg-white p-4 rounded-2xl mb-2 border border-purple-100 font-bold" value={nomeColab} onChangeText={setNomeColab} />
          <TextInput placeholder="Salário (R$)" keyboardType="decimal-pad" className="bg-white p-4 rounded-2xl mb-2 border border-purple-100 font-bold" value={salarioColab} onChangeText={(v) => setSalarioColab(v.replace(',', '.').replace(/[^0-9.]/g, ''))} />
          
          <View className="flex-row justify-between mb-4">
            <TextInput placeholder="Dias trab/ mês" keyboardType="numeric" className="bg-white p-4 rounded-2xl w-[48%] border border-purple-100 font-bold text-center" value={diasColab} onChangeText={setDiasColab} />
            <TextInput placeholder="Horas trab/ dia" keyboardType="numeric" className="bg-white p-4 rounded-2xl w-[48%] border border-purple-100 font-bold text-center" value={horasColab} onChangeText={setHorasColab} />
          </View>

          <TouchableOpacity style={{ backgroundColor: roxo }} className="p-4 rounded-2xl shadow-sm" onPress={() => validarEAdd(nomeColab, salarioColab, listaColaboradores, setListaColaboradores, () => {setNomeColab(''); setSalarioColab(''); setDiasColab(''); setHorasColab('')})}>
            <Text className="text-white text-center font-black text-xs uppercase">Cadastrar Colaborador</Text>
          </TouchableOpacity>
          
          {listaColaboradores.map(c => (
            <View key={c.id} className="mt-3 p-4 bg-white rounded-2xl flex-row justify-between items-center border border-purple-100 shadow-sm">
              <View>
                <Text style={{ color: roxo }} className="font-black text-xs uppercase">{c.nome}</Text>
                <Text className="font-bold text-[10px] text-gray-400">{c.dias} dias/mês • {c.horas}h/dia</Text>
                <Text className="font-bold text-[10px] text-gray-400">R$ {parseFloat(c.salario).toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={() => removerItem(c.id, listaColaboradores, setListaColaboradores)}>
                <MaterialCommunityIcons name="delete-outline" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View className="bg-purple-50/50 p-6 rounded-[40px] mb-8 border border-purple-100">
          <Text style={{ color: lavanda }} className="font-black text-[10px] mb-4 uppercase tracking-widest ml-1">Custos Fixos da Operação</Text>
          <TextInput placeholder="Ex: Aluguel" className="bg-white p-4 rounded-2xl mb-2 border border-purple-100 font-bold" value={nomeCusto} onChangeText={setNomeCusto} />
          <TextInput placeholder="Valor Mensal(R$)" keyboardType="decimal-pad" className="bg-white p-4 rounded-2xl mb-4 border border-purple-100 font-bold" value={valorCusto} onChangeText={(v) => setValorCusto(v.replace(',', '.').replace(/[^0-9.]/g, ''))} />
          <TouchableOpacity style={{ backgroundColor: roxo }} className="p-4 rounded-2xl shadow-sm" onPress={() => validarEAdd(nomeCusto, valorCusto, listaCustosFixos, setListaCustosFixos, () => {setNomeCusto(''); setValorCusto('')})}>
            <Text className="text-white text-center font-black text-xs uppercase">Adicionar Custo</Text>
          </TouchableOpacity>
          
          {listaCustosFixos.map(i => (
            <View key={i.id} className="mt-3 p-4 bg-white rounded-2xl flex-row justify-between items-center border border-purple-100 shadow-sm">
              <View>
                <Text style={{ color: roxo }} className="font-black text-xs uppercase">{i.nome}</Text>
                <Text className="font-bold text-[10px] text-gray-400">R$ {parseFloat(i.valor).toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={() => removerItem(i.id, listaCustosFixos, setListaCustosFixos)}>
                <MaterialCommunityIcons name="delete-outline" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={{ backgroundColor: roxo }}
          className="p-6 rounded-[35px] mb-20 shadow-xl flex-row justify-center items-center" 
          onPress={() => navigation.navigate('DespesasFixas')}
        >
          <Text className="text-white text-center font-black text-xs uppercase tracking-widest">Avançar para Despesas</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="white" className="ml-2" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
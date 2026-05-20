import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- ESTADO GLOBAL: LISTA DE PRODUTOS ---
  const [produtos, setProdutos] = useState([]);
  const [idProdutoAtivo, setIdProdutoAtivo] = useState(null);

  // --- ESTADOS DO EDITOR (BUFFER DO PRODUTO ATUAL + IDENTIDADE DO NEGÓCIO) ---
  const [nomeProduto, setNomeProduto] = useState('');
  
  const [config, setConfig] = useState({ 
    // Campos do Produto
    salario: '', 
    dias: '', 
    horas: '', 
    tempoProducao: '', 
    lucroDesejado: '30',
    // Campos do Plano de Negócio (Identidade)
    nomeNegocio: '',
    cnpj: '',
    segmento: '',
    descricao: '',
    propostaValor: '',
    objetivoCurtoPrazo: '',
    metaCurtoPrazo: '',
    redesSociais: []
  });

  const [insumos, setInsumos] = useState([]);
  const [listaCustosFixos, setListaCustosFixos] = useState([]);
  const [listaColaboradores, setListaColaboradores] = useState([]);
  const [listaDespesasFixas, setListaDespesasFixas] = useState([]);
  const [listaDespesasVariaveis, setListaDespesasVariaveis] = useState([]);

  const [unidades, setUnidades] = useState(['unid', 'kg', 'g', 'm', 'cm']);

  // --- PERSISTÊNCIA DE DADOS (ASYNC STORAGE) ---

  // 1. Carrega os PRODUTOS e a CONFIGURAÇÃO local quando o app inicia (Roda uma única vez)
  useEffect(() => {
    const carregarDadosLocais = async () => {
      try {
        const produtosSalvos = await AsyncStorage.getItem('@conectaValor_produtos');
        const configSalva = await AsyncStorage.getItem('@conectaValor_config');
        
        if (produtosSalvos) {
          setProdutos(JSON.parse(produtosSalvos));
        }
        if (configSalva) {
          setConfig(JSON.parse(configSalva));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dispositivo:", error);
      }
    };
    carregarDadosLocais();
  }, []);

  // 2. CORRIGIDO: Salva os PRODUTOS com Debounce (Espera 1 segundo de inatividade para gravar no disco)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      try {
        await AsyncStorage.setItem('@conectaValor_produtos', JSON.stringify(produtos));
      } catch (error) {
        console.error("Erro ao salvar produtos localmente:", error);
      }
    }, 1000); // 1000 milissegundos = 1 segundo

    return () => clearTimeout(delayDebounce); // Cancela o timer se o usuário voltar a digitar rápido
  }, [produtos]);

  // 3. CORRIGIDO: Salva a CONFIGURAÇÃO (Plano de Negócio) com Debounce
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      try {
        await AsyncStorage.setItem('@conectaValor_config', JSON.stringify(config));
      } catch (error) {
        console.error("Erro ao salvar configurações locais:", error);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [config]);

  // 4. SINCRONIZAÇÃO AUTOMÁTICA EM TEMPO REAL (BUFFER -> LISTA GLOBAL)
  useEffect(() => {
    if (!idProdutoAtivo) return;

    setProdutos(prevProdutos => 
      prevProdutos.map(p => {
        if (p.id === idProdutoAtivo) {
          return {
            ...p,
            nome: nomeProduto,
            config: {
              salario: config.salario,
              dias: config.dias,
              horas: config.horas,
              tempoProducao: config.tempoProducao,
              lucroDesejado: config.lucroDesejado,
            },
            insumos,
            listaCustosFixos,
            listaColaboradores,
            listaDespesasFixas,
            listaDespesasVariaveis,
          };
        }
        return p;
      })
    );
  }, [
    nomeProduto, 
    config.salario, config.dias, config.horas, config.tempoProducao, config.lucroDesejado, 
    insumos, 
    listaCustosFixos, 
    listaColaboradores, 
    listaDespesasFixas, 
    listaDespesasVariaveis,
    idProdutoAtivo
  ]);

  // --- FUNÇÕES DE GESTÃO DE CONTEXTO ---

  const novoProduto = () => {
    const novoId = Date.now().toString();
    const baseProduto = {
      id: novoId,
      nome: '',
      config: { salario: '', dias: '', horas: '', tempoProducao: '', lucroDesejado: '30' },
      insumos: [],
      listaCustosFixos: [],
      listaColaboradores: [],
      listaDespesasFixas: [],
      listaDespesasVariaveis: [],
    };

    setProdutos(prev => [...prev, baseProduto]);
    carregarProduto(baseProduto);
    return novoId;
  };

  const carregarProduto = (produto) => {
    setIdProdutoAtivo(produto.id);
    setNomeProduto(produto.nome || '');
    
    setConfig(prev => ({
      ...prev,
      ...produto.config
    }));

    setInsumos(produto.insumos || []);
    setListaCustosFixos(produto.listaCustosFixos || []);
    setListaColaboradores(produto.listaColaboradores || []);
    setListaDespesasFixas(produto.listaDespesasFixas || []);
    setListaDespesasVariaveis(produto.listaDespesasVariaveis || []);
  };

  const salvarAlteracoes = () => {
    if (!idProdutoAtivo) return;

    setProdutos(prevProdutos => 
      prevProdutos.map(p => {
        if (p.id === idProdutoAtivo) {
          return {
            ...p,
            nome: nomeProduto,
            config: {
              salario: config.salario,
              dias: config.dias,
              horas: config.horas,
              tempoProducao: config.tempoProducao,
              lucroDesejado: config.lucroDesejado,
            },
            insumos,
            listaCustosFixos,
            listaColaboradores,
            listaDespesasFixas,
            listaDespesasVariaveis,
          };
        }
        return p;
      })
    );
  };

  const removerItem = (id, lista, setLista) => {
    setLista(lista.filter(item => item.id !== id));
  };

  const removerProduto = (idProduto) => {
    setProdutos(prev => prev.filter(p => p.id !== idProduto));
  };
  
  const totalCF_Mensal = (parseFloat(config.salario) || 0) + 
    listaColaboradores.reduce((acc, c) => acc + (parseFloat(c.salario) || 0), 0) +
    listaCustosFixos.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);

  const totalDF_Mensal = listaDespesasFixas.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);
  const totalDV_Mensal = listaDespesasVariaveis.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);

  const popularDadosTeste = () => {
    const fakeId = 'prod_teste_' + Date.now();
    const novoProdutoTeste = {
      id: fakeId,
      nome: 'Produto de Teste (Ex: Camiseta)',
      config: { salario: '4500', dias: '22', horas: '8', tempoProducao: '40', lucroDesejado: '30' },
      listaColaboradores: [{ id: 'c1', nome: 'Maria Auxiliar', salario: '1600', dias: '22', horas: '8' }],
      insumos: [
        { id: 'i1', nome: 'Tecido Premium', unidade: 'm', custoFração: 22.50, detalhes: '1m de 10m' },
        { id: 'i2', nome: 'Linha de Seda', unidade: 'unid', custoFração: 3.80, detalhes: '1un de 12un' }
      ],
      listaCustosFixos: [{ id: 'cf1', nome: 'Aluguel Ateliê', valor: '950' }],
      listaDespesasFixas: [{ id: 'df1', nome: 'Taxa MEI', valor: '72' }],
      listaDespesasVariaveis: [{ id: 'dv1', nome: 'Embalagem de Envio', valor: '6.50' }]
    };

    setProdutos(prev => [...prev, novoProdutoTeste]);
    carregarProduto(novoProdutoTeste);
  };

  return (
    <AppContext.Provider value={{ 
      produtos, setProdutos,
      idProdutoAtivo, setIdProdutoAtivo,
      nomeProduto, setNomeProduto,
      config, setConfig, 
      insumos, setInsumos, 
      listaCustosFixos, setListaCustosFixos,
      listaColaboradores, setListaColaboradores,
      listaDespesasFixas, setListaDespesasFixas,
      listaDespesasVariaveis, setListaDespesasVariaveis,
      unidades, setUnidades,
      totalCF_Mensal, totalDF_Mensal, totalDV_Mensal,
      removerItem, 
      removerProduto,
      popularDadosTeste, 
      carregarProduto, 
      salvarAlteracoes,
      novoProduto
    }}>
      {children}
    </AppContext.Provider>
  );
};
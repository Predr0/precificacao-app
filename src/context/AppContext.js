import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- ESTADO GLOBAL: LISTA DE PRODUTOS ---
  const [produtos, setProdutos] = useState([]);
  const [idProdutoAtivo, setIdProdutoAtivo] = useState(null);

  // --- ESTADOS DO EDITOR (BUFFER DO PRODUTO ATUAL + IDENTIDADE DO NEGÓCIO) ---
  const [nomeProduto, setNomeProduto] = useState('');
  
  // Inicializado com os campos do Produto E do Plano de Negócio unificados
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

  // 1. Carrega os PRODUTOS e a CONFIGURAÇÃO local quando o app inicia
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

  // 2. Grava automaticamente os PRODUTOS sempre que a lista sofrer alterações
  useEffect(() => {
    const salvarProdutos = async () => {
      try {
        await AsyncStorage.setItem('@conectaValor_produtos', JSON.stringify(produtos));
      } catch (error) {
        console.error("Erro ao salvar produtos localmente:", error);
      }
    };
    salvarProdutos();
  }, [produtos]);

  // 3. Grava automaticamente a IDENTIDADE (config) sempre que o plano de negócio mudar
  useEffect(() => {
    const salvarConfig = async () => {
      try {
        await AsyncStorage.setItem('@conectaValor_config', JSON.stringify(config));
      } catch (error) {
        console.error("Erro ao salvar configurações locais:", error);
      }
    };
    salvarConfig();
  }, [config]);

  // --- FUNÇÕES DE GESTÃO DE CONTEXTO ---

  // Prepara o editor para um novo produto do zero
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

  // Mapeia os dados de um objeto produto fazendo um MERGE inteligente para proteger os dados da empresa
  const carregarProduto = (produto) => {
    setIdProdutoAtivo(produto.id);
    setNomeProduto(produto.nome || '');
    
    // Protege o Plano de Negócio: mantém os dados da empresa vivos e atualiza só os do produto
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
            // Salva na ficha do produto apenas as chaves pertinentes a ele
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
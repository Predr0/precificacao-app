import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- ESTADO GLOBAL: LISTA DE PRODUTOS ---
  const [produtos, setProdutos] = useState([]);
  const [idProdutoAtivo, setIdProdutoAtivo] = useState(null);

  // --- ESTADOS DO EDITOR (BUFFER DO PRODUTO ATUAL) ---
  const [nomeProduto, setNomeProduto] = useState('');
  const [config, setConfig] = useState({ salario: '', dias: '', horas: '', tempoProducao: '', lucroDesejado: '30' });
  const [insumos, setInsumos] = useState([]);
  const [listaCustosFixos, setListaCustosFixos] = useState([]);
  const [listaColaboradores, setListaColaboradores] = useState([]);
  const [listaDespesasFixas, setListaDespesasFixas] = useState([]);
  const [listaDespesasVariaveis, setListaDespesasVariaveis] = useState([]);

  const [unidades, setUnidades] = useState(['unid', 'kg', 'g', 'm', 'cm']);

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

  // Mapeia os dados de um objeto produto para os estados de edição
  const carregarProduto = (produto) => {
    setIdProdutoAtivo(produto.id);
    setNomeProduto(produto.nome || '');
    setConfig(produto.config);
    setInsumos(produto.insumos);
    setListaCustosFixos(produto.listaCustosFixos);
    setListaColaboradores(produto.listaColaboradores);
    setListaDespesasFixas(produto.listaDespesasFixas);
    setListaDespesasVariaveis(produto.listaDespesasVariaveis);
  };

  const salvarAlteracoes = () => {
    if (!idProdutoAtivo) return;

    setProdutos(prevProdutos => 
      prevProdutos.map(p => {
        if (p.id === idProdutoAtivo) {
          return {
            ...p,
            nome: nomeProduto,
            config,
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
      popularDadosTeste, 
      carregarProduto, 
      salvarAlteracoes,
      novoProduto
    }}>
      {children}
    </AppContext.Provider>
  );
};
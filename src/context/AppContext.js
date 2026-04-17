import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const removerItem = (id, lista, setLista) => {
    setLista(lista.filter(item => item.id !== id));
  };

  const [config, setConfig] = useState({ salario: '', dias: '', horas: '', tempoProducao: '', lucroDesejado: '30' });
  const [insumos, setInsumos] = useState([]);
  const [listaCustosFixos, setListaCustosFixos] = useState([]);
  const [listaColaboradores, setListaColaboradores] = useState([]);
  const [unidades, setUnidades] = useState(['unid', 'kg', 'g', 'm', 'cm']);
  const [listaDespesasFixas, setListaDespesasFixas] = useState([]);
  const [listaDespesasVariaveis, setListaDespesasVariaveis] = useState([]);

  //add dados hipoteticos pra teste
  const popularDadosTeste = () => {
    setConfig({ salario: '4500', dias: '22', horas: '8', tempoProducao: '40', lucroDesejado: '30' });
    
    setListaColaboradores([
      { id: 'c1', nome: 'Maria Auxiliar', salario: '1600', dias: '22', horas: '8' }
    ]);

    setInsumos([
      { id: 'i1', nome: 'Tecido Premium', unidade: 'm', custoFração: 22.50, detalhes: '1m de 10m' },
      { id: 'i2', nome: 'Linha de Seda', unidade: 'unid', custoFração: 3.80, detalhes: '1un de 12un' },
      { id: 'i3', nome: 'Botões Decorativos', unidade: 'unid', custoFração: 1.20, detalhes: '1un de 50un' }
    ]);

    setListaCustosFixos([
      { id: 'cf1', nome: 'Aluguel Ateliê', valor: '950' }
    ]);

    setListaDespesasFixas([
      { id: 'df1', nome: 'Taxa MEI', valor: '72' },
      { id: 'df2', nome: 'Software de Gestão', valor: '45' }
    ]);

    setListaDespesasVariaveis([
      { id: 'dv1', nome: 'Embalagem de Envio', valor: '6.50' }
    ]);
  };

  const totalCF_Mensal = (parseFloat(config.salario) || 0) + 
    listaColaboradores.reduce((acc, c) => acc + (parseFloat(c.salario) || 0), 0) +
    listaCustosFixos.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);

  const totalDF_Mensal = listaDespesasFixas.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);
  const totalDV_Mensal = listaDespesasVariaveis.reduce((acc, i) => acc + (parseFloat(i.valor) || 0), 0);

  return (
    <AppContext.Provider value={{ 
      config, setConfig, insumos, setInsumos, 
      listaCustosFixos, setListaCustosFixos,
      listaColaboradores, setListaColaboradores,
      listaDespesasFixas, setListaDespesasFixas,
      listaDespesasVariaveis, setListaDespesasVariaveis,
      unidades, setUnidades,
      totalCF_Mensal, totalDF_Mensal, totalDV_Mensal,
      removerItem,
      popularDadosTeste 
    }}>
      {children}
    </AppContext.Provider>
  );
};
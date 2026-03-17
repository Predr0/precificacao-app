import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState({ salario: '', dias: '', horas: '', lucroDesejado: '30' });
  const [insumos, setInsumos] = useState([]);
  const [listaCustosFixos, setListaCustosFixos] = useState([]);
  const [listaColaboradores, setListaColaboradores] = useState([]);
  const [unidades, setUnidades] = useState(['unid', 'kg', 'g', 'm', 'cm']);

  // NOVAS LISTAS (RF07 e RF08)
  const [listaDespesasFixas, setListaDespesasFixas] = useState([]);
  const [listaDespesasVariaveis, setListaDespesasVariaveis] = useState([]);

  // TOTAIS MENSAIS (Para as fórmulas de rateio)
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
      totalCF_Mensal, totalDF_Mensal, totalDV_Mensal
    }}>
      {children}
    </AppContext.Provider>
  );
};
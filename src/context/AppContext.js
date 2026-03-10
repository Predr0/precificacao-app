import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Dados de Mão de Obra e Tempo
  const [config, setConfig] = useState({
    salario: '', 
    dias: '', 
    horas: ''
  });

  // Lista dinâmica de Custos Fixos
  const [listaCustosFixos, setListaCustosFixos] = useState([]);

  // Insumos do produto
  const [insumos, setInsumos] = useState([]);

  // Soma automática dos custos para o motor de cálculo
  const totalCustosFixos = listaCustosFixos.reduce(
    (acc, item) => acc + (parseFloat(item.valor) || 0), 0
  );

  return (
    <AppContext.Provider value={{ 
      config, setConfig, 
      insumos, setInsumos, 
      listaCustosFixos, setListaCustosFixos, 
      totalCustosFixos 
    }}>
      {children}
    </AppContext.Provider>
  );
};
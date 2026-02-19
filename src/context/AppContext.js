import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState({
    salario: '0', dias: '0', horas: '0', custoFixo: '0', despesaFixa: '0', despesaVariavel: '0'
  });
  const [insumos, setInsumos] = useState([]); // Lista para múltiplos insumos

  return (
    <AppContext.Provider value={{ config, setConfig, insumos, setInsumos }}>
      {children}
    </AppContext.Provider>
  );
};
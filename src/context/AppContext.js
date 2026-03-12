import React, { createContext, useState } from 'react'; // <--- IMPORTAÇÃO ESSENCIAL

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState({ salario: '0', dias: '0', horas: '0', lucroDesejado: '30' });
  const [insumos, setInsumos] = useState([]); // <--- INICIALIZADO COMO ARRAY
  const [listaCustosFixos, setListaCustosFixos] = useState([]);
  const [listaColaboradores, setListaColaboradores] = useState([]);
  const [unidades, setUnidades] = useState(['unid', 'kg', 'g', 'm', 'cm']);

  // Cálculo do Custo Fixo Mensal Total (Soma tudo)
  const totalSalarios = (parseFloat(config.salario) || 0) + 
    listaColaboradores.reduce((acc, col) => acc + (parseFloat(col.salario) || 0), 0);

  const totalOperacional = listaCustosFixos.reduce(
    (acc, item) => acc + (parseFloat(item.valor) || 0), 0
  );

  const totalCF_Mensal = totalSalarios + totalOperacional;

  return (
    <AppContext.Provider value={{ 
      config, setConfig, insumos, setInsumos, 
      listaCustosFixos, setListaCustosFixos,
      listaColaboradores, setListaColaboradores,
      unidades, setUnidades,
      totalCF_Mensal // <--- VARIÁVEL QUE O CÁLCULO VAI USAR
    }}>
      {children}
    </AppContext.Provider>
  );
};
import React, { useEffect } from 'react';
import { initDatabase } from './src/database/database';

export default function App() {
  useEffect(() => {
    // Inicializa o banco e cria a tabela de insumos (RF03)
    initDatabase();
  }, []);

  // O resto do seu código de interface...
}
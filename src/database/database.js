import * as SQLite from 'expo-sqlite';

// 1. precificaçao.db aberto ou criado
const db = SQLite.openDatabaseSync('precificacao.db');

export const initDatabase = () => {
  // 2. Cria a tabela de Insumos, RF03 E 04
  db.execSync(`
    CREATE TABLE IF NOT EXISTS insumos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco_compra REAL NOT NULL,
      unidade_medida TEXT NOT NULL,
      quantidade_total REAL NOT NULL
    );
  `);
  
  console.log("Banco de dados inicializado com sucesso!");
};

// 3. Função para inserir um novo insumo (Mão na massa!)
export const addInsumo = (nome, preco, unidade, quantidade) => {
  return db.runSync(
    'INSERT INTO insumos (nome, preco_compra, unidade_medida, quantidade_total) VALUES (?, ?, ?, ?)',
    [nome, preco, unidade, quantidade]
  );
};

export default db;
import * as SQLite from 'expo-sqlite';

//Abrir/criar BD
const db = SQLite.openDatabaseSync('precificacao.db');

export const initDatabase = () => {
  try {
    //RF03 e RF04 => criar tabela Insumos
    db.execSync(`
      CREATE TABLE IF NOT EXISTS insumos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        preco_compra REAL NOT NULL,
        unidade_medida TEXT NOT NULL,
        quantidade_total REAL NOT NULL
      );
    `);

    //RF05 => criar tabela Configurações
    db.execSync(`
      CREATE TABLE IF NOT EXISTS configuracoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        salario_pretendido REAL,
        horas_mensais REAL,
        custo_fixo_total REAL
      );
    `);

    console.log("Banco de dados inicializado com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
  }
};

export const addInsumo = (nome, preco, unidade, quantidade) => {
  return db.runSync(
    'INSERT INTO insumos (nome, preco_compra, unidade_medida, quantidade_total) VALUES (?, ?, ?, ?)',
    [nome, preco, unidade, quantidade]
  );
};

export default db;
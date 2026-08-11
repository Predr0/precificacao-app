# 📊 Precificação App — Mobile

[![React Native](https://img.shields.io/badge/React_Native-0.7x-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-v5x-000000?logo=expo&logoColor=white&style=for-the-badge)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Uma aplicação mobile moderna, intuitiva e de alta performance desenvolvida especificamente para apoiar **microempreendedores autônomos** no gerenciamento financeiro e na automação do cálculo de preços de seus produtos e serviços. 

O app elimina planilhas complexas, traduzindo conceitos de margem de lucro, custos fixos/variáveis e ponto de equilíbrio (*break-even*) em fluxos de telas fluidos e focados na experiência do usuário (UX).

---

##  Funcionalidades Principais

- **📦 Gestão de Insumos/Matéria-Prima:** Cadastro dinâmico de insumos com conversão automática de medidas (ex: kg para gramas, litros para ml) para cálculo do custo unitário real.
- **🛠️ Precificação de Produtos/Serviços:** Composição do preço final baseada em custos fixos rateados, custos variáveis, tempo de mão de obra investido e margem de lucro desejada.
- **📊 Dashboard de Resultados:** Visualização gráfica e simplificada do ponto de equilíbrio (quanto o empreendedor precisa vender para cobrir os custos) e projeção de lucro.
- **💾 Persistência de Dados Local:** Arquitetura resiliente offline com armazenamento local seguro, garantindo uso contínuo mesmo sem conexão à rede.

---

##  Stack Técnica e Arquitetura

O projeto foi estruturado seguindo rigorosamente as melhores práticas do ecossistema JavaScript/TypeScript moderno, focando em separação de conceitos (*Separation of Concerns*) e código limpo (*Clean Code*).

*   **Core:** [React Native](https://reactnative.dev/) & [TypeScript](https://www.typescriptlang.org/) para uma base de código fortemente tipada, escalável e segura.
*   **Ambiente e Tooling:** [Expo](https://expo.dev/) (Managed Workflow), otimizando a esteira de desenvolvimento e build nativo.
*   **Gerenciamento de Estado:** Context API ou Hooks customizados estruturados para separar regras de cálculo e negócios da camada de apresentação (UI).
*   **Estilização:** Styled Components / StyleSheet nativo aplicando conceitos de *Design System* modular e adaptável para múltiplos tamanhos de tela.

```text
📂 src/
├── 📁 assets/          # Imagens, fontes e vetores estáticos
├── 📁 components/      # Componentes globais e reutilizáveis (Buttons, Cards, Inputs)
├── 📁 context/         # Estados globais e Providers (Ex: Contexto de Negócio/Precificação)
├── 📁 hooks/           # Custom hooks isolando lógica e cálculos matemáticos
├── 📁 screens/         # Telas da aplicação (Home, Cadastro, Precificação, Dashboard)
├── 📁 utils/           # Funções utilitárias (Formatadores de moeda, conversores de medidas)
└── 📁 types/           # Tipagens estáticas do TypeScript

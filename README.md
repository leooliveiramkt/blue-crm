# Blue CRM

## 📋 Sobre o Projeto

O Blue CRM é um sistema de gestão de relacionamento com clientes desenvolvido a partir da base do Lovable, focado em oferecer uma experiência moderna e eficiente para gerenciamento de leads, clientes e vendas.

## 🚀 Histórico de Desenvolvimento

### Correção de Estrutura (2024-03-20)
- Resolvido problema de pastas duplicadas (`blue-crm/blue-crm` e `blue-crm-final`)
- Estrutura limpa e organizada estabelecida
- Repositório GitHub configurado corretamente
- Scripts de build e desenvolvimento atualizados

### Estrutura Atual
```
blue-crm/
├── src/                    # Código fonte
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas da aplicação
│   ├── hooks/             # Custom hooks
│   ├── services/          # Serviços e integrações
│   └── utils/             # Utilitários
├── public/                # Arquivos estáticos
├── supabase/             # Configurações do Supabase
├── .github/              # Configurações do GitHub
└── docs/                 # Documentação
```

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Radix UI
  - React Router DOM
  - React Hook Form
  - Zod (validação)

- **Backend/Integrações:**
  - Supabase
  - Axios

- **Ferramentas de Desenvolvimento:**
  - ESLint
  - Prettier
  - Vitest
  - Husky (git hooks)

## 🚀 Como Executar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/leooliveiramkt/blue-crm.git
   cd blue-crm
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o projeto:**
   ```bash
   # Desenvolvimento
   npm run dev

   # Build de desenvolvimento
   npm run build:dev

   # Build de produção
   npm run build
   ```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run build:dev` - Cria build de desenvolvimento
- `npm run lint` - Executa o linter
- `npm run test` - Executa os testes
- `npm run format` - Formata o código

## 🔧 Configuração do Ambiente

### Requisitos
- Node.js (versão LTS recomendada)
- npm ou yarn
- Git

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

## 📚 Documentação Adicional

- [Estrutura do Projeto](./docs/PROJECT.md)
- [Configuração do Banco de Dados](./docs/DATABASE.md)
- [Guia de Contribuição](./docs/CONTRIBUTING.md)
- [Política de Segurança](./docs/SECURITY.md)

## 🔄 Processo de Correção de Estrutura

### Problema Identificado
- Existência de pastas duplicadas (`blue-crm/blue-crm` e `blue-crm-final`)
- Estrutura confusa no repositório
- Problemas de build e desenvolvimento

### Solução Implementada
1. Remoção de pastas duplicadas
2. Reorganização da estrutura do projeto
3. Configuração correta do Git
4. Atualização dos scripts de build
5. Push limpo para o GitHub

### Resultado
- Estrutura limpa e organizada
- Repositório GitHub atualizado
- Projeto pronto para desenvolvimento

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Léo Oliveira** - *Desenvolvimento* - [leooliveiramkt](https://github.com/leooliveiramkt)
- **Lovable** - *Base do Projeto* - [lovable-dev](https://github.com/lovable-dev)

## 🙏 Agradecimentos

- Equipe Lovable pelo projeto base
- Comunidade open source
- Todos os contribuidores

---

**Nota:** Este README será atualizado conforme o projeto evolui. Última atualização: 20/03/2024

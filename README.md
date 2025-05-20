# Blue CRM

Sistema de CRM com integração WBuy.

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/blue-crm.git
cd blue-crm
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

4. Execute as migrações do banco de dados:
```bash
npm run migrate
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Integração WBuy

O sistema inclui integração automática com a API WBuy. Para configurar:

1. Acesse o painel administrativo
2. Vá para "Configurações" > "Integrações"
3. Selecione "WBuy"
4. Preencha as credenciais da API:
   - URL da API
   - Chave da API
   - ID da Loja

### Sincronização Automática

A sincronização é executada automaticamente em background usando PM2:

1. Instale o PM2 globalmente:
```bash
npm install -g pm2
```

2. Inicie o processo de sincronização:
```bash
pm2 start ecosystem.config.js
```

3. Para monitorar os logs:
```bash
pm2 logs wbuy-sync
```

4. Para parar a sincronização:
```bash
pm2 stop wbuy-sync
```

### Dados Sincronizados

O sistema sincroniza automaticamente:

- Produtos
- Pedidos
- Clientes
- Estatísticas

Os dados são armazenados no Supabase e atualizados a cada 5 minutos.

## Desenvolvimento

### Estrutura de Arquivos

```
blue-crm/
├── src/
│   ├── services/
│   │   └── wbuy/
│   │       ├── wbuyService.ts
│   │       ├── wbuySyncService.ts
│   │       ├── wbuySyncScheduler.ts
│   │       └── types.ts
│   ├── scripts/
│   │   └── wbuySync.ts
│   └── lib/
│       └── supabase.ts
├── supabase/
│   └── migrations/
│       └── 20240320_create_wbuy_tables.sql
└── ecosystem.config.js
```

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila o projeto
- `npm run migrate`: Executa as migrações do banco de dados
- `npm run lint`: Executa o linter
- `npm run test`: Executa os testes

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📚 Documentação da API WBuy

A integração deste projeto utiliza a API oficial da WBuy. Consulte sempre a documentação oficial para detalhes de endpoints, autenticação e exemplos:

- [Documentação WBuy (Postman)](https://documenter.getpostman.com/view/4141833/RWTsquyN)

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

## 🆕 Atualizações Recentes (JUN/2024)

### Integração Completa com Supabase
- Centralização do client Supabase para backend (`src/config/supabase.ts`) e frontend (`src/lib/supabase.ts`)
- Uso seguro de variáveis de ambiente (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` no backend, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` no frontend)
- Checklist de segurança: Service Role Key **NUNCA** exposta no frontend

### Scripts e Endpoints para Integração WBuy
- Criação do endpoint `/wbuy/credentials` para cadastro/atualização seguro das credenciais da API WBuy por ADM da empresa
- Script de seed para inserir credenciais diretamente na tabela `wbuy_integrations` do Supabase
- Procedimento para cadastro seguro: cada ADM insere os dados da sua empresa via painel, com acesso restrito

### Sincronização e Modularidade
- Sincronização de produtos, pedidos, clientes e estatísticas feita 100% via Supabase, sem dependência de Redis
- Fila de sincronização em memória, robusta e isolada por tenant
- Modularização total: cada integração e serviço roda de forma independente

### Novos Endpoints RESTful
- Endpoints para disparar sincronização manual, consultar status e cadastrar credenciais WBuy
- Estrutura pronta para expansão de integrações futuras

### Boas Práticas e Segurança
- Uso de variáveis de ambiente centralizadas
- Scripts administrativos usam apenas a Service Role Key no backend
- Dados sensíveis nunca expostos no frontend
- Logs e erros tratados e registrados

### Como rodar o seed de credenciais
1. Configure o `.env` com as chaves do Supabase (backend)
2. Execute o script de seed em `scripts/seedWbuyIntegration.ts`

### Observações
- Para cada nova empresa/ADM, repita o processo de cadastro seguro de credenciais
- Consulte sempre a documentação oficial da WBuy e do Supabase para detalhes de endpoints e segurança

**Última atualização: 10/06/2024**

## 📝 Integração e Teste da API WBuy

- Todo o processo de integração com a API WBuy foi realizado com validação de credenciais, teste de múltiplos endpoints e ajuste conforme a documentação oficial.
- Os testes de conexão foram feitos com sucesso para os endpoints principais, garantindo que a comunicação entre o Blue CRM e a WBuy está funcional.
- **Atenção:** Nenhuma credencial sensível ou script de teste é armazenado nesta pasta do projeto.
- **Todos os dados sensíveis, credenciais e scripts de teste estão documentados e salvos APENAS na pasta privada `integracao-apis/blue-crm` na raiz do workspace.**
- Consulte sempre a documentação privada para detalhes de configuração, atualização de credenciais e exemplos de uso seguro.

---

## 🔒 Instruções de Segurança e Compartilhamento de Credenciais

### Supabase
- **Nunca exponha dados reais do Supabase no README.md.**
- Utilize apenas exemplos genéricos:
  ```env
  SUPABASE_URL=https://<SUA-URL-DO-SUPABASE>
  SUPABASE_ANON_KEY=<SUA-CHAVE-ANONIMA>
  SUPABASE_SERVICE_ROLE_KEY=<SUA-SERVICE-ROLE-KEY>
  ```
- O arquivo `.env` deve ser mantido localmente e nunca versionado.

### WBuy (Bela Blue)
- **As credenciais da API WBuy DEVEM ser mantidas apenas no arquivo `.env` local e nunca expostas no README.md ou repositório.**
- Compartilhe as credenciais apenas com usuários autorizados via canal seguro.

### Boas Práticas
- O arquivo `.env` com todas as informações sensíveis deve ficar **apenas localmente** e nunca ser versionado.
- As informações do Supabase e WBuy devem ser documentadas apenas em arquivos privados e fora do repositório público.
- Sempre documente e atualize esta seção para evitar dúvidas recorrentes.

---

## 📁 Armazenamento Seguro de Credenciais e Integrações

Todas as credenciais e dados sensíveis de integração (Supabase, WBuy, etc) **NÃO DEVEM** ser incluídos neste README ou em qualquer parte do repositório público.

- **Mantenha todas as informações sensíveis apenas em arquivos privados na pasta `integracao-apis` na raiz do workspace (`AutomationServer/integracao-apis/`).**
- O arquivo `README.md` dentro da pasta `integracao-apis` contém as orientações privadas e seguras para uso das integrações.
- Nunca suba arquivos `.env` ou credenciais para o repositório.
- Consulte sempre a documentação privada em `integracao-apis/README.md` para detalhes de configuração e acesso seguro.

---

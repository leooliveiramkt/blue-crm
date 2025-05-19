# Modelo de Controle de Projeto (MCP) - CRM Bela Blue

## 1. Visão Geral
- **Nome do Projeto**: CRM Bela Blue
- **Descrição**: Sistema de CRM para gerenciamento de relacionamento com clientes
- **Tecnologias**: React, TypeScript, Vite, TailwindCSS, Supabase

## 2. Estrutura do Projeto
```
blue-crm/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── integrations/   # Integrações com APIs externas
│   ├── lib/           # Utilitários e configurações
│   └── pages/         # Páginas da aplicação
├── supabase/          # Configurações e migrações do Supabase
└── public/            # Arquivos estáticos
```

## 3. Padrões de Código
- **Linting**: ESLint + Prettier
- **Testes**: Jest
- **Commits**: Conventional Commits
- **Branching**: Git Flow

## 4. Integrações
- Supabase (Banco de dados)
- Tiny ERP
- Facebook
- Correios
- WBuy

## 5. Ambiente de Desenvolvimento
- Node.js
- Docker
- Nginx (Produção)

## 6. Processo de Deploy
1. Desenvolvimento → main
2. Testes automatizados
3. Deploy automático via GitHub Actions

## 7. Monitoramento
- Logs via Supabase
- Métricas de performance
- Alertas de erro

## 8. Segurança
- Autenticação via Supabase
- HTTPS em produção
- Variáveis de ambiente protegidas

## 9. Documentação
- README.md atualizado
- Documentação de API
- Guias de contribuição

## 10. Manutenção
- Atualizações de dependências via Renovate
- Backup automático do banco
- Monitoramento de performance 
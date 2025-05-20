# Diretrizes de Segurança - Blue CRM

## Proteção de Credenciais WBuy

### Regras Importantes
1. As credenciais da WBuy da Bela são **ESTRITAMENTE CONFIDENCIAIS**
2. NUNCA compartilhe as credenciais com:
   - Outras empresas
   - Funcionários de outras empresas
   - Repositórios públicos
   - Documentação pública

### Armazenamento Seguro
1. Todas as credenciais devem ser armazenadas em variáveis de ambiente
2. O arquivo `.env.production` NUNCA deve ser commitado no repositório
3. Use sempre o arquivo `.env.example` como template, sem credenciais reais

### Acesso à API
1. Apenas tenants autorizados podem acessar a API WBuy
2. Implementamos validação de tenant no serviço
3. Logs de acesso são mantidos para auditoria

### Boas Práticas
1. Use sempre HTTPS para comunicação com a API
2. Implemente rate limiting para evitar sobrecarga
3. Mantenha logs de todas as operações sensíveis
4. Faça backup regular das configurações
5. Monitore tentativas de acesso não autorizado

## Procedimentos de Segurança

### Em Caso de Comprometimento
1. Imediatamente revogue todas as credenciais
2. Notifique a equipe de segurança
3. Atualize todas as senhas e chaves
4. Revise os logs de acesso
5. Implemente medidas adicionais de segurança

### Manutenção Regular
1. Atualize as credenciais periodicamente
2. Revise as permissões de acesso
3. Mantenha o sistema atualizado
4. Faça auditorias regulares de segurança

## Contato

Em caso de dúvidas ou problemas de segurança, contate:
- Equipe de Segurança: security@bela.com.br
- Suporte Técnico: support@bela.com.br 
# 🎯 COMO USAR O SISTEMA DE HIERARQUIA - BLUE CRM

## 📋 **RESUMO DOS NÍVEIS DE ACESSO**

### **👑 1. SUPER ADMIN (Você - leooliveiramktd@gmail.com)**
```
✅ Altera TUDO em TODAS as empresas
✅ Gerencia APIs de qualquer tenant  
✅ Acesso completo ao sistema
✅ Pode trocar entre empresas
```

### **🏢 2. ADMIN EMPRESA**
```
✅ Altera dados da própria empresa
✅ Cadastra/edita APIs da própria empresa
✅ Gerencia usuários da empresa
✅ Vê dados da Bela Blue
❌ Não acessa outras empresas
```

### **🔧 3. ADMIN (CRM Geral)**
```
✅ Cadastro geral e edição no CRM
✅ Vê dados da Bela Blue
❌ SEM acesso a dados de API
❌ Não pode editar configurações de API
```

### **👔 4. DIRETOR**
```
✅ Cadastro de afiliados
✅ Cadastro de novas promoções
✅ Vê dados da Bela Blue
❌ SEM acesso a API
❌ Não pode editar configurações
```

### **📊 5. SUPERVISOR**
```
✅ Edição básica no sistema
✅ Supervisão operacional
✅ Vê dados da Bela Blue
❌ SEM acesso a API
❌ Não pode criar promoções
```

### **👀 6. AUXILIAR**
```
✅ SOMENTE consulta de dados e relatórios
✅ Vê dados da Bela Blue
❌ SEM qualquer alteração
❌ Acesso read-only
```

---

## 🛠️ **COMO USAR NO CÓDIGO**

### **1. Verificar Permissões:**
```typescript
import { usePermissions } from '../components/auth/PermissionGuard';

const { canEditApis, canManageUsers, isDiretor } = usePermissions();

if (canEditApis) {
  // Mostrar configurações de API
}
```

### **2. Proteger Componentes:**
```typescript
import { AdminEmpresaOnly, DiretorOrHigher } from '../components/auth/PermissionGuard';

// Só Admin Empresa vê
<AdminEmpresaOnly fallback={<p>Sem acesso</p>}>
  <ConfiguracoesAPI />
</AdminEmpresaOnly>

// Diretor ou superior vê
<DiretorOrHigher>
  <CadastroAfiliados />
</DiretorOrHigher>
```

### **3. Usar Context:**
```typescript
import { useTenant } from '../contexts/TenantContext';

const { userSession, tenantConfig, isSuperAdmin } = useTenant();

if (isSuperAdmin()) {
  // Funcionalidades exclusivas do Super Admin
}
```

---

## 🎨 **INTERFACE DO USUÁRIO**

### **Badge de Identificação:**
```typescript
import { PermissionBadge } from '../components/auth/PermissionGuard';

<PermissionBadge /> // Mostra: "👑 Super Admin", "🏢 Admin Empresa", etc.
```

### **Menu Baseado em Permissões:**
```typescript
{canManageUsers && <MenuItem>Gerenciar Usuários</MenuItem>}
{canEditApis && <MenuItem>Configurar APIs</MenuItem>}
{canManageAffiliates && <MenuItem>Cadastrar Afiliados</MenuItem>}
```

---

## 🔄 **FLUXO DE AUTENTICAÇÃO**

### **1. Login:**
```typescript
const { login } = useTenant();

await login('usuario@empresa.com', 'senha');
// Sistema automaticamente determina role e tenant
```

### **2. Trocar Empresa (só Super Admin):**
```typescript
const { switchTenant } = useTenant();

await switchTenant('empresa_x'); // Só funciona para Super Admin
```

---

## 📊 **ACESSO AOS DADOS DA BELA BLUE**

**TODOS os usuários de TODAS as empresas podem ver os dados da Bela Blue:**

```typescript
const { canAccessBelaBlue } = useTenant();

if (canAccessBelaBlue()) {
  // Mostrar dashboard com dados da Bela Blue
  // Benchmarks, insights, melhores práticas
}
```

**Dados compartilhados:**
- 📈 Vendas mensais (agregadas)
- 🏆 Top produtos
- 📊 Métricas de performance
- 💡 Insights de mercado
- 🎯 Melhores práticas

---

## ⚙️ **CONFIGURAÇÃO DE EMPRESA**

### **Para Admin Empresa:**
```typescript
if (canEditApis) {
  // Pode configurar:
  // - API WBuy da empresa
  // - API Tiny da empresa  
  // - Outras integrações
}
```

### **Para Super Admin:**
```typescript
if (isSuperAdmin()) {
  // Pode configurar:
  // - APIs de QUALQUER empresa
  // - Criar novos tenants
  // - Gerenciar usuários globalmente
}
```

---

## 🚀 **PRÓXIMOS PASSOS**

1. **Testar o Sistema:**
   - Fazer login com seu email (Super Admin)
   - Verificar se vê todas as funcionalidades
   - Testar permissões diferentes

2. **Adicionar Empresas:**
   - Criar novos tenants
   - Configurar APIs específicas
   - Convidar admins das empresas

3. **Treinar Usuários:**
   - Cada nível tem suas responsabilidades
   - Documenta fluxos específicos
   - Criar tutoriais por role

---

## 🎯 **VALOR PARA EMPRESAS CLIENTES**

**Ao contratar o Blue CRM, as empresas ganham:**

1. **Sistema CRM Completo** para sua empresa
2. **Acesso aos dados da Bela Blue** como benchmarking
3. **Insights de mercado** baseados em empresa de sucesso
4. **Melhores práticas** testadas e aprovadas
5. **Análises comparativas** para melhorar performance

**Isso é MUITO mais valor que um CRM comum!**

---

*Sistema desenvolvido por: Léo Oliveira*  
*Data: 20/05/2025* 
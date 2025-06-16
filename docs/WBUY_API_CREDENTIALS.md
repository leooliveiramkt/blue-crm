# 🔑 CREDENCIAIS API WBUY - BLUE CRM

## 📋 **INFORMAÇÕES DA API**

### **🏪 Loja: Bela Blue Beauty**
- **Store ID**: `384388`
- **URL Base**: `https://sistema.sistemawbuy.com.br/api/v1`

### **🔐 Credenciais de Autenticação**
```
Usuário da API: 61691da4-7fc8-419e-a06d-b9e021d75efc
Senha da API: eba83af0e5b1415182d267ef174cc2a9
Authorization Bearer: NjE2OTFkYTQtN2ZjOC00MTllLWEwNmQtYjllMDIxZDc1ZWZjOmViYTgzYWYwZTViMTQxNTE4MmQyNjdlZjE3NGNjMmE5
```

## 🌍 **VARIÁVEIS DE AMBIENTE**

### **Para Desenvolvimento (.env)**
```env
WBUY_API_URL=https://sistema.sistemawbuy.com.br/api/v1
WBUY_API_USER=61691da4-7fc8-419e-a06d-b9e021d75efc
WBUY_API_PASSWORD=eba83af0e5b1415182d267ef174cc2a9
WBUY_API_TOKEN=NjE2OTFkYTQtN2ZjOC00MTllLWEwNmQtYjllMDIxZDc1ZWZjOmViYTgzYWYwZTViMTQxNTE4MmQyNjdlZjE3NGNjMmE5
WBUY_STORE_ID=384388
```

### **Para Produção**
```bash
export WBUY_API_URL="https://sistema.sistemawbuy.com.br/api/v1"
export WBUY_API_USER="61691da4-7fc8-419e-a06d-b9e021d75efc"
export WBUY_API_PASSWORD="eba83af0e5b1415182d267ef174cc2a9"
export WBUY_API_TOKEN="NjE2OTFkYTQtN2ZjOC00MTllLWEwNmQtYjllMDIxZDc1ZWZjOmViYTgzYWYwZTViMTQxNTE4MmQyNjdlZjE3NGNjMmE5"
export WBUY_STORE_ID="384388"
```

## 📊 **DADOS DISPONÍVEIS (Última Verificação)**

### **✅ Endpoints Funcionando:**
- **Pedidos**: 88.997 registros
- **Afiliados**: 100 registros  
- **Produtos**: 122 registros
- **Categorias**: 48 registros
- **Clientes**: 35.896 registros

### **🔗 Headers de Requisição:**
```json
{
  "Authorization": "Bearer NjE2OTFkYTQtN2ZjOC00MTllLWEwNmQtYjllMDIxZDc1ZWZjOmViYTgzYWYwZTViMTQxNTE4MmQyNjdlZjE3NGNjMmE5",
  "X-Store-ID": "384388",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

## 🚀 **ENDPOINTS PRINCIPAIS**

### **Pedidos**
```
GET /order/
- Parâmetros: page, limit, status, start_date, end_date
- Total: 88.997 pedidos
```

### **Afiliados**
```
GET /partnerstore/
- Parâmetros: page, limit, status
- Total: 100 afiliados
```

### **Produtos**
```
GET /product/
- Parâmetros: page, limit, category, status
- Total: 122 produtos
```

### **Clientes**
```
GET /customer/
- Parâmetros: page, limit, search
- Total: 35.896 clientes
```

### **Categorias**
```
GET /category/
- Total: 48 categorias
```

## 🔧 **CONFIGURAÇÃO NO CÓDIGO**

### **WbuyService.ts**
```typescript
private getHeaders() {
  return {
    'Authorization': `Bearer ${process.env.WBUY_API_TOKEN || 'NjE2OTFkYTQtN2ZjOC00MTllLWEwNmQtYjllMDIxZDc1ZWZjOmViYTgzYWYwZTViMTQxNTE4MmQyNjdlZjE3NGNjMmE5'}`,
    'Content-Type': 'application/json',
    'X-Store-ID': this.storeId
  };
}
```

### **Teste de Conexão**
```bash
cd blue-crm
node test-wbuy.js
```

## 📈 **SISTEMA DE RELATÓRIOS**

### **Dados para Relatórios Comerciais:**
- **Vendedoras Internas**: Identificadas por querystring
- **Afiliadas Externas**: Códigos ref= e utm_source=
- **Comissões**: 5% internas, 10% afiliadas
- **Canais**: Facebook, Instagram, WhatsApp, TikTok, Google

### **Cache Disponível:**
- `wbuy-cache-pedidos.json` (88.997 pedidos)
- `wbuy-cache-afiliados.json` (100 afiliados)
- `wbuy-cache-produtos.json` (122 produtos)
- `wbuy-cache-clientes.json` (35.896 clientes)

## 🛡️ **SEGURANÇA**

### **⚠️ IMPORTANTE:**
- **NÃO** commitar credenciais no Git
- Usar variáveis de ambiente em produção
- Rotacionar tokens periodicamente
- Monitorar uso da API

### **🔒 Proteção:**
- Credenciais armazenadas em `.env` (gitignored)
- Headers seguros com Bearer Token
- Rate limiting implementado (1.1s entre requests)
- Fallback para cache em caso de erro

---

**📅 Última Atualização**: 28/05/2025  
**👤 Responsável**: Léo Oliveira - Bela Blue  
**🔄 Status**: ✅ Funcionando - API Conectada  
**📊 Dados**: 88.997 pedidos sincronizados 
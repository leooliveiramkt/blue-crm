
# Instruções para Implantação do Blue CRM

Este documento contém instruções para implantar o Blue CRM em diferentes ambientes.

## Implantação em Subdiretório (belablue.io/crm)

Se você deseja hospedar o Blue CRM em um subdiretório do seu domínio existente (como belablue.io/crm), siga estas etapas:

1. Edite o arquivo `src/config/deployment.ts` e altere a constante `BASE_PATH`:
   ```typescript
   export const BASE_PATH = '/crm';  // Substitua '/crm' pelo caminho desejado
   ```

2. Execute o build da aplicação:
   ```bash
   npm run build
   ```

3. Faça o upload da pasta `dist` para o diretório correspondente no seu servidor VPS.

4. Configure seu servidor web (Apache/Nginx) para direcionar todas as requisições do subdiretório para o arquivo `index.html` da aplicação.

### Exemplo de configuração para Apache (arquivo .htaccess no diretório /crm):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /crm/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /crm/index.html [L]
</IfModule>
```

### Exemplo de configuração para Nginx:
```nginx
location /crm {
    alias /caminho/para/pasta/dist;
    try_files $uri $uri/ /crm/index.html;
}
```

## Implantação em Subdomínio (crm.belablue.io)

Se você preferir usar um subdomínio para o Blue CRM, siga estas etapas:

1. Mantenha o arquivo `src/config/deployment.ts` com `BASE_PATH = '/'`.

2. Execute o build da aplicação:
   ```bash
   npm run build
   ```

3. Configure seu DNS para apontar o subdomínio para o IP do seu servidor:
   - Adicione um registro A para "crm" apontando para o IP do seu servidor VPS.

4. Configure seu servidor web para direcionar o tráfego deste subdomínio para a pasta da aplicação.

### Exemplo de configuração para Apache (Virtual Host):
```apache
<VirtualHost *:80>
    ServerName crm.belablue.io
    DocumentRoot /caminho/para/pasta/dist
    
    <Directory "/caminho/para/pasta/dist">
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

### Exemplo de configuração para Nginx:
```nginx
server {
    listen 80;
    server_name crm.belablue.io;
    root /caminho/para/pasta/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Solução de Problemas

Se você encontrar problemas com rotas não sendo encontradas:

1. Verifique se o valor de `BASE_PATH` em `src/config/deployment.ts` está correto.
2. Verifique se a configuração do servidor web está redirecionando corretamente para o arquivo index.html.
3. Certifique-se de que todos os arquivos estáticos estão sendo servidos corretamente.

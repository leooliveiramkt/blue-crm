module.exports = {
  apps: [
    {
      name: 'wbuy-sync',
      script: './dist/scripts/wbuySync.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'wbuy-stats',
      script: './dist/scripts/wbuyStats.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'wbuy-webhook',
      script: './dist/scripts/wbuyWebhook.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}; 
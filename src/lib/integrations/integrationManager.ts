export const integrationManager = {
  isIntegrationAvailable: (provider: string) => {
    // Simula que todas as integrações estão disponíveis
    return true;
  },
  getIntegrationConfig: (provider: string) => {
    // Retorna um objeto de configuração fake
    return {
      apiKey: "fake-key",
      apiUrl: "https://fake-api.com",
      storeId: "fake-store-id"
    };
  }
}; 
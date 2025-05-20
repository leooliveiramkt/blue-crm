import React, { useEffect, useState } from 'react';
import { WBuyConfigService, CompanyWBuyConfig } from '../services/wbuy/wbuyConfigService';
import { WBuyConfig } from '../services/wbuy/types';

export function WBuyConfigManager() {
  const [companies, setCompanies] = useState<Array<{
    company: {
      id: string;
      name: string;
      slug: string;
    };
    config: CompanyWBuyConfig | null;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [config, setConfig] = useState<WBuyConfig>({
    baseURL: '',
    apiKey: '',
    storeId: ''
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await WBuyConfigService.listUserCompanies();
      setCompanies(data);
      if (data.length > 0) {
        setSelectedCompany(data[0].company.id);
        if (data[0].config) {
          setConfig({
            baseURL: data[0].config.baseURL,
            apiKey: data[0].config.apiKey,
            storeId: data[0].config.storeId
          });
        }
      }
    } catch (err) {
      setError('Erro ao carregar empresas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
    const company = companies.find(c => c.company.id === companyId);
    if (company?.config) {
      setConfig({
        baseURL: company.config.baseURL,
        apiKey: company.config.apiKey,
        storeId: company.config.storeId
      });
    } else {
      setConfig({
        baseURL: '',
        apiKey: '',
        storeId: ''
      });
    }
  };

  const handleConfigChange = (field: keyof WBuyConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!selectedCompany) return;

    try {
      setLoading(true);
      const success = await WBuyConfigService.updateCompanyConfig(selectedCompany, config);
      if (success) {
        await loadCompanies();
        alert('Configuração salva com sucesso!');
      } else {
        setError('Erro ao salvar configuração');
      }
    } catch (err) {
      setError('Erro ao salvar configuração');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async () => {
    const companyName = prompt('Nome da empresa:');
    if (!companyName) return;

    const companySlug = companyName.toLowerCase().replace(/\s+/g, '-');
    const apiUrl = prompt('URL da API WBuy:');
    const apiKey = prompt('Chave da API WBuy:');
    const storeId = prompt('ID da Loja WBuy:');

    if (!apiUrl || !apiKey || !storeId) return;

    try {
      setLoading(true);
      const companyId = await WBuyConfigService.createCompanyWithConfig(
        companyName,
        companySlug,
        {
          baseURL: apiUrl,
          apiKey,
          storeId
        }
      );

      if (companyId) {
        await loadCompanies();
        alert('Empresa criada com sucesso!');
      } else {
        setError('Erro ao criar empresa');
      }
    } catch (err) {
      setError('Erro ao criar empresa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Configurações WBuy</h1>
        <button
          onClick={handleCreateCompany}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nova Empresa
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Empresa
        </label>
        <select
          value={selectedCompany || ''}
          onChange={(e) => handleCompanyChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {companies.map(({ company }) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCompany && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da API
            </label>
            <input
              type="text"
              value={config.baseURL}
              onChange={(e) => handleConfigChange('baseURL', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chave da API
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => handleConfigChange('apiKey', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID da Loja
            </label>
            <input
              type="text"
              value={config.storeId}
              onChange={(e) => handleConfigChange('storeId', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Salvar Configurações
          </button>
        </div>
      )}
    </div>
  );
} 
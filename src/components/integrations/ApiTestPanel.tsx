import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { testAllAPIs } from '../../integrations/api-test';

export function ApiTestPanel() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleTestAPIs() {
    setLoading(true);
    try {
      const apiResults = await testAllAPIs();
      setResults(apiResults);
    } catch (error) {
      console.error('Erro ao testar APIs:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Integrações</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleTestAPIs} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? 'Testando...' : 'Testar Todas as APIs'}
          </Button>

          {results && (
            <div className="space-y-4">
              {Object.entries(results).map(([api, result]: [string, any]) => (
                <Card key={api}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {api.charAt(0).toUpperCase() + api.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        result.success ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span>
                        {result.success ? 'Conectado' : 'Erro na conexão'}
                      </span>
                    </div>
                    {!result.success && (
                      <p className="text-sm text-red-500 mt-2">
                        {result.error}
                      </p>
                    )}
                    {result.success && result.data && (
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
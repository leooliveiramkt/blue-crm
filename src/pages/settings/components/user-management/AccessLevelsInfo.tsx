
import React from 'react';

const AccessLevelsInfo: React.FC = () => {
  return (
    <div className="border rounded-md p-4 mt-6">
      <h3 className="font-medium mb-2">Níveis de Acesso</h3>
      <ul className="space-y-2 text-sm">
        <li><strong>Admin:</strong> Acesso completo a todas as funcionalidades e configurações</li>
        <li><strong>Diretor:</strong> Acesso a análises e relatórios, sem configurações de sistema</li>
        <li><strong>Consultor:</strong> Acesso apenas para visualização de dados básicos</li>
      </ul>
    </div>
  );
};

export default AccessLevelsInfo;

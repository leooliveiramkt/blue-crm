
import React from 'react';

interface IntegrationMetadataProps {
  metadata?: Record<string, any>;
}

export const IntegrationMetadata: React.FC<IntegrationMetadataProps> = ({ metadata }) => {
  if (!metadata || Object.keys(metadata).length === 0) return null;

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-2 font-medium">Metadados da Integração</h3>
      <pre className="mt-2 rounded bg-muted p-4 text-xs overflow-auto max-h-64">
        {JSON.stringify(metadata, null, 2)}
      </pre>
    </div>
  );
};

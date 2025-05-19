
import React from 'react';

interface DemoCredentialsProps {
  setDemoCredentials: (type: string) => void;
}

export const DemoCredentials: React.FC<DemoCredentialsProps> = ({ setDemoCredentials }) => {
  return (
    <div className="mt-8 text-center text-sm text-muted-foreground">
      <p>Níveis de acesso de demonstração:</p>
      <div className="text-xs mt-1 space-y-1 flex flex-col">
        <button 
          className="hover:underline hover:text-primary transition-colors"
          onClick={() => setDemoCredentials('admin')}
        >
          Admin: admin@example.com / admin
        </button>
        <button
          className="hover:underline hover:text-primary transition-colors"
          onClick={() => setDemoCredentials('director')}
        >
          Diretor: director@example.com / director
        </button>
        <button
          className="hover:underline hover:text-primary transition-colors"
          onClick={() => setDemoCredentials('consultant')}
        >
          Consulta: consultant@example.com / consultant
        </button>
      </div>
    </div>
  );
};

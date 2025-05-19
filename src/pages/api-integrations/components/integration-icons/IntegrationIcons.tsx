
import React from 'react';
import { IntegrationType } from '@/lib/integrations/types';

// Hook para criar e retornar ícones personalizados
export function useIntegrationIcons() {
  const ShoppingCart = (props: { size?: number }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );

  return { ShoppingCart };
}

// Componente para ícones de serviços externos baseados no SVG padrão
export const ServiceIcon = ({ 
  iconPath, 
  size = 24 
}: { 
  iconPath: string; 
  size?: number 
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {iconPath.split('||').map((path, i) => (
      <path key={i} d={path} />
    ))}
  </svg>
);

// Utilitário para obter o ícone correto baseado no ID da integração
export function useIntegrationIcon(integrationId: IntegrationType) {
  const { ShoppingCart } = useIntegrationIcons();
  
  const iconMap = {
    'wbuy': ShoppingCart,
    'facebook': () => <ServiceIcon iconPath="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    'activecampaign': () => (
      <React.Fragment>
        <ServiceIcon iconPath="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z||m22 6-10 7L2 6" />
      </React.Fragment>
    ),
    'google': () => (
      <React.Fragment>
        <ServiceIcon iconPath="M22 12.5V6c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9.5||m22 8-5 4-5-4||M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z||m18 16 3 3" />
      </React.Fragment>
    ),
    'stape': () => (
      <React.Fragment>
        <ServiceIcon iconPath="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20z" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </React.Fragment>
    ),
    'tiny': () => (
      <React.Fragment>
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </React.Fragment>
    ),
    'airtable': () => (
      <React.Fragment>
        <ServiceIcon iconPath="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V7c0-1.1-.9-2-2-2H6a2 2 0 0 0-2 2z||M4 7v10c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V7||M4 7v10c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V7||M5 7V4c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v3" />
      </React.Fragment>
    ),
  };

  return iconMap[integrationId];
}

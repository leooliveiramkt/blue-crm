import React from 'react';
import { WBuyConfigManager } from '../../components/WBuyConfigManager';

export function WBuyConfigPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <WBuyConfigManager />
      </div>
    </div>
  );
} 
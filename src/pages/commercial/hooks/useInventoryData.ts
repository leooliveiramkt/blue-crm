
import { useState } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  lastUpdated: string;
}

interface LowStockItem {
  id: string;
  name: string;
  quantity: number;
  supplier: string;
  restockTime: number;
  status: 'Baixo' | 'Crítico';
}

export const useInventoryData = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Detox Slim Caps',
      sku: 'DSC-001',
      category: 'Suplementos Termogênicos',
      quantity: 145,
      minQuantity: 50,
      lastUpdated: '28/04/2025'
    },
    {
      id: '2',
      name: 'Colágeno Hidrolisado',
      sku: 'COL-002',
      category: 'Suplementos Naturais',
      quantity: 128,
      minQuantity: 40,
      lastUpdated: '29/04/2025'
    },
    {
      id: '3',
      name: 'Thermogenics Plus',
      sku: 'THP-003',
      category: 'Suplementos Termogênicos',
      quantity: 94,
      minQuantity: 30,
      lastUpdated: '01/05/2025'
    },
    {
      id: '4',
      name: 'Ômega 3 Premium',
      sku: 'OMG-004',
      category: 'Suplementos Naturais',
      quantity: 62,
      minQuantity: 25,
      lastUpdated: '30/04/2025'
    },
    {
      id: '5',
      name: 'Kit Completo Emagrecimento',
      sku: 'KCE-005',
      category: 'Kits Promocionais',
      quantity: 38,
      minQuantity: 15,
      lastUpdated: '27/04/2025'
    },
    {
      id: '6',
      name: 'Shake Proteico Chocolate',
      sku: 'SPC-006',
      category: 'Shakes e Bebidas',
      quantity: 24,
      minQuantity: 20,
      lastUpdated: '25/04/2025'
    },
    {
      id: '7',
      name: 'Shake Proteico Baunilha',
      sku: 'SPB-007',
      category: 'Shakes e Bebidas',
      quantity: 12,
      minQuantity: 20,
      lastUpdated: '26/04/2025'
    },
    {
      id: '8',
      name: 'Fibras Naturais Mix',
      sku: 'FNM-008',
      category: 'Suplementos Naturais',
      quantity: 8,
      minQuantity: 18,
      lastUpdated: '24/04/2025'
    },
    {
      id: '9',
      name: 'Chá Verde em Cápsulas',
      sku: 'CVC-009',
      category: 'Suplementos Naturais',
      quantity: 15,
      minQuantity: 25,
      lastUpdated: '23/04/2025'
    }
  ]);

  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([
    {
      id: '7',
      name: 'Shake Proteico Baunilha',
      quantity: 12,
      supplier: 'Nutri Suplementos Ltda',
      restockTime: 7,
      status: 'Baixo'
    },
    {
      id: '8',
      name: 'Fibras Naturais Mix',
      quantity: 8,
      supplier: 'Naturais Brasil S.A.',
      restockTime: 10,
      status: 'Crítico'
    },
    {
      id: '9',
      name: 'Chá Verde em Cápsulas',
      quantity: 15,
      supplier: 'Herbal Supplements Inc.',
      restockTime: 12,
      status: 'Baixo'
    },
    {
      id: '10',
      name: 'Berinjela em Cápsulas',
      quantity: 7,
      supplier: 'NutriVerde Suplementos',
      restockTime: 8,
      status: 'Crítico'
    }
  ]);

  return {
    inventory,
    lowStockItems
  };
};

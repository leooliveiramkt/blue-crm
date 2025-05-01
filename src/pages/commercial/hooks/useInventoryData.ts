
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
      name: 'Curso Avançado de Marketing',
      sku: 'CAM-001',
      category: 'Cursos Online',
      quantity: 150,
      minQuantity: 50,
      lastUpdated: '28/04/2025'
    },
    {
      id: '2',
      name: 'Formação Completa em Vendas',
      sku: 'FCV-002',
      category: 'Cursos Online',
      quantity: 120,
      minQuantity: 40,
      lastUpdated: '29/04/2025'
    },
    {
      id: '3',
      name: 'E-book Estratégias Digitais',
      sku: 'EED-003',
      category: 'E-books',
      quantity: 500,
      minQuantity: 100,
      lastUpdated: '01/05/2025'
    },
    {
      id: '4',
      name: 'Consultoria Personalizada',
      sku: 'CPE-004',
      category: 'Consultorias',
      quantity: 30,
      minQuantity: 10,
      lastUpdated: '30/04/2025'
    },
    {
      id: '5',
      name: 'Workshop de Liderança',
      sku: 'WLD-005',
      category: 'Cursos Presenciais',
      quantity: 15,
      minQuantity: 5,
      lastUpdated: '27/04/2025'
    },
    {
      id: '6',
      name: 'Curso Básico de Vendas',
      sku: 'CBV-006',
      category: 'Cursos Online',
      quantity: 4,
      minQuantity: 10,
      lastUpdated: '25/04/2025'
    },
    {
      id: '7',
      name: 'Manual de Processos',
      sku: 'MPR-007',
      category: 'Materiais',
      quantity: 8,
      minQuantity: 20,
      lastUpdated: '26/04/2025'
    }
  ]);

  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([
    {
      id: '6',
      name: 'Curso Básico de Vendas',
      quantity: 4,
      supplier: 'Editora Digital Ltda',
      restockTime: 5,
      status: 'Crítico'
    },
    {
      id: '7',
      name: 'Manual de Processos',
      quantity: 8,
      supplier: 'Gráfica Moderna',
      restockTime: 7,
      status: 'Crítico'
    },
    {
      id: '8',
      name: 'Assinatura Mensal',
      quantity: 12,
      supplier: 'Sistema Próprio',
      restockTime: 3,
      status: 'Baixo'
    },
    {
      id: '9',
      name: 'Planilhas de Gestão',
      quantity: 25,
      supplier: 'Sistema Próprio',
      restockTime: 2,
      status: 'Baixo'
    }
  ]);

  return {
    inventory,
    lowStockItems
  };
};

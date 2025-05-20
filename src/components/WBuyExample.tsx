import React, { useEffect, useState } from 'react';
import { useWBuy } from '../hooks/useWBuy';
import { WBuyProduct, WBuyOrder, WBuyAnalytics } from '../services/wbuy/types';

export function WBuyExample() {
  const {
    loading,
    error,
    getProducts,
    getOrders,
    getAnalytics
  } = useWBuy();

  const [products, setProducts] = useState<WBuyProduct[]>([]);
  const [orders, setOrders] = useState<WBuyOrder[]>([]);
  const [analytics, setAnalytics] = useState<WBuyAnalytics | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Buscar produtos
      const productsData = await getProducts({ limit: 10 });
      if (productsData?.data) {
        setProducts(productsData.data);
      }

      // Buscar pedidos
      const ordersData = await getOrders({ limit: 10 });
      if (ordersData?.data) {
        setOrders(ordersData.data);
      }

      // Buscar analytics
      const analyticsData = await getAnalytics({
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // últimos 30 dias
        end_date: new Date().toISOString()
      });
      if (analyticsData) {
        setAnalytics(analyticsData);
      }
    };

    fetchData();
  }, [getProducts, getOrders, getAnalytics]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard WBuy</h1>

      {/* Seção de Analytics */}
      {analytics && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Métricas Gerais</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500">Total de Vendas</h3>
              <p className="text-2xl font-bold">R$ {analytics.total_sales.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500">Total de Pedidos</h3>
              <p className="text-2xl font-bold">{analytics.total_orders}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500">Ticket Médio</h3>
              <p className="text-2xl font-bold">R$ {analytics.average_order_value.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500">Taxa de Conversão</h3>
              <p className="text-2xl font-bold">{(analytics.conversion_rate * 100).toFixed(2)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Seção de Produtos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Últimos Produtos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">R$ {product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Estoque: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Pedidos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Últimos Pedidos</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
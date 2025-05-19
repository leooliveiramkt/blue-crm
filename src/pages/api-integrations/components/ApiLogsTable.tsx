
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Dados de exemplo para os logs
const logData = [
  { time: '15:42:30', service: 'Wbuy', endpoint: '/orders', status: '200' },
  { time: '15:38:12', service: 'Facebook', endpoint: '/insights', status: '200' },
  { time: '15:35:01', service: 'Active Campaign', endpoint: '/contacts', status: '201' },
  { time: '15:30:45', service: 'Wbuy', endpoint: '/affiliates/stats', status: '200' },
  { time: '15:28:17', service: 'Wbuy', endpoint: '/order/update', status: '403' },
  { time: '15:25:09', service: 'Active Campaign', endpoint: '/lists', status: '200' },
];

export const ApiLogsTable: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs de API</CardTitle>
        <CardDescription>Visualize as últimas chamadas e respostas de API.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logData.map((log, index) => (
            <div key={index} className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{log.time}</span>
                <span className="font-medium">{log.service}</span>
                <span className="text-muted-foreground">{log.endpoint}</span>
              </div>
              <span className={log.status.startsWith('2') ? 'text-green-600' : 'text-red-600'}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Ver Todos os Logs</Button>
      </CardFooter>
    </Card>
  );
};

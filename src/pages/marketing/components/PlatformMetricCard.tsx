
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface PlatformMetricCardProps {
  name: string;
  color: string;
  share: string;
  roi: string;
  investment: string;
  revenue: string;
}

const PlatformMetricCard = ({ name, color, share, roi, investment, revenue }: PlatformMetricCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
            {name === 'Facebook' && <span className="text-white font-bold text-xs">F</span>}
            {name === 'Google' && <span className="text-white font-bold text-xs">G</span>}
            {name === 'TikTok' && <span className="text-white font-bold text-xs">T</span>}
            {name === 'Taboola' && <span className="text-white font-bold text-xs">Tb</span>}
            {name === 'Outbrain' && <span className="text-white font-bold text-xs">O</span>}
          </div>
          <p className="text-lg font-bold">{name}</p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Participação:</span>
            <span className="text-sm font-medium">{share}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">ROI:</span>
            <span className="text-sm font-medium text-green-600">{roi}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Investimento:</span>
            <span className="text-sm font-medium">{investment}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Faturamento:</span>
            <span className="text-sm font-medium">{revenue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformMetricCard;

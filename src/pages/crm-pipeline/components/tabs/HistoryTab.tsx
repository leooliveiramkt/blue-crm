
import React from 'react';
import { usePipelineData } from '../../hooks/usePipelineData';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Calendar, 
  RefreshCcw, 
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryTabProps {
  leadId: string;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ leadId }) => {
  const { getLeadHistory } = usePipelineData();
  const history = getLeadHistory(leadId);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'status':
        return <RefreshCcw className="h-4 w-4" />;
      case 'assignment':
        return <User className="h-4 w-4" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'message':
        return "text-blue-500 bg-blue-50";
      case 'call':
        return "text-green-500 bg-green-50";
      case 'email':
        return "text-purple-500 bg-purple-50";
      case 'meeting':
        return "text-amber-500 bg-amber-50";
      case 'status':
        return "text-sky-500 bg-sky-50";
      case 'assignment':
        return "text-rose-500 bg-rose-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="h-[400px] overflow-y-auto p-3">
      <div className="relative space-y-0">
        {history.map((item, index) => (
          <div key={item.id} className="relative pl-8 pb-8">
            {/* Linha vertical conectando os itens */}
            {index < history.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-muted"></div>
            )}
            
            {/* Círculo do ícone */}
            <div className={cn(
              "absolute left-0 top-0 h-8 w-8 rounded-full flex items-center justify-center",
              getActivityColor(item.type)
            )}>
              {getActivityIcon(item.type)}
            </div>
            
            {/* Conteúdo */}
            <div className="space-y-1 pt-1">
              <p className="font-medium text-sm">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.user}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.timestamp).toLocaleDateString()} às {' '}
                  {new Date(item.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              {item.details && (
                <p className="text-sm mt-1 text-muted-foreground">{item.details}</p>
              )}
            </div>
          </div>
        ))}
        
        {history.length === 0 && (
          <div className="h-32 flex items-center justify-center text-center">
            <div className="text-muted-foreground">
              <p>Nenhuma atividade registrada</p>
              <p className="text-sm">O histórico de atividades será exibido aqui</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

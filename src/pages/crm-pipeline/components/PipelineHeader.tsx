
import React, { useState } from 'react';
import { Search, Plus, Filter, Settings, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { AddLeadDialog } from './dialogs/AddLeadDialog';

export const PipelineHeader = () => {
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pipeline de Atendimento</h1>
        
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsAddLeadOpen(true)} variant="default">
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Configurações do Pipeline
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="w-4 h-4 mr-2" />
                Gerenciar Equipe
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Gerenciar Integrações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar leads por nome, email, telefone..." 
            className="pl-9" 
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <AddLeadDialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen} />
    </div>
  );
};

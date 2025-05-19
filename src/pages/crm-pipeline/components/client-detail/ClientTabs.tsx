
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessagesTab } from '../tabs/MessagesTab';
import { HistoryTab } from '../tabs/HistoryTab';
import { TasksTab } from '../tabs/TasksTab';
import { NotesTab } from '../tabs/NotesTab';

interface ClientTabsProps {
  leadId: string;
}

export const ClientTabs: React.FC<ClientTabsProps> = ({ leadId }) => {
  const [currentTab, setCurrentTab] = useState<string>('messages');

  return (
    <div className="px-2 pb-2">
      <Tabs defaultValue="messages" onValueChange={setCurrentTab} value={currentTab}>
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="m-0">
          <MessagesTab leadId={leadId} />
        </TabsContent>
        
        <TabsContent value="history" className="m-0">
          <HistoryTab leadId={leadId} />
        </TabsContent>
        
        <TabsContent value="tasks" className="m-0">
          <TasksTab leadId={leadId} />
        </TabsContent>
        
        <TabsContent value="notes" className="m-0">
          <NotesTab leadId={leadId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};


import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, CalendarDays, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { usePipelineData } from '../../hooks/usePipelineData';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface TasksTabProps {
  leadId: string;
}

export const TasksTab: React.FC<TasksTabProps> = ({ leadId }) => {
  const { getLeadTasks, toggleTaskStatus } = usePipelineData();
  const tasks = getLeadTasks(leadId);
  
  const handleToggleTask = (taskId: string) => {
    toggleTaskStatus(leadId, taskId);
  };
  
  // Agrupar tarefas por status
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="h-[400px] overflow-y-auto p-2">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Tarefas pendentes</h3>
        <Button variant="outline" size="sm" className="h-7">
          <Plus className="h-3 w-3 mr-1" />
          Nova tarefa
        </Button>
      </div>
      
      <div className="space-y-2 mb-4">
        {pendingTasks.length === 0 ? (
          <div className="h-20 border border-dashed rounded-md flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Nenhuma tarefa pendente</span>
          </div>
        ) : (
          pendingTasks.map(task => (
            <Card key={task.id} className="p-3">
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggleTask(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className={cn(
                    "text-sm font-medium",
                    task.completed && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </p>
                  
                  <div className="flex items-center mt-1 gap-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      {task.assignee}
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {completedTasks.length > 0 && (
        <>
          <h3 className="text-sm font-medium mb-2 mt-4">Tarefas concluídas</h3>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <Card key={task.id} className="p-3 bg-muted/50">
                <div className="flex items-start gap-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-through text-muted-foreground">
                      {task.title}
                    </p>
                    
                    <div className="flex items-center mt-1 gap-3">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

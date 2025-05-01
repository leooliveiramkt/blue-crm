
import { useState } from 'react';
import { Task } from '../types';

// Criar tarefas simuladas
const generateTasks = (leadId: string): Task[] => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return [
    {
      id: `task-${leadId}-1`,
      leadId,
      title: 'Fazer follow-up com cliente',
      description: 'Verificar se recebeu a proposta e tem dúvidas',
      dueDate: tomorrow.toISOString(),
      completed: false,
      assignee: 'Ana Silva'
    },
    {
      id: `task-${leadId}-2`,
      leadId,
      title: 'Enviar material complementar',
      dueDate: nextWeek.toISOString(),
      completed: false,
      assignee: 'Roberto Almeida'
    },
    {
      id: `task-${leadId}-3`,
      leadId,
      title: 'Atualizar informações no CRM',
      dueDate: yesterday.toISOString(),
      completed: true,
      assignee: 'Ana Silva'
    }
  ];
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  
  // Inicializar tarefas para um novo lead
  const initializeTasks = (leadId: string) => {
    if (!tasks[leadId]) {
      setTasks(prev => ({
        ...prev,
        [leadId]: generateTasks(leadId)
      }));
    }
  };
  
  // Obter tarefas do lead
  const getLeadTasks = (leadId: string): Task[] => {
    return tasks[leadId] || [];
  };
  
  // Alternar status da tarefa
  const toggleTaskStatus = (leadId: string, taskId: string) => {
    setTasks(prev => {
      const leadTasks = [...(prev[leadId] || [])];
      const updatedTasks = leadTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      
      return {
        ...prev,
        [leadId]: updatedTasks
      };
    });
  };
  
  // Adicionar tarefa
  const addTask = (leadId: string, task: Omit<Task, 'id' | 'leadId'>) => {
    const newTask: Task = {
      id: `task-${leadId}-${Date.now()}`,
      leadId,
      ...task
    };
    
    setTasks(prev => {
      const leadTasks = [...(prev[leadId] || [])];
      return {
        ...prev,
        [leadId]: [...leadTasks, newTask]
      };
    });
    
    return newTask;
  };
  
  // Remover tarefas de um lead
  const removeLeadTasks = (leadId: string) => {
    setTasks(prev => {
      const updated = { ...prev };
      delete updated[leadId];
      return updated;
    });
  };

  return {
    tasks,
    setTasks,
    initializeTasks,
    getLeadTasks,
    toggleTaskStatus,
    addTask,
    removeLeadTasks
  };
};


export interface Stage {
  id: string;
  name: string;
  order: number;
  color: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  stageId: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  source: string;
  tags: string[];
  potentialValue?: number;
  lastContactDays: number;
  unreadMessages: number;
}

export interface Message {
  id: string;
  leadId: string;
  sender: string;
  content: string;
  timestamp: string;
  isFromLead: boolean;
  channel: string;
}

export interface HistoryItem {
  id: string;
  leadId: string;
  type: 'message' | 'call' | 'email' | 'meeting' | 'status' | 'assignment';
  description: string;
  details?: string;
  user: string;
  timestamp: string;
}

export interface Task {
  id: string;
  leadId: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  assignee: string;
}

export interface Note {
  id: string;
  leadId: string;
  content: string;
  author: string;
  timestamp: string;
  pinned: boolean;
}

export interface User {
  id: string;
  name: string;
  role: string;
}

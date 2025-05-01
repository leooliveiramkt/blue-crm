
import React, { useState } from 'react';
import { Plus, Pin, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { usePipelineData } from '../../hooks/usePipelineData';

interface NotesTabProps {
  leadId: string;
}

export const NotesTab: React.FC<NotesTabProps> = ({ leadId }) => {
  const { getLeadNotes, addNote } = usePipelineData();
  const notes = getLeadNotes(leadId);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(leadId, newNote.trim());
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  return (
    <div className="h-[400px] overflow-y-auto p-2">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Anotações</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7"
          onClick={() => setIsAddingNote(true)}
        >
          <Plus className="h-3 w-3 mr-1" />
          Nova anotação
        </Button>
      </div>
      
      {isAddingNote && (
        <Card className="p-3 mb-3">
          <Textarea 
            placeholder="Digite sua anotação aqui..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px] mb-2"
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsAddingNote(false)}
            >
              Cancelar
            </Button>
            <Button 
              size="sm"
              onClick={handleAddNote}
            >
              Salvar
            </Button>
          </div>
        </Card>
      )}
      
      <div className="space-y-3">
        {notes.length === 0 && !isAddingNote ? (
          <div className="h-20 border border-dashed rounded-md flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Nenhuma anotação registrada</span>
          </div>
        ) : (
          notes.map(note => (
            <Card key={note.id} className="p-3">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center">
                  <MessageSquareText className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.timestamp).toLocaleDateString()} às {' '}
                    {new Date(note.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                
                {note.pinned && (
                  <Pin className="h-3 w-3 text-amber-500" />
                )}
              </div>
              
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              
              <div className="text-xs text-muted-foreground mt-2">
                por {note.author}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

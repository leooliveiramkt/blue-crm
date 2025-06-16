import React, { createContext, useContext } from 'react';
import { usePreviewWindow } from '../hooks/usePreviewWindow';
import { PreviewWindow } from '../components/PreviewWindow';

interface PreviewWindowContextType {
  showPreview: (url?: string, title?: string) => void;
  hidePreview: () => void;
  updatePreview: (url: string, title?: string) => void;
  isVisible: boolean;
  url: string;
  title: string;
}

const PreviewWindowContext = createContext<PreviewWindowContextType | undefined>(undefined);

export const PreviewWindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const previewState = usePreviewWindow();

  return (
    <PreviewWindowContext.Provider value={previewState}>
      {children}
      {previewState.isVisible && (
        <PreviewWindow
          url={previewState.url}
          title={previewState.title}
        />
      )}
    </PreviewWindowContext.Provider>
  );
};

export const usePreviewWindowContext = () => {
  const context = useContext(PreviewWindowContext);
  if (!context) {
    throw new Error('usePreviewWindowContext deve ser usado dentro de um PreviewWindowProvider');
  }
  return context;
}; 
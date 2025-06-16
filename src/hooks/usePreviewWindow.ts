import { useState, useEffect } from 'react';

interface PreviewWindowState {
  isVisible: boolean;
  url: string;
  title: string;
}

const DEFAULT_STATE: PreviewWindowState = {
  isVisible: false,
  url: 'http://localhost:5173',
  title: 'Preview'
};

export const usePreviewWindow = () => {
  const [state, setState] = useState<PreviewWindowState>(DEFAULT_STATE);

  const showPreview = (url?: string, title?: string) => {
    setState({
      isVisible: true,
      url: url || DEFAULT_STATE.url,
      title: title || DEFAULT_STATE.title
    });
  };

  const hidePreview = () => {
    setState(prev => ({ ...prev, isVisible: false }));
  };

  const updatePreview = (url: string, title?: string) => {
    setState(prev => ({
      ...prev,
      url,
      title: title || prev.title
    }));
  };

  // Salvar estado no localStorage
  useEffect(() => {
    if (state.isVisible) {
      localStorage.setItem('previewWindowState', JSON.stringify(state));
    }
  }, [state]);

  // Restaurar estado do localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('previewWindowState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setState(parsedState);
      } catch (error) {
        console.error('Erro ao restaurar estado da janela de preview:', error);
      }
    }
  }, []);

  return {
    ...state,
    showPreview,
    hidePreview,
    updatePreview
  };
}; 
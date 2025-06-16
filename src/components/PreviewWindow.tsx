import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';

interface PreviewWindowProps {
  url?: string;
  title?: string;
}

export const PreviewWindow: React.FC<PreviewWindowProps> = ({
  url = 'http://localhost:5173',
  title = 'Preview'
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const refreshPreview = () => {
    setIsLoading(true);
    const iframe = document.getElementById('preview-frame') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };

    const iframe = document.getElementById('preview-frame') as HTMLIFrameElement;
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleLoad);
      }
    };
  }, []);

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 ${
        isMaximized ? 'w-[90vw] h-[90vh]' : 'w-[600px] h-[400px]'
      }`}
    >
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{title}</span>
          {isLoading && (
            <div className="animate-spin">
              <RefreshCw className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshPreview}
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMaximize}
            className="h-8 w-8"
          >
            {isMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="relative w-full h-[calc(100%-40px)]">
        <iframe
          id="preview-frame"
          src={url}
          className="w-full h-full border-0"
          title="Preview"
        />
      </div>
    </div>
  );
}; 
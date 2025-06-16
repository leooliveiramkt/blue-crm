import React from 'react';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { usePreviewWindowContext } from '../contexts/PreviewWindowContext';

interface PreviewToggleProps {
  url?: string;
  title?: string;
  className?: string;
}

export const PreviewToggle: React.FC<PreviewToggleProps> = ({
  url,
  title,
  className = ''
}) => {
  const { isVisible, showPreview, hidePreview } = usePreviewWindowContext();

  const togglePreview = () => {
    if (isVisible) {
      hidePreview();
    } else {
      showPreview(url, title);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={togglePreview}
      className={className}
      title={isVisible ? 'Ocultar Preview' : 'Mostrar Preview'}
    >
      {isVisible ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  );
}; 
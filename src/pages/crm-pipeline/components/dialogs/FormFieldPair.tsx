
import React from 'react';

interface FormFieldPairProps {
  children: React.ReactNode;
  className?: string;
}

export const FormFieldPair: React.FC<FormFieldPairProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {children}
    </div>
  );
};

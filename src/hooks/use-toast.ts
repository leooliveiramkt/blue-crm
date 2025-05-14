
import { toast as sonnerToast, type ToastT } from "sonner";
import * as React from "react";

// Definindo um tipo para garantir compatibilidade
export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning";
  duration?: number;
};

const useToast = () => {
  const toast = React.useCallback(
    ({ title, description, variant, ...props }: ToastProps) => {
      // Convertendo para o formato aceito pela biblioteca sonner
      return sonnerToast(title || "", {
        description,
        className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : 
                  variant === "success" ? "bg-green-600 text-white" :
                  variant === "warning" ? "bg-amber-500 text-white" : "",
        ...props,
      });
    },
    []
  );

  return { toast };
};

// Adaptar o toast direto para compatibilidade com o código existente
const adaptedToast = (props: ToastProps) => {
  const { title, description, variant, ...rest } = props;
  return sonnerToast(title || "", {
    description,
    className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : 
              variant === "success" ? "bg-green-600 text-white" :
              variant === "warning" ? "bg-amber-500 text-white" : "",
    ...rest,
  });
};

export { useToast, adaptedToast as toast };

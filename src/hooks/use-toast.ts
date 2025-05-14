
import { toast as sonnerToast } from "sonner";
import * as React from "react";

type ToastProps = React.ComponentProps<typeof sonnerToast>;

const useToast = () => {
  const toast = React.useCallback(
    ({ ...props }: ToastProps) => {
      return sonnerToast({ ...props });
    },
    []
  );

  return { toast };
};

export { useToast, sonnerToast as toast };

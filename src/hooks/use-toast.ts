
import { toast as sonnerToast } from "sonner";
import * as React from "react";

const useToast = () => {
  const toast = React.useCallback(
    (props: any) => {
      return sonnerToast(props);
    },
    []
  );

  return { toast };
};

export { useToast, sonnerToast as toast };

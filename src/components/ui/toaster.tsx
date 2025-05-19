
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  // Na versão mais recente do sonner, não temos mais acesso ao array 'toasts'
  // Esta é uma implementação simplificada que apenas configura o provider
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  );
}

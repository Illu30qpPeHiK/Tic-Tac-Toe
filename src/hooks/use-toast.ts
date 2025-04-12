
import { UseToastProps } from "@radix-ui/react-toast";
import {
  useToast as useToastShadcn,
  toast as toastFunction
} from "@/components/ui/toast";

// Re-export the toast function and types
export const toast = toastFunction;
export const useToast = useToastShadcn;

export type { UseToastProps };

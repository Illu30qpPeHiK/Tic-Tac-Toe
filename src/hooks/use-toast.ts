
import { type ToastProps } from "@radix-ui/react-toast"
import {
  useToast as useToastShadcn,
  toast as toastFunction,
  type ToastProps as ShadcnToastProps
} from "@/components/ui/toast"

// Re-export the toast function and types
export const toast = toastFunction
export const useToast = useToastShadcn

export type { ShadcnToastProps as UseToastProps }

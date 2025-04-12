
// Re-export the useToast hook from @/components/ui/use-toast for easy access
import { useToast as useToastOriginal } from "@/components/ui/use-toast";

// Re-export the toast function and toast type
export const { toast } = useToastOriginal;

// Export the hook
export const useToast = useToastOriginal;

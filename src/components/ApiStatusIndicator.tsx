import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { subscribeToApiStatus, ApiStatus } from "@/services/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ApiStatusIndicator() {
  const [status, setStatus] = useState<ApiStatus>('unknown');

  useEffect(() => {
    return subscribeToApiStatus(setStatus);
  }, []);

  if (status === 'unknown') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {status === 'connected' ? (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-1.5 px-3 shadow-sm hover:bg-emerald-100 transition-colors cursor-help">
                <Wifi className="h-3.5 w-3.5" />
                <span className="font-medium">API Online</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1.5 py-1.5 px-3 shadow-sm hover:bg-amber-100 transition-colors cursor-help">
                <WifiOff className="h-3.5 w-3.5" />
                <span className="font-medium">Modo Simulado</span>
              </Badge>
            )}
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            {status === 'connected' 
              ? "Conectado ao backend FastAPI local. Dados em tempo real."
              : "Backend indisponível. Exibindo dados de exemplo para demonstração."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

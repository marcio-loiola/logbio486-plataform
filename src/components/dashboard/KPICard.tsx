import { ArrowDown, ArrowRight, ArrowUp, Activity, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  status?: "success" | "warning" | "error" | "info";
  isLoading?: boolean;
  className?: string;
}

export const KPICard = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  status = "info",
  isLoading = false,
  className,
}: KPICardProps) => {
  if (isLoading) {
    return (
      <div className={cn("p-6 rounded-xl bg-white border border-slate-200 shadow-sm animate-pulse", className)}>
        <div className="h-4 w-1/2 bg-slate-200 rounded mb-4"></div>
        <div className="h-8 w-3/4 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "error":
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-blue-600 bg-blue-50 border-blue-100";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <ArrowUp className="w-4 h-4 mr-1" />;
      case "down":
        return <ArrowDown className="w-4 h-4 mr-1" />;
      default:
        return <ArrowRight className="w-4 h-4 mr-1" />;
    }
  };

  const getTrendColor = () => {
    if (trend === "neutral") return "text-slate-500";
    // Usually up is good, but for some metrics (like cost) down is good. 
    // For simplicity, let's assume green for "good" context which depends on the metric.
    // But here we'll just color based on direction for now or use the status prop to color the card.
    // Let's stick to simple logic: 
    return trend === "up" ? "text-emerald-600" : "text-red-600";
  };

  return (
    <div className={cn("p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className={cn("p-1.5 rounded-full", getStatusColor())}>
          {status === "success" && <CheckCircle className="w-4 h-4" />}
          {status === "warning" && <AlertTriangle className="w-4 h-4" />}
          {status === "error" && <Activity className="w-4 h-4" />}
          {status === "info" && <Info className="w-4 h-4" />}
        </div>
      </div>
      
      <div className="flex items-baseline mt-2">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {unit && <span className="ml-1 text-sm text-slate-500 font-medium">{unit}</span>}
      </div>

      {(trend && trendValue) && (
        <div className={cn("flex items-center mt-3 text-sm font-medium", getTrendColor())}>
          {getTrendIcon()}
          <span>{trendValue}</span>
          <span className="text-slate-400 ml-1 font-normal">vs mês anterior</span>
        </div>
      )}
    </div>
  );
};

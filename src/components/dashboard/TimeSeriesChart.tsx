import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";

interface TimeSeriesPoint {
  date: string;
  value: number;
  type: 'historical' | 'prediction';
}

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  title: string;
  description?: string;
  className?: string;
  isLoading?: boolean;
}

export const TimeSeriesChart = ({
  data,
  title,
  description,
  className,
  isLoading = false,
}: TimeSeriesChartProps) => {
  if (isLoading) {
    return (
      <div className={cn("p-6 rounded-xl bg-white border border-slate-200 shadow-sm h-[400px] animate-pulse", className)}>
        <div className="h-6 w-1/3 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-1/4 bg-slate-200 rounded mb-8"></div>
        <div className="h-[300px] w-full bg-slate-200 rounded"></div>
      </div>
    );
  }

  // Separate data for styling if needed, or just pass it through.
  // Recharts can handle mixed data if we format it right or use multiple Areas.
  // For simplicity, we'll plot one line, but maybe color it differently?
  // Recharts doesn't easily change line color mid-line without splitting data.
  // Let's split data into two series: historical and prediction.
  
  const chartData = data.map(point => ({
    date: point.date,
    historical: point.type === 'historical' ? point.value : null,
    prediction: point.type === 'prediction' ? point.value : null,
    // We need to connect the lines. The last historical point should also be the first prediction point ideally,
    // or we just accept a gap. To connect, we'd need to duplicate the point.
    // For now, let's just plot them.
  }));

  return (
    <div className={cn("p-6 rounded-xl bg-white border border-slate-200 shadow-sm", className)}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#003950" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#003950" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FACC15" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="date" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickMargin={10}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }} 
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 500 }}
              labelStyle={{ color: '#64748B', marginBottom: '4px', fontSize: '12px' }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="historical" 
              name="Dados Históricos"
              stroke="#003950" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorHistorical)" 
              connectNulls
            />
            <Area 
              type="monotone" 
              dataKey="prediction" 
              name="Predição (IA)"
              stroke="#FACC15" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorPrediction)" 
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ShipFinancial() {
  // Mock data
  const financialData = {
    fuelCost: 450000,
    cleaningRoi: 125000,
    dragLoss: -25000,
    efficiencySavings: 15000,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-500 text-sm font-medium">Custo Total de Combustível (Mês)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-[#003950]" />
            <span className="text-3xl font-bold text-[#003950]">
              {financialData.fuelCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-2">Baseado no consumo real</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-500 text-sm font-medium">ROI da Limpeza</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-emerald-600" />
            <span className="text-3xl font-bold text-emerald-600">
              {financialData.cleaningRoi.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-2">Retorno sobre investimento em manutenção</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-[#EF4444]">
        <CardHeader>
          <CardTitle className="text-slate-500 text-sm font-medium">Prejuízo por Arrasto (Estimado)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-8 w-8 text-[#EF4444]" />
            <span className="text-3xl font-bold text-[#EF4444]">
              {financialData.dragLoss.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-2">Perda devido à resistência hidrodinâmica extra</p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="text-slate-500 text-sm font-medium">Economia por Eficiência</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-[#003950]" />
            <span className="text-3xl font-bold text-[#003950]">
              {financialData.efficiencySavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-2">Economia gerada por otimização de rota</p>
        </CardContent>
      </Card>
    </div>
  );
}

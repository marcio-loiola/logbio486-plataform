import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingDown, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

export default function ShipFinancial() {
  // Mock data
  const financialData = {
    fuelCost: 450000,
    cleaningRoi: 125000,
    dragLoss: -25000,
    efficiencySavings: 15000,
    projectedSavings: 285000,
    monthlyFuelCost: 450000,
    dailyLoss: 1540,
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary Banner */}
      <Card className="border-l-4 border-l-[#FACC15] bg-gradient-to-r from-slate-50 to-white">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-2">Custo Mensal de Combustível</p>
              <p className="text-3xl font-bold text-[#003950]">
                USD {financialData.monthlyFuelCost.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-2">Prejuízo Diário Total</p>
              <p className="text-3xl font-bold text-red-600">
                R$ {financialData.dailyLoss.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-2">Economia Potencial (Anual)</p>
              <p className="text-3xl font-bold text-emerald-600">
                R$ {financialData.projectedSavings.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Metrics Grid */}
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

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Lightbulb className="h-5 w-5" />
              Sugestão: O custo de limpeza pode melhorar o custo de caudeira exponencialmente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800 text-sm">
              Uma limpeza preventiva do casco agora pode resultar em economia de até <strong>R$ 285.000</strong> nos próximos 12 meses através da redução de consumo de combustível e melhoria de eficiência operacional.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <AlertTriangle className="h-5 w-5" />
              Análise de Impacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Aumento de consumo:</span>
                <strong>+12%</strong>
              </div>
              <div className="flex justify-between">
                <span>Redução de velocidade:</span>
                <strong>-8%</strong>
              </div>
              <div className="flex justify-between">
                <span>Custo extra por viagem:</span>
                <strong>R$ 4,200</strong>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#003950]">Detalhamento de Custos (Último Trimestre)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-700 font-medium">Combustível</span>
              <span className="text-[#003950] font-bold text-lg">R$ 1,350,000</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-700 font-medium">Manutenção Preventiva</span>
              <span className="text-[#003950] font-bold text-lg">R$ 180,000</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-700 font-medium">Perdas por Ineficiência</span>
              <span className="text-red-600 font-bold text-lg">R$ 75,000</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
              <span className="text-emerald-900 font-bold text-lg">Economia Realizada</span>
              <span className="text-emerald-600 font-bold text-2xl">R$ 45,000</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

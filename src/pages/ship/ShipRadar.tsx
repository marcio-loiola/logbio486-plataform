import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AlertTriangle, TrendingUp, Activity } from 'lucide-react';

const data = [
  {
    subject: 'Velocidade',
    A: 120, // Real
    B: 110, // Projected
    fullMark: 150,
  },
  {
    subject: 'Consumo',
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Incrustação',
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Eficiência',
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: 'Emissões',
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: 'Segurança',
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

// Time series data for biofouling trend
const trendData = [
  { date: 'Jan', biofouling: 25, threshold: 60 },
  { date: 'Fev', biofouling: 32, threshold: 60 },
  { date: 'Mar', biofouling: 38, threshold: 60 },
  { date: 'Abr', biofouling: 45, threshold: 60 },
  { date: 'Mai', biofouling: 52, threshold: 60 },
  { date: 'Jun', biofouling: 58, threshold: 60 },
  { date: 'Jul', biofouling: 64, threshold: 60 },
  { date: 'Ago', biofouling: 68, threshold: 60 },
  { date: 'Set', biofouling: 72, threshold: 60 },
  { date: 'Out', biofouling: 75, threshold: 60 },
];

export default function ShipRadar() {
  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <Card className="border-l-4 border-l-red-500 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-lg mb-1">⚠️ ALERTA MODERADO: RBD (Resistência do arrasto do casco não está em níveis críticos)</h3>
              <p className="text-red-700 text-sm">
                O nível de bioincrustação está acima do limite recomendado. Agende limpeza do casco para evitar aumento no consumo de combustível e redução da eficiência operacional.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="h-[500px]">
          <CardHeader>
            <CardTitle className="text-[#003950]">Radar Operacional</CardTitle>
          </CardHeader>
          <CardContent className="h-full pb-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar
                  name="Atual"
                  dataKey="A"
                  stroke="#006159"
                  strokeWidth={3}
                  fill="#006159"
                  fillOpacity={0.2}
                />
                <Radar
                  name="Ideal"
                  dataKey="B"
                  stroke="#FACC15"
                  strokeWidth={2}
                  fill="#FACC15"
                  fillOpacity={0.1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Technical Analysis */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003950]">Análise Técnica</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                O navio apresenta um desempenho de velocidade superior ao projetado, porém com consumo ligeiramente elevado.
                O nível de bioincrustação está dentro dos limites aceitáveis, mas requer monitoramento contínuo.
              </p>
            </CardContent>
          </Card>

          {/* Operational Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#003950]">
                <Activity className="h-5 w-5" />
                Métricas Operacionais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-slate-600">Velocidade Média</span>
                  <span className="font-bold text-[#003950]">14.2 nós</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-slate-600">Consumo Diário</span>
                  <span className="font-bold text-[#003950]">28.5 t/dia</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-slate-600">Nível de Bioincrustação</span>
                  <span className="font-bold text-amber-600">75%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Eficiência do Casco</span>
                  <span className="font-bold text-emerald-600">82%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#003950]">
            <TrendingUp className="h-5 w-5" />
            Tendência de Bioincrustação (Último Ano)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="biofouling" 
                stroke="#EF4444" 
                strokeWidth={3}
                name="Nível de Bioincrustação (%)"
                dot={{ fill: '#EF4444', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="threshold" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Limite Recomendado (%)"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Recomendação:</strong> O nível de bioincrustação ultrapassou o limite recomendado em Julho. 
              Agendar limpeza de casco nas próximas 2-3 semanas para evitar degradação adicional da performance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

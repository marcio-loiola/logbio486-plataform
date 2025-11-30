import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

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

export default function ShipRadar() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#003950]">Análise Técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              O navio apresenta um desempenho de velocidade superior ao projetado, porém com consumo ligeiramente elevado.
              O nível de bioincrustação está dentro dos limites aceitáveis, mas requer monitoramento contínuo.
            </p>
          </CardContent>
        </Card>
        
        {/* Additional metrics could go here */}
      </div>
    </div>
  );
}

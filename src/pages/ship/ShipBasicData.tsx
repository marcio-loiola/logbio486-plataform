import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getShips } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, Anchor, Calendar, FileText } from 'lucide-react';

export default function ShipBasicData() {
  const { id } = useParams();
  const { data: ships, isLoading } = useQuery({
    queryKey: ['ships'],
    queryFn: getShips,
  });

  const ship = ships?.find(s => s.id.toString() === id);

  if (isLoading) return <div>Carregando...</div>;
  if (!ship) return <div>Navio não encontrado</div>;

  return (
    <div className="space-y-6">
      {/* Ship Header with Icon */}
      <Card className="border-l-4 border-l-[#FACC15]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#003950] rounded-xl flex items-center justify-center">
              <Ship className="h-12 w-12 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#003950] mb-1">{ship.name}</h2>
              <p className="text-slate-600">IMO: {ship.imo} | Classe: {ship.ship_class || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Nível 1 - Alerta</p>
              <div className="mt-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-semibold text-sm">
                Monitoramento Ativo
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#003950]">
              <Ship className="h-5 w-5" />
              Atributos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Nome do Navio</p>
                <p className="font-medium text-lg">{ship.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">IMO</p>
                <p className="font-medium text-lg">{ship.imo}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Bandeira</p>
                <p className="font-medium text-lg">Brasil</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Classe</p>
                <p className="font-medium text-lg">{ship.ship_class || 'Mercante'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Matrícula</p>
                <p className="font-medium text-lg">MT-{ship.id.toString().padStart(4, '0')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Proprietário</p>
                <p className="font-medium text-lg">Transpetro</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#003950]">
              <Anchor className="h-5 w-5" />
              Especificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Deadweight</p>
                <p className="font-medium text-lg">92,000 DWT</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Comprimento</p>
                <p className="font-medium text-lg">274 m</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Boca</p>
                <p className="font-medium text-lg">48 m</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Calado</p>
                <p className="font-medium text-lg">17.2 m</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Deslocamento</p>
                <p className="font-medium text-lg">102,000 t</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Ano Construção</p>
                <p className="font-medium text-lg">2018</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance & Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#003950]">
              <Calendar className="h-5 w-5" />
              Expedições/Processos de Recondicionamento e Docagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <p className="font-medium text-[#003950]">Última Docagem</p>
                  <p className="text-sm text-slate-500">Manutenção Preventiva</p>
                </div>
                <p className="text-slate-700 font-semibold">2024-08-15</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <p className="font-medium text-[#003950]">Próxima Prevista</p>
                  <p className="text-sm text-slate-500">Manutenção Rotineira</p>
                </div>
                <p className="text-slate-700 font-semibold">2025-02-10</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-[#003950]">Limpeza de Casco</p>
                  <p className="text-sm text-slate-500">Última realizada</p>
                </div>
                <p className="text-slate-700 font-semibold">2024-06-20</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#003950]">
              <FileText className="h-5 w-5" />
              Dados Operacionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <p className="text-slate-600">Viagens Realizadas (2024)</p>
                <p className="text-[#003950] font-bold text-lg">24</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <p className="text-slate-600">Distância Total Navegada</p>
                <p className="text-[#003950] font-bold text-lg">45,820 nm</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <p className="text-slate-600">Horas de Operação</p>
                <p className="text-[#003950] font-bold text-lg">5,240 h</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-slate-600">Eficiência Média</p>
                <p className="text-emerald-600 font-bold text-lg">87.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

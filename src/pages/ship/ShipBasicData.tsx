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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#003950]">
            <Ship className="h-5 w-5" />
            Identificação
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
              <p className="text-sm text-slate-500">Classe</p>
              <p className="font-medium text-lg">{ship.ship_class || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">ID Interno</p>
              <p className="font-medium text-lg">{ship.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#003950]">
            <Anchor className="h-5 w-5" />
            Características Técnicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             {/* Mock data as API doesn't return these yet */}
            <div>
              <p className="text-sm text-slate-500">Ano de Construção</p>
              <p className="font-medium text-lg">2018</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Bandeira</p>
              <p className="font-medium text-lg">Brasil</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Comprimento (LOA)</p>
              <p className="font-medium text-lg">274 m</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Boca</p>
              <p className="font-medium text-lg">48 m</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

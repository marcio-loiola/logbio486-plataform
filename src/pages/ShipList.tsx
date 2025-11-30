import { useQuery } from '@tanstack/react-query';
import { getShips } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ShipList() {
  const navigate = useNavigate();
  const { data: ships, isLoading } = useQuery({
    queryKey: ['ships'],
    queryFn: getShips,
  });

  if (isLoading) return <div>Carregando frota...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#003950]">Selecione um Navio</h2>
        <p className="text-slate-500">Acesse os detalhes operacionais e financeiros</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ships?.map((ship) => (
          <Card 
            key={ship.id} 
            className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-[#006159]"
            onClick={() => navigate(`/ship/${ship.id}/basic`)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-[#003950]">{ship.name}</CardTitle>
              <Ship className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-500">
                <p>IMO: {ship.imo}</p>
                <p>Classe: {ship.ship_class || 'N/A'}</p>
              </div>
              <div className="mt-4 flex items-center text-[#006159] text-sm font-medium">
                Ver Detalhes <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

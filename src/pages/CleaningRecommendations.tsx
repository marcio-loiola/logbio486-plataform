import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  getCleaningRecommendation, 
  scheduleCleaning
} from '@/services/api-integrations';
import { getShips } from '@/services/api';
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Calendar,
  CheckCircle2,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function CleaningRecommendations() {
  const [selectedShip, setSelectedShip] = useState<string>('');
  const [bioIndex, setBioIndex] = useState<string>('7.0');

  const { data: ships } = useQuery({
    queryKey: ['ships'],
    queryFn: getShips,
  });

  const { data: recommendation, isLoading, refetch } = useQuery({
    queryKey: ['cleaningRecommendation', selectedShip, bioIndex],
    queryFn: () => getCleaningRecommendation(selectedShip, parseFloat(bioIndex)),
    enabled: !!selectedShip && !!bioIndex,
  });

  const handleSchedule = async () => {
    if (!recommendation?.next_available_slot) {
      toast({
        title: 'Erro',
        description: 'Não há slot disponível para agendamento',
        variant: 'destructive',
      });
      return;
    }

    try {
      await scheduleCleaning(
        selectedShip,
        new Date(recommendation.next_available_slot),
        recommendation.cleaning_urgency === 'critical' ? 'critical' : 'normal'
      );
      toast({
        title: 'Sucesso',
        description: 'Limpeza agendada com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível agendar a limpeza',
        variant: 'destructive',
      });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#003950]">Recomendações de Limpeza</h2>
        <p className="text-slate-500">Análise inteligente e recomendações para limpeza de cascos</p>
      </div>

      {/* Selection Form */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Navio</CardTitle>
          <CardDescription>Escolha um navio e informe o índice de biofouling atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ship">Navio</Label>
              <Select value={selectedShip} onValueChange={setSelectedShip}>
                <SelectTrigger id="ship">
                  <SelectValue placeholder="Selecione um navio" />
                </SelectTrigger>
                <SelectContent>
                  {ships?.map((ship) => (
                    <SelectItem key={ship.id} value={ship.name || ship.id.toString()}>
                      {ship.name} {ship.imo && `(${ship.imo})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bioIndex">Índice de Biofouling (0-10)</Label>
              <Input
                id="bioIndex"
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="7.0"
                value={bioIndex}
                onChange={(e) => setBioIndex(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={() => refetch()}
              disabled={!selectedShip || !bioIndex}
              className="bg-[#003950] hover:bg-[#002a3b]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Buscar Recomendação
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Result */}
      {isLoading && (
        <Card>
          <CardContent className="p-12">
            <div className="flex justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-[#003950]" />
            </div>
          </CardContent>
        </Card>
      )}

      {recommendation && (
        <div className="space-y-4">
          {/* Main Recommendation Card */}
          <Card className="border-l-4 border-l-[#003950]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Recomendação para {recommendation.vessel_id}
                </CardTitle>
                <Badge className={getUrgencyColor(recommendation.cleaning_urgency)}>
                  {recommendation.cleaning_urgency === 'critical' && 'Crítico'}
                  {recommendation.cleaning_urgency === 'high' && 'Alta'}
                  {recommendation.cleaning_urgency === 'medium' && 'Média'}
                  {recommendation.cleaning_urgency === 'low' && 'Baixa'}
                </Badge>
              </div>
              <CardDescription>Análise baseada em índice de biofouling e histórico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Índice Atual</div>
                  <div className="text-3xl font-bold text-[#003950]">
                    {recommendation.biofouling_index.toFixed(2)}/10
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Economia Estimada
                  </div>
                  <div className="text-3xl font-bold text-emerald-600">
                    ${recommendation.estimated_savings.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Dias desde Limpeza</div>
                  <div className="text-3xl font-bold text-[#003950]">
                    {recommendation.days_since_cleaning || 'N/A'}
                  </div>
                </div>
              </div>

              {recommendation.recommended_action && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-blue-900 mb-1">Ação Recomendada</div>
                      <div className="text-blue-800">{recommendation.recommended_action}</div>
                    </div>
                  </div>
                </div>
              )}

              {recommendation.next_available_slot && (
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-amber-600" />
                      <div>
                        <div className="font-semibold text-amber-900">Próximo Slot Disponível</div>
                        <div className="text-amber-800">
                          {new Date(recommendation.next_available_slot).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleSchedule}
                      className="bg-[#003950] hover:bg-[#002a3b]"
                    >
                      Agendar Limpeza
                    </Button>
                  </div>
                </div>
              )}

              {recommendation.last_cleaning_date && (
                <div className="mt-4 text-sm text-slate-500">
                  Última limpeza: {new Date(recommendation.last_cleaning_date).toLocaleDateString('pt-BR')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Impact Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Impacto da Limpeza
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-sm text-emerald-700 mb-1">Economia Potencial</div>
                  <div className="text-2xl font-bold text-emerald-900">
                    ${recommendation.estimated_savings.toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">Em custos de combustível</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-700 mb-1">Urgência</div>
                  <div className="text-2xl font-bold text-blue-900 capitalize">
                    {recommendation.cleaning_urgency}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">Nível de prioridade</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!selectedShip && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-500">Selecione um navio para ver recomendações</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


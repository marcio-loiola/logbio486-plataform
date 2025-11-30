import { PredictionComponent } from '@/components/prediction/PredictionComponent';

export default function Prediction() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#003950]">Predição & Simulação</h2>
        <p className="text-slate-500">Simule cenários de rotas e preveja o impacto da bioincrustação</p>
      </div>
      
      <PredictionComponent />
    </div>
  );
}

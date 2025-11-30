import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Ship, Map, Gauge, Calendar, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { predictBiofouling, PredictionResponse, PredictionRequest, getShips } from "@/services/api";
import { TimeSeriesChart } from "@/components/dashboard/TimeSeriesChart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  ship_name: z.string().min(1, "Selecione um navio"),
  speed: z.number().min(5).max(25),
  duration: z.number().min(1).max(720), // horas
  days_since_cleaning: z.number().min(0).max(1000),
  displacement: z.number().optional(),
  mid_draft: z.number().optional(),
  beaufort_scale: z.number().min(0).max(12).optional(),
});

export const PredictionComponent = () => {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { data: ships, isLoading: isLoadingShips } = useQuery({
    queryKey: ['ships'],
    queryFn: getShips,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ship_name: "",
      speed: 14,
      duration: 24, // 24 horas = 1 dia
      days_since_cleaning: 180,
      displacement: undefined,
      mid_draft: undefined,
      beaufort_scale: 3,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      const request: PredictionRequest = {
        ship_name: values.ship_name,
        speed: values.speed,
        duration: values.duration,
        days_since_cleaning: values.days_since_cleaning,
        displacement: values.displacement,
        mid_draft: values.mid_draft,
        beaufort_scale: values.beaufort_scale,
      };

      const data = await predictBiofouling(request);
      setResult(data);
      toast({
        title: "Predição concluída",
        description: "Os dados de performance foram simulados com sucesso.",
      });
    } catch (error: any) {
      console.error('Prediction error:', error);
      toast({
        title: "Erro na predição",
        description: error?.message || "Não foi possível gerar os insights. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-5 w-5 text-primary" />
            Simulação de Rota
          </CardTitle>
          <CardDescription>
            Configure os parâmetros para prever o impacto da bioincrustação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="ship_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Navio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingShips ? "Carregando..." : "Selecione o navio"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ships && ships.length > 0 ? ships.map((ship) => (
                          <SelectItem key={ship.id} value={ship.name}>
                            {ship.name}
                          </SelectItem>
                        )) : (
                          <SelectItem value="loading" disabled>Carregando navios...</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between">
                      <span>Velocidade Média (nós)</span>
                      <span className="text-muted-foreground">{field.value} nós</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={5}
                        max={25}
                        step={0.5}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between">
                      <span>Duração da Viagem (horas)</span>
                      <span className="text-muted-foreground">{field.value}h</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={720}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      {Math.floor(field.value / 24)} dias e {field.value % 24} horas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="days_since_cleaning"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between">
                      <span>Dias desde última limpeza</span>
                      <span className="text-muted-foreground">{field.value} dias</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1000}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Simulando...
                  </>
                ) : (
                  "Gerar Predição"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        {result ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Consumo Previsto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{result.predicted_consumption.toFixed(2)} ton</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Consumo base: {result.baseline_consumption.toFixed(2)} ton
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Índice de Biofouling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn("text-2xl font-bold", 
                    result.bio_index >= 7 ? "text-red-600" : 
                    result.bio_index >= 4 ? "text-amber-600" : "text-emerald-600"
                  )}>
                    {result.bio_index.toFixed(1)}/10
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Classificação: {result.bio_class}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Custo Adicional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    ${result.additional_cost_usd.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +{result.additional_fuel_tons.toFixed(2)} ton de combustível
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Excesso de Consumo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(result.excess_ratio * 100).toFixed(2)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Acima do consumo teórico
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Emissões Adicionais CO₂
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">
                    {result.additional_co2_tons.toFixed(2)} ton
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Impacto ambiental
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Activity className="h-12 w-12 mb-4 opacity-20" />
            <p>Preencha os parâmetros e gere uma simulação para visualizar os resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
};


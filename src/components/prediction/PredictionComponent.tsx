import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Ship, Map, Gauge, Calendar, Activity } from "lucide-react";
import { generateInsight, PredictionResult, PredictionParams } from "@/services/api";
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
  shipId: z.string().min(1, "Selecione um navio"),
  routeId: z.string().min(1, "Selecione uma rota"),
  speed: z.number().min(5).max(25),
  days: z.number().min(1).max(60),
});

export const PredictionComponent = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipId: "",
      routeId: "",
      speed: 14,
      days: 30,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const data = await generateInsight(values as PredictionParams);
      setResult(data);
      toast({
        title: "Predição concluída",
        description: "Os dados de performance foram simulados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na predição",
        description: "Não foi possível gerar os insights. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
                name="shipId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Navio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o navio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ship-001">Navio Alpha (Petroleiro)</SelectItem>
                        <SelectItem value="ship-002">Navio Beta (Gaseiro)</SelectItem>
                        <SelectItem value="ship-003">Navio Gamma (Petroleiro)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="routeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rota</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a rota" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="route-br-cn">Brasil - China</SelectItem>
                        <SelectItem value="route-br-eu">Brasil - Europa</SelectItem>
                        <SelectItem value="route-cbt">Cabotagem Nacional</SelectItem>
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
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between">
                      <span>Duração (dias)</span>
                      <span className="text-muted-foreground">{field.value} dias</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={60}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
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
                    Consumo Estimado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{result.fuelConsumption.toFixed(0)} ton</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Para a rota completa
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Risco de Bioincrustação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn("text-2xl font-bold", 
                    result.biofoulingRisk > 70 ? "text-red-600" : 
                    result.biofoulingRisk > 40 ? "text-amber-600" : "text-emerald-600"
                  )}>
                    {result.biofoulingRisk.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Probabilidade de acúmulo
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Próxima Manutenção
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Date(result.maintenanceDate).toLocaleDateString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Data recomendada
                  </p>
                </CardContent>
              </Card>
            </div>

            <TimeSeriesChart
              title="Projeção de Eficiência do Casco"
              description="Decaimento da performance ao longo do tempo devido à bioincrustação"
              data={result.chartData}
            />
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


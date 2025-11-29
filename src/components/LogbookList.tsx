import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Ship, Fuel, Navigation, Droplets, Thermometer } from 'lucide-react';
import { format } from 'date-fns';

export default function LogbookList() {
  const { entries, loading } = useAppSelector((state) => state.logbook);

  const getBiofoulingColor = (level?: string) => {
    switch (level) {
      case 'none':
        return 'bg-green-eco text-white';
      case 'light':
        return 'bg-teal-bright text-white';
      case 'moderate':
        return 'bg-yellow-500 text-white';
      case 'heavy':
        return 'bg-red-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Ship className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No logbook entries yet. Create your first entry to start tracking.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Logbook History</h2>
        <p className="text-sm text-muted-foreground">Recent vessel operational records</p>
      </div>
      
      {entries.map((entry) => (
        <Card key={entry.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5" />
                  {entry.vessel_name}
                </CardTitle>
                <CardDescription>
                  {format(new Date(entry.entry_date), 'PPP')}
                </CardDescription>
              </div>
              {entry.biofouling_level && (
                <Badge className={getBiofoulingColor(entry.biofouling_level)}>
                  {entry.biofouling_level}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-ocean-medium" />
                <span className="text-muted-foreground">Velocity:</span>
                <span className="font-medium">{entry.velocity} kn</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-ocean-medium" />
                <span className="text-muted-foreground">Fuel:</span>
                <span className="font-medium">{entry.fuel_consumption} L/MT</span>
              </div>
              {entry.water_temperature && (
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-ocean-medium" />
                  <span className="text-muted-foreground">Temp:</span>
                  <span className="font-medium">{entry.water_temperature}°C</span>
                </div>
              )}
              {entry.salinity && (
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-ocean-medium" />
                  <span className="text-muted-foreground">Salinity:</span>
                  <span className="font-medium">{entry.salinity} PSU</span>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="text-sm">
              <p className="text-muted-foreground mb-1">Route:</p>
              <p className="font-medium">{entry.route}</p>
            </div>

            {entry.observations && (
              <>
                <Separator />
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Observations:</p>
                  <p className="text-foreground">{entry.observations}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

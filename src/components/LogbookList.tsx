import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { getLogbooks } from '@/services/api';

export default function LogbookList() {
  const { data: entries, isLoading } = useQuery({
    queryKey: ['logbooks'],
    queryFn: getLogbooks,
  });

  if (isLoading) {
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

  if (!entries || entries.length === 0) {
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
                  Ship ID: {entry.ship_id}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(entry.date), 'PPP p')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-1" />
              <p className="text-sm text-foreground">{entry.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

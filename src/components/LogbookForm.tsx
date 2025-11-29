import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/store/hooks';
import { addEntry } from '@/store/slices/logbookSlice';

const logbookSchema = z.object({
  vessel_name: z.string().trim().min(1, 'Vessel name is required').max(100, 'Vessel name too long'),
  entry_date: z.string().min(1, 'Entry date is required'),
  velocity: z.string().min(1, 'Velocity is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Velocity must be a positive number',
  }),
  fuel_consumption: z.string().min(1, 'Fuel consumption is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Fuel consumption must be a positive number',
  }),
  route: z.string().trim().min(1, 'Route is required').max(500, 'Route description too long'),
  distance_traveled: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
    message: 'Distance must be a positive number',
  }),
  water_temperature: z.string().optional().refine((val) => !val || !isNaN(Number(val)), {
    message: 'Water temperature must be a number',
  }),
  salinity: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
    message: 'Salinity must be a positive number',
  }),
  biofouling_level: z.enum(['none', 'light', 'moderate', 'heavy']).optional(),
  observations: z.string().max(2000, 'Observations too long').optional(),
});

type LogbookFormValues = z.infer<typeof logbookSchema>;

interface LogbookFormProps {
  onSuccess: () => void;
}

export default function LogbookForm({ onSuccess }: LogbookFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const form = useForm<LogbookFormValues>({
    resolver: zodResolver(logbookSchema),
    defaultValues: {
      vessel_name: '',
      entry_date: new Date().toISOString().split('T')[0],
      velocity: '',
      fuel_consumption: '',
      route: '',
      distance_traveled: '',
      water_temperature: '',
      salinity: '',
      observations: '',
    },
  });

  const onSubmit = async (values: LogbookFormValues) => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in', variant: 'destructive' });
      setLoading(false);
      return;
    }

    const entryData = {
      user_id: user.id,
      vessel_name: values.vessel_name,
      entry_date: new Date(values.entry_date).toISOString(),
      velocity: parseFloat(values.velocity),
      fuel_consumption: parseFloat(values.fuel_consumption),
      route: values.route,
      distance_traveled: values.distance_traveled ? parseFloat(values.distance_traveled) : null,
      water_temperature: values.water_temperature ? parseFloat(values.water_temperature) : null,
      salinity: values.salinity ? parseFloat(values.salinity) : null,
      biofouling_level: values.biofouling_level || null,
      observations: values.observations || null,
    };

    const { data, error } = await supabase
      .from('logbook_entries')
      .insert([entryData])
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Logbook entry created successfully' });
      dispatch(addEntry(data));
      form.reset();
      onSuccess();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logbook Entry Form</CardTitle>
        <CardDescription>Fill in the operational data for your vessel</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vessel_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vessel Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vessel name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entry_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="velocity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Velocity (knots) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuel_consumption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Consumption (L/MT) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="route"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route *</FormLabel>
                  <FormControl>
                    <Input placeholder="Port A to Port B" {...field} />
                  </FormControl>
                  <FormDescription>Origin to destination route</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distance_traveled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance Traveled (nautical miles)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="water_temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Water Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="0.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salinity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salinity (PSU)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="0.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="biofouling_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biofouling Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select biofouling level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observations</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes and observations..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Any relevant notes about the voyage</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Entry'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

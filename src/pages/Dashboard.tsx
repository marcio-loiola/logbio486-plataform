import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAuth } from '@/store/slices/authSlice';
import { setEntries, setLoading } from '@/store/slices/logbookSlice';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';
import LogbookForm from '@/components/LogbookForm';
import LogbookList from '@/components/LogbookList';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      dispatch(setAuth({ user: session?.user ?? null, session }));
      if (!session) {
        navigate('/auth');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setAuth({ user: session?.user ?? null, session }));
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    dispatch(setLoading(true));
    const { data, error } = await supabase
      .from('logbook_entries')
      .select('*')
      .order('entry_date', { ascending: false });

    dispatch(setLoading(false));

    if (error) {
      toast({ title: 'Error', description: 'Failed to load logbook entries', variant: 'destructive' });
    } else {
      dispatch(setEntries(data || []));
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">LogBio Platform</h1>
            <p className="text-sm text-muted-foreground">Biofouling Management System</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                New Logbook Entry
              </h2>
              <p className="text-sm text-muted-foreground">
                Record vessel operational data and observations
              </p>
            </div>
            <LogbookForm onSuccess={loadEntries} />
          </div>
          <div>
            <LogbookList />
          </div>
        </div>
      </main>
    </div>
  );
}

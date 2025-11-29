-- Create logbook entries table for storing vessel operational data
CREATE TABLE public.logbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vessel_name TEXT NOT NULL,
  entry_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Operational data
  velocity DECIMAL(10, 2) NOT NULL, -- in knots
  fuel_consumption DECIMAL(10, 2) NOT NULL, -- in liters or metric tons
  route TEXT NOT NULL,
  distance_traveled DECIMAL(10, 2), -- in nautical miles
  
  -- Environmental data
  water_temperature DECIMAL(5, 2), -- in celsius
  salinity DECIMAL(5, 2), -- in PSU (Practical Salinity Units)
  
  -- Observations and notes
  observations TEXT,
  biofouling_level TEXT CHECK (biofouling_level IN ('none', 'light', 'moderate', 'heavy')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.logbook_entries ENABLE ROW LEVEL SECURITY;

-- Users can view their own entries
CREATE POLICY "Users can view their own logbook entries"
  ON public.logbook_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own entries
CREATE POLICY "Users can create their own logbook entries"
  ON public.logbook_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own entries
CREATE POLICY "Users can update their own logbook entries"
  ON public.logbook_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own entries
CREATE POLICY "Users can delete their own logbook entries"
  ON public.logbook_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_logbook_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_logbook_entries_updated_at
  BEFORE UPDATE ON public.logbook_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_logbook_updated_at();

-- Create indexes for better query performance
CREATE INDEX idx_logbook_entries_user_id ON public.logbook_entries(user_id);
CREATE INDEX idx_logbook_entries_entry_date ON public.logbook_entries(entry_date DESC);
CREATE INDEX idx_logbook_entries_vessel_name ON public.logbook_entries(vessel_name);
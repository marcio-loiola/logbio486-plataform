import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ApiTest from "./pages/ApiTest";
import NotFound from "./pages/NotFound";

// Layouts
import { MainLayout } from "./layouts/MainLayout";
import { ShipLayout } from "./layouts/ShipLayout";

// Pages
import FleetOverview from "./pages/FleetOverview";
import Prediction from "./pages/Prediction";
import ShipList from "./pages/ShipList";
import ShipBasicData from "./pages/ship/ShipBasicData";
import ShipRadar from "./pages/ship/ShipRadar";
import ShipFinancial from "./pages/ship/ShipFinancial";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Main App Routes with Sidebar */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<FleetOverview />} />
              <Route path="/prediction" element={<Prediction />} />
              
              <Route path="/ship" element={<ShipList />} />
              
              {/* Ship Details Routes */}
              <Route path="/ship/:id" element={<ShipLayout />}>
                <Route index element={<Navigate to="basic" replace />} />
                <Route path="basic" element={<ShipBasicData />} />
                <Route path="radar" element={<ShipRadar />} />
                <Route path="financial" element={<ShipFinancial />} />
              </Route>
            </Route>

            <Route path="/api-test" element={<ApiTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;

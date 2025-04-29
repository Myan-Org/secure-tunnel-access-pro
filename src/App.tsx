
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VpnProvider } from "./context/VpnContext";

// Pages
import HomePage from "./pages/Home";
import ServersPage from "./pages/Servers";
import StatusPage from "./pages/Status";
import AccountPage from "./pages/Account";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminServers from "./pages/admin/Servers";
import AdminKeys from "./pages/admin/Keys";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VpnProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/servers" element={<ServersPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/servers" element={<AdminServers />} />
            <Route path="/admin/keys" element={<AdminKeys />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </VpnProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

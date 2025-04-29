
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

// For mobile platform detection
import { usePlatform } from "./hooks/use-platform";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Define App component with all providers
const AppContent = () => {
  const platform = usePlatform();
  
  useEffect(() => {
    // Apply mobile-specific styles when running on mobile
    if (platform !== 'web') {
      document.body.classList.add('capacitor-app');
      // Set safe areas for iOS devices
      if (platform === 'ios') {
        document.body.classList.add('ios-device');
      }
    }
  }, [platform]);

  return (
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
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;

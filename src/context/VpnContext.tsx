import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VpnServer, VpnConnectionState, UserSubscription, VpnServersByCountry } from '../types/vpn';
import { toast } from 'sonner';

interface VpnContextType {
  serversByCountry: VpnServersByCountry[];
  servers: VpnServer[];
  connectionState: VpnConnectionState;
  subscription: UserSubscription;
  isLoading: boolean;
  selectedServer: VpnServer | null;
  connectToServer: (server: VpnServer) => Promise<void>;
  disconnectVpn: () => void;
  upgradeSubscription: () => void;
  selectServer: (server: VpnServer) => void;
}

const VpnContext = createContext<VpnContextType | undefined>(undefined);

export const useVpn = () => {
  const context = useContext(VpnContext);
  if (context === undefined) {
    throw new Error('useVpn must be used within a VpnProvider');
  }
  return context;
};

export const VpnProvider = ({ children }: { children: ReactNode }) => {
  const [servers, setServers] = useState<VpnServer[]>([]);
  const [serversByCountry, setServersByCountry] = useState<VpnServersByCountry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedServer, setSelectedServer] = useState<VpnServer | null>(null);
  const [connectionState, setConnectionState] = useState<VpnConnectionState>({
    isConnected: false,
    isConnecting: false
  });
  const [subscription, setSubscription] = useState<UserSubscription>({
    tier: 'free',
    active: true
  });
  
  // Store the interval ID outside of the connection state
  const [trafficUpdateInterval, setTrafficUpdateInterval] = useState<number | null>(null);

  // Mock server data - reduced to 4 countries
  useEffect(() => {
    const loadServers = async () => {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockServers: VpnServer[] = [
        // United States servers
        {
          id: '1',
          name: 'US East',
          location: 'New York',
          country: 'United States',
          countryCode: 'us',
          status: 'online',
          tier: 'free',
          ping: 120,
          load: 65,
          coreType: 'xray'
        },
        {
          id: '2',
          name: 'US West',
          location: 'San Francisco',
          country: 'United States',
          countryCode: 'us',
          status: 'online',
          tier: 'free',
          ping: 140,
          load: 55,
          coreType: 'v2fly'
        },
        // Japan servers
        {
          id: '3',
          name: 'Japan Central',
          location: 'Tokyo',
          country: 'Japan',
          countryCode: 'jp',
          status: 'online',
          tier: 'free',
          ping: 180,
          load: 45,
          coreType: 'v2fly'
        },
        {
          id: '4',
          name: 'Japan South',
          location: 'Osaka',
          country: 'Japan',
          countryCode: 'jp',
          status: 'online',
          tier: 'premium',
          ping: 160,
          load: 40,
          coreType: 'xray'
        },
        // Germany server
        {
          id: '5',
          name: 'Germany',
          location: 'Frankfurt',
          country: 'Germany',
          countryCode: 'de',
          status: 'online',
          tier: 'free',
          ping: 90,
          load: 30,
          coreType: 'xray'
        },
        // UK server
        {
          id: '6',
          name: 'UK London',
          location: 'London',
          country: 'United Kingdom',
          countryCode: 'gb',
          status: 'online',
          tier: 'premium',
          ping: 85,
          load: 20,
          coreType: 'v2fly'
        },
      ];
      
      setServers(mockServers);
      
      // Group servers by country
      const groupedServers: VpnServersByCountry[] = [];
      mockServers.forEach(server => {
        const existingCountry = groupedServers.find(
          item => item.countryCode === server.countryCode
        );
        
        if (existingCountry) {
          existingCountry.servers.push(server);
        } else {
          groupedServers.push({
            country: server.country,
            countryCode: server.countryCode,
            servers: [server]
          });
        }
      });
      
      setServersByCountry(groupedServers);
      setIsLoading(false);
    };
    
    loadServers();
  }, []);

  const selectServer = (server: VpnServer) => {
    setSelectedServer(server);
  };

  const connectToServer = async (server: VpnServer) => {
    // Check if user can connect to this server based on subscription
    if (server.tier === 'premium' && subscription.tier === 'free') {
      toast.error('Premium subscription required to connect to this server');
      return;
    }
    
    // Check if server is online
    if (server.status !== 'online') {
      toast.error(`Server ${server.name} is currently ${server.status}`);
      return;
    }
    
    setConnectionState({
      ...connectionState,
      isConnecting: true
    });
    
    // Simulate connection process
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setConnectionState({
        isConnected: true,
        isConnecting: false,
        currentServer: server,
        startTime: new Date(),
        bytesUp: 0,
        bytesDown: 0
      });
      
      toast.success(`Connected to ${server.name}`);
      
      // Simulate traffic data updates
      const intervalId = window.setInterval(() => {
        setConnectionState(prev => ({
          ...prev,
          bytesUp: (prev.bytesUp || 0) + Math.floor(Math.random() * 50000),
          bytesDown: (prev.bytesDown || 0) + Math.floor(Math.random() * 80000)
        }));
      }, 3000);
      
      // Store the interval ID so we can clean it up later
      setTrafficUpdateInterval(intervalId);
    } catch (error) {
      toast.error('Failed to connect to VPN server');
      setConnectionState({
        isConnected: false,
        isConnecting: false
      });
    }
  };

  const disconnectVpn = () => {
    // Clear the traffic update interval if it exists
    if (trafficUpdateInterval !== null) {
      window.clearInterval(trafficUpdateInterval);
      setTrafficUpdateInterval(null);
    }
    
    setConnectionState({
      isConnected: false,
      isConnecting: false
    });
    toast.info('Disconnected from VPN server');
  };

  const upgradeSubscription = () => {
    // In a real app, this would redirect to a payment page
    toast.info('Redirecting to upgrade page...');
    // For demo purposes, simulate instant upgrade
    setTimeout(() => {
      setSubscription({
        tier: 'premium',
        active: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      });
      toast.success('Upgraded to Premium subscription!');
    }, 1500);
  };

  return (
    <VpnContext.Provider
      value={{
        servers,
        serversByCountry,
        connectionState,
        subscription,
        isLoading,
        selectedServer,
        connectToServer,
        disconnectVpn,
        upgradeSubscription,
        selectServer
      }}
    >
      {children}
    </VpnContext.Provider>
  );
};

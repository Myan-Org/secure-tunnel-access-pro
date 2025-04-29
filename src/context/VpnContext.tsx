
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VpnServer, VpnConnectionState, UserSubscription } from '../types/vpn';
import { toast } from 'sonner';

interface VpnContextType {
  servers: VpnServer[];
  connectionState: VpnConnectionState;
  subscription: UserSubscription;
  isLoading: boolean;
  connectToServer: (server: VpnServer) => Promise<void>;
  disconnectVpn: () => void;
  upgradeSubscription: () => void;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionState, setConnectionState] = useState<VpnConnectionState>({
    isConnected: false,
    isConnecting: false
  });
  const [subscription, setSubscription] = useState<UserSubscription>({
    tier: 'free',
    active: true
  });

  // Mock server data
  useEffect(() => {
    const loadServers = async () => {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockServers: VpnServer[] = [
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
          id: '3',
          name: 'Germany',
          location: 'Frankfurt',
          country: 'Germany',
          countryCode: 'de',
          status: 'offline',
          tier: 'free',
          ping: 90,
          load: 30,
          coreType: 'xray'
        },
        {
          id: '4',
          name: 'UK London',
          location: 'London',
          country: 'United Kingdom',
          countryCode: 'gb',
          status: 'maintenance',
          tier: 'premium',
          ping: 85,
          load: 20,
          coreType: 'v2fly'
        },
        {
          id: '5',
          name: 'Singapore',
          location: 'Singapore',
          country: 'Singapore',
          countryCode: 'sg',
          status: 'online',
          tier: 'premium',
          ping: 140,
          load: 50,
          coreType: 'xray'
        },
        {
          id: '6',
          name: 'Australia',
          location: 'Sydney',
          country: 'Australia',
          countryCode: 'au',
          status: 'online',
          tier: 'premium',
          ping: 200,
          load: 35,
          coreType: 'v2fly'
        },
      ];
      
      setServers(mockServers);
      setIsLoading(false);
    };
    
    loadServers();
  }, []);

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
      const intervalId = setInterval(() => {
        setConnectionState(prev => ({
          ...prev,
          bytesUp: (prev.bytesUp || 0) + Math.floor(Math.random() * 50000),
          bytesDown: (prev.bytesDown || 0) + Math.floor(Math.random() * 80000)
        }));
      }, 3000);
      
      // Cleanup interval on disconnect
      return () => clearInterval(intervalId);
    } catch (error) {
      toast.error('Failed to connect to VPN server');
      setConnectionState({
        isConnected: false,
        isConnecting: false
      });
    }
  };

  const disconnectVpn = () => {
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
        connectionState,
        subscription,
        isLoading,
        connectToServer,
        disconnectVpn,
        upgradeSubscription
      }}
    >
      {children}
    </VpnContext.Provider>
  );
};

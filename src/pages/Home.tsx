
import React from 'react';
import Layout from '../components/Layout';
import { useVpn } from '../context/VpnContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Wifi, Server, Globe, ChevronRight } from 'lucide-react';
import ConnectionStatus from '../components/ConnectionStatus';
import SubscriptionBanner from '../components/SubscriptionBanner';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

const HomePage: React.FC = () => {
  const { 
    connectionState, 
    disconnectVpn, 
    subscription,
    upgradeSubscription,
    isLoading,
    servers
  } = useVpn();
  const navigate = useNavigate();
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  const premiumServers = servers.filter(server => server.tier === 'premium');
  const freeServers = servers.filter(server => server.tier === 'free');
  const onlineServers = servers.filter(server => server.status === 'online');
  
  return (
    <Layout title="SecureTunnel VPN">
      <div className="space-y-6">
        <ConnectionStatus 
          connectionState={connectionState}
          onDisconnect={disconnectVpn}
        />
        
        <SubscriptionBanner 
          subscription={subscription}
          onUpgrade={upgradeSubscription}
        />
        
        {!connectionState.isConnected && !connectionState.isConnecting && (
          <Card className="overflow-hidden">
            <div className="bg-vpn-purple/10 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Shield className="text-vpn-purple" size={24} />
                  Quick Connect
                </h2>
                <p className="text-sm text-muted-foreground">Connect to fastest available server</p>
              </div>
              <Button 
                onClick={() => navigate('/servers')}
                className="bg-vpn-purple hover:bg-vpn-dark-purple"
              >
                Connect
              </Button>
            </div>
          </Card>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="bg-vpn-light-purple rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Server className="text-vpn-purple" size={20} />
              </div>
              <h3 className="font-semibold">{onlineServers.length}</h3>
              <p className="text-xs text-muted-foreground">Available Servers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="bg-vpn-light-purple rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Globe className="text-vpn-purple" size={20} />
              </div>
              <h3 className="font-semibold">{freeServers.length + premiumServers.length}</h3>
              <p className="text-xs text-muted-foreground">Global Locations</p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Server Locations</h2>
            <Button 
              variant="ghost" 
              className="text-vpn-purple flex items-center gap-1 text-sm h-8 px-2"
              onClick={() => navigate('/servers')}
            >
              See all <ChevronRight size={16} />
            </Button>
          </div>
          
          <div className="space-y-2">
            {servers.slice(0, 3).map(server => (
              <div key={server.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {server.status === 'online' ? (
                    <Wifi className="text-green-500" size={16} />
                  ) : (
                    <Wifi className="text-gray-300" size={16} />
                  )}
                  <div>
                    <p className="font-medium">{server.name}</p>
                    <p className="text-xs text-muted-foreground">{server.location}</p>
                  </div>
                </div>
                {server.tier === 'premium' && (
                  <div className="px-2 py-1 bg-vpn-purple/10 text-vpn-purple text-xs rounded-full font-medium">
                    Premium
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

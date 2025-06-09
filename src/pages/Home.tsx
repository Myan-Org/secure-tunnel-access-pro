
import React from 'react';
import Layout from '../components/Layout';
import { useVpn } from '../context/VpnContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Server, Globe, ChevronRight, MapPin, Zap } from 'lucide-react';
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
          <Card className="overflow-hidden bg-gradient-to-br from-vpn-purple/5 via-vpn-light-purple/20 to-vpn-purple/10 border-vpn-purple/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-vpn-purple/10 rounded-full p-3">
                    <Shield className="text-vpn-purple" size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Quick Connect</h2>
                    <p className="text-sm text-muted-foreground">Connect to the fastest available server</p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/servers')}
                  className="bg-vpn-purple hover:bg-vpn-dark-purple text-white px-6 py-3 rounded-xl font-medium"
                  size="lg"
                >
                  <Zap className="mr-2" size={20} />
                  Connect Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-green-50 rounded-full p-3">
                  <Server className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{onlineServers.length}</h3>
                  <p className="text-sm text-muted-foreground">Online Servers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-blue-50 rounded-full p-3">
                  <Globe className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{freeServers.length + premiumServers.length}</h3>
                  <p className="text-sm text-muted-foreground">Global Locations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">Popular Locations</h2>
              <Button 
                variant="ghost" 
                className="text-vpn-purple hover:text-vpn-dark-purple hover:bg-vpn-light-purple/50 flex items-center gap-2"
                onClick={() => navigate('/servers')}
              >
                View All <ChevronRight size={16} />
              </Button>
            </div>
            
            <div className="space-y-3">
              {servers.slice(0, 3).map(server => (
                <div key={server.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-vpn-light-purple rounded-full p-2">
                      <MapPin className="text-vpn-purple" size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{server.name}</p>
                      <p className="text-sm text-muted-foreground">{server.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {server.tier === 'premium' && (
                      <div className="px-3 py-1 bg-vpn-purple/10 text-vpn-purple text-xs rounded-full font-medium">
                        Premium
                      </div>
                    )}
                    <div className={`w-2 h-2 rounded-full ${server.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default HomePage;

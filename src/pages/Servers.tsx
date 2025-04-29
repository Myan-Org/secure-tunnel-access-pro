
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useVpn } from '../context/VpnContext';
import ServerCard from '../components/ServerCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from 'lucide-react';
import ConnectionStatus from '../components/ConnectionStatus';
import LoadingScreen from '../components/LoadingScreen';

const ServersPage: React.FC = () => {
  const { 
    servers, 
    connectionState, 
    connectToServer, 
    disconnectVpn,
    subscription,
    isLoading
  } = useVpn();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  const premiumServers = servers.filter(server => server.tier === 'premium');
  const freeServers = servers.filter(server => server.tier === 'free');
  
  const filteredServers = servers.filter(server => 
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.country.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPremiumServers = premiumServers.filter(server =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.country.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredFreeServers = freeServers.filter(server =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.country.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout title="VPN Servers">
      <ConnectionStatus 
        connectionState={connectionState}
        onDisconnect={disconnectVpn}
      />
      
      <div className="mb-4 relative">
        <Search 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
        />
        <Input 
          placeholder="Search servers..." 
          className="pl-10"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="all" className="flex-1">All Servers</TabsTrigger>
          <TabsTrigger value="free" className="flex-1">Free</TabsTrigger>
          <TabsTrigger value="premium" className="flex-1">Premium</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredServers.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No servers found</p>
          ) : (
            filteredServers.map(server => (
              <ServerCard 
                key={server.id} 
                server={server} 
                onConnect={connectToServer}
                isCurrentServer={connectionState.currentServer?.id === server.id}
                isConnecting={connectionState.isConnecting}
                disabled={
                  server.tier === 'premium' && 
                  subscription.tier === 'free'
                }
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="free" className="space-y-4">
          {filteredFreeServers.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No free servers found</p>
          ) : (
            filteredFreeServers.map(server => (
              <ServerCard 
                key={server.id} 
                server={server} 
                onConnect={connectToServer}
                isCurrentServer={connectionState.currentServer?.id === server.id}
                isConnecting={connectionState.isConnecting}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="premium" className="space-y-4">
          {filteredPremiumServers.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No premium servers found</p>
          ) : (
            filteredPremiumServers.map(server => (
              <ServerCard 
                key={server.id} 
                server={server} 
                onConnect={connectToServer}
                isCurrentServer={connectionState.currentServer?.id === server.id}
                isConnecting={connectionState.isConnecting}
                disabled={subscription.tier === 'free'}
              />
            ))
          )}
          
          {subscription.tier === 'free' && (
            <div className="bg-vpn-light-purple p-4 rounded-lg text-center">
              <p className="text-vpn-purple font-medium">Upgrade to Premium to access these servers</p>
              <button 
                className="mt-2 text-sm text-vpn-purple underline"
                onClick={() => console.log('Navigate to upgrade page')}
              >
                View Premium Plans
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default ServersPage;

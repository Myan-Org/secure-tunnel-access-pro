
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useVpn } from '../context/VpnContext';
import ServerCard from '../components/ServerCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import ConnectionStatus from '../components/ConnectionStatus';
import LoadingScreen from '../components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ServersPage: React.FC = () => {
  const { 
    serversByCountry,
    connectionState, 
    connectToServer, 
    disconnectVpn,
    subscription,
    isLoading
  } = useVpn();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  const toggleCountryExpanded = (countryCode: string) => {
    setExpandedCountries(prev => ({
      ...prev,
      [countryCode]: !prev[countryCode]
    }));
  };
  
  // Filter servers by search term
  const filteredServersByCountry = serversByCountry.map(country => ({
    ...country,
    servers: country.servers.filter(server => 
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.country.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(country => country.servers.length > 0);

  // Filter by tier for tab content
  const getFreeServersByCountry = () => filteredServersByCountry.map(country => ({
    ...country,
    servers: country.servers.filter(server => server.tier === 'free')
  })).filter(country => country.servers.length > 0);
  
  const getPremiumServersByCountry = () => filteredServersByCountry.map(country => ({
    ...country,
    servers: country.servers.filter(server => server.tier === 'premium')
  })).filter(country => country.servers.length > 0);
  
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
          {filteredServersByCountry.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No servers found</p>
          ) : (
            filteredServersByCountry.map(countryGroup => (
              <div key={countryGroup.countryCode} className="border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  onClick={() => toggleCountryExpanded(countryGroup.countryCode)}
                  className="w-full flex justify-between items-center p-3 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">{countryGroup.country}</span>
                    <span className="text-sm text-muted-foreground">({countryGroup.servers.length} servers)</span>
                  </div>
                  {expandedCountries[countryGroup.countryCode] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
                <div className={cn("space-y-2 p-3", !expandedCountries[countryGroup.countryCode] && "hidden")}>
                  {countryGroup.servers.map(server => (
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
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="free" className="space-y-4">
          {getFreeServersByCountry().length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No free servers found</p>
          ) : (
            getFreeServersByCountry().map(countryGroup => (
              <div key={countryGroup.countryCode} className="border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  onClick={() => toggleCountryExpanded(countryGroup.countryCode)}
                  className="w-full flex justify-between items-center p-3 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">{countryGroup.country}</span>
                    <span className="text-sm text-muted-foreground">({countryGroup.servers.length} servers)</span>
                  </div>
                  {expandedCountries[countryGroup.countryCode] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
                <div className={cn("space-y-2 p-3", !expandedCountries[countryGroup.countryCode] && "hidden")}>
                  {countryGroup.servers.map(server => (
                    <ServerCard 
                      key={server.id} 
                      server={server} 
                      onConnect={connectToServer}
                      isCurrentServer={connectionState.currentServer?.id === server.id}
                      isConnecting={connectionState.isConnecting}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="premium" className="space-y-4">
          {getPremiumServersByCountry().length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No premium servers found</p>
          ) : (
            getPremiumServersByCountry().map(countryGroup => (
              <div key={countryGroup.countryCode} className="border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  onClick={() => toggleCountryExpanded(countryGroup.countryCode)}
                  className="w-full flex justify-between items-center p-3 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">{countryGroup.country}</span>
                    <span className="text-sm text-muted-foreground">({countryGroup.servers.length} servers)</span>
                  </div>
                  {expandedCountries[countryGroup.countryCode] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
                <div className={cn("space-y-2 p-3", !expandedCountries[countryGroup.countryCode] && "hidden")}>
                  {countryGroup.servers.map(server => (
                    <ServerCard 
                      key={server.id} 
                      server={server} 
                      onConnect={connectToServer}
                      isCurrentServer={connectionState.currentServer?.id === server.id}
                      isConnecting={connectionState.isConnecting}
                      disabled={subscription.tier === 'free'}
                    />
                  ))}
                </div>
              </div>
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

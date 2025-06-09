
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useVpn } from '../context/VpnContext';
import ServerCard from '../components/ServerCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import ConnectionStatus from '../components/ConnectionStatus';
import LoadingScreen from '../components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Country flag component with improved styling
const CountryFlag = ({ countryCode }: { countryCode: string }) => {
  const getFlagColor = (code: string) => {
    switch (code.toLowerCase()) {
      case 'us': return 'text-blue-600';
      case 'jp': return 'text-red-500';
      case 'de': return 'text-yellow-500';
      case 'gb': return 'text-red-600';
      case 'sg': return 'text-red-500';
      case 'au': return 'text-green-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-muted/50 rounded-full p-2">
      <MapPin className={cn("", getFlagColor(countryCode))} size={18} />
    </div>
  );
};

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
  
  const renderCountryGroup = (countryGroup: any) => (
    <div key={countryGroup.countryCode} className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm">
      <Button
        variant="ghost"
        onClick={() => toggleCountryExpanded(countryGroup.countryCode)}
        className="w-full flex justify-between items-center p-4 hover:bg-muted/30 rounded-none"
      >
        <div className="flex items-center gap-3">
          <CountryFlag countryCode={countryGroup.countryCode} />
          <div className="text-left">
            <span className="text-lg font-semibold text-foreground">{countryGroup.country}</span>
            <p className="text-sm text-muted-foreground">{countryGroup.servers.length} servers available</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              {countryGroup.servers.filter((s: any) => s.status === 'online').length} online
            </p>
          </div>
          {expandedCountries[countryGroup.countryCode] ? 
            <ChevronUp size={20} className="text-muted-foreground" /> : 
            <ChevronDown size={20} className="text-muted-foreground" />
          }
        </div>
      </Button>
      <div className={cn(
        "transition-all duration-200 ease-in-out",
        expandedCountries[countryGroup.countryCode] 
          ? "max-h-[2000px] opacity-100" 
          : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="p-4 pt-0 space-y-3">
          {countryGroup.servers.map((server: any) => (
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
    </div>
  );
  
  return (
    <Layout title="VPN Servers">
      <div className="space-y-6">
        <ConnectionStatus 
          connectionState={connectionState}
          onDisconnect={disconnectVpn}
        />
        
        <div className="relative">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <Input 
            placeholder="Search servers by location..." 
            className="pl-10 h-12 rounded-xl border-border/50 focus:border-vpn-purple"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="w-full bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="all" className="flex-1 rounded-lg">All Servers</TabsTrigger>
            <TabsTrigger value="free" className="flex-1 rounded-lg">Free Tier</TabsTrigger>
            <TabsTrigger value="premium" className="flex-1 rounded-lg">Premium</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredServersByCountry.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="text-muted-foreground" size={24} />
                </div>
                <p className="text-muted-foreground text-lg">No servers found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
              </div>
            ) : (
              filteredServersByCountry.map(renderCountryGroup)
            )}
          </TabsContent>
          
          <TabsContent value="free" className="space-y-4">
            {getFreeServersByCountry().length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="text-muted-foreground" size={24} />
                </div>
                <p className="text-muted-foreground text-lg">No free servers found</p>
              </div>
            ) : (
              getFreeServersByCountry().map(renderCountryGroup)
            )}
          </TabsContent>
          
          <TabsContent value="premium" className="space-y-4">
            {getPremiumServersByCountry().length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="text-muted-foreground" size={24} />
                </div>
                <p className="text-muted-foreground text-lg">No premium servers found</p>
              </div>
            ) : (
              getPremiumServersByCountry().map(renderCountryGroup)
            )}
            
            {subscription.tier === 'free' && (
              <div className="bg-gradient-to-br from-vpn-purple/5 to-vpn-light-purple/20 p-6 rounded-xl border border-vpn-purple/20 text-center">
                <h3 className="text-lg font-semibold text-vpn-purple mb-2">Unlock Premium Servers</h3>
                <p className="text-muted-foreground mb-4">Get access to faster servers and premium locations</p>
                <Button 
                  className="bg-vpn-purple hover:bg-vpn-dark-purple text-white"
                  onClick={() => console.log('Navigate to upgrade page')}
                >
                  Upgrade to Premium
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ServersPage;

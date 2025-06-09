import React, { useState } from 'react';
import { useVpn } from '../context/VpnContext';
import ServerCard from '../components/ServerCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, X, Zap } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const CountryFlag = ({ countryCode }: { countryCode: string }) => {
  const flagEmojis: Record<string, string> = {
    'us': '🇺🇸',
    'jp': '🇯🇵', 
    'de': '🇩🇪',
    'gb': '🇬🇧',
    'sg': '🇸🇬',
    'au': '🇦🇺',
    'fr': '🇫🇷',
    'nl': '🇳🇱',
    'es': '🇪🇸'
  };

  return (
    <div className="text-2xl">
      {flagEmojis[countryCode.toLowerCase()] || '🌍'}
    </div>
  );
};

const ServersPage: React.FC = () => {
  const { 
    serversByCountry,
    subscription,
    isLoading,
    selectServer
  } = useVpn();
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
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
  
  const handleServerClick = (server: any) => {
    selectServer(server);
    navigate('/');
  };
  
  const renderServerList = (countryGroups: any[]) => (
    <div className="space-y-2">
      {countryGroups.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="text-muted-foreground" size={24} />
          </div>
          <p className="text-muted-foreground text-lg">No servers found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
        </div>
      ) : (
        countryGroups.map(countryGroup => (
          <div key={countryGroup.countryCode} className="space-y-2">
            {/* Country Header */}
            <div className="flex items-center gap-3 px-4 py-2 bg-muted/20 rounded-lg">
              <CountryFlag countryCode={countryGroup.countryCode} />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{countryGroup.country}</h3>
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-green-500" />
                  <span className="text-xs text-muted-foreground">
                    {countryGroup.servers.filter((s: any) => s.status === 'online').length} servers
                  </span>
                </div>
              </div>
            </div>
            
            {/* Server List */}
            <div className="space-y-2 pl-4">
              {countryGroup.servers.map((server: any) => (
                <div 
                  key={server.id} 
                  className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/50 hover:border-vpn-purple/30 transition-colors cursor-pointer"
                  onClick={() => handleServerClick(server)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-medium text-foreground">{server.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{server.location}</span>
                          {server.ping && (
                            <span className="text-xs text-muted-foreground">
                              • {server.ping}ms
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {server.tier === 'premium' && (
                      <Badge variant="outline" className="border-vpn-purple text-vpn-purple text-xs">
                        VIP
                      </Badge>
                    )}
                    
                    <div className={`w-2 h-2 rounded-full ${
                      server.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Select Location</h1>
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <X size={24} />
        </Button>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <Input 
            placeholder="Search for streaming, city or country" 
            className="pl-10 h-12 rounded-xl border-border/50 focus:border-vpn-purple bg-muted/30"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="free" className="space-y-4">
          <TabsList className="w-full bg-muted/50 rounded-xl p-1 grid grid-cols-3">
            <TabsTrigger value="free" className="rounded-lg">Free</TabsTrigger>
            <TabsTrigger value="premium" className="rounded-lg">VIP</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="free" className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Zap size={16} className="text-vpn-purple" />
              <span className="text-sm font-medium text-foreground">Free Servers</span>
              <Badge variant="outline" className="border-vpn-purple text-vpn-purple text-xs ml-auto">
                FREE
              </Badge>
            </div>
            {renderServerList(getFreeServersByCountry())}
          </TabsContent>
          
          <TabsContent value="premium" className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Zap size={16} className="text-vpn-purple" />
              <span className="text-sm font-medium text-foreground">VIP Servers</span>
              <Badge className="bg-vpn-purple text-white text-xs ml-auto">
                VIP
              </Badge>
            </div>
            
            {subscription.tier === 'free' && (
              <div className="bg-gradient-to-br from-vpn-purple/5 to-vpn-light-purple/20 p-4 rounded-xl border border-vpn-purple/20 text-center mb-4">
                <h3 className="text-lg font-semibold text-vpn-purple mb-2">Unlock VIP Servers</h3>
                <p className="text-muted-foreground mb-4 text-sm">Get access to faster servers and premium locations</p>
                <Button 
                  className="bg-vpn-purple hover:bg-vpn-dark-purple text-white rounded-full px-6"
                  onClick={() => console.log('Navigate to upgrade page')}
                >
                  Upgrade to VIP
                </Button>
              </div>
            )}
            
            {renderServerList(getPremiumServersByCountry())}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="text-center py-12">
              <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="text-muted-foreground" size={24} />
              </div>
              <p className="text-muted-foreground text-lg">No connection history</p>
              <p className="text-sm text-muted-foreground">Your recent connections will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ServersPage;

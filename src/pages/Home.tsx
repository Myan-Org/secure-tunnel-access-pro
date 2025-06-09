
import React from 'react';
import Layout from '../components/Layout';
import { useVpn } from '../context/VpnContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Server, Globe, Menu, Crown, Home, User, Settings, Star } from 'lucide-react';
import ConnectionStatus from '../components/ConnectionStatus';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

const HomePage: React.FC = () => {
  const { 
    connectionState, 
    disconnectVpn, 
    subscription,
    upgradeSubscription,
    isLoading,
    servers,
    selectedServer,
    connectToServer
  } = useVpn();
  const navigate = useNavigate();
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  const onlineServers = servers.filter(server => server.status === 'online');
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Menu size={24} />
        </Button>
        {subscription.tier === 'free' && (
          <Button 
            onClick={upgradeSubscription}
            className="bg-gradient-to-r from-vpn-purple to-vpn-dark-purple text-white rounded-full px-6 py-2 font-medium"
          >
            <Crown className="mr-2" size={16} />
            Go Premium
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-6 pt-8">
        {/* Connection Status Text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {connectionState.isConnected ? 'Protected' : 'Disconnected'}
          </h1>
          <p className="text-muted-foreground">
            {connectionState.isConnected 
              ? 'Your connection is secure' 
              : 'Your connection is not protected'
            }
          </p>
        </div>

        {/* Central Connection Circle */}
        <div className="relative mb-12">
          <div className={`w-64 h-64 rounded-full border-8 flex items-center justify-center transition-all duration-500 ${
            connectionState.isConnected 
              ? 'border-vpn-purple bg-vpn-purple/10' 
              : 'border-muted bg-muted/10'
          }`}>
            <div className={`w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
              connectionState.isConnected 
                ? 'border-vpn-purple bg-vpn-purple/20' 
                : 'border-muted bg-muted/20'
            }`}>
              <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                connectionState.isConnected 
                  ? 'bg-vpn-purple' 
                  : 'bg-muted'
              }`}>
                <Shield 
                  size={48} 
                  className={connectionState.isConnected ? 'text-white' : 'text-muted-foreground'} 
                />
              </div>
            </div>
          </div>
          
          {/* Connection Animation */}
          {connectionState.isConnecting && (
            <div className="absolute inset-0 rounded-full border-4 border-vpn-purple border-t-transparent animate-spin" />
          )}
        </div>

        {/* Selected Server Card */}
        {selectedServer ? (
          <Card className="w-full max-w-sm mb-8 bg-card/50 border-vpn-purple/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-vpn-purple/20 flex items-center justify-center">
                    <Globe size={16} className="text-vpn-purple" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedServer.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedServer.location}</p>
                  </div>
                </div>
              </div>
              
              {connectionState.isConnected && connectionState.currentServer?.id === selectedServer.id ? (
                <Button 
                  variant="outline" 
                  className="w-full border-vpn-purple/30 text-vpn-purple hover:bg-vpn-purple/10"
                  onClick={disconnectVpn}
                >
                  Disconnect
                </Button>
              ) : (
                <Button 
                  className="w-full bg-vpn-purple hover:bg-vpn-dark-purple text-white"
                  onClick={() => connectToServer(selectedServer)}
                  disabled={connectionState.isConnecting || selectedServer.status !== 'online'}
                >
                  {connectionState.isConnecting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connecting...
                    </div>
                  ) : (
                    'Connect'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-sm mb-8 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                    <Server size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Choose Location</p>
                    <p className="text-sm text-muted-foreground">Select a server to connect</p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/servers')}
                  className="bg-vpn-purple hover:bg-vpn-dark-purple text-white"
                  size="sm"
                >
                  Select
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="w-full max-w-sm grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-card/30 rounded-xl">
            <p className="text-2xl font-bold text-vpn-purple">{onlineServers.length}</p>
            <p className="text-sm text-muted-foreground">Servers</p>
          </div>
          <div className="text-center p-4 bg-card/30 rounded-xl">
            <p className="text-2xl font-bold text-vpn-purple">
              {new Set(servers.map(s => s.country)).size}
            </p>
            <p className="text-sm text-muted-foreground">Countries</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/20 backdrop-blur-lg">
        <div className="grid grid-cols-4 py-2">
          <button className="flex flex-col items-center gap-1 p-3 text-vpn-purple">
            <Home size={20} />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button 
            className="flex flex-col items-center gap-1 p-3 text-muted-foreground hover:text-foreground transition-colors"
            onClick={upgradeSubscription}
          >
            <Star size={20} />
            <span className="text-xs font-medium">Premium</span>
          </button>
          
          <button 
            className="flex flex-col items-center gap-1 p-3 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => navigate('/account')}
          >
            <User size={20} />
            <span className="text-xs font-medium">Profile</span>
          </button>
          
          <button 
            className="flex flex-col items-center gap-1 p-3 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => navigate('/settings')}
          >
            <Settings size={20} />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

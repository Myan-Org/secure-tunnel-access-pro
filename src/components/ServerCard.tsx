
import React from 'react';
import { VpnServer } from '../types/vpn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServerCardProps {
  server: VpnServer;
  onConnect: (server: VpnServer) => void;
  isCurrentServer?: boolean;
  isConnecting?: boolean;
  disabled?: boolean;
}

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return <Wifi className="text-green-500" size={16} />;
    case 'offline':
      return <WifiOff className="text-red-500" size={16} />;
    case 'maintenance':
      return <AlertTriangle className="text-amber-500" size={16} />;
    default:
      return <Wifi className="text-gray-500" size={16} />;
  }
};

const ServerCard: React.FC<ServerCardProps> = ({ 
  server, 
  onConnect, 
  isCurrentServer = false,
  isConnecting = false,
  disabled = false
}) => {
  return (
    <div 
      className={cn(
        "border rounded-xl p-4 relative overflow-hidden transition-all duration-300",
        isCurrentServer ? "border-vpn-purple shadow-lg shadow-vpn-purple/10" : "hover:border-vpn-purple/50",
        disabled && "opacity-60"
      )}
    >
      {isCurrentServer && (
        <div className="absolute -top-4 -right-4 bg-vpn-purple text-white text-xs px-8 py-1 rotate-45 transform">
          Connected
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{server.name}</h3>
          <p className="text-sm text-muted-foreground">{server.location}, {server.country}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={server.tier === 'premium' ? "default" : "outline"} className={server.tier === 'premium' ? "bg-vpn-purple hover:bg-vpn-purple/90" : ""}>
            {server.tier === 'premium' ? 'Premium' : 'Free'}
          </Badge>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm text-muted-foreground my-3">
        <div className="flex items-center gap-1">
          {getStatusIcon(server.status)}
          <span className="capitalize">{server.status}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Core: </span>
          <Badge variant="outline" className="text-xs">
            {server.coreType.toUpperCase()}
          </Badge>
        </div>
        {server.ping && (
          <div>
            Ping: <span className={server.ping < 100 ? "text-green-500" : server.ping > 150 ? "text-red-500" : "text-amber-500"}>{server.ping} ms</span>
          </div>
        )}
      </div>
      
      <Button 
        variant="outline" 
        className={cn(
          "w-full mt-2 border-vpn-purple/50 text-vpn-purple hover:bg-vpn-light-purple hover:text-vpn-purple",
          isCurrentServer && "bg-vpn-light-purple"
        )}
        onClick={() => onConnect(server)}
        disabled={isCurrentServer || isConnecting || disabled || server.status !== 'online'}
      >
        {isConnecting ? "Connecting..." : isCurrentServer ? "Connected" : "Connect"}
        {!isConnecting && !isCurrentServer && <ArrowRight className="ml-2" size={16} />}
      </Button>
    </div>
  );
};

export default ServerCard;

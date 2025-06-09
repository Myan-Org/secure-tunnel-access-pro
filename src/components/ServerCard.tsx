
import React from 'react';
import { VpnServer } from '../types/vpn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wifi, WifiOff, AlertTriangle, Signal } from 'lucide-react';
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
      return <div className="w-2 h-2 bg-green-500 rounded-full" />;
    case 'offline':
      return <div className="w-2 h-2 bg-red-500 rounded-full" />;
    case 'maintenance':
      return <div className="w-2 h-2 bg-amber-500 rounded-full" />;
    default:
      return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
  }
};

const ServerCard: React.FC<ServerCardProps> = ({ 
  server, 
  onConnect, 
  isCurrentServer = false,
  isConnecting = false,
  disabled = false
}) => {
  const getPingColor = (ping?: number) => {
    if (!ping) return "text-muted-foreground";
    if (ping < 100) return "text-green-600";
    if (ping > 150) return "text-red-600";
    return "text-amber-600";
  };

  return (
    <div 
      className={cn(
        "relative bg-card border rounded-xl p-4 transition-all duration-200 hover:shadow-md",
        isCurrentServer 
          ? "border-vpn-purple bg-vpn-purple/5 shadow-lg" 
          : "border-border/50 hover:border-vpn-purple/30",
        disabled && "opacity-60"
      )}
    >
      {isCurrentServer && (
        <div className="absolute -top-2 -right-2 bg-vpn-purple text-white text-xs px-3 py-1 rounded-full font-medium">
          Connected
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground">{server.name}</h3>
          <p className="text-sm text-muted-foreground">{server.location}, {server.country}</p>
        </div>
        <Badge 
          variant={server.tier === 'premium' ? "default" : "outline"} 
          className={cn(
            "ml-2",
            server.tier === 'premium' 
              ? "bg-vpn-purple hover:bg-vpn-purple/90 text-white" 
              : "border-border text-muted-foreground"
          )}
        >
          {server.tier === 'premium' ? 'Premium' : 'Free'}
        </Badge>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(server.status)}
          <span className="text-sm text-muted-foreground capitalize">{server.status}</span>
        </div>
        
        {server.ping && (
          <div className="flex items-center gap-1">
            <Signal size={14} className={getPingColor(server.ping)} />
            <span className={cn("text-sm font-medium", getPingColor(server.ping))}>
              {server.ping}ms
            </span>
          </div>
        )}
      </div>
      
      <Button 
        variant={isCurrentServer ? "secondary" : "outline"} 
        className={cn(
          "w-full rounded-lg font-medium transition-colors",
          isCurrentServer 
            ? "bg-vpn-light-purple text-vpn-purple hover:bg-vpn-light-purple/80" 
            : "border-vpn-purple/30 text-vpn-purple hover:bg-vpn-light-purple hover:border-vpn-purple"
        )}
        onClick={() => onConnect(server)}
        disabled={isCurrentServer || isConnecting || disabled || server.status !== 'online'}
      >
        {isConnecting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-vpn-purple border-t-transparent rounded-full animate-spin" />
            Connecting...
          </div>
        ) : isCurrentServer ? (
          "Connected"
        ) : (
          <div className="flex items-center gap-2">
            Connect
            <ArrowRight size={16} />
          </div>
        )}
      </Button>
    </div>
  );
};

export default ServerCard;

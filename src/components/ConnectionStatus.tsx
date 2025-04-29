
import React from 'react';
import { VpnConnectionState } from '../types/vpn';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Power, Clock, ArrowUpFromLine, ArrowDownToLine } from 'lucide-react';
import { getStatusIcon } from './ServerCard';

interface ConnectionStatusProps {
  connectionState: VpnConnectionState;
  onDisconnect: () => void;
}

const formatBytes = (bytes?: number): string => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const formatTime = (startTime?: Date): string => {
  if (!startTime) return '00:00:00';
  const diff = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return [hours, minutes, seconds]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
};

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connectionState,
  onDisconnect
}) => {
  const { isConnected, isConnecting, currentServer, startTime, bytesUp, bytesDown } = connectionState;

  if (!isConnected && !isConnecting) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {isConnecting ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-vpn-light-purple flex items-center justify-center">
                <div className="animate-pulse">
                  <Power size={30} className="text-vpn-purple" />
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-vpn-purple animate-ripple opacity-0"></div>
            </div>
            <p className="mt-4 text-lg font-semibold">Connecting to VPN...</p>
            <Button variant="outline" className="mt-4" onClick={onDisconnect}>Cancel</Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Connected
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow"></div>
                </h3>
                {currentServer && (
                  <p className="text-muted-foreground">
                    {currentServer.name}, {currentServer.country}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {currentServer.coreType.toUpperCase()}
                    </Badge>
                  </p>
                )}
              </div>
              <Button 
                variant="destructive" 
                className="bg-red-500 hover:bg-red-600"
                onClick={onDisconnect}
              >
                Disconnect
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                <Clock size={20} className="text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-mono font-medium">{formatTime(startTime)}</p>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                <ArrowUpFromLine size={20} className="text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">Upload</p>
                <p className="font-mono font-medium">{formatBytes(bytesUp)}</p>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                <ArrowDownToLine size={20} className="text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">Download</p>
                <p className="font-mono font-medium">{formatBytes(bytesDown)}</p>
              </div>
            </div>
            
            {currentServer && currentServer.status === 'online' && (
              <div className="flex justify-center gap-1 items-center mt-4 text-sm text-green-500">
                {getStatusIcon('online')}
                <span>Server status: Online</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionStatus;


import React from 'react';
import Layout from '../components/Layout';
import { useVpn } from '../context/VpnContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, Activity, Clock, Download, Upload } from 'lucide-react';
import ConnectionStatus from '../components/ConnectionStatus';
import LoadingScreen from '../components/LoadingScreen';

const StatusPage: React.FC = () => {
  const { connectionState, disconnectVpn, isLoading } = useVpn();
  const { isConnected, bytesUp, bytesDown, startTime } = connectionState;
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  const formatBytes = (bytes?: number): string => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getConnectedTime = (): string => {
    if (!startTime) return '0 minutes';
    const diff = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    if (diff < 60) return `${diff} seconds`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes`;
    return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
  };
  
  return (
    <Layout title="Connection Status">
      <ConnectionStatus 
        connectionState={connectionState}
        onDisconnect={disconnectVpn}
      />
      
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Shield size={24} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Not Connected</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Connect to a VPN server to see your connection status and statistics
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="text-vpn-purple" size={20} />
                Connection Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Upload</span>
                    <span>{formatBytes(bytesUp)}</span>
                  </div>
                  <Progress value={(bytesUp || 0) / 1000000 * 10} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Download</span>
                    <span>{formatBytes(bytesDown)}</span>
                  </div>
                  <Progress value={(bytesDown || 0) / 1000000 * 5} className="h-2" />
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Connected Time</span>
                    <span>{getConnectedTime()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Upload className="text-vpn-purple mb-2" size={24} />
                <p className="text-xs text-muted-foreground">Upload Speed</p>
                <p className="font-semibold">3.2 Mbps</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Download className="text-vpn-purple mb-2" size={24} />
                <p className="text-xs text-muted-foreground">Download Speed</p>
                <p className="font-semibold">18.7 Mbps</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Activity className="text-vpn-purple mb-2" size={24} />
                <p className="text-xs text-muted-foreground">Ping</p>
                <p className="font-semibold">
                  {connectionState.currentServer?.ping || '120'} ms
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Clock className="text-vpn-purple mb-2" size={24} />
                <p className="text-xs text-muted-foreground">Connected</p>
                <p className="font-semibold">{getConnectedTime()}</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="text-vpn-purple" size={20} />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-sm">IP Address Protection</p>
                  <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    Protected
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">DNS Protection</p>
                  <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    Protected
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">WebRTC Protection</p>
                  <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    Protected
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Traffic Encryption</p>
                  <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    AES-256
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default StatusPage;

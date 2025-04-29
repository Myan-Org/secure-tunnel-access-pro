
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Settings as SettingsIcon, Globe, Link, History, Lock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import LoadingScreen from '../components/LoadingScreen';
import { useVpn } from '../context/VpnContext';

const SettingsPage: React.FC = () => {
  const { isLoading } = useVpn();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <Layout title="Settings">
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-vpn-purple" />
              <CardTitle className="text-lg">Connection</CardTitle>
            </div>
            <CardDescription>VPN connection preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Auto-Connect</p>
                  <p className="text-xs text-muted-foreground">Connect to VPN on app launch</p>
                </div>
                <Switch id="auto-connect" />
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Kill Switch</p>
                  <p className="text-xs text-muted-foreground">Block internet if VPN disconnects</p>
                </div>
                <Switch id="kill-switch" />
              </div>
              
              <Separator />
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Default Protocol</label>
                <Select defaultValue="auto">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (Recommended)</SelectItem>
                    <SelectItem value="udp">UDP</SelectItem>
                    <SelectItem value="tcp">TCP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-vpn-purple" />
              <CardTitle className="text-lg">Security</CardTitle>
            </div>
            <CardDescription>VPN security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">DNS Leak Protection</p>
                  <p className="text-xs text-muted-foreground">Prevent DNS requests from leaking outside VPN tunnel</p>
                </div>
                <Switch id="dns-protection" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">WebRTC Leak Protection</p>
                  <p className="text-xs text-muted-foreground">Prevent WebRTC from revealing your IP address</p>
                </div>
                <Switch id="webrtc-protection" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Encryption Level</label>
                <Select defaultValue="aes256">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select encryption" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aes256">AES-256 (Recommended)</SelectItem>
                    <SelectItem value="aes128">AES-128</SelectItem>
                    <SelectItem value="chacha20">ChaCha20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Link size={18} className="text-vpn-purple" />
              <CardTitle className="text-lg">Split Tunneling</CardTitle>
            </div>
            <CardDescription>Choose which apps use the VPN</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Enable Split Tunneling</p>
                  <p className="text-xs text-muted-foreground">Allow certain apps to bypass VPN</p>
                </div>
                <Switch id="split-tunneling" />
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full" disabled>
                  Configure Apps
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <SettingsIcon size={18} className="text-vpn-purple" />
              <CardTitle className="text-lg">App Settings</CardTitle>
            </div>
            <CardDescription>General app configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Start on Boot</p>
                  <p className="text-xs text-muted-foreground">Launch app when device starts</p>
                </div>
                <Switch id="start-on-boot" />
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-xs text-muted-foreground">Show connection status notifications</p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Theme</label>
                <Select defaultValue="system">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System Default</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col gap-4 py-6">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <History size={16} />
              Clear VPN Cache
            </Button>
            
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Lock size={16} />
              Change PIN
            </Button>
            
            <Button variant="outline" className="w-full flex items-center gap-2" color="destructive">
              <Shield size={16} />
              Reset All Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;

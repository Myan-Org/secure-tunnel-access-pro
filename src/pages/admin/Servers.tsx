
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Edit, Trash, Plus, Server, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VpnCoreType, VpnServer, VpnServerStatus, VpnServerTier } from '@/types/vpn';
import { getStatusIcon } from '@/components/ServerCard';

const AdminServersPage: React.FC = () => {
  const [servers, setServers] = useState<VpnServer[]>([
    {
      id: '1',
      name: 'US East',
      location: 'New York',
      country: 'United States',
      countryCode: 'us',
      status: 'online',
      tier: 'free',
      ping: 120,
      load: 65,
      coreType: 'xray'
    },
    {
      id: '2',
      name: 'Japan Central',
      location: 'Tokyo',
      country: 'Japan',
      countryCode: 'jp',
      status: 'online',
      tier: 'free',
      ping: 180,
      load: 45,
      coreType: 'v2fly'
    },
    // Same mock data as in VpnContext
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const [newServer, setNewServer] = useState<Partial<VpnServer>>({
    name: '',
    location: '',
    country: '',
    countryCode: '',
    status: 'online',
    tier: 'free',
    coreType: 'xray'
  });
  
  const handleAddServer = () => {
    if (!newServer.name || !newServer.location || !newServer.country) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const server: VpnServer = {
      id: Date.now().toString(),
      name: newServer.name,
      location: newServer.location,
      country: newServer.country,
      countryCode: newServer.countryCode || 'us',
      status: newServer.status as VpnServerStatus || 'online',
      tier: newServer.tier as VpnServerTier || 'free',
      coreType: newServer.coreType as VpnCoreType || 'xray',
      ping: 100,
      load: 50
    };
    
    setServers([...servers, server]);
    setIsAdding(false);
    setNewServer({
      name: '',
      location: '',
      country: '',
      countryCode: '',
      status: 'online',
      tier: 'free',
      coreType: 'xray'
    });
    
    toast.success('Server added successfully');
  };
  
  const handleDeleteServer = (id: string) => {
    setServers(servers.filter(server => server.id !== id));
    toast.success('Server deleted successfully');
  };
  
  const handleToggleStatus = (id: string) => {
    setServers(servers.map(server => {
      if (server.id === id) {
        const newStatus: VpnServerStatus = server.status === 'online' ? 'offline' : 'online';
        return { ...server, status: newStatus };
      }
      return server;
    }));
    
    toast.success('Server status updated');
  };
  
  const filteredServers = filter === 'all' 
    ? servers 
    : filter === 'xray' 
      ? servers.filter(server => server.coreType === 'xray')
      : servers.filter(server => server.coreType === 'v2fly');
  
  return (
    <Layout title="Manage Servers" admin>
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Server size={20} className="text-vpn-purple" />
              VPN Servers
            </CardTitle>
            <Button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-vpn-purple hover:bg-vpn-dark-purple"
            >
              <Plus size={16} className="mr-1" />
              Add Server
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="border rounded-lg p-4 mb-6 bg-muted/30">
              <h3 className="font-medium mb-4">Add New Server</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Server Name <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="e.g., US East" 
                    value={newServer.name}
                    onChange={(e) => setNewServer({...newServer, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="e.g., New York" 
                    value={newServer.location}
                    onChange={(e) => setNewServer({...newServer, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="e.g., United States" 
                    value={newServer.country}
                    onChange={(e) => setNewServer({...newServer, country: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Country Code
                  </label>
                  <Input 
                    placeholder="e.g., us" 
                    value={newServer.countryCode}
                    onChange={(e) => setNewServer({...newServer, countryCode: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Tier</label>
                  <Select 
                    value={newServer.tier as string || 'free'}
                    onValueChange={(value) => setNewServer({...newServer, tier: value as VpnServerTier})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Core Type</label>
                  <Select 
                    value={newServer.coreType as string || 'xray'}
                    onValueChange={(value) => setNewServer({...newServer, coreType: value as VpnCoreType})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select core" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xray">XRay</SelectItem>
                      <SelectItem value="v2fly">V2Fly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-vpn-purple hover:bg-vpn-dark-purple"
                  onClick={handleAddServer}
                >
                  Add Server
                </Button>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="xray">XRay Core</TabsTrigger>
                <TabsTrigger value="v2fly">V2Fly Core</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 text-sm font-medium">Name</th>
                  <th className="text-left py-2 px-3 text-sm font-medium">Location</th>
                  <th className="text-left py-2 px-3 text-sm font-medium">Core</th>
                  <th className="text-left py-2 px-3 text-sm font-medium">Tier</th>
                  <th className="text-left py-2 px-3 text-sm font-medium">Status</th>
                  <th className="text-right py-2 px-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServers.map(server => (
                  <tr key={server.id} className="border-b hover:bg-muted/30">
                    <td className="py-2 px-3 text-sm">{server.name}</td>
                    <td className="py-2 px-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-muted-foreground" />
                        {server.location}, {server.country}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <Badge variant="outline" className="text-xs font-medium">
                        {server.coreType.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <Badge className={server.tier === 'premium' ? "bg-vpn-purple" : "bg-muted text-muted-foreground"}>
                        {server.tier}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Switch 
                          checked={server.status === 'online'} 
                          onCheckedChange={() => handleToggleStatus(server.id)}
                          className="scale-75"
                        />
                        <div className="flex items-center gap-1">
                          {getStatusIcon(server.status)}
                          <span className="capitalize text-xs">{server.status}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-sm text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteServer(server.id)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredServers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No servers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AdminServersPage;

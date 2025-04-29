
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Copy, Key, Plus, Calendar, Server, RefreshCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VpnKey, VpnServer, VpnCoreType } from '@/types/vpn';

const mockServers: VpnServer[] = [
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
  // Add more servers as needed
];

const AdminKeysPage: React.FC = () => {
  const [keys, setKeys] = useState<VpnKey[]>([
    {
      id: '1',
      key: 'xray_us_east_001',
      serverId: '1',
      coreType: 'xray',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    },
    {
      id: '2',
      key: 'v2fly_japan_001',
      serverId: '2',
      coreType: 'v2fly',
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    },
    // Add more keys as needed
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newKey, setNewKey] = useState<Partial<VpnKey>>({
    key: '',
    serverId: '',
    coreType: 'xray',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  
  const handleGenerateKey = () => {
    const server = mockServers.find(s => s.id === newKey.serverId);
    if (!server) {
      toast.error('Please select a server');
      return;
    }
    
    // Generate a random key
    const randomKey = `${server.coreType}_${server.countryCode}_${Math.random().toString(36).substring(2, 10)}`;
    setNewKey({...newKey, key: randomKey});
  };
  
  const handleAddKey = () => {
    if (!newKey.key || !newKey.serverId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const key: VpnKey = {
      id: Date.now().toString(),
      key: newKey.key,
      serverId: newKey.serverId,
      coreType: newKey.coreType as VpnCoreType,
      expiresAt: newKey.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    };
    
    setKeys([...keys, key]);
    setIsDialogOpen(false);
    setNewKey({
      key: '',
      serverId: '',
      coreType: 'xray',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    
    toast.success('VPN key added successfully');
  };
  
  const handleDeleteKey = (id: string) => {
    setKeys(keys.filter(key => key.id !== id));
    toast.success('VPN key deleted successfully');
  };
  
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Key copied to clipboard');
  };
  
  const getServerName = (serverId: string) => {
    const server = mockServers.find(s => s.id === serverId);
    return server ? server.name : 'Unknown Server';
  };
  
  const filteredKeys = searchTerm
    ? keys.filter(k => 
        k.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getServerName(k.serverId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.coreType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : keys;
  
  return (
    <Layout title="Manage VPN Keys" admin>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Key size={20} className="text-vpn-purple" />
              VPN Keys
            </CardTitle>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-vpn-purple hover:bg-vpn-dark-purple"
            >
              <Plus size={16} className="mr-1" />
              Add Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input 
              placeholder="Search keys..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 text-sm font-medium">Key</th>
                  <th className="text-left py-2 px-3 text-sm font-medium">Server</th>
                  <th className="text-left py-2 px-3 text-sm font-medium">Core Type</th>
                  <th className="text-left py-2 px-3 text-sm font-medium">Created</th>
                  <th className="text-left py-2 px-3 text-sm font-medium">Expires</th>
                  <th className="text-right py-2 px-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeys.map(key => {
                  const isExpiring = key.expiresAt.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days
                  const isExpired = key.expiresAt.getTime() < Date.now();
                  
                  return (
                    <tr key={key.id} className="border-b hover:bg-muted/30">
                      <td className="py-2 px-3 text-sm font-mono">
                        <div className="flex items-center gap-1">
                          {key.key}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 ml-1" 
                            onClick={() => handleCopyKey(key.key)}
                          >
                            <Copy size={12} />
                          </Button>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Server size={14} className="text-muted-foreground" />
                          {getServerName(key.serverId)}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-sm">
                        <Badge variant="outline" className="text-xs">
                          {key.coreType.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-sm text-muted-foreground">
                        {key.createdAt.toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 text-sm">
                        <div className={`flex items-center gap-1 ${isExpired ? 'text-destructive' : isExpiring ? 'text-yellow-500' : ''}`}>
                          <Calendar size={14} />
                          {key.expiresAt.toLocaleDateString()}
                          {isExpired && (
                            <Badge variant="destructive" className="text-[10px] h-5">Expired</Badge>
                          )}
                          {isExpiring && !isExpired && (
                            <Badge variant="outline" className="text-[10px] h-5 border-yellow-500 text-yellow-500">Expiring Soon</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-sm text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => {
                              const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                              setKeys(keys.map(k => k.id === key.id ? {...k, expiresAt: newExpiry} : k));
                              toast.success('Key validity extended by 30 days');
                            }}
                          >
                            <RefreshCcw size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteKey(key.id)}
                          >
                            <Key size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredKeys.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No keys found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New VPN Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium block mb-1">
                Server <span className="text-red-500">*</span>
              </label>
              <Select 
                value={newKey.serverId} 
                onValueChange={(value) => setNewKey({...newKey, serverId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select server" />
                </SelectTrigger>
                <SelectContent>
                  {mockServers.map(server => (
                    <SelectItem key={server.id} value={server.id}>
                      {server.name} ({server.coreType.toUpperCase()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">
                Key <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g., xray_us_123abc" 
                  value={newKey.key}
                  onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handleGenerateKey}
                  className="shrink-0"
                >
                  Generate
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Core Type</label>
              <Select 
                value={newKey.coreType || 'xray'}
                onValueChange={(value) => setNewKey({...newKey, coreType: value as VpnCoreType})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select core type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xray">XRay</SelectItem>
                  <SelectItem value="v2fly">V2Fly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Expiration Date</label>
              <Input 
                type="date" 
                value={newKey.expiresAt ? newKey.expiresAt.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  setNewKey({...newKey, expiresAt: date || undefined});
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-vpn-purple hover:bg-vpn-dark-purple"
              onClick={handleAddKey}
            >
              Add Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminKeysPage;

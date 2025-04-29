
import React from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Server, Key, ArrowUpRight, ChevronRight, Activity } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <Layout title="Admin Dashboard" admin>
      <div className="space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <Users size={20} className="text-vpn-purple" />
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold">1,248</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
                <ArrowUpRight size={12} />
                <span>12% from last week</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <Server size={20} className="text-vpn-purple" />
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold">18</p>
              <p className="text-sm text-muted-foreground">Active Servers</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Activity size={12} />
                <span>3 in maintenance</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <Key size={20} className="text-vpn-purple" />
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold">124</p>
              <p className="text-sm text-muted-foreground">Active Keys</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-500">
                <Activity size={12} />
                <span>12 expiring soon</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 size={20} className="text-vpn-purple" />
                <span className="text-xs text-muted-foreground">This month</span>
              </div>
              <p className="text-2xl font-bold">$4,320</p>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
                <ArrowUpRight size={12} />
                <span>18% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent activity */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button variant="ghost" className="h-8 px-2 text-xs">
                View all
                <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
            <CardDescription>Latest actions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'New User', description: 'John Doe created an account', time: '10 minutes ago' },
                { type: 'Subscription', description: 'Sarah Smith upgraded to Premium', time: '2 hours ago' },
                { type: 'Server', description: 'Singapore server maintenance completed', time: '5 hours ago' },
                { type: 'Key', description: 'New API key generated for Japan server', time: '1 day ago' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <div className="font-medium">{item.type}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Quick actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Manage your VPN infrastructure</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button className="h-auto py-3 bg-vpn-purple hover:bg-vpn-dark-purple">
              <Server size={18} className="mr-2" />
              Add New Server
            </Button>
            <Button variant="outline" className="h-auto py-3">
              <Key size={18} className="mr-2" />
              Generate Key
            </Button>
            <Button variant="outline" className="h-auto py-3">
              <Users size={18} className="mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="h-auto py-3">
              <BarChart3 size={18} className="mr-2" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

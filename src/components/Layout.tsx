
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Server, User, Settings, Home, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => (
  <Link 
    to={to} 
    className={cn(
      "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
      active 
        ? "text-vpn-purple bg-vpn-light-purple" 
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    )}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

interface LayoutProps {
  children: ReactNode;
  title: string;
  admin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, admin = false }) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <div className="flex-1 pb-16">
        <div className="container py-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
      
      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t py-2 px-4">
        <div className="container mx-auto">
          <div className="flex justify-around">
            {!admin ? (
              <>
                <NavItem to="/" icon={<Home size={20} />} label="Home" active={path === '/'} />
                <NavItem to="/servers" icon={<Server size={20} />} label="Servers" active={path === '/servers'} />
                <NavItem to="/status" icon={<Shield size={20} />} label="Status" active={path === '/status'} />
                <NavItem to="/account" icon={<User size={20} />} label="Account" active={path === '/account'} />
                <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" active={path === '/settings'} />
              </>
            ) : (
              <>
                <NavItem to="/admin" icon={<BarChart3 size={20} />} label="Dashboard" active={path === '/admin'} />
                <NavItem to="/admin/servers" icon={<Server size={20} />} label="Servers" active={path === '/admin/servers'} />
                <NavItem to="/admin/keys" icon={<Shield size={20} />} label="Keys" active={path === '/admin/keys'} />
                <NavItem to="/admin/users" icon={<User size={20} />} label="Users" active={path === '/admin/users'} />
                <NavItem to="/admin/settings" icon={<Settings size={20} />} label="Settings" active={path === '/admin/settings'} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

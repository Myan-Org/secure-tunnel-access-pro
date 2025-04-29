
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-20 h-20 relative mb-8">
        <div className="w-full h-full rounded-full border-4 border-vpn-light-purple"></div>
        <div className="w-full h-full rounded-full border-4 border-t-vpn-purple absolute top-0 left-0 animate-spin"></div>
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-vpn-purple to-vpn-dark-purple bg-clip-text text-transparent">
        SecureTunnel
      </h1>
      <p className="text-muted-foreground mt-2">Loading secure connection...</p>
    </div>
  );
};

export default LoadingScreen;

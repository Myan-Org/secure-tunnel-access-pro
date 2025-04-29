
export type VpnCoreType = 'xray' | 'v2fly';

export type VpnServerStatus = 'online' | 'offline' | 'maintenance';

export type VpnServerTier = 'free' | 'premium';

export interface VpnServer {
  id: string;
  name: string;
  location: string;
  country: string;
  countryCode: string;
  status: VpnServerStatus;
  tier: VpnServerTier;
  ping?: number;
  load?: number;
  coreType: VpnCoreType;
}

export interface VpnServersByCountry {
  country: string;
  countryCode: string;
  servers: VpnServer[];
}

export interface VpnKey {
  id: string;
  key: string;
  serverId: string;
  coreType: VpnCoreType;
  expiresAt: Date;
  createdAt: Date;
}

export interface UserSubscription {
  tier: 'free' | 'premium';
  expiresAt?: Date;
  active: boolean;
}

export interface VpnConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  currentServer?: VpnServer;
  startTime?: Date;
  bytesUp?: number;
  bytesDown?: number;
}

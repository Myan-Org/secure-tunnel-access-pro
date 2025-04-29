
import React from 'react';
import { UserSubscription } from '../types/vpn';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CrownIcon } from 'lucide-react';

interface SubscriptionBannerProps {
  subscription: UserSubscription;
  onUpgrade: () => void;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  subscription,
  onUpgrade
}) => {
  const isPremium = subscription.tier === 'premium';
  
  return (
    <Card className={`mb-6 overflow-hidden ${isPremium ? 'border-vpn-purple' : ''}`}>
      {isPremium && (
        <div className="bg-gradient-to-r from-vpn-purple to-vpn-dark-purple text-white py-1 px-4 text-xs font-medium text-center">
          PREMIUM SUBSCRIPTION
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={isPremium ? "default" : "outline"} className={isPremium ? "bg-vpn-purple" : ""}>
                {isPremium ? 'Premium' : 'Free'}
              </Badge>
              {subscription.expiresAt && (
                <span className="text-xs text-muted-foreground">
                  Expires: {subscription.expiresAt.toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-sm mt-1">
              {isPremium 
                ? 'Access to all premium servers with higher speeds' 
                : 'Upgrade to access premium servers'}
            </p>
          </div>
          {!isPremium && (
            <Button 
              onClick={onUpgrade} 
              className="bg-vpn-purple hover:bg-vpn-dark-purple text-white"
            >
              <CrownIcon size={16} className="mr-1" />
              Upgrade
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionBanner;

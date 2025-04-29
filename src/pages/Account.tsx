
import React from 'react';
import Layout from '../components/Layout';
import { useVpn } from '../context/VpnContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, CreditCard, Star, Clock } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

interface PlanProps {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  current?: boolean;
  onSelect: () => void;
  buttonText: string;
}

const PlanCard: React.FC<PlanProps> = ({
  name,
  price,
  features,
  highlighted = false,
  current = false,
  onSelect,
  buttonText
}) => (
  <Card className={`border ${highlighted ? 'border-vpn-purple shadow-lg' : ''} ${current ? 'bg-secondary/50' : ''} relative overflow-hidden`}>
    {current && (
      <div className="absolute top-0 right-0 bg-vpn-purple text-white text-xs px-3 py-1">
        Current Plan
      </div>
    )}
    <CardContent className="pt-6 pb-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold">{name}</h3>
        <div className="mt-2">
          <span className="text-2xl font-bold">{price}</span>
          {price !== 'Free' && <span className="text-muted-foreground">/month</span>}
        </div>
      </div>
      
      <ul className="space-y-2 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <BadgeCheck size={16} className="text-vpn-purple" />
            {feature}
          </li>
        ))}
      </ul>
      
      <Button 
        onClick={onSelect}
        variant={highlighted ? "default" : "outline"}
        className={`w-full ${highlighted ? 'bg-vpn-purple hover:bg-vpn-dark-purple' : ''}`}
      >
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

const AccountPage: React.FC = () => {
  const { subscription, upgradeSubscription, isLoading } = useVpn();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <Layout title="My Account">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                subscription.tier === 'premium' ? 'bg-vpn-light-purple' : 'bg-secondary'
              }`}>
                {subscription.tier === 'premium' ? (
                  <Star className="text-vpn-purple" size={24} />
                ) : (
                  <CreditCard className="text-muted-foreground" size={24} />
                )}
              </div>
              <div>
                <h3 className="font-semibold">
                  {subscription.tier === 'premium' ? 'Premium Plan' : 'Free Plan'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {subscription.tier === 'premium' 
                    ? 'Full access to all premium servers' 
                    : 'Limited to free servers only'}
                </p>
              </div>
            </div>
            
            {subscription.tier === 'premium' && subscription.expiresAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-3">
                <Clock size={16} />
                <span>Renews on {subscription.expiresAt.toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <h2 className="font-semibold text-lg mt-8 mb-4">Available Plans</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <PlanCard 
            name="Free"
            price="Free"
            features={[
              'Access to free servers',
              'Basic connection speeds',
              'Standard encryption',
              'Limited server locations'
            ]}
            current={subscription.tier === 'free'}
            onSelect={() => {}}
            buttonText="Current Plan"
          />
          
          <PlanCard 
            name="Premium"
            price="$9.99"
            features={[
              'Access to all servers',
              'Unlimited bandwidth',
              'Higher speeds',
              'Advanced security features',
              'No ads'
            ]}
            highlighted={true}
            current={subscription.tier === 'premium'}
            onSelect={subscription.tier === 'premium' ? () => {} : upgradeSubscription}
            buttonText={subscription.tier === 'premium' ? 'Current Plan' : 'Upgrade'}
          />
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {subscription.tier === 'premium' ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">Premium Subscription</p>
                      <p className="text-xs text-muted-foreground">Apr 15, 2025</p>
                    </div>
                    <p className="font-semibold">$9.99</p>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">Premium Subscription</p>
                      <p className="text-xs text-muted-foreground">Mar 15, 2025</p>
                    </div>
                    <p className="font-semibold">$9.99</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">
                  No payment history available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;

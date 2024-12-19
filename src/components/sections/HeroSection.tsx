import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useWalletData } from '../../hooks/useWalletData';
import { AffiliateForm } from '../AffiliateForm';
import { logger } from '../../utils/logger';
import { cn } from '../../utils/cn';
import coinBackground from '../../assets/coins-Flipit-ADS.png';

const OWNED_NODE_CREDIT = 1000; // $1000 per owned node
const SOLD_NODE_CREDIT = 500;   // $500 per sold node

export function HeroSection() {
  const { address } = useWallet();
  const { data: walletData, loading } = useWalletData(address);
  const [shouldFlip, setShouldFlip] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isPoweringDown, setIsPoweringDown] = useState(false);

  useEffect(() => {
    if (address && !isConnected) {
      setIsConnected(true);
      setIsPoweringDown(false);
      setShouldFlip(true);
      const timer = setTimeout(() => setShouldFlip(false), 1000);
      return () => clearTimeout(timer);
    } else if (!address && isConnected) {
      setShouldFlip(false); // Ensure flip is disabled immediately
      setIsPoweringDown(true);
      const timer = setTimeout(() => {
        setIsConnected(false);
        setIsPoweringDown(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [address, isConnected]);

  const formatCredits = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getNodeText = (count: number, type: string) => {
    return `${count} ${type}${count === 1 ? '' : 's'}`;
  };

  // Calculate owned nodes (wallet's own flipit.nodes)
  const ownedNodes = walletData?.flipit?.nodes || 0;

  // Calculate sold nodes (sum of children's flipit.nodes)
  const soldNodes = walletData?.children?.reduce((total, child) => {
    return total + (child.flipit?.nodes || 0);
  }, 0) || 0;

  const totalCredits = (ownedNodes * OWNED_NODE_CREDIT) + (soldNodes * SOLD_NODE_CREDIT);

  return (
    <section className="relative min-h-[80vh] px-4 flex items-center justify-center overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0">
        {/* First layer - larger, more blurred coins */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${coinBackground})`,
            backgroundSize: '800px',
            backgroundRepeat: 'repeat',
            transform: 'rotate(-10deg) scale(1.3)',
            filter: 'blur(3px)',
          }}
        />
        
        {/* Second layer - medium coins */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${coinBackground})`,
            backgroundSize: '500px',
            backgroundRepeat: 'repeat',
            transform: 'rotate(5deg) scale(1.1)',
            filter: 'blur(1px)',
          }}
        />
        
        {/* Third layer - smaller, sharper coins */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url(${coinBackground})`,
            backgroundSize: '300px',
            backgroundRepeat: 'repeat',
            transform: 'rotate(-5deg)',
            filter: 'blur(0px)',
          }}
        />
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background"
        />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 container mx-auto">
        <div id="free-ads" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-16">
            <div className={cn(
              "flex-1 text-center lg:text-left lg:pl-8 xl:pl-0",
              isPoweringDown && "animate-power-down",
              !address && isConnected && "animate-power-up"
            )}>
              {!address ? (
                <>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                    <span className="animate-gradient-text">Get Your Free</span>
                    <br />
                    Ad Credits
                  </h1>
                  <p className="text-text-muted text-lg sm:text-xl max-w-2xl mb-8">
                    Connect your wallet to view your eligible ad credits
                  </p>
                </>
              ) : (
                <>
                  <p className="text-text-muted text-lg sm:text-xl mb-4">
                    You own {getNodeText(ownedNodes, 'node')} and have sold {getNodeText(soldNodes, 'node')}
                  </p>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                    <span className="animate-gradient-text">Congratulations</span>
                    <br />
                    Node Owner
                  </h1>
                  <div className="space-y-4">
                    <p className="text-2xl font-bold text-accent-orange">
                      Total Ad Credits: {formatCredits(totalCredits)}
                    </p>
                    <div className="text-sm text-text-muted space-y-1">
                      <p>• Owned nodes: {ownedNodes} × {formatCredits(OWNED_NODE_CREDIT)} per node</p>
                      <p>• Sold nodes: {soldNodes} × {formatCredits(SOLD_NODE_CREDIT)} per node</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex-1 max-w-md w-full">
              <div 
                className={cn(
                  "floating-card transition-transform duration-1000",
                  address && shouldFlip && "animate-flip",
                  isPoweringDown && "animate-power-down",
                  !isPoweringDown && !address && isConnected && "animate-power-up"
                )}
              >
                <AffiliateForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

interface StatusSummaryProps {
  ownedNodes: number;
  soldNodes: number;
}

const OWNED_NODE_CREDIT = 1000;
const SOLD_NODE_CREDIT = 500;

export function StatusSummary({ ownedNodes, soldNodes }: StatusSummaryProps) {
  const [showContent, setShowContent] = useState(false);
  const [showNodeCount, setShowNodeCount] = useState(false);

  useEffect(() => {
    // Start showing content after mount
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    // Show node count after 2 seconds
    const nodeCountTimer = setTimeout(() => {
      setShowNodeCount(true);
    }, 2000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(nodeCountTimer);
    };
  }, []);

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

  const totalCredits = (ownedNodes * OWNED_NODE_CREDIT) + (soldNodes * SOLD_NODE_CREDIT);

  return (
    <div className="space-y-6">
      <div className={cn(
        "transition-opacity duration-500",
        showNodeCount ? "opacity-100" : "opacity-0"
      )}>
        <p className="text-text-muted text-lg sm:text-xl mb-4">
          You own {getNodeText(ownedNodes, 'node')} and have sold {getNodeText(soldNodes, 'node')}
        </p>
      </div>

      <div className={cn(
        "transition-all duration-500 transform",
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          <span className="animate-gradient-text">Congrats</span>
          <br />
          {ownedNodes > 0 ? 'Node Owner' : 'Promoter'}
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
      </div>
    </div>
  );
}

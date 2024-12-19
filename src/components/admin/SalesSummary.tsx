import React from 'react';
import { Coins, Users, ArrowRightLeft } from 'lucide-react';

interface SalesSummaryProps {
  salesData: any[];
}

export function SalesSummary({ salesData }: SalesSummaryProps) {
  return (
    <div className="bg-background/50 p-6 rounded-lg mb-8">
      <h3 className="text-xl font-semibold mb-6">Total Network Statistics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background-secondary/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Coins className="w-5 h-5 text-accent-orange" />
            <h4 className="text-sm text-text-muted">Total Node Count</h4>
          </div>
          <p className="text-2xl font-bold">0 Nodes</p>
          <p className="text-sm text-text-muted mt-2">
            Total value: $0
          </p>
        </div>

        <div className="bg-background-secondary/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-accent-orange" />
            <h4 className="text-sm text-text-muted">Unique Owners</h4>
          </div>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-text-muted mt-2">
            Active node owners
          </p>
        </div>

        <div className="bg-background-secondary/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRightLeft className="w-5 h-5 text-accent-orange" />
            <h4 className="text-sm text-text-muted">Average Per Owner</h4>
          </div>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-text-muted mt-2">
            Nodes per owner
          </p>
        </div>
      </div>
    </div>
  );
}
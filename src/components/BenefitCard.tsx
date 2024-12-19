import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export function BenefitCard({ Icon, title, description }: BenefitCardProps) {
  return (
    <div className="benefit-card flex flex-col items-center text-center p-6 bg-background-secondary/30 rounded-xl backdrop-blur-sm">
      <Icon className="w-12 h-12 text-[#fc822b] mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-text-muted">{description}</p>
    </div>
  );
}
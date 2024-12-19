import React from 'react';
import { Timer, Megaphone, Award } from 'lucide-react';
import { BenefitCard } from '../BenefitCard';

const benefits = [
  {
    icon: Timer,
    title: 'Be First',
    description: 'Advertise on Flipit before we open it to the public.'
  },
  {
    icon: Megaphone,
    title: 'Innovative Placement',
    description: "Place ads on the backs of pages that don't even offer ads on the front."
  },
  {
    icon: Award,
    title: 'Lifetime Beta Access',
    description: 'Gain access to new beta features early.'
  }
];

export function BenefitsSection() {
  return (
    <div id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background-secondary/50 to-background-tertiary/50 animate-gradient"></div>
      
      <div className="relative">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 text-[#f8f9fa] shadow-text animate-on-scroll">
          More than just Free!
        </h2>
        
        <p className="text-xl md:text-2xl text-text-muted text-center mb-20 max-w-3xl mx-auto">
          Imagine placing your ads on the backs of pages where customers are actively making buying decisions—reading reviews, comparing products, and finalizing choices. Be there at the perfect moment.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              Icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
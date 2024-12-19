import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../utils/cn';

export function CollapsibleInfo() {
  const [isOpen, setIsOpen] = useState(false);

  const benefits = [
    {
      title: 'Ad Credit Match',
      description: 'Get ad credits equal to the price of the nodes you sold. For example, if you sold nodes when they were $500 each, you\'ll receive $500 in ad credits per node.'
    },
    {
      title: 'Ongoing Opportunity',
      description: 'For a limited time, you can still earn ad credits for nodes sold now, with a maximum of $1,000 in credits per node.'
    }
  ];

  return (
    <div className="relative w-full lg:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-accent-orange hover:text-accent-orange/80 transition-colors"
      >
        Learn More* 
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      <div
        className={cn(
          'mt-2 overflow-hidden transition-all duration-300 ease-in-out',
          'lg:absolute lg:w-[320px] z-10',
          isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="bg-[#0c1030] rounded-lg shadow-xl border border-accent-blue/20 p-4">
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex gap-3">
                <ArrowRight className="h-5 w-5 flex-shrink-0 text-accent-orange" />
                <div>
                  <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                  <p className="text-white/90 text-sm">{benefit.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/70 mt-4 pt-4 border-t border-accent-blue/20">
            * Only applicable for nodes purchased on your first level.
          </p>
        </div>
      </div>
    </div>
  );
}
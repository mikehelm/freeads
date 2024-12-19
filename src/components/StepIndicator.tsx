import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{
    number: number;
    label: string;
  }>;
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="absolute -top-6 left-0 right-0 flex justify-center">
      <div className="flex items-center space-x-4 bg-background-tertiary px-6 py-2 rounded-full">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className={`flex items-center ${currentStep === step.number ? 'text-accent-orange' : 'text-text-muted'}`}>
              <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-2">
                {step.number}
              </span>
              <span className="font-medium">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-text-muted" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
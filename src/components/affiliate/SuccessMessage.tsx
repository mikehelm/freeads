import React from 'react';
import { Check } from 'lucide-react';

export function SuccessMessage() {
  return (
    <div className="gradient-border bg-background-secondary/80 backdrop-blur-lg p-10 rounded-lg">
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <Check className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
        <p className="text-text-muted">
          We've received your information. We'll be in touch soon!
        </p>
      </div>
    </div>
  );
}

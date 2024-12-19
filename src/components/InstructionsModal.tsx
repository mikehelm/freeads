import React from 'react';
import { Button } from './Button';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  if (!isOpen) return null;

  const steps = [
    'Visit get.flipit.com',
    'Connect your wallet',
    'Copy your referral link',
    'Paste the link above and submit',
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0c1030] border border-[#4b1ee2]/20 rounded-2xl p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold mb-6">Follow These Steps</h3>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-[#4b1ee2] rounded-full flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-[#e0e4ed]">{step}</p>
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          onClick={onClose}
          className="mt-8 w-full"
        >
          Got it
        </Button>
      </div>
    </div>
  );
}
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './Button';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0c1030] border border-[#4b1ee2]/20 rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-[#fc822b] mx-auto mb-6" />
            <Dialog.Title className="text-2xl font-bold mb-4">
              Application Received!
            </Dialog.Title>
            <Dialog.Description className="text-[#e0e4ed] mb-8">
              Thank you for applying! We will be in touch with you shortly to confirm your ad credits.
            </Dialog.Description>
            <Button variant="secondary" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { UserDetailsForm } from './UserDetailsForm';
import { X } from 'lucide-react';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: string;
}

export function UserDetailsModal({ isOpen, onClose, wallet }: UserDetailsModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-secondary rounded-lg p-6 w-full max-w-md border border-accent-blue/20">
          <Dialog.Close className="absolute top-4 right-4 text-text-muted hover:text-text-primary">
            <X className="h-4 w-4" />
          </Dialog.Close>
          
          <Dialog.Title className="text-xl font-semibold mb-4 text-text-primary">
            Complete Your Profile
          </Dialog.Title>
          
          <Dialog.Description className="text-text-muted mb-6">
            Please provide your email address to complete your registration.
          </Dialog.Description>
          
          <UserDetailsForm 
            wallet={wallet} 
            onSuccess={onClose}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

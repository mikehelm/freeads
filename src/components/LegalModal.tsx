import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from './Button';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LegalModal({ isOpen, onClose }: LegalModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] bg-[#0c1030] border border-[#4b1ee2]/20 rounded-2xl p-8 z-50 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <Dialog.Title className="text-2xl font-bold text-white">
              Legal Information
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-text-muted hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-6 text-text-muted">
            <p>By using this platform, you agree to the following:</p>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Terms & Conditions</h3>
              <p>
                By accessing or using the Flipit platform, you agree to comply with our{' '}
                <a 
                  href="https://flipit.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#fc822b] hover:text-[#ff6f00] transition-colors"
                >
                  Terms & Conditions
                </a>.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Privacy Policy</h3>
              <p>
                We respect your privacy. Please read our{' '}
                <a 
                  href="https://flipit.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#fc822b] hover:text-[#ff6f00] transition-colors"
                >
                  Privacy Policy
                </a>.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Accredited Investor</h3>
              <p>
                Investment opportunities are open to accredited investors only.{' '}
                <a 
                  href="https://flipit.com/accredited-investor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#fc822b] hover:text-[#ff6f00] transition-colors"
                >
                  Learn more about accredited investor requirements
                </a>.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Investment Risks</h3>
              <p>
                Investments in Flipit carry risk. Review our{' '}
                <a 
                  href="https://flipit.com/investment-risks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#fc822b] hover:text-[#ff6f00] transition-colors"
                >
                  investment risk disclosure
                </a>.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">General Legal</h3>
              <p>
                By using Flipit, you agree to comply with legal regulations.{' '}
                <a 
                  href="https://flipit.com/legal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#fc822b] hover:text-[#ff6f00] transition-colors"
                >
                  View general legal information
                </a>.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
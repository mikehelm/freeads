import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../hooks/useWallet';
import { StepIndicator } from './StepIndicator';
import { WalletStep } from './affiliate/WalletStep';
import { EmailForm } from './affiliate/EmailForm';
import { SuccessMessage } from './affiliate/SuccessMessage';
import { config } from '../config';

const STEPS = [
  { number: 1, label: 'Connect' },
  { number: 2, label: 'Email' }
];

export function AffiliateForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showStepTwo, setShowStepTwo] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { address } = useWallet();

  useEffect(() => {
    // Only advance to step 2 if we have a valid address
    if (address && currentStep === 1) {
      console.log('Valid address detected, advancing to step 2:', address);
      setCurrentStep(2);
    } else if (!address && currentStep !== 1) {
      console.log('No address detected, reverting to step 1');
      setCurrentStep(1);
      setEmail('');
      setError('');
      setIsSubmitted(false);
      setShowStepTwo(false);
    }
  }, [address, currentStep]);

  useEffect(() => {
    if (currentStep === 2) {
      setShowStepTwo(true);
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    } else {
      setShowStepTwo(false);
    }
  }, [currentStep]);

  const validateEmail = () => {
    if (!email) {
      setError('Please enter your email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail() || !address) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/user-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: address.toLowerCase(),
          email: email,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save email');
      }

      if (!data.success) {
        throw new Error('Failed to save email');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to save email:', error);
      setError(error instanceof Error ? error.message : 'Failed to save your email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return <SuccessMessage />;
  }

  return (
    <div className="relative">
      <div className="gradient-border bg-background-secondary/80 backdrop-blur-lg p-10 rounded-lg">
        <StepIndicator currentStep={currentStep} steps={STEPS} />

        <div className="flex flex-col items-start mb-8 mt-4">
          <h3 className={`leading-[1.3] font-semibold ${currentStep === 2 ? 'text-2xl' : 'text-[32px]'}`}>
            {currentStep === 1 
              ? (address ? 'Ready to Continue' : 'Connect Your Wallet')
              : 'Enter your email address to claim your credits'}
          </h3>
          {currentStep === 1 && !address && (
            <p className="text-text-muted text-lg mt-2">Select the Wallet Linked to Your Flipit Affiliate Sales</p>
          )}
        </div>

        {currentStep === 1 ? (
          <WalletStep address={address} />
        ) : (
          <div className={`transition-all duration-500 ${showStepTwo ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
            <EmailForm
              email={email}
              setEmail={setEmail}
              error={error}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
              emailInputRef={emailInputRef}
            />
          </div>
        )}
      </div>
    </div>
  );
}

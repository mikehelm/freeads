import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../hooks/useWallet';
import { StepIndicator } from './StepIndicator';
import { WalletStep } from './affiliate/WalletStep';
import { EmailForm } from './affiliate/EmailForm';
import { SuccessMessage } from './affiliate/SuccessMessage';
import { NameCollectionForm } from './affiliate/NameCollectionForm';
import { config } from '../config';

const STEPS = [
  { number: 1, label: 'Connect' },
  { number: 2, label: 'Email' },
  { number: 3, label: 'Profile' }
];

export function AffiliateForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showStepTwo, setShowStepTwo] = useState(false);
  const [showStepThree, setShowStepThree] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { address } = useWallet();

  useEffect(() => {
    if (address && currentStep === 1) {
      setCurrentStep(2);
    } else if (!address && currentStep !== 1) {
      setCurrentStep(1);
      setEmail('');
      setError('');
      setIsSubmitted(false);
      setShowStepTwo(false);
      setShowStepThree(false);
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

    if (currentStep === 3) {
      setShowStepThree(true);
    } else {
      setShowStepThree(false);
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
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

      setCurrentStep(3);
    } catch (error) {
      console.error('Failed to save email:', error);
      setError(error instanceof Error ? error.message : 'Failed to save your email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSubmit = async (firstName: string, lastName: string, country: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/user-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: address?.toLowerCase(),
          firstName,
          lastName,
          country
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile');
      }

      if (!data.success) {
        throw new Error('Failed to save profile');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(2);
    setShowStepThree(false);
  };

  if (isSubmitted) {
    return <SuccessMessage />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {currentStep < 3 && <StepIndicator steps={STEPS} currentStep={currentStep} />}
      
      <div className={`mt-8 ${currentStep === 3 ? 'mt-12' : ''}`}>
        {currentStep === 1 && (
          <WalletStep />
        )}

        {showStepTwo && (
          <EmailForm
            email={email}
            setEmail={setEmail}
            error={error}
            isLoading={isLoading}
            onSubmit={handleEmailSubmit}
            inputRef={emailInputRef}
          />
        )}

        {showStepThree && (
          <NameCollectionForm
            onSubmit={handleNameSubmit}
            wallet={address || ''}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

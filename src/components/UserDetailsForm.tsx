import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { logger } from '../utils/logger';
import { walletService } from '../services/api/wallet';
import { validateEmail } from '../types/wallet';
import { validateAddress } from '../utils/address';
import { WalletData } from '../services/api/types';

interface UserDetailsFormProps {
  wallet: string;
  onSuccess?: () => void;
}

export function UserDetailsForm({ wallet, onSuccess }: UserDetailsFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [walletError, setWalletError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setWalletError('');

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!validateAddress(wallet)) {
      setWalletError('Invalid wallet address format');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) {
      setError('No wallet address available');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    logger.log('info', 'Submitting form', { wallet, email });

    try {
      const response = await walletService.updateWallet(wallet.toLowerCase(), {
        email,
      });

      if (response.error) {
        throw response.error;
      }

      logger.log('info', 'User details saved successfully');
      setEmail(''); // Clear form
      onSuccess?.();
    } catch (err) {
      logger.log('error', 'Failed to save user details', err);
      setError(err.message || 'Failed to save your details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (emailError && validateEmail(newEmail)) {
      setEmailError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="mb-2">
          <span className="text-sm text-text-muted">Wallet Address:</span>
          <span className="text-sm font-mono ml-2">{wallet}</span>
        </div>
        {walletError && <p className="text-red-500 text-sm mt-1">{walletError}</p>}
      </div>

      <div>
        <Input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          disabled={isSubmitting}
          error={emailError}
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        Save Details
      </Button>
    </form>
  );
}

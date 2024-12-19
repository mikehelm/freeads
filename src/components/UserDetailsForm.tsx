import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { logger } from '../utils/logger';
import { userService } from '../services/userService';

interface UserDetailsFormProps {
  wallet: string;
  onSuccess?: () => void;
}

export function UserDetailsForm({ wallet, onSuccess }: UserDetailsFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) {
      setError('No wallet address available');
      return;
    }

    setIsSubmitting(true);
    setError('');

    logger.log('info', 'Submitting form', { wallet, email });

    try {
      await userService.updateUserDetails({
        wallet: wallet.toLowerCase(), // Ensure consistent case
        email,
      });

      logger.log('info', 'User details saved successfully');
      setEmail(''); // Clear form
      onSuccess?.();
    } catch (err) {
      logger.log('error', 'Failed to save user details', err);
      setError('Failed to save your details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="mb-2">
          <span className="text-sm text-text-muted">Wallet Address:</span>
          <span className="text-sm font-mono ml-2">{wallet}</span>
        </div>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-background-secondary border-accent-blue/20"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={isSubmitting || !wallet}
        className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white"
      >
        {isSubmitting ? 'Saving...' : 'Save Details'}
      </Button>
    </form>
  );
}

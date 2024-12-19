import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../Button';

interface EmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  error: string;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  emailInputRef: React.RefObject<HTMLInputElement>;
}

export function EmailForm({ email, setEmail, error, isLoading, handleSubmit, emailInputRef }: EmailFormProps) {
  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <div className="relative">
          <input
            ref={emailInputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className={`
              w-full px-6 py-4 bg-white/5 border-2 rounded-lg
              ${error ? 'border-red-500' : 'border-white/10'}
              text-white placeholder-white/50
              focus:outline-none focus:border-accent-orange
              transition-colors duration-200
            `}
          />
          {error && (
            <p className="absolute -bottom-6 left-0 text-red-500 text-sm">
              {error}
            </p>
          )}
        </div>
        <p className="mt-2 text-sm text-text-muted">
          Use the one that you use for your Flipit Account
        </p>
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        variant="primary"
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit'
        )}
      </Button>
    </form>
  );
}

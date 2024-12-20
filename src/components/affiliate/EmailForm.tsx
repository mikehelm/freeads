import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../Button';

interface EmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  error: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function EmailForm({ email, setEmail, error, isLoading, onSubmit, inputRef }: EmailFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      <div className="space-y-4">
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        <div>
          <input
            ref={inputRef}
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
          <p className="mt-2 text-sm text-text-muted">
            Use the one that you use for your Flipit Account
          </p>
        </div>
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

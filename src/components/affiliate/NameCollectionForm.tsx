import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/Dialog';
import { Input } from '../Input';

interface NameCollectionFormProps {
  onSubmit: (firstName: string, lastName: string, country: string) => void;
  wallet: string;
  onBack: () => void;
}

export function NameCollectionForm({ onSubmit, wallet, onBack }: NameCollectionFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = firstName.trim() && lastName.trim() && country && isChecked;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!isFormValid) {
      setError('Please fill in all fields and accept the terms');
      setIsLoading(false);
      return;
    }

    onSubmit(firstName, lastName, country);
  };

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'New Zealand',
    'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland',
    'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland', 'Singapore',
    'Japan', 'South Korea', 'Hong Kong', 'Taiwan', 'Thailand', 'Malaysia',
    'Indonesia', 'Philippines', 'Vietnam', 'India', 'Brazil', 'Mexico',
    'Argentina', 'Chile', 'Colombia', 'Peru', 'South Africa', 'Nigeria',
    'Kenya', 'Israel', 'United Arab Emirates', 'Saudi Arabia'
  ].sort();

  return (
    <div className="w-full max-w-4xl mx-auto p-12 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg border border-white/10 shadow-xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">
            Final Step
          </h2>
          <div className="text-white/90">
            <p className="text-2xl font-semibold mb-4">Claim Your Credits</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-white/90 mb-1">
                First Name
              </label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/50"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-white/90 mb-1">
                Last Name
              </label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/50"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-white/90 mb-1">
              Country
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-white/5 border-white/10 text-white rounded-md h-10 px-3 py-2 text-sm focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
              required
            >
              <option value="" className="bg-gray-900">Select your country</option>
              {countries.map((c) => (
                <option key={c} value={c} className="bg-gray-900">{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="ml-3">
                <label htmlFor="terms" className="text-sm text-white/80">
                  Ad credits are non-transferable and may not be claimed or used in certain countries due to local regulations. 
                  Check your country's rules before accepting.{' '}
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(true)}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    See full disclaimer here
                  </button>
                </label>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors duration-200"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center w-full text-white/70 hover:text-white/90 transition-colors duration-200 mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Maybe change your email?
            </button>
          </div>
        </form>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Full Disclaimer</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 text-sm text-white/80">
            <p>
              The ad credits offered as part of this promotion are intended solely for use on our platform 
              and are governed by the following terms:
            </p>

            <div>
              <h3 className="font-semibold mb-1">Non-Transferability:</h3>
              <p>
                Ad credits are non-transferable and may not be exchanged, sold, or redeemed for cash or 
                any other monetary equivalent.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Tax Considerations:</h3>
              <p>
                Recipients are responsible for determining the tax implications, if any, in their country 
                of residence. Ad credits may qualify as taxable income under certain jurisdictions. 
                Please consult a tax professional for advice.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Affiliate Credits:</h3>
              <p>
                The $500 ad credits provided for affiliate node purchases are subject to local regulations. 
                In some countries, these credits may not be eligible for claim or use. It is the recipient's 
                responsibility to verify compliance with their country's laws before accepting these credits.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Terms of Use:</h3>
              <p>
                Ad credits are valid only for advertising on our platform and are subject to our platform's 
                terms of service.
              </p>
            </div>

            <p>
              By accepting the ad credits, you acknowledge and agree to these terms. If you have any 
              questions or concerns, please contact us at{' '}
              <a
                href="mailto:founders@flipit.com"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                founders@flipit.com
              </a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

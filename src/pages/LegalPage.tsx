import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

export default function LegalPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Top back button */}
      <div className="mb-12">
        <Button
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-3 text-lg font-medium bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl transition-all transform hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Button>
      </div>

      <h1 className="text-4xl font-bold mb-12">Legal Information</h1>
      <p className="text-text-muted mb-8">By using this platform, you agree to the following:</p>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Terms & Conditions</h2>
          <p className="text-text-muted mb-4">
            By accessing or using the Flipit platform, you agree to comply with our Terms & Conditions.
          </p>
          <a 
            href="https://flipit.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#fc822b] hover:text-[#ff6f00] transition-colors"
          >
            View Terms & Conditions
          </a>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
          <p className="text-text-muted mb-4">
            We respect your privacy and are committed to protecting your personal information.
          </p>
          <a 
            href="https://flipit.com/policies/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#fc822b] hover:text-[#ff6f00] transition-colors"
          >
            View Privacy Policy
          </a>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Investment Information</h2>
          <div className="space-y-4 text-text-muted">
            <p>
              Investment opportunities in Flipit are open to accredited investors only. 
              Please review all investment documentation carefully before making any investment decisions.
            </p>
            <p>
              Investing in early-stage companies involves substantial risk, including the potential loss of your entire investment. 
              Past performance is not indicative of future results.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Investment Risk Disclosure</h2>
          <div className="space-y-4 text-text-muted">
            <p>
              Investing in Flipit carries inherent risks, including the potential loss of your entire investment. 
              We recommend that you consult with a financial advisor and carefully review all investment documentation 
              before making any decisions. Past performance does not guarantee future results, and investments may not 
              perform as expected.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">General Legal Information</h2>
          <div className="space-y-4 text-text-muted">
            <p>
              By accessing or using the Flipit platform, you agree to comply with the applicable laws and regulations 
              of your jurisdiction, as well as our Terms and Conditions and Privacy Policy.
            </p>
            <p>
              All legal disputes will be governed by the laws of the jurisdiction in which Flipit is registered. 
              Flipit is not responsible for any indirect, incidental, or consequential damages related to the use 
              of our platform.
            </p>
          </div>
        </section>
      </div>

      {/* Bottom back button */}
      <div className="mt-16 pt-8 border-t border-accent-blue/20">
        <Button
          onClick={handleBack}
          className="flex items-center gap-2 px-8 py-4 text-lg font-medium bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl transition-all transform hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
          Return to Previous Page
        </Button>
      </div>
    </div>
  );
}
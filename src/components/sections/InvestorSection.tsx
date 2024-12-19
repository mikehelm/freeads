import React from 'react';
import { Mail } from 'lucide-react';

export function InvestorSection() {
  return (
    <div id="investors" className="investor-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-16 relative overflow-hidden opacity-0">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#f8f9fa] shadow-text">
          Investor Interest
        </h2>
        <p className="text-lg text-text-muted mb-8">
          Flipit is a fully developed, market-ready product poised to revolutionize the advertising industry with a groundbreaking approach. The digital advertising market is vast, and Flipit is positioned to make an extraordinary impact. There's much more beneath the surface that we're eager to share with the right investor—reach out to discover how you can be part of this transformative opportunity.
        </p>
        <a 
          href="mailto:founders@flipit.com?subject=Investor%20Interest"
          rel="noopener"
          className="inline-flex items-center gap-2 text-[#fc822b] hover:text-[#ff6f00] transition-colors font-semibold group"
        >
          <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span>Contact Us at founders@flipit.com</span>
        </a>
      </div>
    </div>
  );
}
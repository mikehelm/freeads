import React, { useEffect } from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { BenefitsSection } from '../components/sections/BenefitsSection';
import { InvestorSection } from '../components/sections/InvestorSection';
import { Separator } from '../components/Separator';
import { useLocation } from 'react-router-dom';
import { scrollToElement } from '../utils/scroll';

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    // Handle scroll to section if coming from another page
    const state = location.state as { scrollTo?: string };
    if (state?.scrollTo) {
      scrollToElement(state.scrollTo);
      // Clear the state to prevent scrolling on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    document.querySelectorAll('.benefit-card, .investor-section').forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <Separator />
      <InvestorSection />
    </>
  );
}
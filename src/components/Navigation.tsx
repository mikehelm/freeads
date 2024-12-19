import React, { useState, useEffect } from 'react';
import { Menu, X, Home, ArrowUpRight, ArrowUp } from 'lucide-react';
import { Button } from './Button';
import { WalletDisplay } from './WalletDisplay';
import { scrollToElement } from '../utils/scroll';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserDetailsModal } from './UserDetailsModal';
import { useWallet } from '../hooks/useWallet';
import { logger } from '../utils/logger';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMidScreen, setIsMidScreen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { address, connectWallet, disconnectWallet, showUserDetails, closeUserDetails } = useWallet();

  // Don't show navigation on legal information page
  if (location.pathname === '/legal') {
    return null;
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMidScreen(window.innerWidth >= 768 && window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      scrollToElement(id);
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const renderMenuItems = () => (
    <>
      <a
        href="#"
        onClick={scrollToTop}
        className="text-text-muted hover:text-white transition-colors flex items-center gap-2"
      >
        <Home className="w-5 h-5" />
      </a>
      <a
        href="#benefits"
        onClick={(e) => handleScroll(e, 'benefits')}
        className="text-text-muted hover:text-white transition-colors"
      >
        Benefits
      </a>
      <Button
        onClick={() => window.open('https://get.flipit.com?referralCode=B2J9JXJGEM', '_blank')}
      >
        Buy Nodes
      </Button>
      <Button 
        variant="outline"
        onClick={(e) => handleScroll(e, 'investors')}
        className="bg-background-secondary/50 group"
      >
        <span className="flex items-center gap-2">
          Own a part of Flipit
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </Button>
    </>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Navigation (>1024px) */}
            <div className="hidden lg:flex items-center space-x-8 backdrop-blur-sm bg-background/30 px-6 py-2 rounded-full border border-white/[0.05]">
              <div className="flex gap-2">
                <Link
                  to="/"
                  className="flex items-center space-x-2 font-bold"
                >
                </Link>
              </div>
              {renderMenuItems()}
            </div>

            {/* Desktop Wallet Section (>1024px) */}
            <div className="hidden lg:block ml-auto">
              <WalletDisplay className="backdrop-blur-sm bg-background/30 px-4 py-2 rounded-lg border border-white/[0.05] hover:border-accent-blue transition-colors" />
            </div>

            {/* Mid-screen Navigation (768px-1024px) */}
            {isMidScreen && !isOpen && (
              <button
                onClick={() => setIsOpen(true)}
                className="backdrop-blur-sm bg-background/30 text-text-muted hover:text-white p-2 rounded-lg border border-white/[0.05]"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}

            {/* Mobile menu button (<768px) */}
            <div className="lg:hidden md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="backdrop-blur-sm bg-background/30 text-text-muted hover:text-white p-2 rounded-lg border border-white/[0.05]"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile and Mid-screen Menu */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 backdrop-blur-md bg-background/40 border-t border-white/[0.05]">
              <div className="flex flex-col space-y-4 p-4">
                {renderMenuItems()}
                <WalletDisplay />
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {showUserDetails && address && (
        <UserDetailsModal
          isOpen={showUserDetails}
          onClose={closeUserDetails}
          wallet={address}
        />
      )}
    </>
  );
}
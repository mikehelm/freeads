import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="container mx-auto px-4 py-8 mt-16">
      <div className="border-t border-[#4b1ee2]/20 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-[#e0e4ed] text-sm">
            &copy; 2024 Flipit Global Limited. All rights reserved.
          </div>
          <Link
            to="/admin"
            className="text-[#e0e4ed] hover:text-white transition-colors text-sm flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Admin
          </Link>
          <Link
            to="/legal"
            className="text-[#e0e4ed] hover:text-white transition-colors text-sm flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Legal Information
          </Link>
        </div>
      </div>
    </footer>
  );
}
import React from 'react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-transparent animate-spin loading-gradient" />
        <div className="mt-4 text-text-muted text-sm animate-pulse">Loading Flipit</div>
      </div>
    </div>
  );
}
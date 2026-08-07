import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';

export const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Icon (Three Horizontal Lines) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-mono">TMS</span>
            <span>Trade Master Suite</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-300 ml-2">
            <Link to="/" className="hover:text-white transition-colors" activeProps={{ className: 'text-blue-400' }}>
              Dashboard
            </Link>
            <Link to="/journal" className="hover:text-white transition-colors" activeProps={{ className: 'text-blue-400' }}>
              Journal
            </Link>
            <Link to="/analytics" className="hover:text-white transition-colors" activeProps={{ className: 'text-blue-400' }}>
              Analytics
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/new-trade"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow transition-colors flex items-center gap-1"
          >
            <span className="text-sm leading-none">+</span>
            <span>Log Trade</span>
          </Link>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-[80vw] bg-slate-900 border-r border-slate-800 h-full p-5 space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="font-bold text-white text-sm">Navigation Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-white p-1 text-lg"
                >
                  ✕
                </button>
              </div>
              <nav className="flex flex-col gap-3 font-semibold text-sm">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
                  activeProps={{ className: 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30' }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/journal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
                  activeProps={{ className: 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30' }}
                >
                  Journal
                </Link>
                <Link
                  to="/analytics"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
                  activeProps={{ className: 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30' }}
                >
                  Analytics
                </Link>
                <Link
                  to="/new-trade"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-blue-600 text-white font-bold text-center mt-2 shadow"
                >
                  + Log Trade
                </Link>
              </nav>
            </div>
            <div className="text-[11px] text-slate-500 text-center font-mono border-t border-slate-800 pt-3">
              Trade Master Suite v1.0
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (Mobile) */}
      <Link
        to="/new-trade"
        className="md:hidden fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center border border-blue-400/30 active:scale-95 transition-transform"
        aria-label="Log Trade"
      >
        <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Twitter, Instagram, Github, Mail, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-obsidian-900 border-t border-slate-800 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-4 mb-16">
          
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Ticket className="h-5 w-5 text-white rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">ARIAS</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              The premier platform for authenticated match ticketing. Secure your spot in the arena with zero-fraud guarantees.
            </p>
            <div className="flex space-x-4 text-slate-500">
              <Twitter className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
              <Github className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/events" className="hover:text-white transition-colors">Browse Events</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sell Tickets</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Arias NFT Wallet</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Official Partners</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="glass-card p-6 border-slate-800">
            <h4 className="text-white font-bold mb-4 flex items-center">
              <ShieldCheck className="mr-2 h-4 w-4 text-blue-500" /> Secure System
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              All transactions are encrypted and verified. Our system ensures honest pricing and authenticated transfers.
            </p>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
               <span>Verified</span>
               <div className="h-1 w-1 rounded-full bg-slate-700" />
               <span>SSL 2.0</span>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800/50 text-xs text-slate-600">
          <p>© 2026 Arias Entertainment Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Policy</span>
            <span className="flex items-center">
              <Mail className="mr-2 h-3 w-3" /> hello@arias.app
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

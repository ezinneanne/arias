import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, User, Menu, LogOut, LayoutDashboard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

export const Navbar = () => {
  const { user, setUser, isAuthenticated } = useApp();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isHome ? "bg-transparent py-6" : "bg-obsidian-900/80 backdrop-blur-xl border-b border-slate-800 py-4"
    )}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
            <Ticket className="h-6 w-6 text-white rotate-45" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">ARIAS</span>
        </Link>

        <div className="hidden items-center space-x-8 md:flex">
          <Link to="/events" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Browse Events</Link>
          <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it Works</Link>
          <Link to="/contact" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Support</Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button variant="ghost" size="sm" className="flex items-center">
                  {user?.role === 'admin' ? <LayoutDashboard className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                  {user?.name.split(' ')[0]}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => setUser(null)}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden text-sm font-medium text-slate-300 hover:text-white transition-colors md:block">Log in</Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
          <Menu className="h-6 w-6 text-slate-300 md:hidden" />
        </div>
      </div>
    </nav>
  );
};

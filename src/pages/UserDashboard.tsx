import React from 'react';
import { Ticket, Calendar, MapPin, ExternalLink, ShieldAlert, History, User } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatDate } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

const MY_TICKETS = [
  {
    id: 'T-1001',
    eventTitle: 'Masters League Finals',
    date: '2026-06-15T20:00:00',
    venue: 'Cyber Arena, Seoul',
    seat: 'Sec A, Row 12, Seat 4',
    status: 'Ready',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ARIAS-T1001-VAL'
  }
];

const UserDashboard = () => {
  const { user } = useApp();

  return (
    <div className="min-h-screen pt-32 pb-20 bg-obsidian-900">
      <div className="mx-auto max-w-7xl px-6">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user?.name || 'Gamer'}</h1>
            <p className="text-slate-400">Track and manage your upcoming match activations.</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm"><History className="mr-2 h-4 w-4" /> Past Events</Button>
            <Button size="sm"><Ticket className="mr-2 h-4 w-4" /> My Wallet</Button>
          </div>
        </header>

        <div className="grid gap-12 lg:grid-cols-3">
          
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Ticket className="mr-3 h-6 w-6 text-blue-500" /> Active Tickets
            </h2>
            
            <div className="space-y-6">
              {MY_TICKETS.map((ticket) => (
                <motion.div 
                  key={ticket.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl"
                >
                  <div className="relative md:w-1/3 h-48 md:h-auto bg-obsidian-900">
                    <img 
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400" 
                      className="w-full h-full object-cover opacity-60" 
                      alt="Event"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                       <div className="mb-4 bg-white p-2 rounded-lg">
                          <img src={ticket.qrCode} alt="Ticket QR" className="w-24 h-24" />
                       </div>
                       <p className="text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">Tap to expand</p>
                    </div>
                  </div>

                  <div className="flex-1 p-8 text-slate-900 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                           <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mb-1 block">Digital Asset #ARS-T1</span>
                           <h3 className="text-2xl font-bold leading-tight">{ticket.eventTitle}</h3>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold uppercase">
                          {ticket.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-sm text-slate-500">
                          <Calendar className="mr-2 h-4 w-4 text-blue-500" /> {formatDate(ticket.date)}
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                          <MapPin className="mr-2 h-4 w-4 text-blue-500" /> {ticket.venue}
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex justify-between items-center mb-6">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Seat</span>
                        <span className="text-sm font-bold text-slate-900">{ticket.seat}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="secondary" className="bg-slate-100 text-slate-900 hover:bg-slate-200 flex-1">
                        Transfer
                      </Button>
                      <Button className="flex-1">Add to Wallet</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-8 text-white">
              <h3 className="text-lg font-bold mb-6">Profile Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-800/50 transition-all cursor-pointer group">
                  <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Account Details</p>
                    <p className="text-xs text-slate-500">Manage private info</p>
                  </div>
                  <ExternalLink className="ml-auto h-4 w-4 text-slate-600" />
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-800/50 transition-all cursor-pointer group">
                  <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Security</p>
                    <p className="text-xs text-slate-500">2FA and Keys</p>
                  </div>
                  <ExternalLink className="ml-auto h-4 w-4 text-slate-600" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

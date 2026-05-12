import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, ShieldCheck, Ticket, Users, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, formatDate, cn } from '../lib/utils';

const PRODUCT = {
  id: '1',
  title: 'Masters League Finals 2026',
  date: '2026-06-15T20:00:00',
  location: 'Cyber Arena, Seoul',
  venue: 'Digital Stadium South',
  price: 120,
  image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
  category: 'ESPORTS',
  availableTickets: 42,
  description: `The grand conclusion of the 2026 Masters League. Two world-class teams battle for the title in the heart of Seoul's Cyber District. Experience a night of high-stakes play, state-of-the-art production, and community celebration.`,
  tiers: [
    { name: 'VIP Front Row', price: 250, left: 5 },
    { name: 'Premium Middle', price: 150, left: 12 },
    { name: 'General Admission', price: 120, left: 25 }
  ]
};

const EventDetailsPage = () => {
  const { id } = useParams();
  const [selectedTier, setSelectedTier] = useState(PRODUCT.tiers[2].name);
  const [quantity, setQuantity] = useState(1);
  const [showMap, setShowMap] = useState(false);

  const activeTier = PRODUCT.tiers.find(t => t.name === selectedTier)!;

  return (
    <div className="min-h-screen pt-20 bg-obsidian-900 pb-20">
      {/* Hero Banner */}
      <div className="relative h-[40vh] w-full lg:h-[50vh]">
        <img 
          src={PRODUCT.image} 
          className="h-full w-full object-cover" 
          alt={PRODUCT.title}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/40 to-transparent" />
        
        <div className="absolute bottom-12 left-0 right-0">
          <div className="mx-auto max-w-7xl px-6">
            <Link to="/events" className="mb-6 inline-flex items-center text-sm font-bold text-blue-400 hover:text-blue-300">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
            </Link>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">{PRODUCT.title}</h1>
            <div className="flex flex-wrap gap-6 text-slate-300">
              <span className="flex items-center"><Calendar className="mr-2 h-5 w-5 text-blue-500" /> {formatDate(PRODUCT.date)}</span>
              <span className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-blue-500" /> {PRODUCT.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-12">
        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Main Info */}
          <div className="lg:col-span-2">
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-white">Event Details</h2>
              <p className="text-lg leading-relaxed text-slate-400">{PRODUCT.description}</p>
            </section>

            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Select Seats</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMap(!showMap)}>
                  {showMap ? 'Hide Seating Map' : 'View Seating Map'}
                </Button>
              </div>

              <AnimatePresence>
                {showMap && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 overflow-hidden rounded-2xl bg-slate-800/30 border border-slate-700 p-8 text-center"
                  >
                    <div className="aspect-video w-full rounded-xl bg-obsidian-800 flex items-center justify-center relative overflow-hidden group">
                      <div className="p-4 border-2 border-blue-500/20 rounded-full animate-ping absolute" />
                      <div className="relative z-10 flex flex-col items-center">
                        <MapPin className="h-12 w-12 text-blue-500 mb-4" />
                        <p className="text-slate-500 font-medium">Stadium Interactive Map Placeholder</p>
                        <p className="text-xs text-slate-600 mt-2">Pinch to zoom functionality enabled</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {PRODUCT.tiers.map((tier) => (
                  <div 
                    key={tier.name}
                    onClick={() => setSelectedTier(tier.name)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-2xl border-2 p-6 transition-all",
                      selectedTier === tier.name 
                        ? "border-blue-500 bg-blue-500/5 shadow-lg" 
                        : "border-slate-800 bg-obsidian-800 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                        selectedTier === tier.name ? "border-blue-500" : "border-slate-600"
                      )}>
                        {selectedTier === tier.name && <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{tier.name}</h4>
                        <p className="text-sm text-slate-500">{tier.left} tickets remaining</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-white">{formatCurrency(tier.price)}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-obsidian-800 p-8 border border-slate-700/50">
              <div className="flex items-start space-x-4">
                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-white">The Arias Guarantee</h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    We stand by our tickets 100%. If your event is cancelled or rescheduled, your funds are fully protected. 
                    Tokens are strictly verified via official digital handshakes with the venue.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Checkout Widget */}
          <div className="lg:relative">
            <div className="sticky top-32 space-y-6">
              <div className="glass-card p-8">
                <h3 className="mb-6 text-xl font-bold text-white">Quick Checkout</h3>
                
                <div className="mb-6">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Ticket Quantity</label>
                  <div className="flex items-center justify-between rounded-xl bg-obsidian-900 border border-slate-700 p-2">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-800 text-white"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(6, quantity + 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-800 text-white"
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">Limit: 6 tickets per user</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-400">
                    <span>{activeTier.name} x {quantity}</span>
                    <span>{formatCurrency(activeTier.price * quantity)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Service Fee</span>
                    <span>{formatCurrency(15)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-700 pt-4 text-xl font-bold text-white">
                    <span>Total</span>
                    <span>{formatCurrency(activeTier.price * quantity + 15)}</span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button className="w-full" size="lg">Secure Tickets</Button>
                </Link>

                <div className="mt-6 flex items-center justify-center space-x-2 text-xs font-medium text-slate-500">
                  <Users className="h-4 w-4" />
                  <span>4 people are viewing these seats</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 p-6 text-center">
                <HelpCircle className="mx-auto mb-4 h-8 w-8 text-slate-600" />
                <h4 className="mb-2 font-bold text-white">Need help?</h4>
                <p className="text-sm text-slate-500">Our support squad is live 24/7 for all your ticketing queries.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;

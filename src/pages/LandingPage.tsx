import React from 'react';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';

const FEATURED_EVENTS = [
  {
    id: '1',
    title: 'Masters League Finals',
    date: '2026-06-15T20:00:00',
    location: 'Cyber Arena, Seoul',
    price: 120,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
    category: 'ESPORTS',
    availableTickets: 42
  },
  {
    id: '2',
    title: 'World Cup Qualifiers',
    date: '2026-07-10T18:00:00',
    location: 'Wembley Stadium, London',
    price: 85,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    category: 'SOCCER',
    availableTickets: 120
  },
  {
    id: '3',
    title: 'Grand Slam Tennis Open',
    date: '2026-08-05T10:00:00',
    location: 'Arthur Ashe, NYC',
    price: 150,
    image: 'https://images.unsplash.com/photo-1595435063853-157947113197?auto=format&fit=crop&q=80&w=800',
    category: 'TENNIS',
    availableTickets: 15
  }
];

const LandingPage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-obsidian-900/90" />
          <img 
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=2000" 
            className="h-full w-full object-cover opacity-30"
            alt="Crowd at a game"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400">
              The Next Gen of Ticketing
            </span>
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
              Secure Your Spot <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">In The Game.</span>
            </h1>
            <p className="mb-10 text-lg text-slate-400 md:text-xl">
              Fast, secure, and authenticated tickets for the world's biggest matches. 
              No scalpers, no fakes, just the pure thrill of the game.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
              <Link to="/events">
                <Button size="lg" className="w-full sm:w-auto">
                  Find Tickets <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                How Arias Works
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500"
        >
          <div className="h-10 w-6 rounded-full border-2 border-slate-700 flex justify-center pt-2">
            <div className="h-2 w-1 rounded-full bg-slate-500" />
          </div>
        </motion.div>
      </section>

      {/* Trust Pillars */}
      <section className="bg-obsidian-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "100% Authenticated",
                desc: "Every ticket is verified through the official league blockchain for zero fraud."
              },
              {
                icon: Zap,
                title: "Instant Transfer",
                desc: "Receive your tickets in your digital wallet within seconds of checkout."
              },
              {
                icon: Globe,
                title: "Official Partners",
                desc: "Direct integration with major stadiums and sports franchises globally."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col items-start px-6"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="bg-obsidian-900 pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Featured Matchups</h2>
              <p className="text-slate-400">Hand-picked premier events you don't want to miss.</p>
            </div>
            <Link to="/events" className="hidden text-sm font-bold text-blue-400 hover:text-blue-300 md:block">
              View All Events &rarr;
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/events">
              <Button variant="outline" className="w-full">View All Events</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

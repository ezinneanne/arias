import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin, Calendar, Flame } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const ALL_EVENTS = [
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
    title: 'NBA All-Star Game',
    date: '2026-02-18T19:30:00',
    location: 'Staples Center, LA',
    price: 250,
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800',
    category: 'BASKETBALL',
    availableTickets: 8
  },
  {
    id: '4',
    title: 'UFC 305: Nunes vs Smith',
    date: '2026-05-12T22:00:00',
    location: 'MGM Grand, Las Vegas',
    price: 180,
    image: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&q=80&w=800',
    category: 'MMA',
    availableTickets: 65
  },
  {
    id: '5',
    title: 'Formula 1: Monaco GP',
    date: '2026-05-24T15:00:00',
    location: 'Circuit de Monaco',
    price: 320,
    image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=800',
    category: 'RACING',
    availableTickets: 24
  },
  {
    id: '6',
    title: 'Grand Slam Tennis Open',
    date: '2026-08-05T10:00:00',
    location: 'Arthur Ashe, NYC',
    price: 150,
    image: 'https://images.unsplash.com/photo-1595435063853-157947113197?auto=format&fit=crop&q=80&w=800',
    category: 'TENNIS',
    availableTickets: 15
  }
];

const CATEGORIES = ['ALL', 'SOCCER', 'BASKETBALL', 'ESPORTS', 'MMA', 'RACING', 'TENNIS'];

const EventListingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = ALL_EVENTS.filter(event => {
    const matchesCategory = selectedCategory === 'ALL' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 bg-obsidian-900">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header and Search */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 text-4xl font-bold text-white md:text-5xl"
          >
            Find Your Match
          </motion.h1>

          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search by team, event or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-obsidian-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" /> Date
              </Button>
              <Button variant="outline" className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" /> Location
              </Button>
              <Button variant="secondary" className="flex items-center">
                <SlidersHorizontal className="mr-2 h-5 w-5" /> More
              </Button>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mb-12 flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all",
                selectedCategory === cat 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "bg-obsidian-800 text-slate-400 hover:text-slate-100 hover:bg-obsidian-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Pulse Banner */}
        <div className="mb-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 p-4 flex items-center">
          <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Flame className="h-5 w-5 text-white animate-pulse" />
          </div>
          <p className="text-sm font-medium text-slate-300">
            <span className="text-white font-bold">High Demand:</span> We've seen a 40% increase in bookings for the Masters League Finals today. Book soon!
          </p>
        </div>

        {/* Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-obsidian-800 text-slate-600">
              <Search className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">No matches found</h3>
            <p className="text-slate-500">We couldn't find any events matching your search criteria. Want to be notified when more tickets drop?</p>
            <Button variant="outline" className="mt-8">Set Alert for "{searchQuery}"</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListingPage;

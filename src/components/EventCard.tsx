import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  image: string;
  category: string;
  availableTickets: number;
}

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

export const EventCard = ({ event, onClick }: EventCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="glass-card group h-full cursor-pointer overflow-hidden transition-all duration-300 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
          {event.category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="mb-2 text-xl">{event.title}</h3>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-slate-400 text-sm">
            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center text-slate-400 text-sm">
            <MapPin className="mr-2 h-4 w-4 text-blue-500" />
            {event.location}
          </div>
        </div>
        
        <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">From</span>
            <span className="text-xl font-bold text-white">{formatCurrency(event.price)}</span>
          </div>
          <div className="flex items-center text-sm font-medium text-slate-400">
            <Ticket className="mr-1.5 h-4 w-4 rotate-45" />
            {event.availableTickets} left
          </div>
        </div>
      </div>
    </motion.div>
  );
};

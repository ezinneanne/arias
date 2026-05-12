import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Globe, Lock, RefreshCcw, Ticket } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-obsidian-900">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header Section */}
        <section className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              The Future of <span className="text-blue-500">Secure Ticketing</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Arias was built to solve the transparency and security issues that have plagued the ticketing industry for decades. 
              We use advanced verification protocols to ensure every ticket is legitimate, fair, and instantly accessible.
            </p>
          </motion.div>
        </section>

        {/* The Process Grid */}
        <div className="grid gap-12 md:grid-cols-3 mb-32">
          {[
            {
              icon: Search,
              step: "01",
              title: "Verified Inventory",
              desc: "We work directly with official leagues and stadium owners. No third-party brokers, just direct, authenticated listings."
            },
            {
              icon: Lock,
              step: "02",
              title: "Secure Purchase",
              desc: "Our checkout uses high-tier encryption and atomic transactions to guarantee your ticket is reserved exclusively for you."
            },
            {
              icon: Ticket,
              step: "03",
              title: "Digital Handshake",
              desc: "Tickets are delivered as secure digital assets directly to your encrypted Arias wallet, ready for stadium scanning."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 text-4xl font-black text-slate-800/20 group-hover:text-blue-500/10 transition-colors">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature Focus */}
        <section className="grid gap-16 lg:grid-cols-2 items-center mb-32">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Why Arias is Different</h2>
            
            <div className="flex space-x-6">
              <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <RefreshCcw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Anti-Scalping Protection</h4>
                <p className="text-slate-400 text-sm">Our dynamic QR codes refresh every 30 seconds, preventing unauthorized reselling and ensuring the person at the gate is the true owner.</p>
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Global Accessibility</h4>
                <p className="text-slate-400 text-sm">Whether you're in London, Seoul, or New York, Arias provides a unified interface for the world's premier sporting events.</p>
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Zero Fraud Guarantee</h4>
                <p className="text-slate-400 text-sm">Every transaction is recorded on our private ledger, making it impossible to duplicate or forge tickets.</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden glass-card p-1">
             <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1200" alt="Stadium" className="rounded-2xl opacity-80" />
             <div className="absolute inset-0 bg-blue-600/10 hover:bg-transparent transition-all duration-500" />
          </div>
        </section>

        <section className="text-center rounded-3xl bg-blue-600 p-12 lg:p-20 overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to join the area?</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/events"><Button variant="secondary" size="lg">Browse Matches</Button></Link>
              <Link to="/signup"><Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">Create Account</Button></Link>
            </div>
          </div>
          <Zap className="absolute -bottom-20 -right-20 h-80 w-80 text-white/10 rotate-12" />
        </section>

      </div>
    </div>
  );
};

import { Search } from 'lucide-react';
export default AboutPage;

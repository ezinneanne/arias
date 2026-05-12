import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Mail, Phone, HelpCircle, ChevronDown, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';

const FAQS = [
  {
    q: "How do I receive my tickets?",
    a: "After a successful checkout, tickets are instantly delivered to your 'My Tickets' dashboard. You'll also receive a confirmation email with a link to your secure digital wallet."
  },
  {
    q: "Can I transfer my tickets to a friend?",
    a: "Yes, you can transfer tickets directly to another verified Arias user via their email address from your dashboard. Transfers are instant and permanent."
  },
  {
    q: "What is your refund policy?",
    a: "Refunds are automatically issued if an event is cancelled and not rescheduled. For other issues, please contact our support team at least 48 hours sebelum match starts."
  },
  {
    q: "Is the price I see the final price?",
    a: "We believe in transparency. The final price on the checkout page includes the ticket cost and a fixed administration fee. No hidden 'convenience' charges."
  }
];

const SupportPage = () => {
  const { user } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-obsidian-900">
      <div className="mx-auto max-w-7xl px-6">
        
        <header className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Arias Support Squad</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Got questions? We've got answers. Reach out to our 24/7 team for any help with your tickets or account.
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-3 mb-32">
          
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <HelpCircle className="mr-3 h-6 w-6 text-blue-500" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div 
                  key={i} 
                  className="rounded-2xl border border-slate-800 bg-obsidian-800/50 overflow-hidden cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="p-6 flex items-center justify-between">
                    <h4 className="font-bold text-white">{faq.q}</h4>
                    <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </div>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-6 pb-6 text-slate-400 text-sm leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Methods */}
          <div className="space-y-6">
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-6">Quick Contact</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                   <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <MessageSquare className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-white">Live Chat</p>
                      <p className="text-xs text-slate-500">Typical response: 2 mins</p>
                   </div>
                </div>
                <div className="flex items-center space-x-4">
                   <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                      <Mail className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-white">Email Support</p>
                      <p className="text-xs text-slate-500">support@arias.com</p>
                   </div>
                </div>
                <div className="flex items-center space-x-4">
                   <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Phone className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-white">Priority Line</p>
                      <p className="text-xs text-slate-500">Free for VIP holders</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 p-8 text-center bg-blue-600/5">
               <h4 className="font-bold text-white mb-2">Technical Status</h4>
               <div className="flex justify-center items-center space-x-2 text-green-500 text-xs font-bold uppercase tracking-widest">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  All Systems Operational
               </div>
            </div>
          </div>

        </div>

        {/* Support Form */}
        <section className="mx-auto max-w-3xl glass-card p-10 lg:p-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Send us a Message</h2>
            <p className="text-slate-500">Can't find what you're looking for? Drop us a line and we'll get back to you.</p>
          </div>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                <input type="text" placeholder="Enter full name" defaultValue={user?.name || ''} className="input-field w-full text-white" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <input type="email" placeholder="Enter email" defaultValue={user?.email || ''} className="input-field w-full text-white" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Subject</label>
              <select className="input-field w-full text-white appearance-none">
                <option>Ticket Issue</option>
                <option>Payment Query</option>
                <option>Account Access</option>
                <option>Partnership</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Message</label>
              <textarea rows={5} placeholder="How can we help?" className="input-field w-full text-white resize-none" />
            </div>
            <Button className="w-full" size="lg">
              Send Message <Send className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </section>

      </div>
    </div>
  );
};

export default SupportPage;

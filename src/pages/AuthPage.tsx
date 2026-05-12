import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { API_BASE } from '../config';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useApp();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? `${API_BASE}/api/auth/login` : `${API_BASE}/api/auth/register`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      setUser(data.user);
      setToken(data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-obsidian-900">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-blue-600">
        <div>
          <div className="flex items-center space-x-2 text-white mb-12">
            <Ticket className="h-8 w-8 rotate-45" />
            <span className="text-2xl font-bold tracking-tighter">ARIAS</span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Join the most <br />trusted arena in <br />live entertainment.
          </h2>
          <p className="text-blue-100 text-lg max-w-sm">
            Experience verified matches, blockchain security, and instant digital transfers.
          </p>
        </div>
        <div className="flex items-center space-x-8 text-blue-100 opacity-60">
           <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/NBA_logo.svg" className="h-8 invert" alt="NBA" />
           <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png" className="h-8" alt="Barca" />
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="max-w-md w-full">
           <div className="mb-10 lg:hidden text-center">
              <Ticket className="h-10 w-10 text-blue-500 mx-auto mb-4 rotate-45" />
              <h2 className="text-2xl font-bold text-white">ARIAS</h2>
           </div>

           <motion.div
             key={isLogin ? 'login' : 'signup'}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="glass-card p-10"
           >
              <h1 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
              <p className="text-slate-500 mb-8">{isLogin ? 'Enter your details to access your matches.' : 'Sign up to start secure booking.'}</p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleAuth}>
                {!isLogin && (
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                      <input 
                        type="text" 
                        placeholder="Enter your full name" 
                        className="input-field w-full pl-12 text-white" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="input-field w-full pl-12 text-white" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="input-field w-full pl-12 text-white" 
                      required 
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <Button className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Get Started')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-slate-400 hover:text-blue-400 transition-colors block w-full"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

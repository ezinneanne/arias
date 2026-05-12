import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Ticket, DollarSign, TrendingUp, 
  Settings, Search, Plus, Filter, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  ClipboardList, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BASE } from '../config';

type ActiveTab = 'overview' | 'users' | 'events' | 'logs';

export default function AdminDashboard() {
  const { token } = useApp();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await fetch(`${API_BASE}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } else if (activeTab === 'users') {
        const res = await fetch(`${API_BASE}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUsers(await res.json());
      } else if (activeTab === 'events') {
        const res = await fetch(`${API_BASE}/api/events`);
        setEvents(await res.json());
      } else if (activeTab === 'logs') {
        const res = await fetch(`${API_BASE}/api/admin/logs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setLogs(await res.json());
      }
    } catch (error) {
      console.error('Fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">CRM Control Center</h1>
            <p className="text-slate-500">Manage your business operations and insights</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" size="sm" onClick={() => fetchData()}>
               <Settings className="mr-2 h-4 w-4" /> Refresh Data
             </Button>
             <Button size="sm">
               <Plus className="mr-2 h-4 w-4" /> Create Event
             </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/5 mb-8 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'events', label: 'Event Manager', icon: Ticket },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'logs', label: 'Audit Logs', icon: ClipboardList }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === tab.id ? 'text-blue-500' : 'text-slate-500 hover:text-white'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
             <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
             </div>
          ) : (
            <>
              {activeTab === 'overview' && stats && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Revenue', value: `$${(stats.revenue || 0).toLocaleString()}`, trend: '+12.5%', up: true, icon: DollarSign },
                      { label: 'Tickets Sold', value: stats.tickets || 0, trend: '+5.2%', up: true, icon: Ticket },
                      { label: 'Total Users', value: stats.users || 0, trend: '+8.1%', up: true, icon: Users },
                      { label: 'Conversion Rate', value: stats.conversion || '0%', trend: '-0.4%', up: false, icon: TrendingUp },
                    ].map((stat, i) => (
                      <div key={i} className="glass-card p-6 border-white/5">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2 rounded-lg bg-white/5 text-blue-500">
                            <stat.icon className="h-5 w-5" />
                          </div>
                          <div className={`flex items-center text-xs font-bold ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                            {stat.up ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                            {stat.trend}
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="glass-card p-8 border-white/5">
                    <h3 className="text-lg font-bold text-white mb-8">Sales Velocity</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.salesHistory || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                            itemStyle={{ color: '#3b82f6' }}
                          />
                          <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6, stroke: '#1e293b', strokeWidth: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card overflow-hidden border-white/5"
                >
                  <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
                     <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input type="text" placeholder="Search users by name or email..." className="input-field pl-10 w-full text-sm text-white" />
                     </div>
                     <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 text-xs text-slate-500 uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4 font-bold">User</th>
                          <th className="px-6 py-4 font-bold">Role</th>
                          <th className="px-6 py-4 font-bold">Registration Date</th>
                          <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                          <tr key={user.id} className="text-sm hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                                  {user.name?.[0] || 'U'}
                                </div>
                                <div>
                                   <p className="font-medium text-white">{user.name}</p>
                                   <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-xs">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 transition-colors">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'events' && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {events.map((event) => (
                    <div key={event.id} className="glass-card overflow-hidden group">
                      <div className="aspect-video relative overflow-hidden">
                         <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
                         <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 to-transparent" />
                         <div className="absolute top-4 left-4 flex gap-2 text-white">
                            <span className="bg-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter shadow-lg">Active</span>
                            <span className="bg-black/60 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded border border-white/10">{event.category}</span>
                         </div>
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-white mb-2 line-clamp-1">{event.title}</h4>
                        <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
                           <span>{new Date(event.date).toLocaleDateString()}</span>
                           <span className="text-blue-500 font-bold">{event.available_tickets} / {event.capacity} Tickets</span>
                        </div>
                        <div className="flex gap-2">
                           <Button size="sm" className="w-full">Edit</Button>
                           <Button variant="outline" size="sm" className="w-full">Audit</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'logs' && (
                <motion.div
                   key="logs"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="glass-card border-white/5"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 text-xs text-slate-500 uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4 font-bold">Action</th>
                          <th className="px-6 py-4 font-bold">User Context</th>
                          <th className="px-6 py-4 font-bold">IP Address</th>
                          <th className="px-6 py-4 font-bold text-right">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {logs.map((log) => (
                          <tr key={log.id} className="text-sm">
                            <td className="px-6 py-4">
                              <code className="text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded">{log.action}</code>
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-xs">
                              {log.user_id ? `UserID: ${log.user_id.substring(0,8)}...` : 'Anonymous'}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs font-mono">
                              {log.ip_address || '127.0.0.1'}
                            </td>
                            <td className="px-6 py-4 text-right text-slate-600 text-xs">
                              {new Date(log.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Users, MapPin, Calendar, Sparkles, Loader2 } from 'lucide-react';
import { createGroup } from '../../services/groupService';
import type { TripGroup } from '../../types/group';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: { uid: string; name: string; email: string };
  onCreated: (group: TripGroup) => void;
}

export const CreateGroupModal: React.FC<Props> = ({ isOpen, onClose, user, onCreated }) => {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !destination || !startDate || !endDate) return;
    
    setLoading(true);
    setTimeout(() => {
      const group = createGroup(name, destination, startDate, endDate, user);
      onCreated(group);
      setLoading(false);
      setName(''); setDestination(''); setStartDate(''); setEndDate('');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="relative p-8">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create Trip Group</h2>
              <p className="text-sm text-slate-400">Plan together, travel together</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 tracking-wider mb-2 block">GROUP NAME</label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g., Goa Gang 2026"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-400 tracking-wider mb-2 block">DESTINATION</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g., Goa, India"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono font-bold text-slate-400 tracking-wider mb-2 block">START DATE</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-all text-sm [color-scheme:dark]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono font-bold text-slate-400 tracking-wider mb-2 block">END DATE</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-all text-sm [color-scheme:dark]"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Plus, Clock, MapPin, ThumbsUp, Trash2, Calendar } from 'lucide-react';
import type { TripGroup } from '../../types/group';
import { addItineraryItem, removeItineraryItem, voteItineraryItem } from '../../services/groupService';

interface Props {
  group: TripGroup;
  currentUserId: string;
  currentUserName: string;
  onRefresh: () => void;
}

export const ItineraryTab: React.FC<Props> = ({ group, currentUserId, currentUserName, onRefresh }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDay, setNewDay] = useState(1);
  const [newTime, setNewTime] = useState('09:00');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');

  // Calculate days from dates
  const start = new Date(group.startDate);
  const end = new Date(group.endDate);
  const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const handleAdd = () => {
    if (!newTitle) return;
    addItineraryItem(group.id, {
      day: newDay,
      time: newTime,
      title: newTitle,
      description: newDesc,
      location: newLocation,
      addedBy: currentUserId,
      addedByName: currentUserName,
    });
    setNewTitle(''); setNewDesc(''); setNewLocation('');
    setShowAddForm(false);
    onRefresh();
  };

  const handleRemove = (itemId: string) => {
    removeItineraryItem(group.id, itemId);
    onRefresh();
  };

  const handleVote = (itemId: string) => {
    voteItineraryItem(group.id, itemId, currentUserId);
    onRefresh();
  };

  // Group by day
  const itemsByDay: Record<number, typeof group.itinerary> = {};
  group.itinerary.forEach(item => {
    if (!itemsByDay[item.day]) itemsByDay[item.day] = [];
    itemsByDay[item.day].push(item);
  });

  const dayColors = [
    'border-l-blue-500', 'border-l-emerald-500', 'border-l-purple-500',
    'border-l-orange-500', 'border-l-rose-500', 'border-l-cyan-500',
    'border-l-yellow-500', 'border-l-indigo-500',
  ];

  return (
    <div className="space-y-6">
      {/* Add button */}
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs font-bold text-slate-400 tracking-wider">
          SHARED ITINERARY
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors font-mono tracking-wider"
        >
          <Plus className="w-3.5 h-3.5" />
          ADD ACTIVITY
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 space-y-4 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-500 tracking-wider mb-1.5 block">DAY</label>
              <select
                value={newDay}
                onChange={e => setNewDay(Number(e.target.value))}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-3 text-white outline-none text-sm"
              >
                {Array.from({ length: totalDays }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-500 tracking-wider mb-1.5 block">TIME</label>
              <input
                type="time"
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-3 text-white outline-none text-sm [color-scheme:dark]"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-mono font-bold text-slate-500 tracking-wider mb-1.5 block">ACTIVITY</label>
            <input
              type="text"
              placeholder="e.g., Visit Amber Fort"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500/50 rounded-lg py-2.5 px-3 text-white placeholder-slate-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono font-bold text-slate-500 tracking-wider mb-1.5 block">DESCRIPTION</label>
            <textarea
              placeholder="Details about the activity..."
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500/50 rounded-lg py-2.5 px-3 text-white placeholder-slate-500 outline-none text-sm resize-none h-20"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono font-bold text-slate-500 tracking-wider mb-1.5 block">LOCATION (optional)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="e.g., Amer, Jaipur"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500/50 rounded-lg py-2.5 pl-10 pr-3 text-white placeholder-slate-500 outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={!newTitle}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white rounded-lg font-bold text-sm transition-all"
            >
              Add to Itinerary
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-sm transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {group.itinerary.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No activities planned yet</p>
          <p className="text-sm mt-1">Start building your itinerary together!</p>
        </div>
      )}

      {/* Days */}
      {Array.from({ length: totalDays }, (_, i) => i + 1).map(dayNum => {
        const items = itemsByDay[dayNum] || [];
        const dayDate = new Date(start);
        dayDate.setDate(dayDate.getDate() + dayNum - 1);
        const colorClass = dayColors[(dayNum - 1) % dayColors.length];

        return (
          <div key={dayNum} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-yellow-500 tracking-wider">
                DAY {String(dayNum).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-600">—</span>
              <span className="text-xs text-slate-400">
                {dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {items.length === 0 ? (
              <div className={`border-l-2 ${colorClass} bg-slate-800/10 border border-slate-800/50 rounded-r-lg px-5 py-4`}>
                <p className="text-sm text-slate-600 italic">No activities for this day</p>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className={`border-l-2 ${colorClass} bg-slate-800/20 hover:bg-slate-800/30 border border-slate-700/30 rounded-r-xl px-5 py-4 transition-colors group`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-mono text-xs text-slate-400">{item.time}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      {item.description && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                      )}
                      {item.location && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-500">{item.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-slate-600">Added by {item.addedByName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleVote(item.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          item.votes.includes(currentUserId)
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800/50 text-slate-400 hover:text-emerald-400 border border-slate-700/50'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {item.votes.length}
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
};

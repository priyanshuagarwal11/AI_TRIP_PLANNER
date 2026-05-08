import React, { useState } from 'react';
import { Plus, Users, MapPin, Calendar, ArrowRight, Trash2, Search, Link, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { TripGroup } from '../../types/group';
import { getGroupsForUser, deleteGroup, joinByInviteCode, getInvitesForEmail, acceptInvitation, rejectInvitation } from '../../services/groupService';
import { CreateGroupModal } from './CreateGroupModal';
import { GroupDetail } from './GroupDetail';

export const GroupTrips: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { currentUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(k => k + 1);

  if (!currentUser) {
    return (
      <div className="min-h-[80vh] bg-[#0B1120] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold font-serif text-white mb-3">Group Travel</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Plan trips together with friends. Split expenses, chat, vote on activities, and create shared itineraries.
          </p>
          <button
            onClick={onOpenAuth}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 inline-flex items-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Sign in to get started
          </button>
        </div>
      </div>
    );
  }

  const user = {
    uid: currentUser.uid,
    name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
    email: currentUser.email || '',
  };

  const groups = getGroupsForUser(user.uid);
  const pendingInvites = getInvitesForEmail(user.email);

  // If a group is selected, show detail view
  if (selectedGroupId) {
    return (
      <GroupDetail
        groupId={selectedGroupId}
        user={user}
        onBack={() => { setSelectedGroupId(null); refresh(); }}
      />
    );
  }

  const handleJoin = () => {
    if (!joinCode) return;
    const result = joinByInviteCode(joinCode.toUpperCase(), user);
    if (result) {
      setJoinCode('');
      setJoinError('');
      setShowJoinInput(false);
      setSelectedGroupId(result.id);
      refresh();
    } else {
      setJoinError('Invalid invite code');
    }
  };

  const handleAcceptInvite = (inviteId: string) => {
    acceptInvitation(inviteId, user);
    refresh();
  };

  const handleRejectInvite = (inviteId: string) => {
    rejectInvitation(inviteId);
    refresh();
  };

  const handleDelete = (groupId: string) => {
    if (confirm('Delete this group? This cannot be undone.')) {
      deleteGroup(groupId);
      refresh();
    }
  };

  const getGradient = (idx: number) => {
    const gradients = [
      'from-blue-600/20 to-cyan-600/10',
      'from-purple-600/20 to-pink-600/10',
      'from-emerald-600/20 to-teal-600/10',
      'from-orange-600/20 to-amber-600/10',
      'from-rose-600/20 to-red-600/10',
      'from-indigo-600/20 to-violet-600/10',
    ];
    return gradients[idx % gradients.length];
  };

  const getBorderColor = (idx: number) => {
    const colors = [
      'border-blue-500/20 hover:border-blue-500/40',
      'border-purple-500/20 hover:border-purple-500/40',
      'border-emerald-500/20 hover:border-emerald-500/40',
      'border-orange-500/20 hover:border-orange-500/40',
      'border-rose-500/20 hover:border-rose-500/40',
      'border-indigo-500/20 hover:border-indigo-500/40',
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white" key={refreshKey}>
      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        user={user}
        onCreated={(g) => { setSelectedGroupId(g.id); refresh(); }}
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-white">
              Group <span className="italic text-yellow-500">Trips</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Plan together, travel together, split fairly.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJoinInput(!showJoinInput)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-300 rounded-xl font-bold text-sm transition-all"
            >
              <Link className="w-4 h-4" />
              Join
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/15"
            >
              <Plus className="w-4 h-4" />
              New Group
            </button>
          </div>
        </div>

        {/* Join by code */}
        {showJoinInput && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 mb-6 animate-in slide-in-from-top-2">
            <h4 className="font-bold text-white mb-3 text-sm">Join with invite code</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter invite code (e.g., ABC123)"
                value={joinCode}
                onChange={e => { setJoinCode(e.target.value); setJoinError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
                className="flex-1 bg-slate-900/50 border border-slate-700 focus:border-blue-500/50 rounded-lg py-2.5 px-4 text-white placeholder-slate-500 outline-none text-sm uppercase tracking-wider"
              />
              <button
                onClick={handleJoin}
                disabled={!joinCode}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white rounded-lg font-bold text-sm transition-all"
              >
                Join Group
              </button>
            </div>
            {joinError && <p className="text-red-400 text-xs mt-2">{joinError}</p>}
          </div>
        )}

        {/* Pending invitations */}
        {pendingInvites.length > 0 && (
          <div className="mb-8">
            <h3 className="font-mono text-xs font-bold text-yellow-500 tracking-wider mb-3">
              PENDING INVITATIONS ({pendingInvites.length})
            </h3>
            <div className="space-y-2">
              {pendingInvites.map(inv => (
                <div key={inv.id} className="flex items-center gap-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm">{inv.groupName}</h4>
                    <span className="text-xs text-slate-400">Invited by {inv.invitedByName}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRejectInvite(inv.id)}
                      className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptInvite(inv.id)}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-xs font-bold transition-all"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups grid */}
        {groups.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-2xl bg-slate-800/30 border border-slate-700/30 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No groups yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              Create your first group trip or join one using an invite code.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/15 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Group
            </button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group, idx) => {
            const start = new Date(group.startDate);
            const end = new Date(group.endDate);
            const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

            return (
              <div
                key={group.id}
                onClick={() => setSelectedGroupId(group.id)}
                className={`relative bg-gradient-to-br ${getGradient(idx)} border ${getBorderColor(idx)} rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl group overflow-hidden`}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-white text-lg leading-tight flex-1 pr-2">{group.name}</h3>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(group.id); }}
                      className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-yellow-500" />
                      <span>{group.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>
                        {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs">{totalDays}d</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Member avatars */}
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 4).map((m, i) => {
                        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500'];
                        return (
                          <div
                            key={m.uid}
                            className={`w-8 h-8 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white text-xs font-bold border-2 border-[#0B1120]`}
                            title={m.name}
                          >
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                        );
                      })}
                      {group.members.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-[10px] font-bold border-2 border-[#0B1120]">
                          +{group.members.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-white transition-colors text-xs font-bold">
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

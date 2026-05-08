import React, { useState } from 'react';
import { UserPlus, Shield, Crown, X, Copy, Check, Link, Mail, Trash2 } from 'lucide-react';
import type { TripGroup, GroupMember } from '../../types/group';
import { createInvitation, removeMember, getInvitesForEmail } from '../../services/groupService';

interface Props {
  group: TripGroup;
  currentUserId: string;
  onRefresh: () => void;
}

export const MembersTab: React.FC<Props> = ({ group, currentUserId, onRefresh }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const currentMember = group.members.find(m => m.uid === currentUserId);
  const isAdmin = currentMember?.role === 'admin';

  const handleInvite = () => {
    if (!inviteEmail || !currentMember) return;
    createInvitation(
      group.id, group.name,
      currentUserId, currentMember.name,
      inviteEmail
    );
    setInviteEmail('');
    setShowInviteForm(false);
    onRefresh();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}?joinCode=${group.inviteCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveMember = (uid: string) => {
    if (confirm('Remove this member from the group?')) {
      removeMember(group.id, uid);
      onRefresh();
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'admin') return <Crown className="w-3.5 h-3.5 text-yellow-500" />;
    return <Shield className="w-3.5 h-3.5 text-blue-400" />;
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-blue-500 to-cyan-400',
      'from-purple-500 to-pink-400',
      'from-emerald-500 to-teal-400',
      'from-orange-500 to-amber-400',
      'from-rose-500 to-red-400',
      'from-indigo-500 to-violet-400',
    ];
    const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
    return colors[idx];
  };

  return (
    <div className="space-y-6">
      {/* Invite section */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            Invite Friends
          </h3>
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {showInviteForm ? 'CLOSE' : '+ INVITE'}
          </button>
        </div>

        {showInviteForm && (
          <div className="space-y-4 mb-4 animate-in slide-in-from-top-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleInvite()}
                  className="w-full bg-slate-900/50 border border-slate-700 focus:border-emerald-500/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 outline-none transition-all text-sm"
                />
              </div>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        )}

        {/* Shareable link */}
        <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-700/50 rounded-lg p-3">
          <Link className="w-4 h-4 text-slate-400 shrink-0" />
          <code className="text-xs text-slate-300 font-mono flex-1 truncate">
            Invite Code: <span className="text-blue-400 font-bold">{group.inviteCode}</span>
          </code>
          <button
            onClick={handleCopyLink}
            className="p-1.5 hover:bg-slate-700/50 rounded-md transition-colors text-slate-400 hover:text-white"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Members list */}
      <div>
        <h3 className="font-mono text-xs font-bold text-slate-400 tracking-wider mb-4">
          MEMBERS ({group.members.length})
        </h3>
        <div className="space-y-2">
          {group.members.map(member => (
            <div
              key={member.uid}
              className="flex items-center gap-3 bg-slate-800/20 hover:bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 transition-colors group"
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(member.name)} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm truncate">{member.name}</span>
                  {member.uid === currentUserId && (
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">YOU</span>
                  )}
                </div>
                <span className="text-xs text-slate-500 truncate block">{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                  {getRoleIcon(member.role)}
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {member.role}
                  </span>
                </div>
                {isAdmin && member.uid !== currentUserId && (
                  <button
                    onClick={() => handleRemoveMember(member.uid)}
                    className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

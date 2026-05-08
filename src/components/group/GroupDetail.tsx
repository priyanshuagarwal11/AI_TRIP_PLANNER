import React, { useState, useCallback } from 'react';
import { ArrowLeft, Users, Calendar, MessageCircle, Receipt, BarChart3, MapPin, Bell, Link, Copy, Check } from 'lucide-react';
import type { TripGroup } from '../../types/group';
import { getGroupById, getUnreadCount } from '../../services/groupService';
import { MembersTab } from './MembersTab';
import { ItineraryTab } from './ItineraryTab';
import { ChatTab } from './ChatTab';
import { ExpensesTab } from './ExpensesTab';
import { BalanceDashboard } from './BalanceDashboard';
import { PollsSection } from './PollsSection';
import { NotificationsPanel } from './NotificationsPanel';

type TabId = 'itinerary' | 'members' | 'chat' | 'expenses' | 'dashboard';

interface Props {
  groupId: string;
  user: { uid: string; name: string; email: string };
  onBack: () => void;
}

export const GroupDetail: React.FC<Props> = ({ groupId, user, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabId>('itinerary');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [copied, setCopied] = useState(false);

  const group = getGroupById(groupId);
  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  if (!group) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-lg">Group not found</p>
        <button onClick={onBack} className="mt-4 text-blue-400 hover:text-blue-300 font-bold text-sm">← Go Back</button>
      </div>
    );
  }

  const notifCount = getUnreadCount(user.uid, user.email);

  const tabs: { id: TabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'itinerary', label: 'Itinerary', icon: <Calendar className="w-4 h-4" /> },
    { id: 'members', label: 'Members', icon: <Users className="w-4 h-4" />, badge: group.members.length },
    { id: 'chat', label: 'Chat', icon: <MessageCircle className="w-4 h-4" />, badge: group.messages.length },
    { id: 'expenses', label: 'Expenses', icon: <Receipt className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  // Calculate trip days
  const start = new Date(group.startDate);
  const end = new Date(group.endDate);
  const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white" key={refreshKey}>
      <NotificationsPanel
        userId={user.uid}
        userEmail={user.email}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative container mx-auto px-4 pt-6 pb-4">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              All Groups
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Link className="w-3.5 h-3.5" />
                {group.inviteCode}
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>

              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2.5 hover:bg-slate-800/50 rounded-xl transition-colors text-slate-400 hover:text-white"
              >
                <Bell className="w-5 h-5" />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Group info */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-white mb-2">
              {group.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-yellow-500" />
                <span>{group.destination}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  {new Date(group.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {' — '}
                  {new Date(group.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-slate-600">·</span>
                <span>{totalDays} days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>{group.members.length} members</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white border border-white/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-white/10 text-white' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {activeTab === 'itinerary' && (
          <>
            <ItineraryTab
              group={group}
              currentUserId={user.uid}
              currentUserName={user.name}
              onRefresh={refresh}
            />
            <PollsSection
              group={group}
              currentUserId={user.uid}
              currentUserName={user.name}
              onRefresh={refresh}
            />
          </>
        )}

        {activeTab === 'members' && (
          <MembersTab
            group={group}
            currentUserId={user.uid}
            onRefresh={refresh}
          />
        )}

        {activeTab === 'chat' && (
          <ChatTab
            group={group}
            currentUserId={user.uid}
            currentUserName={user.name}
            onRefresh={refresh}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesTab
            group={group}
            currentUserId={user.uid}
            currentUserName={user.name}
            onRefresh={refresh}
          />
        )}

        {activeTab === 'dashboard' && (
          <BalanceDashboard
            group={group}
            currentUserId={user.uid}
            currentUserName={user.name}
            onRefresh={refresh}
          />
        )}
      </div>
    </div>
  );
};

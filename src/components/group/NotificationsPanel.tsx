import React from 'react';
import { Bell, Check, CheckCheck, UserPlus, Receipt, CreditCard, Calendar, MessageCircle, BarChart3 } from 'lucide-react';
import type { GroupNotification } from '../../types/group';
import { getNotificationsForUser, markNotificationRead, markAllNotificationsRead } from '../../services/groupService';

interface Props {
  userId: string;
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<Props> = ({ userId, userEmail, isOpen, onClose }) => {
  const notifications = getNotificationsForUser(userId, userEmail);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    markAllNotificationsRead(userId, userEmail);
  };

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
  };

  const getIcon = (type: GroupNotification['type']) => {
    switch (type) {
      case 'invite': return <UserPlus className="w-4 h-4 text-blue-400" />;
      case 'expense': return <Receipt className="w-4 h-4 text-orange-400" />;
      case 'settle': return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'itinerary': return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'chat': return <MessageCircle className="w-4 h-4 text-cyan-400" />;
      case 'poll': return <BarChart3 className="w-4 h-4 text-yellow-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-[#0f172a] border-l border-slate-700/50 h-full overflow-hidden flex flex-col animate-in slide-in-from-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-white text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-mono font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              MARK ALL READ
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No notifications</p>
            </div>
          )}

          {[...notifications].reverse().map(notif => (
            <div
              key={notif.id}
              onClick={() => handleMarkRead(notif.id)}
              className={`flex items-start gap-3 p-4 border-b border-slate-800/50 cursor-pointer transition-colors ${
                notif.read ? 'opacity-50' : 'bg-slate-800/10 hover:bg-slate-800/20'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-slate-800/50 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-bold text-white">{notif.title}</h5>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                <span className="text-[10px] text-slate-600 font-mono mt-1 block">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

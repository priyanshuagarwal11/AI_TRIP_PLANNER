import React, { useState, useRef, useEffect } from 'react';
import { Send, Link as LinkIcon, MapPin, AtSign, Smile } from 'lucide-react';
import type { TripGroup, ChatMessage } from '../../types/group';
import { sendMessage } from '../../services/groupService';

interface Props {
  group: TripGroup;
  currentUserId: string;
  currentUserName: string;
  onRefresh: () => void;
}

export const ChatTab: React.FC<Props> = ({ group, currentUserId, currentUserName, onRefresh }) => {
  const [text, setText] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [group.messages.length]);

  const handleSend = () => {
    if (!text.trim()) return;

    // Detect mentions
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = mentionRegex.exec(text)) !== null) {
      const member = group.members.find(m => m.name.toLowerCase().includes(match![1].toLowerCase()));
      if (member) mentions.push(member.uid);
    }

    // Detect type
    const urlRegex = /https?:\/\/[^\s]+/;
    const type = urlRegex.test(text) ? 'link' as const : 'text' as const;

    sendMessage(group.id, {
      senderId: currentUserId,
      senderName: currentUserName,
      text: text.trim(),
      type,
      mentions,
    });

    setText('');
    onRefresh();
  };

  const insertMention = (name: string) => {
    setText(prev => prev + `@${name} `);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  // Group messages by date
  const messagesByDate: Record<string, ChatMessage[]> = {};
  group.messages.forEach(msg => {
    const dateKey = new Date(msg.createdAt).toDateString();
    if (!messagesByDate[dateKey]) messagesByDate[dateKey] = [];
    messagesByDate[dateKey].push(msg);
  });

  const renderMessageText = (text: string) => {
    // Highlight mentions
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return <span key={i} className="text-blue-400 font-bold">{part}</span>;
      }
      // Highlight links
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const linkParts = part.split(urlRegex);
      return linkParts.map((lp, j) => {
        if (lp.match(urlRegex)) {
          return (
            <a key={`${i}-${j}`} href={lp} target="_blank" rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300 break-all">
              {lp}
            </a>
          );
        }
        return <span key={`${i}-${j}`}>{lp}</span>;
      });
    });
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
        {group.messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <Smile className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No messages yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        )}

        {Object.entries(messagesByDate).map(([dateKey, msgs]) => (
          <div key={dateKey}>
            {/* Date divider */}
            <div className="flex items-center gap-3 py-4">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span className="text-[10px] font-mono font-bold text-slate-600 tracking-wider">
                {formatDate(msgs[0].createdAt)}
              </span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            {msgs.map((msg, idx) => {
              const isMine = msg.senderId === currentUserId;
              const showAvatar = idx === 0 || msgs[idx - 1].senderId !== msg.senderId;

              return (
                <div key={msg.id} className={`flex gap-2.5 mb-1 ${isMine ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className="w-8 shrink-0">
                    {showAvatar && !isMine && (
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(msg.senderName)} flex items-center justify-center text-white text-xs font-bold`}>
                        {msg.senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                    {showAvatar && !isMine && (
                      <span className="text-[10px] font-bold text-slate-500 mb-1 ml-1">{msg.senderName}</span>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMine 
                        ? 'bg-blue-600 text-white rounded-br-md' 
                        : 'bg-slate-800/60 text-slate-200 border border-slate-700/30 rounded-bl-md'
                    }`}>
                      {renderMessageText(msg.text)}
                    </div>
                    <span className={`text-[9px] text-slate-600 mt-0.5 ${isMine ? 'mr-1' : 'ml-1'}`}>
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Mention dropdown */}
      {showMentions && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-2 mb-2 animate-in slide-in-from-bottom-2 max-h-40 overflow-y-auto">
          {group.members
            .filter(m => m.uid !== currentUserId)
            .map(m => (
              <button
                key={m.uid}
                onClick={() => insertMention(m.name)}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
              >
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarColor(m.name)} flex items-center justify-center text-white text-xs font-bold`}>
                  {m.name.charAt(0)}
                </div>
                <span className="text-sm text-white font-medium">{m.name}</span>
              </button>
            ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
        <button
          onClick={() => setShowMentions(!showMentions)}
          className="p-2.5 hover:bg-slate-800/50 rounded-xl transition-colors text-slate-400 hover:text-blue-400"
          title="Mention someone"
        >
          <AtSign className="w-5 h-5" />
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-800/40 border border-slate-700/50 focus:border-blue-500/40 rounded-xl py-3 px-4 text-white placeholder-slate-500 outline-none text-sm transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white rounded-xl transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { BarChart3, Plus, CheckCircle2, Lock } from 'lucide-react';
import type { TripGroup } from '../../types/group';
import { createPoll, votePoll, closePoll } from '../../services/groupService';

interface Props {
  group: TripGroup;
  currentUserId: string;
  currentUserName: string;
  onRefresh: () => void;
}

export const PollsSection: React.FC<Props> = ({ group, currentUserId, currentUserName, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleCreate = () => {
    const validOptions = options.filter(o => o.trim());
    if (!question || validOptions.length < 2) return;
    createPoll(group.id, question, validOptions, currentUserId, currentUserName);
    setQuestion(''); setOptions(['', '']);
    setShowForm(false);
    onRefresh();
  };

  const handleVote = (pollId: string, optionId: string) => {
    votePoll(group.id, pollId, optionId, currentUserId);
    onRefresh();
  };

  const handleClose = (pollId: string) => {
    closePoll(group.id, pollId);
    onRefresh();
  };

  const addOption = () => setOptions([...options, '']);

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <h4 className="font-mono text-xs font-bold text-slate-400 tracking-wider flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5" />
          POLLS
        </h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-mono font-bold text-blue-400 hover:text-blue-300 transition-colors"
        >
          + CREATE POLL
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 space-y-4 animate-in slide-in-from-top-2">
          <input
            type="text"
            placeholder="What's your question?"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500/50 rounded-lg py-2.5 px-3 text-white placeholder-slate-500 outline-none text-sm"
          />
          {options.map((opt, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={e => {
                const newOpts = [...options];
                newOpts[i] = e.target.value;
                setOptions(newOpts);
              }}
              className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500/50 rounded-lg py-2.5 px-3 text-white placeholder-slate-500 outline-none text-sm"
            />
          ))}
          <button
            onClick={addOption}
            className="text-xs text-blue-400 hover:text-blue-300 font-bold"
          >
            + Add option
          </button>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-sm font-bold transition-all">
              Create Poll
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {group.polls.length === 0 && !showForm && (
        <p className="text-sm text-slate-600 text-center py-6">No polls created yet</p>
      )}

      {[...group.polls].reverse().map(poll => {
        const totalVotes = poll.options.reduce((s, o) => s + o.votes.length, 0);
        const userVoted = poll.options.some(o => o.votes.includes(currentUserId));
        const isCreator = poll.createdBy === currentUserId;

        return (
          <div key={poll.id} className="bg-slate-800/20 border border-slate-700/30 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h5 className="font-bold text-white text-sm">{poll.question}</h5>
                <span className="text-[10px] text-slate-500">by {poll.createdByName} · {totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
              </div>
              {poll.closed && (
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                  <Lock className="w-3 h-3" /> CLOSED
                </span>
              )}
              {!poll.closed && isCreator && (
                <button
                  onClick={() => handleClose(poll.id)}
                  className="text-[10px] font-mono font-bold text-red-400 hover:text-red-300"
                >
                  CLOSE
                </button>
              )}
            </div>
            <div className="space-y-2">
              {poll.options.map(opt => {
                const pct = totalVotes > 0 ? (opt.votes.length / totalVotes) * 100 : 0;
                const isSelected = opt.votes.includes(currentUserId);

                return (
                  <button
                    key={opt.id}
                    onClick={() => !poll.closed && handleVote(poll.id, opt.id)}
                    disabled={poll.closed}
                    className={`w-full text-left relative overflow-hidden rounded-lg p-3 border transition-all ${
                      isSelected
                        ? 'border-blue-500/30 bg-blue-500/10'
                        : 'border-slate-700/30 bg-slate-900/30 hover:border-slate-600'
                    } ${poll.closed ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {/* Background bar */}
                    {(userVoted || poll.closed) && (
                      <div
                        className={`absolute inset-y-0 left-0 ${isSelected ? 'bg-blue-500/15' : 'bg-slate-700/20'} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    )}
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                        <span className="text-sm text-white">{opt.text}</span>
                      </div>
                      {(userVoted || poll.closed) && (
                        <span className="text-xs font-mono text-slate-400">{pct.toFixed(0)}%</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

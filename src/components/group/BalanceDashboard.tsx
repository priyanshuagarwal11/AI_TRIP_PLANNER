import React, { useState } from 'react';
import { ArrowRight, Wallet, TrendingUp, IndianRupee, CheckCircle2, PieChart } from 'lucide-react';
import type { TripGroup } from '../../types/group';
import { calculateBalances, getCategoryBreakdown, getTotalCost, getPerPersonCost, settleUp } from '../../services/groupService';

interface Props {
  group: TripGroup;
  currentUserId: string;
  currentUserName: string;
  onRefresh: () => void;
}

export const BalanceDashboard: React.FC<Props> = ({ group, currentUserId, currentUserName, onRefresh }) => {
  const [settleModal, setSettleModal] = useState<{ fromUid: string; fromName: string; toUid: string; toName: string; amount: number } | null>(null);

  const { balances, debts } = calculateBalances(group);
  const categoryBreakdown = getCategoryBreakdown(group);
  const totalCost = getTotalCost(group);
  const perPersonCost = getPerPersonCost(group);

  const handleSettle = () => {
    if (!settleModal) return;
    settleUp(
      group.id,
      { uid: settleModal.fromUid, name: settleModal.fromName },
      { uid: settleModal.toUid, name: settleModal.toName },
      settleModal.amount
    );
    setSettleModal(null);
    onRefresh();
  };

  const categoryColors: Record<string, string> = {
    hotel: 'bg-blue-500',
    food: 'bg-orange-500',
    travel: 'bg-emerald-500',
    activities: 'bg-purple-500',
    shopping: 'bg-pink-500',
    other: 'bg-slate-500',
  };

  const categoryEmojis: Record<string, string> = {
    hotel: '🏨',
    food: '🍕',
    travel: '🚕',
    activities: '🎯',
    shopping: '🛍️',
    other: '📦',
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <IndianRupee className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-mono font-bold text-blue-400/70 tracking-wider">TOTAL COST</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{totalCost.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono font-bold text-emerald-400/70 tracking-wider">PER PERSON</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{perPersonCost.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-mono font-bold text-purple-400/70 tracking-wider">SETTLEMENTS</span>
          </div>
          <p className="text-3xl font-bold text-white">{group.settleRecords.length}</p>
        </div>
      </div>

      {/* Category breakdown */}
      {Object.keys(categoryBreakdown).length > 0 && (
        <div className="bg-slate-800/20 border border-slate-700/30 rounded-xl p-5">
          <h4 className="font-mono text-xs font-bold text-slate-400 tracking-wider mb-4 flex items-center gap-2">
            <PieChart className="w-3.5 h-3.5" />
            CATEGORY BREAKDOWN
          </h4>
          {/* Bar chart */}
          <div className="space-y-3">
            {Object.entries(categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amt]) => {
                const pct = totalCost > 0 ? (amt / totalCost) * 100 : 0;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-lg w-8 text-center">{categoryEmojis[cat] || '📦'}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-300 capitalize">{cat}</span>
                        <span className="text-xs font-mono text-slate-400">₹{amt.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${categoryColors[cat] || 'bg-slate-500'} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 w-10 text-right">{pct.toFixed(0)}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Individual balances */}
      <div className="bg-slate-800/20 border border-slate-700/30 rounded-xl p-5">
        <h4 className="font-mono text-xs font-bold text-slate-400 tracking-wider mb-4">INDIVIDUAL BALANCES</h4>
        <div className="space-y-2">
          {balances.map(b => (
            <div key={b.uid} className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                b.balance >= 0 ? 'bg-emerald-500/30' : 'bg-red-500/30'
              }`}>
                {b.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-white flex-1 font-medium">
                {b.name}
                {b.uid === currentUserId && <span className="text-slate-500 text-xs ml-1">(You)</span>}
              </span>
              <span className={`font-bold text-sm font-mono ${
                b.balance > 0 ? 'text-emerald-400' : b.balance < 0 ? 'text-red-400' : 'text-slate-500'
              }`}>
                {b.balance > 0 ? '+' : ''}₹{Math.abs(b.balance).toLocaleString('en-IN')}
              </span>
              <span className={`text-[10px] font-mono ${
                b.balance > 0 ? 'text-emerald-500/70' : b.balance < 0 ? 'text-red-500/70' : 'text-slate-600'
              }`}>
                {b.balance > 0 ? 'gets back' : b.balance < 0 ? 'owes' : 'settled'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Simplified debts */}
      {debts.length > 0 && (
        <div className="bg-slate-800/20 border border-slate-700/30 rounded-xl p-5">
          <h4 className="font-mono text-xs font-bold text-slate-400 tracking-wider mb-4">WHO OWES WHOM</h4>
          <div className="space-y-3">
            {debts.map((debt, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-900/30 rounded-xl p-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm font-bold text-red-400 truncate">{debt.from.name}</span>
                  <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="text-sm font-bold text-emerald-400 truncate">{debt.to.name}</span>
                </div>
                <span className="font-bold text-white font-mono text-sm shrink-0">
                  ₹{debt.amount.toLocaleString('en-IN')}
                </span>
                {(debt.from.uid === currentUserId || debt.to.uid === currentUserId) && (
                  <button
                    onClick={() => setSettleModal({
                      fromUid: debt.from.uid,
                      fromName: debt.from.name,
                      toUid: debt.to.uid,
                      toName: debt.to.name,
                      amount: debt.amount,
                    })}
                    className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold transition-all border border-emerald-500/20 shrink-0"
                  >
                    Settle Up
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {debts.length === 0 && group.expenses.length > 0 && (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400 opacity-50" />
          <p className="text-sm font-bold text-emerald-400">All settled up! 🎉</p>
          <p className="text-xs text-slate-500 mt-1">No outstanding balances</p>
        </div>
      )}

      {/* Settlement history */}
      {group.settleRecords.length > 0 && (
        <div className="bg-slate-800/20 border border-slate-700/30 rounded-xl p-5">
          <h4 className="font-mono text-xs font-bold text-slate-400 tracking-wider mb-4">SETTLEMENT HISTORY</h4>
          <div className="space-y-2">
            {[...group.settleRecords].reverse().map(s => (
              <div key={s.id} className="flex items-center gap-3 bg-slate-900/20 rounded-lg p-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-slate-300 flex-1">
                  <span className="font-bold">{s.from.name}</span>
                  <span className="text-slate-500"> paid </span>
                  <span className="font-bold text-emerald-400">₹{s.amount.toLocaleString('en-IN')}</span>
                  <span className="text-slate-500"> to </span>
                  <span className="font-bold">{s.to.name}</span>
                </span>
                <span className="text-[10px] text-slate-600 font-mono">
                  {new Date(s.settledAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settle modal */}
      {settleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSettleModal(null)} />
          <div className="relative bg-[#0f172a] border border-slate-700/50 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Settle Up</h3>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold mx-auto mb-2">
                  {settleModal.fromName.charAt(0)}
                </div>
                <span className="text-xs text-slate-400">{settleModal.fromName}</span>
              </div>
              <div className="text-center">
                <ArrowRight className="w-6 h-6 text-slate-600" />
                <span className="text-lg font-bold text-emerald-400 font-mono mt-1 block">
                  ₹{settleModal.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold mx-auto mb-2">
                  {settleModal.toName.charAt(0)}
                </div>
                <span className="text-xs text-slate-400">{settleModal.toName}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSettleModal(null)}
                className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSettle}
                className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-sm transition-all"
              >
                Confirm Settlement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

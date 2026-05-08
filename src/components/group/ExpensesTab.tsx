import React, { useState } from 'react';
import { Plus, IndianRupee, Receipt, SplitSquareVertical, Trash2, Tag, User } from 'lucide-react';
import type { TripGroup, ExpenseCategory, SplitType, ExpenseSplit } from '../../types/group';
import { addExpense, removeExpense } from '../../services/groupService';

interface Props {
  group: TripGroup;
  currentUserId: string;
  currentUserName: string;
  onRefresh: () => void;
}

const CATEGORIES: { value: ExpenseCategory; label: string; emoji: string }[] = [
  { value: 'hotel', label: 'Hotel', emoji: '🏨' },
  { value: 'food', label: 'Food', emoji: '🍕' },
  { value: 'travel', label: 'Travel', emoji: '🚕' },
  { value: 'activities', label: 'Activities', emoji: '🎯' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'other', label: 'Other', emoji: '📦' },
];

export const ExpensesTab: React.FC<Props> = ({ group, currentUserId, currentUserName, onRefresh }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [paidByUid, setPaidByUid] = useState(currentUserId);
  const [selectedMembers, setSelectedMembers] = useState<string[]>(group.members.map(m => m.uid));
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});
  const [percentSplits, setPercentSplits] = useState<Record<string, string>>({});

  const handleAdd = () => {
    if (!title || !amount) return;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const payer = group.members.find(m => m.uid === paidByUid);
    if (!payer) return;

    let splitBetween: ExpenseSplit[] = [];

    if (splitType === 'equal') {
      const share = amountNum / selectedMembers.length;
      splitBetween = selectedMembers.map(uid => {
        const m = group.members.find(mm => mm.uid === uid)!;
        return { uid, name: m.name, amount: share };
      });
    } else if (splitType === 'custom') {
      splitBetween = selectedMembers.map(uid => {
        const m = group.members.find(mm => mm.uid === uid)!;
        return { uid, name: m.name, amount: parseFloat(customSplits[uid] || '0') };
      });
    } else if (splitType === 'percentage') {
      splitBetween = selectedMembers.map(uid => {
        const m = group.members.find(mm => mm.uid === uid)!;
        const pct = parseFloat(percentSplits[uid] || '0');
        return { uid, name: m.name, amount: (amountNum * pct) / 100, percentage: pct };
      });
    }

    addExpense(group.id, {
      title,
      amount: amountNum,
      category,
      paidBy: [{ uid: paidByUid, name: payer.name, amount: amountNum }],
      splitType,
      splitBetween,
      addedBy: currentUserId,
      addedByName: currentUserName,
    });

    setTitle(''); setAmount('');
    setShowAddForm(false);
    onRefresh();
  };

  const handleRemoveExpense = (expenseId: string) => {
    removeExpense(group.id, expenseId);
    onRefresh();
  };

  const toggleMember = (uid: string) => {
    setSelectedMembers(prev => 
      prev.includes(uid) ? prev.filter(u => u !== uid) : [...prev, uid]
    );
  };

  const totalExpenses = group.expenses.reduce((s, e) => s + e.amount, 0);
  const getCategoryEmoji = (cat: string) => CATEGORIES.find(c => c.value === cat)?.emoji || '📦';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-mono text-xs font-bold text-slate-400 tracking-wider">EXPENSES</h3>
          <p className="text-2xl font-bold text-white mt-1">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Add expense form */}
      {showAddForm && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 space-y-5 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-[10px] font-mono font-bold text-slate-500 tracking-wider mb-1.5 block">TITLE</label>
              <input
                type="text"
                placeholder="e.g., Dinner at beach shack"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 focus:border-emerald-500/50 rounded-lg py-2.5 px-3 text-white placeholder-slate-500 outline-none text-sm"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="text-[10px] font-mono font-bold text-slate-500 tracking-wider mb-1.5 block">AMOUNT (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 focus:border-emerald-500/50 rounded-lg py-2.5 pl-10 pr-3 text-white placeholder-slate-500 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] font-mono font-bold text-slate-500 tracking-wider mb-2 block">CATEGORY</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    category === cat.value
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <span>{cat.emoji}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Paid by */}
          <div>
            <label className="text-[10px] font-mono font-bold text-slate-500 tracking-wider mb-2 block">PAID BY</label>
            <select
              value={paidByUid}
              onChange={e => setPaidByUid(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-3 text-white outline-none text-sm"
            >
              {group.members.map(m => (
                <option key={m.uid} value={m.uid}>{m.name}{m.uid === currentUserId ? ' (You)' : ''}</option>
              ))}
            </select>
          </div>

          {/* Split type */}
          <div>
            <label className="text-[10px] font-mono font-bold text-slate-500 tracking-wider mb-2 block">SPLIT TYPE</label>
            <div className="flex gap-2">
              {(['equal', 'custom', 'percentage'] as SplitType[]).map(st => (
                <button
                  key={st}
                  onClick={() => setSplitType(st)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize ${
                    splitType === st
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Split between */}
          <div>
            <label className="text-[10px] font-mono font-bold text-slate-500 tracking-wider mb-2 block">
              SPLIT BETWEEN
            </label>
            <div className="space-y-2">
              {group.members.map(m => (
                <div key={m.uid} className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-2.5">
                  <button
                    onClick={() => toggleMember(m.uid)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs transition-all shrink-0 ${
                      selectedMembers.includes(m.uid)
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-slate-600 text-transparent'
                    }`}
                  >
                    ✓
                  </button>
                  <span className="text-sm text-white flex-1">{m.name}</span>

                  {splitType === 'equal' && selectedMembers.includes(m.uid) && amount && (
                    <span className="text-xs text-slate-400 font-mono">
                      ₹{(parseFloat(amount) / selectedMembers.length).toFixed(0)}
                    </span>
                  )}

                  {splitType === 'custom' && selectedMembers.includes(m.uid) && (
                    <input
                      type="number"
                      placeholder="₹0"
                      value={customSplits[m.uid] || ''}
                      onChange={e => setCustomSplits(prev => ({ ...prev, [m.uid]: e.target.value }))}
                      className="w-20 bg-slate-800/50 border border-slate-700 rounded-md py-1.5 px-2 text-white text-xs outline-none text-right"
                    />
                  )}

                  {splitType === 'percentage' && selectedMembers.includes(m.uid) && (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        placeholder="0"
                        value={percentSplits[m.uid] || ''}
                        onChange={e => setPercentSplits(prev => ({ ...prev, [m.uid]: e.target.value }))}
                        className="w-16 bg-slate-800/50 border border-slate-700 rounded-md py-1.5 px-2 text-white text-xs outline-none text-right"
                      />
                      <span className="text-xs text-slate-500">%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAdd}
              disabled={!title || !amount}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white rounded-lg font-bold text-sm transition-all"
            >
              Add Expense
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

      {/* Expense list */}
      {group.expenses.length === 0 && !showAddForm && (
        <div className="text-center py-16 text-slate-500">
          <Receipt className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No expenses recorded</p>
          <p className="text-sm mt-1">Add your first expense to start tracking</p>
        </div>
      )}

      <div className="space-y-2">
        {[...group.expenses].reverse().map(expense => (
          <div
            key={expense.id}
            className="flex items-center gap-4 bg-slate-800/20 hover:bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-lg shrink-0">
              {getCategoryEmoji(expense.category)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white text-sm truncate">{expense.title}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-500">
                  Paid by {expense.paidBy.map(p => p.name).join(', ')}
                </span>
                <span className="text-slate-700">·</span>
                <span className="text-[10px] text-slate-600 capitalize">{expense.splitType} split</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-white text-sm">₹{expense.amount.toLocaleString('en-IN')}</span>
            </div>
            <button
              onClick={() => handleRemoveExpense(expense.id)}
              className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

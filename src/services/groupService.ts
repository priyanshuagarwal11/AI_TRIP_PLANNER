// ─── Group Service ─── Local-first with localStorage persistence ───
// This service uses localStorage as the data layer so the feature works
// without a running Firestore backend. Swap to Firestore calls when ready.

import type {
  TripGroup, GroupMember, GroupItineraryItem, Expense, ChatMessage,
  SettleRecord, Poll, GroupNotification, GroupInvitation, BalanceEntry, DebtEntry
} from '../types/group';

const STORAGE_KEY = 'wandermind_groups';
const INVITES_KEY = 'wandermind_invites';
const NOTIFS_KEY = 'wandermind_notifications';

// ─── Helpers ──────────────────────────────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function generateInviteCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function loadGroups(): TripGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveGroups(groups: TripGroup[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

function loadInvites(): GroupInvitation[] {
  try {
    const raw = localStorage.getItem(INVITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveInvites(invites: GroupInvitation[]) {
  localStorage.setItem(INVITES_KEY, JSON.stringify(invites));
}

function loadNotifications(): GroupNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveNotifications(notifs: GroupNotification[]) {
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifs));
}

// ─── Group CRUD ───────────────────────────────────────────────

export function createGroup(
  name: string, destination: string, startDate: string, endDate: string,
  creator: { uid: string; name: string; email: string }
): TripGroup {
  const group: TripGroup = {
    id: generateId(),
    name,
    destination,
    startDate,
    endDate,
    inviteCode: generateInviteCode(),
    createdBy: creator.uid,
    createdByName: creator.name,
    members: [{
      uid: creator.uid,
      name: creator.name,
      email: creator.email,
      role: 'admin',
      joinedAt: new Date().toISOString(),
    }],
    itinerary: [],
    expenses: [],
    settleRecords: [],
    messages: [],
    polls: [],
    notifications: [],
    createdAt: new Date().toISOString(),
  };

  const groups = loadGroups();
  groups.push(group);
  saveGroups(groups);
  return group;
}

export function getGroupsForUser(uid: string): TripGroup[] {
  return loadGroups().filter(g => g.members.some(m => m.uid === uid));
}

export function getGroupById(groupId: string): TripGroup | undefined {
  return loadGroups().find(g => g.id === groupId);
}

export function deleteGroup(groupId: string): void {
  const groups = loadGroups().filter(g => g.id !== groupId);
  saveGroups(groups);
}

function updateGroup(groupId: string, updater: (g: TripGroup) => TripGroup): TripGroup | undefined {
  const groups = loadGroups();
  const idx = groups.findIndex(g => g.id === groupId);
  if (idx === -1) return undefined;
  groups[idx] = updater(groups[idx]);
  saveGroups(groups);
  return groups[idx];
}

// ─── Invitations ──────────────────────────────────────────────

export function createInvitation(
  groupId: string, groupName: string,
  invitedBy: string, invitedByName: string,
  inviteeEmail: string
): GroupInvitation {
  const inv: GroupInvitation = {
    id: generateId(),
    groupId, groupName,
    invitedBy, invitedByName,
    inviteeEmail,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  const invites = loadInvites();
  invites.push(inv);
  saveInvites(invites);

  // Also create a notification
  addNotification({
    groupId,
    type: 'invite',
    title: 'New Invitation',
    message: `${invitedByName} invited you to join "${groupName}"`,
    targetUserId: inviteeEmail, // for now matching by email
  });

  return inv;
}

export function getInvitesForEmail(email: string): GroupInvitation[] {
  return loadInvites().filter(i => i.inviteeEmail === email && i.status === 'pending');
}

export function acceptInvitation(inviteId: string, user: { uid: string; name: string; email: string }): void {
  const invites = loadInvites();
  const inv = invites.find(i => i.id === inviteId);
  if (!inv) return;

  inv.status = 'accepted';
  saveInvites(invites);

  // Add user to group
  updateGroup(inv.groupId, g => ({
    ...g,
    members: [...g.members, {
      uid: user.uid,
      name: user.name,
      email: user.email,
      role: 'member' as const,
      joinedAt: new Date().toISOString(),
    }],
  }));
}

export function rejectInvitation(inviteId: string): void {
  const invites = loadInvites();
  const inv = invites.find(i => i.id === inviteId);
  if (inv) {
    inv.status = 'rejected';
    saveInvites(invites);
  }
}

export function joinByInviteCode(code: string, user: { uid: string; name: string; email: string }): TripGroup | null {
  const groups = loadGroups();
  const group = groups.find(g => g.inviteCode === code);
  if (!group) return null;
  if (group.members.some(m => m.uid === user.uid)) return group; // already a member

  const updated = updateGroup(group.id, g => ({
    ...g,
    members: [...g.members, {
      uid: user.uid,
      name: user.name,
      email: user.email,
      role: 'member' as const,
      joinedAt: new Date().toISOString(),
    }],
  }));
  return updated || null;
}

export function removeMember(groupId: string, uid: string): void {
  updateGroup(groupId, g => ({
    ...g,
    members: g.members.filter(m => m.uid !== uid),
  }));
}

// ─── Itinerary ────────────────────────────────────────────────

export function addItineraryItem(
  groupId: string, item: Omit<GroupItineraryItem, 'id' | 'votes' | 'createdAt'>
): GroupItineraryItem | undefined {
  const newItem: GroupItineraryItem = {
    ...item,
    id: generateId(),
    votes: [],
    createdAt: new Date().toISOString(),
  };

  const group = updateGroup(groupId, g => ({
    ...g,
    itinerary: [...g.itinerary, newItem].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)),
  }));

  if (group) {
    addNotification({
      groupId,
      type: 'itinerary',
      title: 'Itinerary Updated',
      message: `${item.addedByName} added "${item.title}" to Day ${item.day}`,
    });
  }

  return newItem;
}

export function removeItineraryItem(groupId: string, itemId: string): void {
  updateGroup(groupId, g => ({
    ...g,
    itinerary: g.itinerary.filter(i => i.id !== itemId),
  }));
}

export function voteItineraryItem(groupId: string, itemId: string, uid: string): void {
  updateGroup(groupId, g => ({
    ...g,
    itinerary: g.itinerary.map(i => {
      if (i.id !== itemId) return i;
      const votes = i.votes.includes(uid) ? i.votes.filter(v => v !== uid) : [...i.votes, uid];
      return { ...i, votes };
    }),
  }));
}

// ─── Chat ─────────────────────────────────────────────────────

export function sendMessage(
  groupId: string, msg: Omit<ChatMessage, 'id' | 'createdAt'>
): ChatMessage | undefined {
  const newMsg: ChatMessage = {
    ...msg,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  updateGroup(groupId, g => ({
    ...g,
    messages: [...g.messages, newMsg],
  }));

  return newMsg;
}

export function getMessages(groupId: string): ChatMessage[] {
  const group = getGroupById(groupId);
  return group?.messages || [];
}

// ─── Expenses ─────────────────────────────────────────────────

export function addExpense(groupId: string, expense: Omit<Expense, 'id' | 'settled' | 'createdAt'>): Expense | undefined {
  const newExpense: Expense = {
    ...expense,
    id: generateId(),
    settled: false,
    createdAt: new Date().toISOString(),
  };

  const group = updateGroup(groupId, g => ({
    ...g,
    expenses: [...g.expenses, newExpense],
  }));

  if (group) {
    addNotification({
      groupId,
      type: 'expense',
      title: 'New Expense',
      message: `${expense.addedByName} added "${expense.title}" — ₹${expense.amount}`,
    });
  }

  return newExpense;
}

export function removeExpense(groupId: string, expenseId: string): void {
  updateGroup(groupId, g => ({
    ...g,
    expenses: g.expenses.filter(e => e.id !== expenseId),
  }));
}

export function settleUp(groupId: string, from: { uid: string; name: string }, to: { uid: string; name: string }, amount: number): void {
  const record: SettleRecord = {
    id: generateId(),
    from, to, amount,
    settledAt: new Date().toISOString(),
  };

  updateGroup(groupId, g => ({
    ...g,
    settleRecords: [...g.settleRecords, record],
  }));

  addNotification({
    groupId,
    type: 'settle',
    title: 'Payment Settled',
    message: `${from.name} paid ₹${amount} to ${to.name}`,
    targetUserId: to.uid,
  });
}

// ─── Balance Calculator ───────────────────────────────────────

export function calculateBalances(group: TripGroup): { balances: BalanceEntry[]; debts: DebtEntry[] } {
  const memberMap: Record<string, { uid: string; name: string; balance: number }> = {};
  
  // Init all members
  group.members.forEach(m => {
    memberMap[m.uid] = { uid: m.uid, name: m.name, balance: 0 };
  });

  // Process expenses
  group.expenses.forEach(expense => {
    // Add what each payer paid
    expense.paidBy.forEach(p => {
      if (memberMap[p.uid]) {
        memberMap[p.uid].balance += p.amount;
      }
    });

    // Subtract each person's share
    expense.splitBetween.forEach(s => {
      if (memberMap[s.uid]) {
        let share = 0;
        if (expense.splitType === 'equal') {
          share = expense.amount / expense.splitBetween.length;
        } else if (expense.splitType === 'custom') {
          share = s.amount;
        } else if (expense.splitType === 'percentage') {
          share = (expense.amount * (s.percentage || 0)) / 100;
        }
        memberMap[s.uid].balance -= share;
      }
    });
  });

  // Process settlements
  group.settleRecords.forEach(s => {
    if (memberMap[s.from.uid]) memberMap[s.from.uid].balance += s.amount;
    if (memberMap[s.to.uid]) memberMap[s.to.uid].balance -= s.amount;
  });

  const balances: BalanceEntry[] = Object.values(memberMap).map(m => ({
    uid: m.uid,
    name: m.name,
    balance: Math.round(m.balance * 100) / 100,
  }));

  // Calculate simplified debts
  const debtors = balances.filter(b => b.balance < 0).map(b => ({ ...b, balance: Math.abs(b.balance) }));
  const creditors = balances.filter(b => b.balance > 0).map(b => ({ ...b }));
  
  // Sort for optimal matching
  debtors.sort((a, b) => b.balance - a.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  const debts: DebtEntry[] = [];
  let di = 0, ci = 0;
  
  while (di < debtors.length && ci < creditors.length) {
    const d = debtors[di];
    const c = creditors[ci];
    const amount = Math.min(d.balance, c.balance);
    
    if (amount > 0.01) {
      debts.push({
        from: { uid: d.uid, name: d.name },
        to: { uid: c.uid, name: c.name },
        amount: Math.round(amount * 100) / 100,
      });
    }

    d.balance -= amount;
    c.balance -= amount;
    
    if (d.balance < 0.01) di++;
    if (c.balance < 0.01) ci++;
  }

  return { balances, debts };
}

export function getCategoryBreakdown(group: TripGroup): Record<string, number> {
  const breakdown: Record<string, number> = {};
  group.expenses.forEach(e => {
    breakdown[e.category] = (breakdown[e.category] || 0) + e.amount;
  });
  return breakdown;
}

export function getTotalCost(group: TripGroup): number {
  return group.expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function getPerPersonCost(group: TripGroup): number {
  const total = getTotalCost(group);
  return group.members.length > 0 ? Math.round((total / group.members.length) * 100) / 100 : 0;
}

// ─── Polls ────────────────────────────────────────────────────

export function createPoll(
  groupId: string,
  question: string,
  options: string[],
  createdBy: string,
  createdByName: string
): Poll | undefined {
  const poll: Poll = {
    id: generateId(),
    question,
    options: options.map(o => ({ id: generateId(), text: o, votes: [] })),
    createdBy, createdByName,
    createdAt: new Date().toISOString(),
    closed: false,
  };

  updateGroup(groupId, g => ({
    ...g,
    polls: [...g.polls, poll],
  }));

  addNotification({
    groupId,
    type: 'poll',
    title: 'New Poll',
    message: `${createdByName} created a poll: "${question}"`,
  });

  return poll;
}

export function votePoll(groupId: string, pollId: string, optionId: string, uid: string): void {
  updateGroup(groupId, g => ({
    ...g,
    polls: g.polls.map(p => {
      if (p.id !== pollId) return p;
      return {
        ...p,
        options: p.options.map(o => {
          // Remove user's previous vote from all options
          const filteredVotes = o.votes.filter(v => v !== uid);
          // Add vote only to selected option
          if (o.id === optionId) {
            return { ...o, votes: [...filteredVotes, uid] };
          }
          return { ...o, votes: filteredVotes };
        }),
      };
    }),
  }));
}

export function closePoll(groupId: string, pollId: string): void {
  updateGroup(groupId, g => ({
    ...g,
    polls: g.polls.map(p => p.id === pollId ? { ...p, closed: true } : p),
  }));
}

// ─── Notifications ────────────────────────────────────────────

export function addNotification(data: {
  groupId: string;
  type: GroupNotification['type'];
  title: string;
  message: string;
  targetUserId?: string;
}): void {
  const notifs = loadNotifications();
  notifs.push({
    id: generateId(),
    ...data,
    read: false,
    createdAt: new Date().toISOString(),
  });
  saveNotifications(notifs);
}

export function getNotificationsForUser(uid: string, email: string): GroupNotification[] {
  return loadNotifications().filter(n => !n.targetUserId || n.targetUserId === uid || n.targetUserId === email);
}

export function markNotificationRead(notifId: string): void {
  const notifs = loadNotifications();
  const n = notifs.find(n => n.id === notifId);
  if (n) {
    n.read = true;
    saveNotifications(notifs);
  }
}

export function markAllNotificationsRead(uid: string, email: string): void {
  const notifs = loadNotifications();
  notifs.forEach(n => {
    if (!n.targetUserId || n.targetUserId === uid || n.targetUserId === email) {
      n.read = true;
    }
  });
  saveNotifications(notifs);
}

export function getUnreadCount(uid: string, email: string): number {
  return getNotificationsForUser(uid, email).filter(n => !n.read).length;
}

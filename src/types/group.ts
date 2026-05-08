// ─── Group Trip Types ─────────────────────────────────────────

export type MemberRole = 'admin' | 'member';
export type InviteStatus = 'pending' | 'accepted' | 'rejected';
export type SplitType = 'equal' | 'custom' | 'percentage';
export type ExpenseCategory = 'hotel' | 'food' | 'travel' | 'activities' | 'shopping' | 'other';

export interface GroupMember {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  role: MemberRole;
  joinedAt: string;
}

export interface GroupInvitation {
  id: string;
  groupId: string;
  groupName: string;
  invitedBy: string;
  invitedByName: string;
  inviteeEmail: string;
  inviteeUsername?: string;
  status: InviteStatus;
  createdAt: string;
}

export interface GroupItineraryItem {
  id: string;
  day: number;
  time: string;
  title: string;
  description: string;
  location?: string;
  addedBy: string;
  addedByName: string;
  votes: string[]; // user ids who approved
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  type: 'text' | 'link' | 'place';
  mentions?: string[]; // mentioned user ids
  createdAt: string;
}

export interface ExpenseSplit {
  uid: string;
  name: string;
  amount: number;  // for custom split, this is the absolute amount
  percentage?: number; // for percentage split
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  paidBy: { uid: string; name: string; amount: number }[];
  splitType: SplitType;
  splitBetween: ExpenseSplit[];
  settled: boolean;
  createdAt: string;
  addedBy: string;
  addedByName: string;
}

export interface SettleRecord {
  id: string;
  from: { uid: string; name: string };
  to: { uid: string; name: string };
  amount: number;
  settledAt: string;
}

export interface BalanceEntry {
  uid: string;
  name: string;
  balance: number; // positive = should receive, negative = owes
}

export interface DebtEntry {
  from: { uid: string; name: string };
  to: { uid: string; name: string };
  amount: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // user ids
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  endsAt?: string;
  closed: boolean;
}

export interface GroupNotification {
  id: string;
  groupId: string;
  type: 'invite' | 'expense' | 'settle' | 'itinerary' | 'chat' | 'poll';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  targetUserId?: string;
}

export interface TripGroup {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  inviteCode: string;
  createdBy: string;
  createdByName: string;
  members: GroupMember[];
  itinerary: GroupItineraryItem[];
  expenses: Expense[];
  settleRecords: SettleRecord[];
  messages: ChatMessage[];
  polls: Poll[];
  notifications: GroupNotification[];
  createdAt: string;
}

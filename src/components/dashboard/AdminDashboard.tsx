import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers, getRecentActivities, getAdminStats, deleteUserData, updateUserRole } from '../../lib/firestore';
import type { UserRole } from '../../lib/firestore';
import {
  Users, Activity, MapPin, TrendingUp, Search, Shield, Trash2,
  BarChart3, Clock, ChevronRight, AlertTriangle, Home, Settings,
  LogOut, Menu, X, Globe, Eye
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
  onLogout: () => void;
}

const StatCard = ({ icon: Icon, label, value, color, change }: any) => (
  <div className="card p-5">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
      {change && <span className="text-xs font-semibold text-emerald-500">+{change}%</span>}
    </div>
    <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</div>
    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
  </div>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, onLogout }) => {
  const { currentUser, isAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'activity' | 'settings'>('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalTrips: 0, totalSearches: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, u, a] = await Promise.all([getAdminStats(), getAllUsers(), getRecentActivities()]);
      setStats(s);
      setUsers(u);
      setActivities(a);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm('Delete this user permanently?')) return;
    await deleteUserData(uid);
    setUsers(prev => prev.filter(u => u.id !== uid));
  };

  const handleRoleChange = async (uid: string, role: UserRole) => {
    await updateUserRole(uid, role);
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, role } : u));
  };

  const filteredUsers = users.filter(u =>
    (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (ts: any) => {
    if (!ts) return 'Unknown';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const navItems = [
    { id: 'overview', icon: BarChart3, label: 'Overview' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'activity', icon: Activity, label: 'Activity' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  // Access denied guard — AFTER all hooks
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">You don't have admin privileges.</p>
          <button onClick={onBack} className="btn-primary text-sm">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 dark:text-white">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeSection === item.id
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <button onClick={onBack} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
            <Home className="w-4 h-4" /> Back to Site
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">{activeSection}</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-xs font-bold">
              {(currentUser?.displayName || 'A')[0].toUpperCase()}
            </div>
            <span className="hidden sm:inline font-medium">{currentUser?.displayName || 'Admin'}</span>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
            </div>
          ) : (
            <>
              {/* ━━━ OVERVIEW ━━━ */}
              {activeSection === 'overview' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="text-blue-500 bg-blue-50 dark:bg-blue-950/30" change="12" />
                    <StatCard icon={MapPin} label="Trips Created" value={stats.totalTrips} color="text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" change="8" />
                    <StatCard icon={Search} label="Total Searches" value={stats.totalSearches} color="text-amber-500 bg-amber-50 dark:bg-amber-950/30" change="24" />
                    <StatCard icon={Globe} label="Active Today" value={users.filter(u => { const d = u.lastLogin?.toDate?.(); return d && (Date.now() - d.getTime()) < 86400000; }).length} color="text-purple-500 bg-purple-50 dark:bg-purple-950/30" />
                  </div>
                  {/* Recent users */}
                  <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900 dark:text-white">Recent Users</h3>
                      <button onClick={() => setActiveSection('users')} className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                      {users.slice(0, 5).map(u => (
                        <div key={u.id} className="px-5 py-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">{(u.displayName || u.email || '?')[0].toUpperCase()}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{u.displayName || 'Anonymous'}</div>
                            <div className="text-xs text-gray-400 truncate">{u.email}</div>
                          </div>
                          <span className={`badge border-0 text-[10px] ${u.role === 'admin' ? 'bg-red-50 dark:bg-red-950/30 text-red-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>{u.role || 'user'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Recent activity */}
                  <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                      <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                      {activities.slice(0, 8).map(a => (
                        <div key={a.id} className="px-5 py-3 flex items-center gap-3">
                          <Activity className="w-4 h-4 text-gray-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{a.action?.replace(/_/g, ' ')}</span>
                            {a.meta?.destination && <span className="text-xs text-gray-400 ml-2">— {a.meta.destination}</span>}
                          </div>
                          <span className="text-xs text-gray-400 shrink-0">{formatTime(a.timestamp)}</span>
                        </div>
                      ))}
                      {activities.length === 0 && <div className="px-5 py-8 text-center text-sm text-gray-400">No activity yet</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* ━━━ USERS ━━━ */}
              {activeSection === 'users' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                          <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">User</th>
                          <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Email</th>
                          <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Role</th>
                          <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Last Login</th>
                          <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                          {filteredUsers.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold">{(u.displayName || '?')[0].toUpperCase()}</div>
                                  <span className="font-semibold text-gray-900 dark:text-white">{u.displayName || 'Anonymous'}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-gray-500">{u.email}</td>
                              <td className="px-5 py-3">
                                <select value={u.role || 'user'} onChange={e => handleRoleChange(u.id, e.target.value as UserRole)} className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 border-0 rounded-lg px-2 py-1 outline-none cursor-pointer">
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                              <td className="px-5 py-3 text-gray-400 text-xs">{formatTime(u.lastLogin)}</td>
                              <td className="px-5 py-3">
                                <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredUsers.length === 0 && <div className="py-12 text-center text-sm text-gray-400">No users found</div>}
                  </div>
                </div>
              )}

              {/* ━━━ ACTIVITY ━━━ */}
              {activeSection === 'activity' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900 dark:text-white">Activity Log</h3>
                      <button onClick={loadData} className="text-xs font-semibold text-blue-600 hover:underline">Refresh</button>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                      {activities.map(a => (
                        <div key={a.id} className="px-5 py-3 flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            a.action === 'login' ? 'bg-green-50 dark:bg-green-950/30 text-green-500' :
                            a.action === 'logout' ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' :
                            a.action === 'trip_saved' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-500' :
                            'bg-amber-50 dark:bg-amber-950/30 text-amber-500'
                          }`}>
                            <Activity className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{a.action?.replace(/_/g, ' ')}</div>
                            <div className="text-xs text-gray-400">UID: {a.uid?.slice(0, 8)}… {a.meta?.method && `• ${a.meta.method}`} {a.meta?.destination && `• ${a.meta.destination}`}</div>
                          </div>
                          <span className="text-xs text-gray-400 shrink-0">{formatTime(a.timestamp)}</span>
                        </div>
                      ))}
                      {activities.length === 0 && <div className="py-12 text-center text-sm text-gray-400">No activity recorded yet</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* ━━━ SETTINGS ━━━ */}
              {activeSection === 'settings' && (
                <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                  <div className="card p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Admin Account</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{currentUser?.email}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Role</span>
                        <span className="badge bg-red-50 dark:bg-red-950/30 text-red-500 border-0">Admin</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">UID</span>
                        <span className="text-xs text-gray-400 font-mono">{currentUser?.uid}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

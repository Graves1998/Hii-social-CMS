
import React from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  Settings, 
  History, 
  PlusSquare,
  UserCircle
} from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: { name: string; role: UserRole };
  setCurrentUser: (user: { name: string; role: UserRole }) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  currentUser, 
  setCurrentUser 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard },
    { id: 'content', label: 'Quản Lý Nội Dung', icon: ListTodo },
    { id: 'audit', label: 'Nhật Ký Hoạt Động', icon: History },
  ];

  const roles: UserRole[] = [UserRole.EDITOR, UserRole.REVIEWER, UserRole.ADMIN];

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar - Navy Glassmorphism */}
      <aside className="w-64 glass-sidebar text-white flex flex-col z-20">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center font-black text-xl text-navy shadow-lg shadow-brand-orange/20">
            H
          </div>
          <span className="text-xl font-bold tracking-tight text-off-white">Hii Social</span>
        </div>
        
        <nav className="flex-1 mt-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === item.id 
                      ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-105' 
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10 bg-navy/20">
          <div className="mb-4">
            <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2 block">Chế độ Dev</label>
            <select 
              value={currentUser.role}
              onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value as UserRole })}
              className="w-full bg-navy/40 border border-white/10 text-xs rounded-lg p-2 text-off-white outline-none focus:border-brand-blue"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 px-3 py-3 glass-card rounded-2xl border-white/10">
            <div className="w-10 h-10 rounded-full bg-brand-blue/30 flex items-center justify-center">
              <UserCircle size={24} className="text-brand-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-off-white">{currentUser.name}</p>
              <p className="text-[10px] text-brand-blue font-bold uppercase tracking-wider">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 glass-header flex items-center justify-between px-10 shrink-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-navy capitalize tracking-tight">
              {menuItems.find(m => m.id === activeTab)?.label || activeTab}
            </h1>
            <p className="text-xs text-brand-blue font-semibold">CMS Kiểm Duyệt Nội Bộ</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Create button removed as requested */}
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

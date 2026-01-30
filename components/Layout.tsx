
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Home
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.OWNER, UserRole.TENANT, UserRole.CARETAKER] },
    { id: 'tenants', label: 'Tenants', icon: Users, roles: [UserRole.OWNER, UserRole.CARETAKER] },
    { id: 'rent', label: 'Rent Tracking', icon: CreditCard, roles: [UserRole.OWNER, UserRole.TENANT, UserRole.CARETAKER] },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare, roles: [UserRole.OWNER, UserRole.TENANT, UserRole.CARETAKER] },
    { id: 'property', label: 'Property Setup', icon: Settings, roles: [UserRole.OWNER] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role || UserRole.TENANT));

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-64 bg-indigo-700 text-white z-30 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Home className="text-indigo-700" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">BharatRent</span>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === item.id ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-600 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 capitalize">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-indigo-600 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</p>
              </div>
              <img 
                src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}`}
                alt="Profile" 
                className="w-9 h-9 rounded-full border shadow-sm"
              />
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

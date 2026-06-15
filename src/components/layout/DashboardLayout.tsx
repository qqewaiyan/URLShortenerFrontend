import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Link2, LayoutDashboard, Link2Icon, User, LogOut, Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My URLs', href: '/urls', icon: Link2Icon },
  { name: 'Profile', href: '/profile', icon: User },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-50">
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-200 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between p-6 border-b border-brand-200">
              <Link to="/" className="flex items-center gap-2">
                <Link2 className="w-8 h-8 text-brand-900" />
                <span className="text-xl font-bold text-brand-900">Shortify</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-brand-400 hover:text-brand-600 hover:bg-brand-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-900 text-white'
                        : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Log out
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-brand-200">
          <div className="flex items-center gap-2 px-6 py-6 border-b border-brand-200">
            <Link to="/" className="flex items-center gap-2">
              <Link2 className="w-8 h-8 text-brand-900" />
              <span className="text-xl font-bold text-brand-900">Shortify</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-900 text-white'
                      : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-brand-200">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-brand-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-900 truncate">{user?.name}</p>
                <p className="text-xs text-brand-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-30 lg:hidden bg-white border-b border-brand-200">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-brand-400 hover:text-brand-600 hover:bg-brand-50"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <Link2 className="w-8 h-8 text-brand-900" />
              <span className="text-xl font-bold text-brand-900">Shortify</span>
            </Link>
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-brand-500" />
              )}
            </div>
          </div>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

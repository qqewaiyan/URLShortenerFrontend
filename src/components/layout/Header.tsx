import { Link, useNavigate } from 'react-router-dom';
import { Link2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import  Button  from '../ui/Button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-brand-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Link2 className="w-7 h-7 text-brand-900" />
              <span className="text-xl font-bold text-brand-900">Shortify</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
                <Button onClick={() => navigate('/register')}>Get started</Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-brand-400 hover:text-brand-600 hover:bg-brand-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-200 bg-white">
          <div className="px-4 py-6 space-y-4">
            <a href="#features" className="block text-base font-medium text-brand-600 hover:text-brand-900">
              Features
            </a>
            <a href="#pricing" className="block text-base font-medium text-brand-600 hover:text-brand-900">
              Pricing
            </a>
            <a href="#about" className="block text-base font-medium text-brand-600 hover:text-brand-900">
              About
            </a>
            <div className="pt-4 border-t border-brand-200 space-y-3">
              {user ? (
                <Button className="w-full" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="secondary" className="w-full" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                    Sign in
                  </Button>
                  <Button className="w-full" onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>
                    Get started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

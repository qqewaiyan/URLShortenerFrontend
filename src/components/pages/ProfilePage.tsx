import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardLayout } from '../layout/DashboardLayout';
import  Card  from '../ui/Card.tsx';
import  Button  from '../ui/Button.tsx';
import  Input  from '../ui/Input.tsx';
import { useToast } from '../ui/Toast';
import { User, Mail, Lock, Building, Calendar, CreditCard, CheckCircle, Eye, EyeOff } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'billing'>('profile');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    email: user?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    toast('Profile updated successfully!');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setLoading(false);
    toast('Password updated successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-brand-900">Account Settings</h1>
          <p className="text-brand-500 mt-1">Manage your profile and preferences</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="sm:w-48 flex-shrink-0">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'profile' | 'security' | 'billing')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-brand-900 text-white'
                      : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card>
                   <h2 className="text-lg font-semibold mb-4">
                        Profile Information
                    </h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden">
                        {user?.avatar_url ? (
                          <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-8 h-8 text-brand-400" />
                        )}
                      </div>
                      <div>
                        <Button variant="secondary" size="sm" type="button">
                          Change avatar
                        </Button>
                        <p className="text-xs text-brand-400 mt-2">JPG, PNG. Max size 2MB</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-brand-700 mb-1.5">
                          Email address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                          <Input
                            id="email"
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="pl-11"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" loading={loading}>
                        Save changes
                      </Button>
                    </div>
                  </form>
                </Card>

                <Card>
                    <h2 className="text-lg font-semibold">
                        Account Information
                    </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-brand-100">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-brand-400" />
                        <span className="text-brand-600">Account created</span>
                      </div>
                      <span className="text-sm font-medium text-brand-900">
                        {new Date(user?.created_at || '').toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-brand-100">
                      <div className="flex items-center gap-3 text-sm">
                        <Building className="w-4 h-4 text-brand-400" />
                        <span className="text-brand-600">Plan</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-brand-100 text-brand-900 text-xs font-medium rounded">
                          Free
                        </span>
                        <Button variant="ghost" size="sm">
                          Upgrade
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card>
                  <h2 className="text-lg font-semibold">
                    Change Password
                </h2>
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-brand-700 mb-1.5">
                        Current password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="pl-11 pr-11"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-brand-700 mb-1.5">
                        New password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="pl-11 pr-11"
                          placeholder="Minimum 6 characters"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-700 mb-1.5">
                        Confirm new password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="pl-11"
                          placeholder="Confirm your new password"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" loading={loading}>
                        Update password
                      </Button>
                    </div>
                  </form>
                </Card>

                <Card>
                    <h2 className="text-lg font-semibold">
                        Two-Factor Authentication
                    </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-brand-600">Add an extra layer of security to your account</p>
                      <p className="text-xs text-brand-400 mt-1">Recommended for all accounts</p>
                    </div>
                    <Button variant="secondary" size="sm">
                      Enable
                    </Button>
                  </div>
                </Card>

                <Card className="border-red-200 bg-red-50/50">
                <h2 className="text-lg font-semibold">
                   Danger Zone
                </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-700">Delete your account and all data</p>
                      <p className="text-xs text-red-500 mt-1">This action cannot be undone</p>
                    </div>
                    <Button variant="danger" size="sm">
                      Delete account
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <Card>
                    <h2 className="text-lg font-semibold">
                        Current Plan
                    </h2>
                  <div className="flex items-center justify-between p-6 bg-brand-50 rounded-lg border border-brand-200">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-brand-900">Free Plan</h3>
                        <span className="px-2 py-1 bg-brand-900 text-white text-xs font-medium rounded">
                          Current
                        </span>
                      </div>
                      <p className="text-sm text-brand-600 mt-1">50 short links, basic analytics</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-brand-900">$0</div>
                      <div className="text-sm text-brand-500">/month</div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button className="w-full">
                      Upgrade to Pro - $9/month
                    </Button>
                    <p className="text-xs text-center text-brand-400 mt-2">
                      Unlock unlimited links, advanced analytics, custom domains, and more
                    </p>
                  </div>
                </Card>

                <Card>
                    <h2 className="text-lg font-semibold">
                        Pro Plan Features
                    </h2>
                  <ul className="space-y-3 text-sm">
                    {[
                      'Unlimited short links',
                      'Advanced analytics & reporting',
                      'Custom domain support',
                      'API access',
                      'Priority support',
                      'Team collaboration',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-brand-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button.tsx';
import Input from '../ui/Input.tsx';
import { Link2, Mail, Lock, Send, EyeClosedIcon, EyeIcon } from 'lucide-react';


export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, togglePasswordShow] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    if (error) {
      setError('Invalid email or password. Please try again.');
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setError("");

    signInWithGoogle();
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <Link2 className="w-8 h-8 text-brand-900" />
            <span className="text-2xl font-bold text-brand-900">Shortify</span>
          </div>

          <h1 className="text-3xl font-bold text-brand-900 mb-2">Welcome back</h1>
          <p className="text-brand-500 mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                <Input
                  id="password"
                   type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11"
                  required
                />
                {showPassword ? (
                  <EyeIcon
                    onClick={() => togglePasswordShow(!showPassword)}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400"
                  />
                ) : (
                  <EyeClosedIcon
                    onClick={() => togglePasswordShow(!showPassword)}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-brand-600">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-brand-300 text-brand-900 focus:ring-brand-900"
                />
                Remember me
              </label>
              <a href="#" className="text-sm text-brand-900 hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-brand-500">Or continue with</span>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <Send className="w-5 h-5" />
            Sign in with Google
          </Button>

          <p className="mt-8 text-center text-sm text-brand-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-900 font-medium hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

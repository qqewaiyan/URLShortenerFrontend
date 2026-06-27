import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import  Button  from '../ui/Button.tsx';
import  Input  from '../ui/Input.tsx';
import { Link2, Mail, Lock, User, Send, EyeClosedIcon,EyeIcon } from 'lucide-react';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, togglePasswordShow] = useState(false);
  const [showConfirmPassword, toggleConfirmPasswordShow] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password);
    if (error) {
      setError('Failed to create account. Please try again.');
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
  setLoading(true);
  setError("");

  signInWithGoogle();
  navigate('/dashboard');
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-white flex">

      <div className="py-5 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <Link2 className="w-8 h-8 text-brand-900" />
            <span className="text-2xl font-bold text-brand-900">Shortify</span>
          </div>

          <h1 className="text-3xl font-bold text-brand-900 mb-2">Create your account</h1>
          <p className="text-brand-500 mb-8">
            Get started with your free account today
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-700 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11"
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-700 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                <Input
                  id="confirmPassword"
                   type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-11"
                  required
                />
                {showConfirmPassword ? (
                  <EyeIcon
                    onClick={() => toggleConfirmPasswordShow(!showConfirmPassword)}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400"
                  />
                ) : (
                  <EyeClosedIcon
                    onClick={() => toggleConfirmPasswordShow(!showConfirmPassword)}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400"
                  />
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 rounded border-brand-300 text-brand-900 focus:ring-brand-900"
                required
              />
              <label htmlFor="terms" className="text-sm text-brand-600">
                I agree to the{' '}
                <a href="#" className="text-brand-900 hover:underline font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-brand-900 hover:underline font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Create account
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
            Sign up with Google
          </Button>

          <p className="mt-8 text-center text-sm text-brand-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-900 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

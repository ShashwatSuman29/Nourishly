import { useState } from 'react';
import { motion } from 'framer-motion';
import { signIn, signUp } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password);
        if (error) throw error;
        // Show success message for email confirmation
        alert('Please check your email for confirmation link');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto"
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-indigo-500/10">
            {mode === 'signin' ? (
              <LogIn className="w-5 h-5 text-indigo-400" />
            ) : (
              <UserPlus className="w-5 h-5 text-indigo-400" />
            )}
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : mode === 'signin' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center text-sm text-gray-400">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signin')}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}; 
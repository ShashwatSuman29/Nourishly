import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signUp } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Loader2, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onClose?: () => void;
}

export const AuthForm = ({ mode, onClose }: AuthFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast.success('Please check your email for confirmation link');
        onClose?.();
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/');
        onClose?.();
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="relative w-full max-w-md bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-gray-700/50 rounded-2xl shadow-2xl"
      >
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-primary/10">
              {mode === 'signin' ? (
                <LogIn className="w-5 h-5 text-primary" />
              ) : (
                <UserPlus className="w-5 h-5 text-primary" />
              )}
            </div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              {mode === 'signin' ? 'Welcome Back' : 'Join Us'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-gray-800/50 border-gray-700/50 focus:border-primary/50 focus:ring-primary/20"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-gray-800/50 border-gray-700/50 focus:border-primary/50 focus:ring-primary/20 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white rounded-xl py-2.5 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : mode === 'signin' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="text-center text-sm text-gray-400">
              {mode === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="text-primary hover:text-primary/80 transition-colors"
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
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}; 
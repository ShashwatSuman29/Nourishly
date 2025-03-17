import { AuthForm } from '@/components/auth/AuthForm';
import { motion } from 'framer-motion';

export const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-950 to-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full"
      >
        <AuthForm mode="signin" />
      </motion.div>
    </div>
  );
}; 
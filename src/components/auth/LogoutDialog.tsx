import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutDialog = ({ isOpen, onClose, onConfirm }: LogoutDialogProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-sm bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-gray-700/50 rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-red-500/10">
            <LogOut className="w-5 h-5 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Sign Out
          </h2>
        </div>

        <p className="text-gray-300 mb-6">
          Are you sure you want to sign out?
        </p>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 hover:border-gray-700 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
          >
            Sign Out
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}; 
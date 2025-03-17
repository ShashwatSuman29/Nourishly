import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Dumbbell, 
  GraduationCap, 
  Smile, 
  LayoutDashboard, 
  Menu, 
  X,
  LogIn,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/supabase';

const navItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
  {
    label: 'Physical',
    path: '/physical',
    icon: <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
  {
    label: 'Mental',
    path: '/mental',
    icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
  {
    label: 'Educational',
    path: '/educational',
    icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
  {
    label: 'Fun',
    path: '/fun',
    icon: <Smile className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
];

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-lg shadow-lg' 
          : 'bg-background/50 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <NavLink 
            to="/" 
            className="flex items-center space-x-2 shrink-0"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <span className="font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                Nourishly
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary/50"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-full text-sm lg:text-base font-medium
                  transition-all duration-200 hover:scale-105
                  ${isActive 
                    ? 'bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'text-foreground/80 hover:text-foreground hover:bg-secondary'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signin')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </motion.button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-full bg-secondary/80 hover:bg-secondary md:hidden focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg"
          >
            <nav className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20' 
                      : 'text-foreground/80 hover:text-foreground hover:bg-secondary'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
              {user ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-foreground/80 hover:text-foreground hover:bg-secondary transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate('/signin');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-foreground/80 hover:text-foreground hover:bg-secondary transition-all duration-200"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;

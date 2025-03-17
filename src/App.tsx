import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SignIn } from '@/pages/SignIn';
import { SignUp } from '@/pages/SignUp';

import Navbar from "@/components/layout/Navbar";
import Dashboard from "@/pages/Dashboard";
import Physical from "@/pages/Physical";
import Mental from "@/pages/Mental";
import Educational from "@/pages/Educational";
import Fun from "@/pages/Fun";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component for AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <main className="min-h-screen pt-16 sm:pt-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/physical"
              element={
                <ProtectedRoute>
                  <Physical />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mental"
              element={
                <ProtectedRoute>
                  <Mental />
                </ProtectedRoute>
              }
            />
            <Route
              path="/educational"
              element={
                <ProtectedRoute>
                  <Educational />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fun"
              element={
                <ProtectedRoute>
                  <Fun />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <TaskProvider>
          <Router>
            <div className="relative min-h-screen bg-background text-foreground">
              <Navbar />
              <AnimatedRoutes />
            </div>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

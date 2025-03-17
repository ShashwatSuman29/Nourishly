import { AuthForm } from '@/components/auth/AuthForm';

export const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-950 to-gray-900">
      <AuthForm mode="signin" />
    </div>
  );
}; 
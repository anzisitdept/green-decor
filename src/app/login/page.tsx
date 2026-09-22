import AuthPage from '@/components/auth/AuthPage';

export const metadata = {
  title: 'Sign In — Green Decor Pakistan',
  description: 'Sign in to your Green Decor account to track orders, manage addresses, and access your saved wishlist.',
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
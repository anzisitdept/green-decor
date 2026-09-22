import AuthPage from '@/components/auth/AuthPage';

export const metadata = {
  title: 'Register — Green Decor Pakistan',
  description: 'Create your Green Decor account and join Pakistan’s leading botanical lifestyle community.',
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}
import LoginForm from '@/components/forms/LoginForm';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your Fyxen account.',
};

export default function LoginPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary-900 mb-2">Welcome Back</h1>
        <p className="text-primary-500">Enter your credentials to access your account.</p>
      </div>
      <LoginForm />
    </>
  );
}

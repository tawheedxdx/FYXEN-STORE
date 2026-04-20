import SignupForm from '@/components/forms/SignupForm';

export const metadata = {
  title: 'Create Account',
  description: 'Join Fyxen today.',
};

export default function SignupPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary-900 mb-2">Create an Account</h1>
        <p className="text-primary-500">Join Fyxen for a premium shopping experience.</p>
      </div>
      <SignupForm />
    </>
  );
}

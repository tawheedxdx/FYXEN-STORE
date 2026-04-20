export const metadata = {
  title: 'Terms & Conditions | Fyxen',
};

export default function TermsConditionsPage() {
  return (
    <div className="container-custom py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
      
      <div className="prose prose-primary dark:prose-invert max-w-none">
        <p>Welcome to Fyxen. These terms and conditions outline the rules and regulations for the use of Bytread International Private Limited's Website.</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Fyxen if you do not agree to take all of the terms and conditions stated on this page.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Intellectual Property Rights</h2>
        <p>Unless otherwise stated, Bytread International Private Limited and/or its licensors own the intellectual property rights for all material on Fyxen. All intellectual property rights are reserved.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
        <p>If you create an account on our platform, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account.</p>
      </div>
    </div>
  );
}

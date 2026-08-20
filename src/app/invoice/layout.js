export const metadata = {
  title: 'Tax Invoice | FYXEN',
};

export default function InvoiceLayout({ children }) {
  return (
    <main className="min-h-screen bg-white text-black print:p-0">
      {children}
    </main>
  );
}

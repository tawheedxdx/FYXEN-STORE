export const metadata = {
  title: 'Contact Us | Fyxen',
};

export default function ContactPage() {
  return (
    <div className="container-custom py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <p className="text-primary-600 dark:text-primary-300 mb-8">
        We would love to hear from you. For any inquiries, please fill out the form below or reach out to us through our direct channels.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input type="text" className="input-field" placeholder="Your Name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className="input-field" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea className="input-field h-32 resize-none" placeholder="How can we help?"></textarea>
          </div>
          <button type="button" className="btn-primary w-full">Send Message</button>
        </form>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Corporate Headquarters</h3>
            <p className="text-primary-600 dark:text-primary-300">
              Bytread International Private Limited<br />
              123 Premium Tower, Business Park<br />
              Mumbai, Maharashtra 400001<br />
              India
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Direct Contact</h3>
            <p className="text-primary-600 dark:text-primary-300">
              Email: support@fyxen.com<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

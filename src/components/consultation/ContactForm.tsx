import { useState } from 'react';

const WEB3FORMS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const canSubmit = formData.name.trim() && formData.email.trim() && formData.message.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: formData.subject || `Message from ${formData.name}`,
          from_name: 'Panoply Parfums Contact',
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError('Something went wrong. Please try again or email varun@panoplyparfums.com directly.');
      }
    } catch {
      setError('Network error. Please try again or email varun@panoplyparfums.com directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <span className="text-3xl">🪶</span>
        <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-[var(--color-parchment)]">
          Message Sent
        </h3>
        <p className="mt-3 mx-auto max-w-sm text-sm leading-relaxed text-[var(--color-parchment-dim)]">
          Thank you. I'll respond to {formData.email} as soon as possible — usually within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-[family-name:var(--font-display)] text-xs tracking-[0.1em] uppercase text-[var(--color-parchment-dim)]">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Your name"
            className="w-full rounded-sm border border-[var(--color-amber)]/20 bg-[var(--color-charcoal)] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-[var(--color-parchment)] placeholder:text-[var(--color-parchment-dim)]/30 focus:border-[var(--color-amber)]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-[family-name:var(--font-display)] text-xs tracking-[0.1em] uppercase text-[var(--color-parchment-dim)]">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={e => update('email', e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-sm border border-[var(--color-amber)]/20 bg-[var(--color-charcoal)] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-[var(--color-parchment)] placeholder:text-[var(--color-parchment-dim)]/30 focus:border-[var(--color-amber)]/50 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block font-[family-name:var(--font-display)] text-xs tracking-[0.1em] uppercase text-[var(--color-parchment-dim)]">
          Subject
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={e => update('subject', e.target.value)}
          placeholder="What's this about?"
          className="w-full rounded-sm border border-[var(--color-amber)]/20 bg-[var(--color-charcoal)] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-[var(--color-parchment)] placeholder:text-[var(--color-parchment-dim)]/30 focus:border-[var(--color-amber)]/50 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1.5 block font-[family-name:var(--font-display)] text-xs tracking-[0.1em] uppercase text-[var(--color-parchment-dim)]">
          Message *
        </label>
        <textarea
          required
          value={formData.message}
          onChange={e => update('message', e.target.value)}
          rows={4}
          placeholder="Tell me what's on your mind..."
          className="w-full rounded-sm border border-[var(--color-amber)]/20 bg-[var(--color-charcoal)] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-[var(--color-parchment)] placeholder:text-[var(--color-parchment-dim)]/30 focus:border-[var(--color-amber)]/50 focus:outline-none resize-none"
        />
      </div>

      {error && (
        <div className="rounded-sm border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit || submitting}
        className={`w-full rounded-sm border px-8 py-3.5 font-[family-name:var(--font-display)] text-xs tracking-[0.12em] uppercase transition-all duration-500 ${
          canSubmit && !submitting
            ? 'border-[var(--color-amber)]/40 bg-[var(--color-amber)]/10 text-[var(--color-parchment)] hover:bg-[var(--color-amber)]/20 hover:border-[var(--color-amber)]/60 hover:shadow-[0_0_30px_4px_rgba(201,169,110,0.15)] cursor-pointer'
            : 'border-[var(--color-amber)]/10 bg-transparent text-[var(--color-parchment-dim)]/30 cursor-not-allowed'
        }`}
      >
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

import { useState } from 'react';

const WEB3FORMS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

const s = {
  parchment: 'var(--color-parchment)',
  parchmentDim: 'var(--color-parchment-dim)',
  amber: 'var(--color-amber)',
  charcoal: 'var(--color-charcoal)',
  display: 'var(--font-display)',
  body: 'var(--font-body)',
};

const inputStyle: React.CSSProperties = {
  width: '100%', borderRadius: '2px',
  border: '1px solid color-mix(in oklab, var(--color-amber) 20%, transparent)',
  backgroundColor: s.charcoal, padding: '0.75rem 1rem',
  fontFamily: s.body, fontSize: '0.875rem', color: s.parchment, boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '0.375rem',
  fontFamily: s.display, fontSize: '0.75rem', letterSpacing: '0.1em',
  textTransform: 'uppercase', color: s.parchmentDim,
};

const btnStyle: React.CSSProperties = {
  width: '100%', borderRadius: '2px', border: '1px solid color-mix(in oklab, var(--color-amber) 40%, transparent)',
  backgroundColor: 'color-mix(in oklab, var(--color-amber) 10%, transparent)',
  padding: '0.875rem 2rem', fontFamily: s.display, fontSize: '0.75rem', letterSpacing: '0.12em',
  textTransform: 'uppercase', color: s.parchment, cursor: 'pointer', transition: 'all 0.5s',
};

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));
  const canSubmit = formData.name.trim() && formData.email.trim() && formData.message.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: formData.subject || `Message from ${formData.name}`,
          from_name: 'Panoply Parfums Contact',
          name: formData.name, email: formData.email, message: formData.message,
        }),
      });
      if (res.ok) { setSubmitted(true); setFormData({ name: '', email: '', subject: '', message: '' }); }
      else setError('Something went wrong. Email varun@panoplyparfums.com directly.');
    } catch { setError('Network error. Email varun@panoplyparfums.com directly.'); }
    finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <span style={{ fontSize: '2rem' }}>🪶</span>
        <h3 style={{ marginTop: '1rem', fontFamily: s.display, fontSize: '1.5rem', color: s.parchment }}>Message Sent</h3>
        <p style={{ marginTop: '0.75rem', maxWidth: '24rem', marginLeft: 'auto', marginRight: 'auto', fontSize: '0.875rem', lineHeight: 1.625, color: s.parchmentDim }}>
          Thank you. I'll respond to {formData.email} as soon as possible — usually within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div>
          <label style={labelStyle}>Name *</label>
          <input type="text" required value={formData.name} onChange={e => update('name', e.target.value)} placeholder="Your name" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input type="email" required value={formData.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Subject</label>
        <input type="text" value={formData.subject} onChange={e => update('subject', e.target.value)} placeholder="What's this about?" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Message *</label>
        <textarea required value={formData.message} onChange={e => update('message', e.target.value)} rows={4}
          placeholder="Tell me what's on your mind..." style={{ ...inputStyle, resize: 'none' }} />
      </div>

      {error && (
        <div style={{ borderRadius: '2px', border: '1px solid rgba(251,44,54,0.2)', backgroundColor: 'rgba(251,44,54,0.05)', padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#fb2c36' }}>{error}</div>
      )}

      <button type="submit" disabled={!canSubmit || submitting}
        style={canSubmit && !submitting ? btnStyle : { ...btnStyle, opacity: 0.3, cursor: 'not-allowed' }}>
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

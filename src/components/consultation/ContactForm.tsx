import { useState } from 'react';

const WEB3FORMS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

const C = { parchment: '#e8dcc8', parchmentDim: '#c4b89a', amber: '#c9a96e', charcoal: '#1a1410' };
const fade = (hex: string, a: number) => { const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return `rgba(${r},${g},${b},${a})`; };
const F = { display: 'var(--font-display)', body: 'var(--font-body)' };

const inputS: React.CSSProperties = { width: '100%', borderRadius: '2px', border: `1px solid ${fade(C.amber,0.2)}`, backgroundColor: C.charcoal, padding: '0.75rem 1rem', fontFamily: F.body, fontSize: '0.875rem', color: C.parchment, boxSizing: 'border-box' };
const labelS: React.CSSProperties = { display: 'block', marginBottom: '0.375rem', fontFamily: F.display, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.parchmentDim };
const btnS: React.CSSProperties = { width: '100%', borderRadius: '2px', border: `1px solid ${fade(C.amber,0.4)}`, backgroundColor: fade(C.amber,0.1), padding: '0.875rem 2rem', fontFamily: F.display, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.parchment, cursor: 'pointer', transition: 'all 0.5s' };

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const update = (field: string, value: string) => setFormData(p => ({ ...p, [field]: value }));
  const canSubmit = formData.name.trim() && formData.email.trim() && formData.message.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject: formData.subject || `Message from ${formData.name}`, from_name: 'Panoply Parfums Contact', name: formData.name, email: formData.email, message: formData.message }) });
      if (res.ok) { setSubmitted(true); setFormData({ name: '', email: '', subject: '', message: '' }); }
      else setError('Something went wrong. Email varun@panoplyparfums.com directly.');
    } catch { setError('Network error. Email varun@panoplyparfums.com directly.'); }
    finally { setSubmitting(false); }
  };

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
      <span style={{ fontSize: '2rem' }}>🪶</span>
      <h3 style={{ marginTop: '1rem', fontFamily: F.display, fontSize: '1.5rem', color: C.parchment }}>Message Sent</h3>
      <p style={{ marginTop: '0.75rem', maxWidth: '24rem', marginInline: 'auto', fontSize: '0.875rem', lineHeight: 1.625, color: C.parchmentDim }}>Thank you. I'll respond to {formData.email} as soon as possible — usually within 24 hours.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div><label style={labelS}>Name *</label><input type="text" required value={formData.name} onChange={e => update('name', e.target.value)} placeholder="Your name" style={inputS} /></div>
        <div><label style={labelS}>Email *</label><input type="email" required value={formData.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" style={inputS} /></div>
      </div>
      <div><label style={labelS}>Subject</label><input type="text" value={formData.subject} onChange={e => update('subject', e.target.value)} placeholder="What's this about?" style={inputS} /></div>
      <div><label style={labelS}>Message *</label><textarea required value={formData.message} onChange={e => update('message', e.target.value)} rows={4} placeholder="Tell me what's on your mind..." style={{ ...inputS, resize: 'none' }} /></div>
      {error && <div style={{ borderRadius: '2px', border: '1px solid rgba(251,44,54,0.2)', backgroundColor: 'rgba(251,44,54,0.05)', padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#fb2c36' }}>{error}</div>}
      <button type="submit" disabled={!canSubmit || submitting} style={canSubmit && !submitting ? btnS : { ...btnS, opacity: 0.3, cursor: 'not-allowed' }}>{submitting ? 'Sending...' : 'Send Message'}</button>
    </form>
  );
}
